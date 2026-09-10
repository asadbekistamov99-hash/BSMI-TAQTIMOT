import { test } from 'node:test';
import assert from 'node:assert/strict';
import { faceVerificationError } from '../src/lib/faceVerificationError.ts';

test('configuration and quota failures identify the required repair', () => {
  for (const [error, code] of [
    [new Error('GEMINI_API_KEY sozlanmagan'), 'FACE_API_KEY_MISSING'],
    [{ status: 403 }, 'FACE_API_ACCESS_DENIED'],
    [{ message: 'API key not valid' }, 'FACE_API_ACCESS_DENIED'],
    [{ status: 429 }, 'FACE_API_QUOTA'],
  ]) {
    const result = faceVerificationError(error);
    assert.equal(result.code, code);
    assert.equal(result.retryable, false);
    assert.equal(result.status, 503);
  }
});

test('timeouts and temporary outages allow bounded retry', () => {
  assert.equal(faceVerificationError({ name: 'AbortError' }).status, 504);
  assert.equal(faceVerificationError({ status: 503 }).retryable, true);
});

test('provider details are not returned to the browser', () => {
  const result = faceVerificationError({ message: 'upstream failed: secret-key-test-value' });
  assert.ok(!JSON.stringify(result).includes('secret-key-test-value'));
  assert.equal(result.code, 'FACE_API_UNAVAILABLE');
});
