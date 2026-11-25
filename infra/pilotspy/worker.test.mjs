import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {handle} from './worker.mjs';
if(!globalThis.crypto) globalThis.crypto=webcrypto;
const origin='https://pawelbudnik.com';
const api='https://webcam.pawelbudnik.com';
function fixture(){const objects=new Map();return {VIEW_PASSWORD:'test-only-password',SESSION_SECRET:'test-only-signing-key',UPLOAD_TOKEN:'test-upload-token',LOGIN_LIMIT:{limit:async()=>({success:true})},SNAPSHOTS:{put:async(k,bytes,opts)=>objects.set(k,{body:bytes,...opts,json:async()=>JSON.parse(bytes)}),head:async k=>objects.get(k),get:async k=>objects.get(k)},objects};}
const request=(path,options={})=>new Request(api+path,options);
async function login(env){const r=await handle(request('/login',{method:'POST',headers:{Origin:origin},body:JSON.stringify({password:env.VIEW_PASSWORD})}),env);assert.equal(r.status,200);return r.headers.get('set-cookie').split(';')[0];}
test('private endpoints reject unauthenticated requests and cross-origin login',async()=>{const env=fixture();for(const path of ['/image','/last-capture','/status','/cat'])assert.equal((await handle(request(path),env)).status,401);assert.equal((await handle(request('/login',{method:'POST',headers:{Origin:'https://evil.example'}}),env)).status,403);});
test('login rate limiting, incorrect password and cookie flags',async()=>{const env=fixture();let r=await handle(request('/login',{method:'POST',headers:{Origin:origin},body:JSON.stringify({password:'wrong'})}),env);assert.equal(r.status,401);env.LOGIN_LIMIT.limit=async()=>({success:false});assert.equal((await handle(request('/login',{method:'POST',headers:{Origin:origin}}),env)).status,429);env.LOGIN_LIMIT.limit=async()=>({success:true});r=await handle(request('/login',{method:'POST',headers:{Origin:origin},body:JSON.stringify({password:env.VIEW_PASSWORD})}),env);for(const flag of ['Secure','HttpOnly','SameSite=Strict','Max-Age=2592000'])assert.ok(r.headers.get('set-cookie').includes(flag));});
test('upload is authenticated, atomic, and image access closes after hours',async()=>{const env=fixture(),cookie=await login(env),now=Date.now();const headers={Authorization:'Bearer '+env.UPLOAD_TOKEN,'X-Captured-At':new Date(now).toISOString(),'X-Opens-At':new Date(now-60000).toISOString(),'X-Closes-At':new Date(now+60000).toISOString()};assert.equal((await handle(request('/upload',{method:'PUT',headers,body:new Uint8Array([255,216,255,217])}),env)).status,200);assert.equal((await handle(request('/image',{headers:{Cookie:cookie}}),env)).status,200);assert.equal((await handle(request('/upload',{method:'PUT',headers,body:'invalid'}),env)).status,400);assert.equal((await handle(request('/image',{headers:{Cookie:cookie}}),env)).status,200);env.objects.get('current.jpg').customMetadata.end=String(now-1);assert.equal((await handle(request('/image',{headers:{Cookie:cookie}}),env)).status,403);assert.equal((await handle(request('/status',{headers:{Cookie:cookie}}),env)).headers.get('cache-control'),'no-store, private');});
test('password rotation invalidates sessions and tampering fails',async()=>{const env=fixture(),cookie=await login(env);assert.equal((await handle(request('/status',{headers:{Cookie:cookie+'bad'}}),env)).status,401);env.VIEW_PASSWORD='rotated-test-only';assert.equal((await handle(request('/status',{headers:{Cookie:cookie}}),env)).status,401);});
test('logout expires cookie and rejects CSRF',async()=>{const env=fixture();assert.equal((await handle(request('/logout',{method:'POST'}),env)).status,403);const r=await handle(request('/logout',{method:'POST',headers:{Origin:origin}}),env);assert.ok(r.headers.get('set-cookie').includes('Max-Age=0'));});
test('API root redirects to the sole viewer and CORS allows only the canonical origin',async()=>{
  const env=fixture();
  const root=await handle(request('/'),env);
  assert.equal(root.status,308); assert.equal(root.headers.get('location'),'https://pawelbudnik.com/seetakeoffs/');
  const preflight=await handle(request('/login',{method:'OPTIONS',headers:{Origin:origin,'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'content-type'}}),env);
  assert.equal(preflight.status,204); assert.equal(preflight.headers.get('access-control-allow-origin'),origin); assert.equal(preflight.headers.get('access-control-allow-credentials'),'true');
  const evil=await handle(request('/login',{method:'OPTIONS',headers:{Origin:'https://evil.example'}}),env);
  assert.equal(evil.status,403); assert.equal(evil.headers.get('access-control-allow-origin'),null);
  const unauthorized=await handle(request('/image',{headers:{Origin:origin}}),env);
  assert.equal(unauthorized.status,401); assert.equal(unauthorized.headers.get('access-control-allow-origin'),origin);
});

test('sun schedule reports upcoming hours independently and keeps snapshots private',async()=>{
  const env=fixture(),cookie=await login(env),now=Date.now();
  const schedule={opens:new Date(now+3600000).toISOString(),closes:new Date(now+7200000).toISOString()};
  assert.equal((await handle(request('/schedule',{method:'PUT',body:JSON.stringify(schedule)}),env)).status,401);
  assert.equal((await handle(request('/schedule',{method:'PUT',headers:{Authorization:'Bearer '+env.UPLOAD_TOKEN},body:JSON.stringify(schedule)}),env)).status,200);
  const status=await (await handle(request('/status',{headers:{Cookie:cookie}}),env)).json();
  assert.equal(status.active,false);assert.equal(status.opens,schedule.opens);assert.equal(status.captured,null);
  assert.equal((await handle(request('/image',{headers:{Cookie:cookie}}),env)).status,403);
});


test('last capture remains authenticated and available after hours without opening live image access',async()=>{
  const env=fixture(),cookie=await login(env),now=Date.now();
  const get=path=>handle(request(path,{headers:{Cookie:cookie,Origin:origin}}),env);
  assert.equal((await get('/last-capture')).status,404);
  const jpeg=new Uint8Array([255,216,255,217]);
  await env.SNAPSHOTS.put('current.jpg',jpeg,{customMetadata:{captured:String(now-3600000),start:String(now-7200000),end:String(now-1800000)}});
  assert.equal((await get('/image')).status,403);
  const image=await get('/last-capture');
  assert.equal(image.status,200);
  assert.deepEqual(new Uint8Array(await image.arrayBuffer()),jpeg);
  assert.equal(image.headers.get('cache-control'),'no-store, private');
  assert.equal(image.headers.get('access-control-allow-origin'),origin);
});
