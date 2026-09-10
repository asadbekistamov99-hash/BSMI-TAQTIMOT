import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prepareSmallPresentation } from '../src/lib/smallPresentation.ts';
import { buildPresentationFields, assertInlinePresentationFits } from '../src/lib/presentationPayload.ts';

test('510 KiB file prepares without network and preserves its bytes in a saveable payload', async () => {
  const originalReader = globalThis.FileReader;
  const originalFetch = globalThis.fetch;
  let networkCalls = 0;
  globalThis.fetch = () => { networkCalls++; throw new Error('Network must not be used'); };
  globalThis.FileReader = class {
    readAsDataURL(file) {
      file.arrayBuffer().then(buffer => {
        this.result = `data:${file.type};base64,${Buffer.from(buffer).toString('base64')}`;
        this.onload();
      });
    }
  };
  try {
    const bytes = Buffer.alloc(510 * 1024, 31);
    const file = new File([bytes], 'slides.pptx', { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
    const progress = [];
    const url = await prepareSmallPresentation(file, value => progress.push(value));
    assert.equal(networkCalls, 0);
    assert.deepEqual(Buffer.from(url.split(',')[1], 'base64'), bytes);
    assert.equal(progress.at(-1), 100);
    assert.doesNotThrow(() => assertInlinePresentationFits({ theory: 'x'.repeat(100 * 1024), ...buildPresentationFields(url, 'pptx', file.name) }));
    assert.equal(await prepareSmallPresentation(new File([Buffer.alloc(601 * 1024)], 'large.pptx')), null);
  } finally {
    globalThis.FileReader = originalReader;
    globalThis.fetch = originalFetch;
  }
});

test('file read errors reject instead of leaving the upload pending', async () => {
  const original = globalThis.FileReader;
  globalThis.FileReader = class { readAsDataURL() { this.onerror(); } };
  try {
    await assert.rejects(prepareSmallPresentation(new File(['data'], 'slides.pptx')), /o‘qib bo‘lmadi/);
  } finally { globalThis.FileReader = original; }
});
