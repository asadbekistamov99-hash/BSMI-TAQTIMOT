// Base64 expands bytes by 4/3. Leave room for the topic's text and metadata.
export const MAX_INLINE_PRESENTATION_BYTES = 600 * 1024;
const INLINE_DOCUMENT_BUDGET = 900 * 1024;

export function buildPresentationFields(url: string, fileType: 'pptx' | 'pdf', fileName: string) {
  const inline = url.startsWith('data:');
  return {
    // Keep inline content in exactly one field; readers already support customLectureFile.
    // Empty aliases also clear any previously attached file when replacing it.
    pptxUrl: !inline && fileType === 'pptx' ? url : '',
    pdfUrl: !inline && fileType === 'pdf' ? url : '',
    customLectureFile: { fileUrl: url, fileName, fileType, uploadedAt: new Date().toISOString() }
  };
}

export function assertInlinePresentationFits(topic: Record<string, unknown>) {
  // Conservative JSON budget leaves headroom for Firestore's document overhead.
  if (new TextEncoder().encode(JSON.stringify(topic)).byteLength > INLINE_DOCUMENT_BUDGET) {
    throw new Error('Fayl va mavzu matni birgalikda saqlash chegarasidan oshdi. Faylni bulutga yuklab, havolasini kiriting.');
  }
}
