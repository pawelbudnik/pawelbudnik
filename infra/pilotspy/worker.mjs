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
function sameOrigin(req) { return req.headers.get('origin') === new URL(req.url).origin; }
export async function handle(req,env) {
  const url = new URL(req.url), path = url.pathname;
  if(url.protocol !== 'https:') return response('HTTPS required',400);
  if(path === '/' && req.method==='GET') return response(HTML,200,{'Content-Type':'text/html; charset=utf-8','Content-Security-Policy':"default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self' blob:; connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors https://pawelbudnik.com https://www.pawelbudnik.com"});
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
  if(path === '/upload' && req.method==='PUT') {
    if(!env.UPLOAD_TOKEN || !await equal(req.headers.get('authorization'),'Bearer '+env.UPLOAD_TOKEN)) return response('Unauthorized',401);
    const limited=await readLimited(req,10*1024*1024); if(!limited) return response('Too large',413); const bytes=limited.buffer;
    if(bytes.byteLength>10*1024*1024 || bytes.byteLength<4 || new Uint8Array(bytes)[0]!==255 || new Uint8Array(bytes)[1]!==216 || new Uint8Array(bytes)[bytes.byteLength-2]!==255 || new Uint8Array(bytes)[bytes.byteLength-1]!==217) return response('Invalid JPEG',400);
    const captured=Date.parse(req.headers.get('X-Captured-At')), start=Date.parse(req.headers.get('X-Opens-At')), end=Date.parse(req.headers.get('X-Closes-At'));
    if(![captured,start,end].every(Number.isFinite) || captured<start || captured>end || end-start>86400000 || Math.abs(Date.now()-captured)>600000) return response('Invalid capture window',400);
    await env.SNAPSHOTS.put('current.jpg',bytes,{httpMetadata:{contentType:'image/jpeg'},customMetadata:{captured:String(captured),start:String(start),end:String(end)}});
    return json({ok:true});
  }
  if(!['/status','/image','/cat'].includes(path) || req.method!=='GET') return response('Not found',404);
  if(!await authenticated(req,env)) return json({error:'Please enter the viewing password.'},401);
  if(path==='/cat') { const cat=await env.SNAPSHOTS.get('cat.jpg'); return cat?response(cat.body,200,{'Content-Type':'image/jpeg'}):response('Cat photo not installed yet',404); }
  const object=await env.SNAPSHOTS.head('current.jpg');
  const meta=object?.customMetadata;
  const active=!!meta && Date.now()>=Number(meta.start) && Date.now()<=Number(meta.end);
  if(path==='/status') return json({active,captured:meta?.captured?new Date(Number(meta.captured)).toISOString():null,opens:meta?.start?new Date(Number(meta.start)).toISOString():null,closes:meta?.end?new Date(Number(meta.end)).toISOString():null});
  if(!active) return response('Outside operational hours or awaiting a current capture',403);
  const image=await env.SNAPSHOTS.get('current.jpg');
  // Recheck metadata after get, including when a concurrent upload replaced the object.
  if(!image || Date.now()<Number(image.customMetadata.start) || Date.now()>Number(image.customMetadata.end)) return response('Unavailable',403);
  return response(image.body,200,{'Content-Type':'image/jpeg'});
}
export default {async fetch(req,env) {try{return await handle(req,env);}catch{return json({error:'Service temporarily unavailable.'},503);}}};
const HTML = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PilotSpy webcam</title>
<style>*{box-sizing:border-box}body{margin:0;background:#eef3f2;color:#173733;font:16px system-ui,sans-serif}main{max-width:1000px;margin:auto;padding:clamp(20px,5vw,48px)}h1{font-size:clamp(28px,5vw,44px);margin:0}p{line-height:1.6}small{color:#46645f}section{background:white;border-radius:20px;padding:24px;margin-top:24px}input,button{font:inherit;padding:12px 16px;border-radius:9px;border:1px solid #819e97}input{width:100%;margin:10px 0}button{background:#165e50;color:white;cursor:pointer}button:disabled{opacity:.5}img{width:100%;max-height:65vh;object-fit:contain;border-radius:12px;background:#e8efec}[hidden]{display:none!important}.actions{display:flex;gap:12px;flex-wrap:wrap;margin:16px 0}#message{min-height:1.6em}</style>
<main><small>PRIVATE MOUNTAIN WEATHER CAMERA</small><h1>PilotSpy</h1><p>See the mountains. Plan your next flight.</p><section id="login"><form id="form"><label for="password">Viewing password</label><input id="password" name="password" type="password" autocomplete="current-password" required maxlength="256"><button>View webcam</button></form><p>Your sign-in lasts approximately 30 days on this browser.</p></section><section id="viewer" hidden><div class="actions"><button id="refresh">Refresh</button><button id="logout">Log out</button></div><img id="photo" alt="Latest mountain snapshot" hidden><h2 id="night" hidden>Sorry, no more flying now anyway :P</h2><p id="capture"></p><p id="hours"></p></section><p id="message" role="status" aria-live="polite"></p><p>Snapshots operate from one hour before sunrise until 30 minutes after sunset. Automatically refreshed every five minutes. Times come from Home Assistant’s sun.sun entity.</p></main>
<script>
const $=id=>document.getElementById(id);let imageUrl;let busy=false;let boundary;
function clearImage(){if(imageUrl)URL.revokeObjectURL(imageUrl);imageUrl=null;$('photo').removeAttribute('src');$('photo').hidden=true;}
function signedOut(){clearImage();clearTimeout(boundary);$('viewer').hidden=true;$('login').hidden=false;}
function time(s){return new Date(s).toLocaleString(undefined,{timeZone:'Europe/Zurich',dateStyle:'medium',timeStyle:'short'})+' (Europe/Zurich)';}
async function update(){if(busy)return;busy=true;$('refresh').disabled=true;try{const r=await fetch('/status',{cache:'no-store'});if(r.status===401){signedOut();return;}if(!r.ok)throw Error('Could not refresh. Please try again.');const s=await r.json();$('viewer').hidden=false;$('login').hidden=true;$('night').hidden=s.active;$('capture').textContent=s.captured?'Last successful capture: '+time(s.captured):'Awaiting the first successful capture.';$('hours').textContent=s.opens?'Capture window: '+time(s.opens)+' – '+time(s.closes):'Operational hours: one hour before sunrise until 30 minutes after sunset.';clearTimeout(boundary);if(s.active)boundary=setTimeout(()=>{clearImage();$('night').hidden=false;update();},Math.max(0,new Date(s.closes)-Date.now())+50);const image=await fetch(s.active?'/image?t='+Date.now():'/cat',{cache:'no-store'});if(!image.ok){clearImage();throw Error(s.active?'Snapshot temporarily unavailable.':'The cat photo has not been installed yet.');}const blob=await image.blob();clearImage();imageUrl=URL.createObjectURL(blob);$('photo').src=imageUrl;$('photo').alt=s.active?'Latest mountain snapshot':'Our cat, off duty';$('photo').hidden=false;$('message').textContent='';}catch(e){$('message').textContent=e.message;}finally{busy=false;$('refresh').disabled=false;}}
$('form').onsubmit=async e=>{e.preventDefault();const button=e.target.querySelector('button');button.disabled=true;try{const r=await fetch('/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:$('password').value})});$('password').value='';if(!r.ok){const error=await r.json();throw Error(error.error||'Sign-in failed.');}await update();}catch(e){$('message').textContent=e.message;}finally{button.disabled=false;}};
$('refresh').onclick=update;$('logout').onclick=async()=>{try{const r=await fetch('/logout',{method:'POST'});if(!r.ok)throw Error();signedOut();$('message').textContent='Logged out.';}catch{$('message').textContent='Logout failed. Please try again.';}};setInterval(update,300000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)update();});update();
</script></html>`;

