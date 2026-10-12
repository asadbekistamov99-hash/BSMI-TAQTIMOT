import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFaceIdSession, writeFaceIdSession, clearFaceIdSession, FACE_ID_SESSION_TTL_MS } from '../src/lib/faceIdSession.ts';

function memoryStorage() {
  const map = new Map();
  return {
    getItem: k => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: k => map.delete(k),
    key: i => Array.from(map.keys())[i] ?? null,
    get length() { return map.size; }
  };
}

test('a verified session is remembered for the same uid within the TTL only', () => {
  const s = memoryStorage();
  const t0 = 1_000_000;
  assert.equal(readFaceIdSession('u1', t0, s), false);
  writeFaceIdSession('u1', t0, s);
  assert.equal(readFaceIdSession('u1', t0 + 1000, s), true);
  assert.equal(readFaceIdSession('u2', t0 + 1000, s), false, 'another account never inherits it');
  assert.equal(readFaceIdSession('u1', t0 + FACE_ID_SESSION_TTL_MS + 1, s), false, 'expired');
  assert.equal(readFaceIdSession('u1', t0 + 1000, s), false, 'expired entry was removed');
});

test('ttl 0 disables the memory entirely and garbage is ignored', () => {
  const s = memoryStorage();
  writeFaceIdSession('u1', 5, s);
  assert.equal(readFaceIdSession('u1', 6, s, 0), false);
  s.setItem('faceIdVerified:u9', 'not json');
  assert.equal(readFaceIdSession('u9', 6, s), false);
  s.setItem('faceIdVerified:u8', JSON.stringify({ uid: 'someone-else', at: 5 }));
  assert.equal(readFaceIdSession('u8', 6, s), false);
  assert.equal(readFaceIdSession('u1', 1, s), false, 'clock moved backwards → not trusted');
});

test('clear removes one uid or every Face ID key, and null storage is safe', () => {
  const s = memoryStorage();
  writeFaceIdSession('a', 1, s);
  writeFaceIdSession('b', 1, s);
  s.setItem('other', 'keep');
  clearFaceIdSession('a', s);
  assert.equal(readFaceIdSession('a', 2, s), false);
  assert.equal(readFaceIdSession('b', 2, s), true);
  clearFaceIdSession(undefined, s);
  assert.equal(readFaceIdSession('b', 2, s), false);
  assert.equal(s.getItem('other'), 'keep');
  assert.doesNotThrow(() => writeFaceIdSession('a', 1, null));
  assert.equal(readFaceIdSession('a', 1, null), false);
  assert.doesNotThrow(() => clearFaceIdSession('a', null));
});
