const encoder = new TextEncoder();
const COOKIE = '__Host-pilotspy';
const AGE = 30 * 86400;
const headers = {'Cache-Control':'no-store, private', 'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'no-referrer', 'Strict-Transport-Security':'max-age=31536000'};
async function key(secret) { return crypto.subtle.importKey('raw', encoder.encode(secret), {name:'HMAC',hash:'SHA-256'}, false, ['sign','verify']); }
function hex(bytes) { return [...new Uint8Array(bytes)].map(x=>x.toString(16).padStart(2,'0')).join(''); }
async function signature(value, secret) { return hex(await crypto.subtle.sign('HMAC',await key(secret),encoder.encode(value))); }
async function equal(a,b) { return typeof a === 'string' && typeof b === 'string' && (await signature(a,'compare')) === (await signature(b,'compare')); }
async function authenticated(req,env) {
  const token = req.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);
  if (!token) return false;
  const [expires,nonce,sig] = token.split('.');
  return Number(expires)>Date.now()/1000 && Number(expires)<=Date.now()/1000+AGE+60 && /^[a-f0-9]{32}$/.test(nonce||'') && await equal(sig,await signature(expires+'.'+nonce,env.SESSION_SECRET+env.VIEW_PASSWORD));
}
async function readLimited(req, limit) {
  const reader=req.body?.getReader(); if(!reader) return new Uint8Array();
  const chunks=[];let size=0;
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>limit){await reader.cancel();return null;}chunks.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}return bytes;
}
function response(body,status=200,extra={}) { return new Response(body,{status,headers:{...headers,...extra}}); }
const json = (body,status=200,extra={})=>response(JSON.stringify(body),status,{'Content-Type':'application/json',...extra});
const VIEWER = 'https://pawelbudnik.com/seetakeoffs/';
const VIEWER_ORIGIN = 'https://pawelbudnik.com';
function sameOrigin(req) { return req.headers.get('origin') === VIEWER_ORIGIN; }
export async function handle(req,env) {
  let result;
  try { result = await route(req,env); }
  catch { result = json({error:'Service temporarily unavailable.'},503); }
  const outgoing = new Headers(result.headers);
  outgoing.set('Vary', 'Origin');
  if (sameOrigin(req)) {
    outgoing.set('Access-Control-Allow-Origin', VIEWER_ORIGIN);
    outgoing.set('Access-Control-Allow-Credentials', 'true');
  }
  return new Response(result.body,{status:result.status,headers:outgoing});
}
async function route(req,env) {
  const url = new URL(req.url), path = url.pathname;
  if(url.protocol !== 'https:') return response('HTTPS required',400);
  if(path === '/' && ['GET','HEAD'].includes(req.method)) return response(null,308,{'Location':VIEWER});
  if(req.method==='OPTIONS') {
    if(!sameOrigin(req) || !['/login','/logout','/status','/image','/last-capture','/cat'].includes(path)) return response('Forbidden',403);
    return response(null,204,{'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'600'});
  }
  if(path === '/login' && req.method==='POST') {
    if(!sameOrigin(req)) return response('Forbidden',403);
    if(!(await env.LOGIN_LIMIT.limit({key:req.headers.get('CF-Connecting-IP')||'unknown'})).success) return json({error:'Too many attempts. Try again in a minute.'},429,{'Retry-After':'60'});
    if(Number(req.headers.get('content-length'))>1024) return response('Too large',413);
    const raw=await readLimited(req,1024); if(!raw) return response('Too large',413); const body=new TextDecoder().decode(raw);
    let password; try { password=JSON.parse(body).password; } catch { return response('Invalid request',400); }
    if(!await equal(password,env.VIEW_PASSWORD)) return json({error:'Incorrect password.'},401);
    const value=Math.floor(Date.now()/1000+AGE)+'.'+crypto.randomUUID().replaceAll('-','');
    return json({ok:true},200,{'Set-Cookie':`${COOKIE}=${value}.${await signature(value,env.SESSION_SECRET+env.VIEW_PASSWORD)}; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=${AGE}`});
  }
  if(path === '/logout' && req.method==='POST') {
    if(!sameOrigin(req)) return response('Forbidden',403);
    return json({ok:true},200,{'Set-Cookie':`${COOKIE}=; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`});
  }
  if(path === '/schedule' && req.method==='PUT') {
    if(!env.UPLOAD_TOKEN || !await equal(req.headers.get('authorization'),'Bearer '+env.UPLOAD_TOKEN)) return response('Unauthorized',401);
    const raw=await readLimited(req,1024); if(!raw) return response('Too large',413);
    let schedule; try { schedule=JSON.parse(new TextDecoder().decode(raw)); } catch { return response('Invalid schedule',400); }
    const start=Date.parse(schedule.opens), end=Date.parse(schedule.closes);
    if(![start,end].every(Number.isFinite) || end<=start || end-start>86400000 || end<Date.now() || start>Date.now()+172800000) return response('Invalid schedule',400);
    await env.SNAPSHOTS.put('schedule.json',JSON.stringify({start,end,updated:Date.now()}),{httpMetadata:{contentType:'application/json'}});
    return json({ok:true});
  }
  if(path === '/upload' && req.method==='PUT') {
    if(!env.UPLOAD_TOKEN || !await equal(req.headers.get('authorization'),'Bearer '+env.UPLOAD_TOKEN)) return response('Unauthorized',401);
    const limited=await readLimited(req,10*1024*1024); if(!limited) return response('Too large',413); const bytes=limited.buffer;
    if(bytes.byteLength>10*1024*1024 || bytes.byteLength<4 || new Uint8Array(bytes)[0]!==255 || new Uint8Array(bytes)[1]!==216 || new Uint8Array(bytes)[bytes.byteLength-2]!==255 || new Uint8Array(bytes)[bytes.byteLength-1]!==217) return response('Invalid JPEG',400);
    const captured=Date.parse(req.headers.get('X-Captured-At')), start=Date.parse(req.headers.get('X-Opens-At')), end=Date.parse(req.headers.get('X-Closes-At'));
    if(![captured,start,end].every(Number.isFinite) || captured<start || captured>end || end-start>86400000 || Math.abs(Date.now()-captured)>600000) return response('Invalid capture window',400);
    await env.SNAPSHOTS.put('current.jpg',bytes,{httpMetadata:{contentType:'image/jpeg'},customMetadata:{captured:String(captured),start:String(start),end:String(end)}});
    return json({ok:true});
  }
  if(!['/status','/image','/last-capture','/cat'].includes(path) || req.method!=='GET') return response('Not found',404);
  if(!await authenticated(req,env)) return json({error:'Please enter the viewing password.'},401);
  if(path==='/cat') { const cat=await env.SNAPSHOTS.get('cat.jpg'); return cat?response(cat.body,200,{'Content-Type':'image/jpeg'}):response('Cat photo not installed yet',404); }
  // Explicit authenticated access to the last saved daytime snapshot, including private hours.
  if(path==='/last-capture') {
    const image=await env.SNAPSHOTS.get('current.jpg');
    return image?response(image.body,200,{'Content-Type':'image/jpeg'}):response('No captured snapshot available',404);
  }
  const object=await env.SNAPSHOTS.head('current.jpg');
  const meta=object?.customMetadata;
  const scheduleObject=await env.SNAPSHOTS.get('schedule.json');
  const schedule=scheduleObject ? await scheduleObject.json() : meta;
  const active=!!schedule && Date.now()>=Number(schedule.start) && Date.now()<=Number(schedule.end);
  if(path==='/status') return json({active,captured:meta?.captured?new Date(Number(meta.captured)).toISOString():null,opens:schedule?.start?new Date(Number(schedule.start)).toISOString():null,closes:schedule?.end?new Date(Number(schedule.end)).toISOString():null});
  if(!active) return response('Outside operational hours or awaiting a current capture',403);
  const image=await env.SNAPSHOTS.get('current.jpg');
  // Recheck metadata after get, including when a concurrent upload replaced the object.
  const imageStart=Number(image?.customMetadata?.start), imageEnd=Number(image?.customMetadata?.end);
  if(!image || ![imageStart,imageEnd].every(Number.isFinite) || Date.now()<imageStart || Date.now()>imageEnd) return response('Unavailable',403);
  return response(image.body,200,{'Content-Type':'image/jpeg'});
}
export default {fetch: handle};
