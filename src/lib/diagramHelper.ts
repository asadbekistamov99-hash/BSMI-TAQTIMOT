import { doc, updateDoc, deleteField, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface DiagramReplacement {
  imageUrl: string;
  caption?: string;
  diagramKey?: string;
  originalCode?: string;
  updatedAt?: string;
  title?: string;
}

/**
 * Creates a stable deterministic hash key for a diagram code block
 */
export function getDiagramKey(code: string, index?: number): string {
  const normalized = (code || '').trim().replace(/\r\n/g, '\n');
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = ((hash << 5) - hash) + normalized.charCodeAt(i);
    hash |= 0;
  }
  const safeHash = Math.abs(hash).toString(36);
  return index !== undefined ? `diag_${index}_${safeHash}` : `diag_${safeHash}`;
}

/**
 * Human-friendly anatomical name detector for a code block / ASCII diagram
 */
export function detectDiagramTitle(code: string): string {
  const text = (code || '').toLowerCase();

  if (text.includes('axis verticalis') || text.includes('planum frontale') || text.includes('planum sagittale') || text.includes('horizontal')) {
    return "Anatomik O'qlar va Sathlar (Axis verticalis, Planum frontale & sagittale)";
  }
  if (text.includes('spinal_cord') || text.includes('medulla spinalis') || text.includes('orqa miya')) {
    return "Orqa Miya Anatomik Strukturasi (Medulla Spinalis)";
  }
  if (text.includes('cranial_nerves') || text.includes('12 juft') || text.includes('bosh miya nerv')) {
    return "12 Juft Kalla Nervlari Topografiyasi (Nervi Craniales)";
  }
  if (text.includes('fossa rhomboidea') || text.includes('uzunchoq miya') || text.includes('brainstem')) {
    return "Miya Ustuni va Rombsimon Chuqurcha (Brainstem & Fossa Rhomboidea)";
  }
  if (text.includes('cerebellum') || text.includes('miyacha')) {
    return "Miyacha Strukturasi (Cerebellum)";
  }
  if (text.includes('vertebra') || text.includes('umurtqa')) {
    return "Umurtqa Suyagi Anatomiyasi (Vertebra)";
  }
  if (text.includes('sternum') || text.includes('to‘sh suyagi') || text.includes('manubrium')) {
    return "To'sh Suyagi (Sternum)";
  }
  if (text.includes('clavicula') || text.includes('o‘mrov')) {
    return "O'mrov Suyagi (Clavicula)";
  }
  if (text.includes('scapula') || text.includes('kurak')) {
    return "Kurak Suyagi (Scapula)";
  }

  // Extract first informative line
  const lines = code.split('\n').map(l => l.replace(/[^a-zA-Z0-9\s\-_()]/g, '').trim()).filter(l => l.length > 3);
  if (lines.length > 0) {
    return lines[0].slice(0, 50);
  }

  return "Anatomik Sxema va Oqim Modeli";
}

/**
 * Extracts all codeblocks / diagrams from markdown theory text
 */
export function extractDiagramsFromTheory(theory: any): Array<{
  key: string;
  code: string;
  title: string;
  index: number;
  fullBlock: string;
}> {
  let rawText = '';
  if (typeof theory === 'string') {
    rawText = theory;
  } else if (theory && typeof theory === 'object') {
    rawText = theory.uz || theory.ru || theory.en || Object.values(theory)[0] || '';
  }

  if (!rawText) return [];

  const regex = /```(?:[a-zA-Z0-9_-]*)\r?\n([\s\S]*?)```/g;
  const list: Array<{
    key: string;
    code: string;
    title: string;
    index: number;
    fullBlock: string;
  }> = [];

  let match;
  let index = 0;
  while ((match = regex.exec(rawText)) !== null) {
    const code = match[1].trim();
    // Only consider blocks that have newlines or diagram symbols
    if (code.includes('\n') || code.includes('|') || code.includes('->') || code.includes('─')) {
      const key = getDiagramKey(code, index);
      const title = detectDiagramTitle(code);
      list.push({
        key,
        code,
        title,
        index,
        fullBlock: match[0]
      });
      index++;
    }
  }

  return list;
}

/**
 * Save a replacement image for a specific diagram in Firestore
 */
export async function saveDiagramReplacement(
  topicId: string,
  diagramKey: string,
  replacement: DiagramReplacement
): Promise<void> {
  if (!topicId || !diagramKey) return;
  const topicRef = doc(db, 'topics', topicId);
  const data = {
    [`diagramReplacements.${diagramKey}`]: {
      ...replacement,
      updatedAt: new Date().toISOString()
    }
  };
  await updateDoc(topicRef, data).catch(async (err) => {
    // If updateDoc fails (e.g. document structure), use setDoc with merge
    await setDoc(topicRef, {
      diagramReplacements: {
        [diagramKey]: {
          ...replacement,
          updatedAt: new Date().toISOString()
        }
      }
    }, { merge: true });
  });
}

/**
 * Reverts a replacement image back to the original diagram in Firestore
 */
export async function removeDiagramReplacement(
  topicId: string,
  diagramKey: string
): Promise<void> {
  if (!topicId || !diagramKey) return;
  const topicRef = doc(db, 'topics', topicId);
  await updateDoc(topicRef, {
    [`diagramReplacements.${diagramKey}`]: deleteField()
  }).catch(console.error);
}
