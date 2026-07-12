import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json' with { type: 'json' };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  const quizzesSnap = await getDocs(collection(db, 'quizzes'));
  console.log(`Found total ${quizzesSnap.size} quizzes.`);

  const topicsSnap = await getDocs(collection(db, 'topics'));
  const counts: Record<string, number> = {};
  quizzesSnap.forEach(doc => {
    const q = doc.data();
    counts[q.topicId] = (counts[q.topicId] || 0) + 1;
  });

  console.log("--- QUIZES PER TOPIC STATUS ---");
  topicsSnap.docs.forEach((doc, idx) => {
    const t = doc.data();
    const title = t.title?.uz || t.title || "Noma'lum";
    console.log(`Topic ${idx + 1}: ${title} -> ${counts[doc.id] || 0} questions`);
  });
}

run();
