import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isValidGeminiKeyShape, maskGeminiKey } from '../src/lib/aiKeyFormat.ts';

test('Gemini kalit formati tekshiriladi', () => {
  assert.equal(isValidGeminiKeyShape('AIzaSyD1234567890abcdefghijklmnopqrstu'), true);
  assert.equal(isValidGeminiKeyShape('  AIzaSyD1234567890abcdefghijklmnopqrstu  '), true);
  assert.equal(isValidGeminiKeyShape('AQ.TestKeyPlaceholder0123456789abcdefghij'), true);
  assert.equal(isValidGeminiKeyShape('sk-proj-abcdef'), false);
  assert.equal(isValidGeminiKeyShape('AIza'), false);
  assert.equal(isValidGeminiKeyShape(''), false);
  assert.equal(isValidGeminiKeyShape(undefined), false);
});

test('kalit yashiriladi, oxirgi 4 belgi qoladi', () => {
  const m = maskGeminiKey('AIzaSyD1234567890abcdefghijklmnopqrstu');
  assert.ok(m.startsWith('AIza'));
  assert.ok(isValidGeminiKeyShape('AQ.TestKeyPlaceholder0123456789abcdefghij'));
  assert.ok(maskGeminiKey('AQ.TestKeyPlaceholder0123456789abcdefghij').startsWith('AQ.T'));
  assert.ok(m.endsWith('rstu'));
  assert.ok(!m.includes('1234567890'));
});
