import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_FACE_MATCH_THRESHOLD,
  DEFAULT_FACE_ID_MODELS,
  MIN_FRAMES_REQUIRED,
  resolveThreshold,
  resolveModelList,
  validateVerifyRequest,
  cleanBase64,
  detectMimeType,
  parseModelJson,
  normalizeConfidence,
  normalizeVerdict,
  decideVerification,
  classifyAiError,
  analyzeLuminance,
  assessFrameQuality,
  shouldAutoRetry
} from '../src/lib/faceVerificationPolicy.ts';

const fakeImage = (mime = 'jpeg') => `data:image/${mime};base64,${'A'.repeat(400)}==`;
const goodFrames = () => Array.from({ length: 5 }, (_, i) => ({ type: `frame_${i + 1}`, image: fakeImage() }));

test('threshold: env parsing is tolerant and clamped, default is 0.75', () => {
  assert.equal(DEFAULT_FACE_MATCH_THRESHOLD, 0.75);
  assert.equal(resolveThreshold(undefined), 0.75);
  assert.equal(resolveThreshold(''), 0.75);
  assert.equal(resolveThreshold('0.8'), 0.8);
  assert.equal(resolveThreshold('80'), 0.8);
  assert.equal(resolveThreshold('abc'), 0.75);
  assert.equal(resolveThreshold('0.2'), 0.75, 'below minimum falls back');
  assert.equal(resolveThreshold('1.5'), 0.75, 'above 100% falls back');
});

test('model list: env override, dedupe, garbage ignored', () => {
  assert.deepEqual(resolveModelList(undefined), DEFAULT_FACE_ID_MODELS);
  assert.ok(DEFAULT_FACE_ID_MODELS.length >= 3, 'several fallbacks so one quota never locks everyone out');
  assert.deepEqual(resolveModelList(' gemini-2.5-flash , gemini-2.5-flash, gemini-x '), ['gemini-2.5-flash', 'gemini-x']);
  assert.deepEqual(resolveModelList('$$$, ,'), DEFAULT_FACE_ID_MODELS);
});

test('request validation fails closed on every malformed payload', () => {
  assert.equal(validateVerifyRequest(null).ok, false);
  assert.equal(validateVerifyRequest({}).ok, false);
  assert.equal(validateVerifyRequest({ enrolledImage: fakeImage(), frames: [] }).ok, false);
  assert.equal(validateVerifyRequest({ enrolledImage: fakeImage(), frames: goodFrames().slice(0, MIN_FRAMES_REQUIRED - 1) }).ok, false);
  assert.equal(validateVerifyRequest({ enrolledImage: 'short', frames: goodFrames() }).ok, false);
  assert.equal(validateVerifyRequest({ enrolledImage: fakeImage(), frames: [...goodFrames(), { image: 42 }] }).ok, false);
  assert.equal(validateVerifyRequest({ enrolledImage: 'data:text/html;base64,' + 'A'.repeat(200), frames: goodFrames() }).ok, false);
  const ok = validateVerifyRequest({ enrolledImage: fakeImage('png'), frames: goodFrames() });
  assert.equal(ok.ok, true);
  assert.equal(ok.value.frames.length, 5);
  assert.equal(ok.value.frames[2].type, 'frame_3');
});

test('base64 helpers', () => {
  assert.equal(cleanBase64('data:image/jpeg;base64,AB CD\nEF'), 'ABCDEF');
  assert.equal(cleanBase64('RAWBASE64=='), 'RAWBASE64==');
  assert.equal(detectMimeType('data:image/png;base64,xxx'), 'image/png');
  assert.equal(detectMimeType('data:image/webp;base64,xxx'), 'image/webp');
  assert.equal(detectMimeType('data:image/jpeg;base64,xxx'), 'image/jpeg');
  assert.equal(detectMimeType('xxx'), 'image/jpeg');
});

test('model JSON parsing survives fences and prose, rejects garbage', () => {
  assert.deepEqual(parseModelJson('{"isMatch":true}'), { isMatch: true });
  assert.deepEqual(parseModelJson('```json\n{"isMatch":true}\n```'), { isMatch: true });
  assert.deepEqual(parseModelJson('Natija: {"isMatch": false, "reason": "x"} tamom'), { isMatch: false, reason: 'x' });
  assert.equal(parseModelJson('[1,2]'), null);
  assert.equal(parseModelJson('no json here'), null);
  assert.equal(parseModelJson(undefined), null);
});

test('confidence normalisation: percent, strings and junk', () => {
  assert.equal(normalizeConfidence(0.87), 0.87);
  assert.equal(normalizeConfidence(87), 0.87);
  assert.equal(normalizeConfidence('92%'), 0.92);
  assert.equal(normalizeConfidence('abc'), 0);
  assert.equal(normalizeConfidence(-1), 0);
  assert.equal(normalizeConfidence(500), 0);
  assert.equal(normalizeConfidence(undefined), 0);
});

test('verdict normalisation is fail-closed', () => {
  const v = normalizeVerdict({});
  assert.deepEqual(v, { faceDetected: false, isMatch: false, livenessPassed: false, spoofSuspected: false, confidence: 0, reason: '' });
  const s = normalizeVerdict({ faceDetected: 'true', isMatch: 'TRUE', livenessPassed: true, spoofSuspected: 'false', confidence: '0.9', reason: ' ok ' });
  assert.equal(s.faceDetected, true);
  assert.equal(s.isMatch, true);
  assert.equal(s.spoofSuspected, false);
  assert.equal(s.confidence, 0.9);
  assert.equal(s.reason, 'ok');
});

