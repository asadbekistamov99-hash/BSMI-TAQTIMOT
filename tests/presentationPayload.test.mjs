import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildPresentationFields, assertInlinePresentationFits, MAX_INLINE_PRESENTATION_BYTES } from '../src/lib/presentationPayload.ts';

test('500 KiB PPTX fallback fits once; previous duplicate exceeded Firestore limit', () => {
  const bytes = Buffer.alloc(500 * 1024, 42);
  const url = 'data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,' + bytes.toString('base64');
  const fields = buildPresentationFields(url, 'pptx', 'test.pptx');
  const topic = { theory: 'a'.repeat(100 * 1024), ...fields };
  assert.ok(bytes.length <= MAX_INLINE_PRESENTATION_BYTES);
  assert.ok(Buffer.byteLength(JSON.stringify({ ...topic, pptxUrl: url })) > 1048576);
  assert.doesNotThrow(() => assertInlinePresentationFits(topic));
  assert.equal(fields.pptxUrl, '');
  assert.equal(fields.pdfUrl, '');
  assert.deepEqual(Buffer.from(fields.customLectureFile.fileUrl.split(',')[1], 'base64'), bytes);
});

test('oversized topic is rejected before saving', () => {
  assert.throws(() => assertInlinePresentationFits({ theory: 'x'.repeat(1024 * 1024) }), /chegarasidan/);
});

test('external URLs retain compatibility and clear the old file type', () => {
  const pdf = buildPresentationFields('https://example.com/slides.pdf', 'pdf', 'slides.pdf');
  assert.equal(pdf.pptxUrl, '');
  assert.equal(pdf.pdfUrl, pdf.customLectureFile.fileUrl);
  const pptx = buildPresentationFields('/api/files/slides.pptx', 'pptx', 'slides.pptx');
  assert.equal(pptx.pdfUrl, '');
  assert.equal(pptx.pptxUrl, pptx.customLectureFile.fileUrl);
});
