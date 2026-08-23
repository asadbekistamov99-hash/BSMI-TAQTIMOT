import { collection, doc, getDocs, writeBatch, updateDoc, deleteDoc, Firestore } from 'firebase/firestore';
import { SEMESTER_1_TOPICS, SEMESTER_2_TOPICS, SEMESTER_3_TOPICS } from '../constants';
import { SEMESTER_3_DETAILED_TOPICS } from '../data/semester3TopicsData';

export interface MergedTopic {
  id: string;
  semester: number;
  order: number;
  title: {
    uz: string;
    ru: string;
    en: string;
  };
  theory: {
    uz: string;
    ru: string;
    en: string;
  };
  latinTerms: string[];
  videos: {
    uz: string[];
    ru: string[];
    en: string[];
  } | string[];
  image?: string;
  [key: string]: any;
}

/**
 * Normalizes title text by stripping numbering prefixes and punctuation
 */
export function cleanTopicTitle(titleStr: string): string {
  if (!titleStr) return '';
  return titleStr
    .replace(/^\s*\d+[\s\-_.:]*(?:mavzu|тема|topic)?[\s\-_.:]*/i, '')
    .replace(/[‘'ʻ’`]/g, "'")
    .trim()
    .toLowerCase();
}

/**
 * Derives canonical (semester, order) for any topic record
 */
export function getTopicCanonicalKey(topic: any): { semester: number; order: number; key: string } {
  const sem = Number(topic.semester) || 1;
  let order = Number(topic.order) || 0;

  const rawUz = typeof topic.title === 'object' ? (topic.title?.uz || '') : (topic.title || '');
  const cleanTitle = cleanTopicTitle(rawUz);

  // If order is missing or invalid, try to parse from title or match standard catalog
  if (!order || order <= 0) {
    const numMatch = rawUz.match(/^\s*(\d+)[\s\-_.:]*(?:mavzu|тема|topic)?/i);
    if (numMatch) {
      order = parseInt(numMatch[1], 10);
    }
  }

  // Check matching in standard semester lists
  if (!order || order <= 0) {
    if (sem === 1) {
      const idx = SEMESTER_1_TOPICS.findIndex(t => cleanTopicTitle(t) === cleanTitle || cleanTitle.includes(cleanTopicTitle(t).slice(0, 20)));
      if (idx !== -1) order = idx + 1;
    } else if (sem === 2) {
      const idx = SEMESTER_2_TOPICS.findIndex(t => cleanTopicTitle(t) === cleanTitle || cleanTitle.includes(cleanTopicTitle(t).slice(0, 20)));
      if (idx !== -1) order = idx + 1;
    } else if (sem === 3) {
      const idx = SEMESTER_3_TOPICS.findIndex(t => cleanTopicTitle(t) === cleanTitle || cleanTitle.includes(cleanTopicTitle(t).slice(0, 20)));
      if (idx !== -1) order = idx + 1;
    }
  }

  // Fallback order if still 0
  if (!order || order <= 0) {
    order = 1;
  }

  return {
    semester: sem,
    order: order,
    key: `sem_${sem}_top_${order}`
  };
}

/**
 * Merges a group of duplicate topic objects into one single comprehensive topic
 */
export function mergeTopicGroup(topicsList: any[]): MergedTopic {
  if (topicsList.length === 0) {
    throw new Error("Empty topics list cannot be merged");
  }

  const { semester, order, key: canonicalId } = getTopicCanonicalKey(topicsList[0]);

  // Determine standard reference topic if exists in Semester 3
  const sem3Detailed = (semester === 3 && order >= 1 && order <= SEMESTER_3_DETAILED_TOPICS.length)
    ? SEMESTER_3_DETAILED_TOPICS[order - 1]
    : null;

  // 1. Merge Title
  let titleUz = '';
  let titleRu = '';
  let titleEn = '';

  // Seed with sem3 detailed or constants title if available
  if (sem3Detailed) {
    titleUz = sem3Detailed.title.uz;
    titleRu = sem3Detailed.title.ru || '';
    titleEn = sem3Detailed.title.en || '';
  } else if (semester === 1 && order >= 1 && order <= SEMESTER_1_TOPICS.length) {
    titleUz = `${order}-Mavzu: ${SEMESTER_1_TOPICS[order - 1]}`;
    titleRu = `Тема ${order}: ${SEMESTER_1_TOPICS[order - 1]}`;
    titleEn = `Topic ${order}: ${SEMESTER_1_TOPICS[order - 1]}`;
  } else if (semester === 2 && order >= 1 && order <= SEMESTER_2_TOPICS.length) {
    titleUz = `${order}-Mavzu: ${SEMESTER_2_TOPICS[order - 1]}`;
    titleRu = `Тема ${order}: ${SEMESTER_2_TOPICS[order - 1]}`;
    titleEn = `Topic ${order}: ${SEMESTER_2_TOPICS[order - 1]}`;
  }

  for (const t of topicsList) {
    const rawT = t.title;
    if (typeof rawT === 'object' && rawT !== null) {
      if (rawT.uz && (!titleUz || rawT.uz.length > titleUz.length)) titleUz = rawT.uz;
      if (rawT.ru && (!titleRu || rawT.ru.length > titleRu.length)) titleRu = rawT.ru;
      if (rawT.en && (!titleEn || rawT.en.length > titleEn.length)) titleEn = rawT.en;
    } else if (typeof rawT === 'string' && rawT.trim()) {
      if (!titleUz) titleUz = rawT.trim();
    }
  }

  if (!titleRu) titleRu = titleUz;
  if (!titleEn) titleEn = titleUz;

  // 2. Merge Theory (Pick the richest / most complete markdown text)
  let theoryUz = sem3Detailed?.theory?.uz || '';
  let theoryRu = sem3Detailed?.theory?.ru || '';
  let theoryEn = sem3Detailed?.theory?.en || '';

  const uniqueUzTheories: string[] = [];

  for (const t of topicsList) {
    const rawTh = t.theory;
    let u = '';
    let r = '';
    let e = '';

    if (typeof rawTh === 'object' && rawTh !== null) {
      u = rawTh.uz || '';
      r = rawTh.ru || '';
      e = rawTh.en || '';
    } else if (typeof rawTh === 'string') {
      u = rawTh;
    }

    if (u && u.trim().length > 30) {
      // Check if this text is a placeholder
      const isPlaceholder = u.includes("tez orada yuklanadi") || u.includes("mavzusi bo‘yicha nazariy ma'lumotlar");
      if (!isPlaceholder && !uniqueUzTheories.includes(u.trim())) {
        uniqueUzTheories.push(u.trim());
      }
    }

    if (r && r.length > theoryRu.length) theoryRu = r;
    if (e && e.length > theoryEn.length) theoryEn = e;
  }

  if (uniqueUzTheories.length > 0) {
    // Pick the longest most detailed theory or combine if distinct
    const longest = uniqueUzTheories.reduce((a, b) => (a.length >= b.length ? a : b), '');
    // If other theories contain significant unique sections not in longest, append them
    const otherValuable = uniqueUzTheories.filter(t => t !== longest && t.length > 150 && !longest.includes(t.slice(0, 50)));
    if (otherValuable.length > 0) {
      theoryUz = longest + "\n\n---\n\n### 📖 Qo‘shimcha Nazariy Ma'lumotlar\n" + otherValuable.join("\n\n---\n\n");
    } else {
      theoryUz = longest;
    }
  }

  if (!theoryUz && sem3Detailed) {
    theoryUz = sem3Detailed.theory.uz;
  }

  // 3. Merge Latin Terms (deduplicate while preserving full formatted terms)
  const latinTermsSet = new Set<string>();
  if (sem3Detailed?.latinTerms) {
    sem3Detailed.latinTerms.forEach(t => latinTermsSet.add(t.trim()));
  }

  for (const t of topicsList) {
    if (Array.isArray(t.latinTerms)) {
      t.latinTerms.forEach((term: string) => {
        if (typeof term === 'string' && term.trim()) {
          latinTermsSet.add(term.trim());
        }
      });
    }
  }

  // 4. Merge Videos
  const uzVideos = new Set<string>();
  const ruVideos = new Set<string>();
  const enVideos = new Set<string>();

  if (sem3Detailed?.videos) {
    if (Array.isArray(sem3Detailed.videos)) {
      sem3Detailed.videos.forEach(v => uzVideos.add(v));
    } else if (typeof sem3Detailed.videos === 'object') {
      (sem3Detailed.videos.uz || []).forEach(v => uzVideos.add(v));
      (sem3Detailed.videos.ru || []).forEach(v => ruVideos.add(v));
      (sem3Detailed.videos.en || []).forEach(v => enVideos.add(v));
    }
  }

  for (const t of topicsList) {
    if (Array.isArray(t.videos)) {
      t.videos.forEach((v: string) => {
        if (typeof v === 'string' && v.trim()) uzVideos.add(v.trim());
      });
    } else if (typeof t.videos === 'object' && t.videos !== null) {
      (t.videos.uz || []).forEach((v: string) => v && uzVideos.add(v.trim()));
      (t.videos.ru || []).forEach((v: string) => v && ruVideos.add(v.trim()));
      (t.videos.en || []).forEach((v: string) => v && enVideos.add(v.trim()));
    }
  }

  // 5. Image URL
  let image = sem3Detailed?.image || "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=2670&auto=format&fit=crop";
  for (const t of topicsList) {
    if (t.image && typeof t.image === 'string' && t.image.startsWith('http')) {
      image = t.image;
      break;
    }
  }

  // Preferred canonical ID
  let chosenId = canonicalId;
  const hasExistingCanonical = topicsList.some(t => t.id === canonicalId || t.id === `sem3_topic_${order}`);
  if (hasExistingCanonical) {
    const found = topicsList.find(t => t.id === canonicalId) || topicsList.find(t => t.id === `sem3_topic_${order}`);
    if (found) chosenId = found.id;
  } else if (topicsList[0]?.id) {
    chosenId = topicsList[0].id;
  }

  return {
    id: chosenId,
    semester,
    order,
    title: {
      uz: titleUz,
      ru: titleRu,
      en: titleEn
    },
    theory: {
      uz: theoryUz,
      ru: theoryRu || theoryUz,
      en: theoryEn || theoryUz
    },
    latinTerms: Array.from(latinTermsSet),
    videos: {
      uz: Array.from(uzVideos),
      ru: Array.from(ruVideos),
      en: Array.from(enVideos)
    },
    image
  };
}

/**
 * Takes a list of raw topic documents from Firestore or Memory,
 * groups them by semester and order, merges duplicate documents into 1,
 * and returns the clean unique list + instructions on what IDs to delete.
 */
export function deduplicateAndMergeTopics(rawTopics: any[]): {
  mergedTopics: MergedTopic[];
  duplicatesToDelete: { keepId: string; deleteIds: string[] }[];
} {
  const groups = new Map<string, any[]>();

  for (const t of rawTopics) {
    const { key } = getTopicCanonicalKey(t);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(t);
  }

  const mergedTopics: MergedTopic[] = [];
  const duplicatesToDelete: { keepId: string; deleteIds: string[] }[] = [];

  for (const [, topicGroup] of groups.entries()) {
    const merged = mergeTopicGroup(topicGroup);
    mergedTopics.push(merged);

    // Identify duplicates to remove in Firestore
    const allIds = topicGroup.map(t => t.id).filter(Boolean);
    const deleteIds = allIds.filter(id => id !== merged.id);

    if (deleteIds.length > 0) {
      duplicatesToDelete.push({
        keepId: merged.id,
        deleteIds
      });
    }
  }

  // Sort by semester asc, order asc
  mergedTopics.sort((a, b) => {
    if (a.semester !== b.semester) return a.semester - b.semester;
    return a.order - b.order;
  });

  return {
    mergedTopics,
    duplicatesToDelete
  };
}

/**
 * Direct Firestore cleanup utility:
 * Reads all topics from Firestore, merges duplicates, updates the canonical documents,
 * and deletes all duplicate documents.
 */
export async function cleanupFirestoreDuplicateTopics(
  db: Firestore,
  onProgress?: (message: string) => void
): Promise<{ mergedCount: number; deletedDocsCount: number }> {
  if (onProgress) onProgress("Bazada mavzular tahlil qilinmoqda...");

  const snap = await getDocs(collection(db, 'topics'));
  const allDocs = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  const { mergedTopics, duplicatesToDelete } = deduplicateAndMergeTopics(allDocs);

  let deletedDocsCount = 0;
  let mergedCount = mergedTopics.length;

  if (onProgress) onProgress(`${allDocs.length} ta hujjatdan ${mergedTopics.length} ta yagona mavzu aniqlandi...`);

  // 1. Save / Update merged topics into Firestore
  const batch = writeBatch(db);
  for (const topic of mergedTopics) {
    const ref = doc(db, 'topics', topic.id);
    const { id, ...data } = topic;
    batch.set(ref, data, { merge: true });
  }

  // 2. Delete redundant duplicate documents
  for (const dup of duplicatesToDelete) {
    for (const delId of dup.deleteIds) {
      const delRef = doc(db, 'topics', delId);
      batch.delete(delRef);
      deletedDocsCount++;
    }
  }

  await batch.commit();

  if (onProgress) {
    onProgress(`Tayyor! ${deletedDocsCount} ta takrorlangan hujjat o'chirildi va ${mergedCount} ta mavzu to'liq birlashtirildi.`);
  }

  return {
    mergedCount,
    deletedDocsCount
  };
}