const good = { faceDetected: true, isMatch: true, livenessPassed: true, spoofSuspected: false, confidence: 0.9, reason: '' };

test('decision: only a fully positive verdict above threshold verifies', () => {
  assert.equal(decideVerification(good).verified, true);
  assert.equal(decideVerification({ ...good, confidence: 0.75 }).verified, true, 'threshold is inclusive');
  const low = decideVerification({ ...good, confidence: 0.74 });
  assert.equal(low.verified, false);
  assert.equal(low.code, 'LOW_CONFIDENCE');
  assert.equal(low.retryable, true);
  assert.match(low.reason, /74%/);

  const noFace = decideVerification({ ...good, faceDetected: false });
  assert.equal(noFace.verified, false);
  assert.equal(noFace.code, 'NO_FACE');
  assert.equal(noFace.confidence, 0);

  const spoof = decideVerification({ ...good, spoofSuspected: true });
  assert.equal(spoof.code, 'SPOOF');
  assert.equal(spoof.retryable, false);
  assert.equal(decideVerification({ ...good, livenessPassed: false }).code, 'SPOOF');

  const noMatch = decideVerification({ ...good, isMatch: false, confidence: 0.99 });
  assert.equal(noMatch.verified, false);
  assert.equal(noMatch.code, 'NO_MATCH');
  assert.equal(noMatch.retryable, false);
});

test('decision honours a custom threshold and never verifies from an empty verdict', () => {
  assert.equal(decideVerification({ ...good, confidence: 0.8 }, 0.85).verified, false);
  assert.equal(decideVerification({ ...good, confidence: 0.86 }, 0.85).verified, true);
  assert.equal(decideVerification(normalizeVerdict(null)).verified, false);
  assert.equal(decideVerification(normalizeVerdict({ verified: true })).verified, false, 'a bare verified:true from the model is ignored');
});

test('AI error classification', () => {
  const quota = classifyAiError({ status: 429, message: 'RESOURCE_EXHAUSTED: quota exceeded. Please retry in 24.5s.' });
  assert.equal(quota.code, 'AI_QUOTA');
  assert.equal(quota.httpStatus, 429);
  assert.equal(quota.retryAfterSec, 25);
  assert.equal(quota.transient, true);

  const noKey = classifyAiError(new Error('GEMINI_API_KEY sozlanmagan'));
  assert.equal(noKey.code, 'AI_NOT_CONFIGURED');
  assert.equal(noKey.transient, false);
  assert.equal(classifyAiError({ status: 403, message: 'API key not valid' }).code, 'AI_NOT_CONFIGURED');

  const missing = classifyAiError({ status: 404, message: 'models/gemini-x is not found' });
  assert.equal(missing.code, 'AI_UNAVAILABLE');
  assert.equal(missing.skipModel, true);

  const busy = classifyAiError({ status: 503, message: 'The model is overloaded' });
  assert.equal(busy.code, 'AI_UNAVAILABLE');
  assert.equal(busy.transient, true);
  assert.equal(busy.skipModel, false);

  const timeout = classifyAiError(new Error('Face ID model call timed out after 22000ms'));
  assert.equal(timeout.code, 'AI_TIMEOUT');
  assert.equal(timeout.transient, true);

  assert.equal(classifyAiError(undefined).code, 'AI_UNAVAILABLE');
});

test('frame quality: black, dark, normal and blown-out frames', () => {
  const px = (r, g, b, count) => {
    const arr = new Uint8ClampedArray(count * 4);
    for (let i = 0; i < count; i++) { arr[i * 4] = r; arr[i * 4 + 1] = g; arr[i * 4 + 2] = b; arr[i * 4 + 3] = 255; }
    return arr;
  };
  assert.equal(assessFrameQuality(analyzeLuminance(px(0, 0, 0, 100), 1)).code, 'NO_SIGNAL');
  assert.equal(assessFrameQuality(analyzeLuminance(px(20, 20, 20, 100), 1)).code, 'TOO_DARK');
  assert.equal(assessFrameQuality(analyzeLuminance(px(120, 110, 100, 100), 1)).ok, true);
  assert.equal(assessFrameQuality(analyzeLuminance(px(250, 250, 250, 100), 1)).code, 'TOO_BRIGHT');
  assert.equal(assessFrameQuality(analyzeLuminance(new Uint8ClampedArray(0), 1)).code, 'NO_SIGNAL');
  const stats = analyzeLuminance(px(100, 100, 100, 64), 8);
  assert.equal(stats.samples, 8);
  assert.ok(Math.abs(stats.mean - 100) < 0.01);
});

test('auto-retry only for soft / transient outcomes, and only once', () => {
  assert.equal(shouldAutoRetry('LOW_CONFIDENCE', 0), true);
  assert.equal(shouldAutoRetry('AI_TIMEOUT', 0), true);
  assert.equal(shouldAutoRetry('NETWORK', 0), true);
  assert.equal(shouldAutoRetry('LOW_CONFIDENCE', 1), false);
  assert.equal(shouldAutoRetry('NO_MATCH', 0), false);
  assert.equal(shouldAutoRetry('SPOOF', 0), false);
  assert.equal(shouldAutoRetry('AI_QUOTA', 0), false);
  assert.equal(shouldAutoRetry('AI_NOT_CONFIGURED', 0), false);
  assert.equal(shouldAutoRetry('TOO_DARK', 0), false);
  assert.equal(shouldAutoRetry(undefined, 0), false);
});
