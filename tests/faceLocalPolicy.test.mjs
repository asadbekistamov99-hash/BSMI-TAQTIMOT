import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  FACE_DESCRIPTOR_LENGTH,
  LOCAL_MATCH_DISTANCE,
  LOCAL_NO_MATCH_DISTANCE,
  resolveLocalThreshold,
  isDescriptor,
  euclideanDistance,
  median,
  distanceToSimilarity,
  looksFrozen,
  decideLocalVerification,
  serializeDescriptor
} from '../src/lib/faceLocalPolicy.ts';

// deterministic pseudo-random unit-ish vectors
function vec(seed, scale = 1) {
  const out = new Float32Array(FACE_DESCRIPTOR_LENGTH);
  let s = seed;
  for (let i = 0; i < out.length; i++) {
    s = (s * 1103515245 + 12345) % 2147483648;
    out[i] = ((s / 2147483648) - 0.5) * scale;
  }
  return out;
}
// same person: enrolled + small noise so the distance lands near `target`
function near(base, target, seed = 7) {
  const noise = vec(seed);
  let n = 0; for (let i = 0; i < noise.length; i++) n += noise[i] * noise[i];
  const k = target / Math.sqrt(n);
  const out = new Float32Array(base.length);
  for (let i = 0; i < base.length; i++) out[i] = base[i] + noise[i] * k;
  return out;
}
const sample = (descriptor, score = 0.9, faceRatio = 0.3) => ({ descriptor, score, faceRatio });

test('threshold parsing', () => {
  assert.equal(resolveLocalThreshold(undefined), LOCAL_MATCH_DISTANCE);
  assert.equal(resolveLocalThreshold('0.5'), 0.5);
  assert.equal(resolveLocalThreshold('2'), LOCAL_MATCH_DISTANCE);
  assert.equal(resolveLocalThreshold('abc'), LOCAL_MATCH_DISTANCE);
});

test('descriptor validation and math helpers', () => {
  assert.equal(isDescriptor(vec(1)), true);
  assert.equal(isDescriptor(Array.from(vec(1))), true);
  assert.equal(isDescriptor(new Float32Array(64)), false);
  assert.equal(isDescriptor(null), false);
  const bad = Array.from(vec(1)); bad[3] = NaN;
  assert.equal(isDescriptor(bad), false);
  assert.equal(euclideanDistance([0, 0], [3, 4]), 5);
  assert.equal(euclideanDistance([0], [1, 2]), Infinity);
  assert.equal(median([3, 1, 2]), 2);
  assert.equal(median([4, 1, 3, 2]), 2.5);
  assert.equal(median([]), Infinity);
  assert.equal(distanceToSimilarity(0.2), 1);
  assert.equal(distanceToSimilarity(1.0), 0);
  assert.ok(distanceToSimilarity(0.4) > 0.7);
  assert.equal(serializeDescriptor(new Float32Array([0.123456789, -1])).length, 2);
  assert.equal(serializeDescriptor(new Float32Array([0.123456789]))[0], 0.12346);
});

test('same person within threshold verifies; median resists one bad frame', () => {
  const enrolled = vec(42);
  const samples = [
    sample(near(enrolled, 0.35, 1)),
    sample(near(enrolled, 0.40, 2)),
    sample(near(enrolled, 0.45, 3)),
    sample(near(enrolled, 0.95, 4)), // one bad frame (turned head)
    sample(near(enrolled, 0.38, 5))
  ];
  const d = decideLocalVerification(enrolled, samples);
  assert.equal(d.verified, true);
  assert.ok(d.distance < LOCAL_MATCH_DISTANCE);
  assert.equal(d.samples, 5);
  assert.ok(d.confidence > 0.6);
});

test('different person is NO_MATCH (not retryable); borderline is LOW_CONFIDENCE (retryable)', () => {
  const enrolled = vec(42);
  const other = decideLocalVerification(enrolled, [sample(vec(9)), sample(vec(10)), sample(vec(11))]);
  assert.equal(other.verified, false);
  assert.equal(other.code, 'NO_MATCH');
  assert.equal(other.retryable, false);
  assert.ok(other.distance > LOCAL_NO_MATCH_DISTANCE);

  const border = decideLocalVerification(enrolled, [sample(near(enrolled, 0.62, 1)), sample(near(enrolled, 0.60, 2)), sample(near(enrolled, 0.64, 3))]);
  assert.equal(border.verified, false);
  assert.equal(border.code, 'LOW_CONFIDENCE');
  assert.equal(border.retryable, true);
  assert.match(border.reason, /%/);
});

test('too few usable frames → NO_FACE; far face → hint; frozen frames → SPOOF; bad enrolled → re-enroll', () => {
  const enrolled = vec(42);
  const few = decideLocalVerification(enrolled, [sample(near(enrolled, 0.3)), sample(near(enrolled, 0.3), 0.2)]);
  assert.equal(few.code, 'NO_FACE');
  assert.equal(few.retryable, true);

  const far = decideLocalVerification(enrolled, [sample(near(enrolled, 0.3), 0.9, 0.05), sample(near(enrolled, 0.3), 0.9, 0.06)]);
  assert.equal(far.code, 'NO_FACE');
  assert.match(far.reason, /uzoq/);

  const same = near(enrolled, 0.3);
  const frozen = decideLocalVerification(enrolled, [sample(same), sample(same), sample(same)]);
  assert.equal(frozen.code, 'SPOOF');
  assert.equal(frozen.retryable, false);
  assert.equal(looksFrozen([sample(same), sample(near(enrolled, 0.31))]), false);

  const noEnrolled = decideLocalVerification(null, [sample(same), sample(near(enrolled, 0.31)), sample(near(enrolled, 0.32))]);
  assert.equal(noEnrolled.verified, false);
  assert.equal(noEnrolled.retryable, false);
  assert.match(noEnrolled.reason, /qayta suratga/);
});

test('custom threshold is honoured and never verifies without samples', () => {
  const enrolled = vec(42);
  const s = [sample(near(enrolled, 0.5, 1)), sample(near(enrolled, 0.5, 2)), sample(near(enrolled, 0.5, 3))];
  assert.equal(decideLocalVerification(enrolled, s, 0.45).verified, false);
  assert.equal(decideLocalVerification(enrolled, s, 0.6).verified, true);
  assert.equal(decideLocalVerification(enrolled, []).verified, false);
});
