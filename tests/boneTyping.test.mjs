import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  BONES, normalizeAnswer, isCorrect, hintFor, pickBones, bonesForRegion, scoreAttempts,
} from '../src/lib/boneTypingEngine.ts';

test('normalizeAnswer ignores case, accents, apostrophes and extra spaces', () => {
  assert.equal(normalizeAnswer('  Cervical   Vertebra '), 'cervical vertebra');
  assert.equal(normalizeAnswer("G‘alvirsimon"), 'galvirsimon');
  assert.equal(normalizeAnswer('hip-bone'), 'hip bone');
});

test('isCorrect accepts the latin name in any casing, rejects wrong names', () => {
  assert.equal(isCorrect('femur', 'FEMUR'), true);
  assert.equal(isCorrect('femur', 'tibia'), false);
  assert.equal(isCorrect('lumbar vertebra', 'lumbar'), false);
});

test('hints: round 1 shows the name, round 2 shows first letter, round 3 shows nothing', () => {
  const femur = BONES.find((b) => b.id === 'femur');
  assert.equal(hintFor(femur, 1), 'femur');
  assert.equal(hintFor(femur, 2), 'f____  (son suyagi)');
  assert.equal(hintFor(femur, 3), null);
});

test('pickBones returns unique bones, capped at the pool size', () => {
  const picked = pickBones(BONES, 8, () => 0.42);
  assert.equal(picked.length, 8);
  assert.equal(new Set(picked.map((b) => b.id)).size, 8);
  assert.equal(pickBones(bonesForRegion('thorax'), 50).length, bonesForRegion('thorax').length);
});

test('every bone has a latin and uzbek name and a unique id', () => {
  assert.equal(new Set(BONES.map((b) => b.id)).size, BONES.length);
  for (const b of BONES) {
    assert.ok(b.latin.length > 0 && b.uz.length > 0, b.id);
  }
});

test('scoreAttempts weights rounds 1/2/3 as 1/2/3 points', () => {
  const s = scoreAttempts([
    { boneId: 'a', round: 1, correct: true },
    { boneId: 'b', round: 2, correct: true },
    { boneId: 'c', round: 3, correct: false },
  ]);
  assert.equal(s.points, 3);
  assert.equal(s.maxPoints, 6);
  assert.equal(s.accuracy, 67);
  assert.equal(scoreAttempts([]).accuracy, 0);
});

import { boneName, regionLabel, roundInfo } from '../src/lib/boneTypingEngine.ts';

test('bone names follow the selected language, latin stays in the typed answer', () => {
  const femur = BONES.find((b) => b.id === 'femur');
  assert.equal(boneName(femur, 'uz'), 'son suyagi');
  assert.equal(boneName(femur, 'ru'), 'бедренная кость');
  assert.equal(boneName(femur, 'en'), 'femur');
  assert.equal(hintFor(femur, 2, 'ru'), 'f____  (бедренная кость)');
  assert.equal(femur.latin, 'femur');
});

test('every bone has russian and english names', () => {
  for (const b of BONES) {
    assert.notEqual(boneName(b, 'ru'), b.latin, b.id);
    assert.notEqual(boneName(b, 'en'), '', b.id);
  }
});

test('region labels and round texts exist in all three languages', () => {
  for (const r of ['head', 'spine', 'thorax', 'upperLimb', 'lowerLimb']) {
    for (const l of ['uz', 'ru', 'en']) assert.ok(regionLabel(r, l).length > 0, r + l);
  }
  for (const r of [1, 2, 3]) {
    for (const l of ['uz', 'ru', 'en']) assert.ok(roundInfo(r, l).title.length > 0);
  }
});
