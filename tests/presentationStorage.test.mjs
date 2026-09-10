import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validatePresentation, uploadToSupabasePresentation, storageUploadError, MAX_PRESENTATION_BYTES } from '../src/lib/presentationStorage.ts';

test('510 KiB and exactly 25 MiB accepted; larger, empty and unsupported rejected', () => {
 for (const size of [510 * 1024, MAX_PRESENTATION_BYTES]) assert.equal(validatePresentation({name:'A.PPTX',size}), 'pptx');
 for (const file of [{name:'a.pptx',size:MAX_PRESENTATION_BYTES+1},{name:'a.pdf',size:0},{name:'a.exe',size:50}]) assert.throws(()=>validatePresentation(file));
});

test('sends original binary directly to Supabase and returns a short URL', async () => {
 const file = new File([new Uint8Array(25 * 1024 * 1024)], 'slides.pptx');
 let received, endpoint;
 const progress=[];
 const xhr = {upload:{}, setRequestHeader(){}, open(method,url){assert.equal(method,'POST');endpoint=url;}, send(body){received=body;this.upload.onprogress({loaded:file.size,total:file.size,lengthComputable:true});this.status=200;this.onload();}};
 const result = await uploadToSupabasePresentation(file,{url:'https://example.supabase.co',key:'public-test-key',token:'test-session'},p=>progress.push(p),()=>xhr);
 assert.equal(received,file);
 assert.ok(endpoint.startsWith('https://example.supabase.co/storage/v1/object/presentations/'));
 assert.ok(result.url.includes('/object/public/presentations/'));
 assert.ok(JSON.stringify(result).length < 500);
 assert.deepEqual(progress,[0,99,100]);
});

test('permission, bucket, and size errors are actionable', () => {
 assert.match(storageUploadError(403,'{}').message,/ruxsat/);
 assert.match(storageUploadError(400,'{"message":"Bucket not found"}').message,/bucket/);
 assert.match(storageUploadError(413,'{}').message,/chegarasi/);
});

test('network failure rejects and never returns base64 fallback', async () => {
 const xhr={upload:{},open(){},setRequestHeader(){},send(){this.onerror();}};
 await assert.rejects(uploadToSupabasePresentation(new File(['abc'],'a.pdf'),{url:'https://example.supabase.co',key:'k',token:'t'},undefined,()=>xhr),/DNS/);
});
