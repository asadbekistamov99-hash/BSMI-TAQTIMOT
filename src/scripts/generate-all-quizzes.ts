import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from 'dotenv';
import firebaseConfig from '../../firebase-applet-config.json' with { type: 'json' };

// Load environment variables (.env / process.env)
dotenv.config();

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

/**
 * Retries generating quiz questions with exponential backoff on rate-limiting.
 */
async function generateQuizzesWithAI(topicTitle: string, count: number = 30, retries = 4): Promise<any[]> {
  const prompt = `Human Anatomy (Odam anatomiyasi) fanidan "${topicTitle}" mavzusiga doir ${count} ta har xil qiyinchilikdagi professional biologik/tibbiy test savollarini (MCQ) O'zbek tilida tayyorlab ber.
Savol va tushuntirish kiritilgan tibbiy terminlar (lotincha yoki anatomik nomlar) bilan boyitilgan bo'lsin.
Har bir savolda:
1. "question": savol matni (o'zbek tilida).
2. "options": 4 ta variant (o'zbek tilida, lotincha terminlar ishlatilishi mumkin). Ulardan faqat bittasi to'g'ri bo'lishi kerak.
3. "correctAnswerIndex": to'g'ri javob indeksi (0, 1, 2 yoki 3).
4. "explanation": to'g'ri javob nega to'g'riligini o'zbek tilida qisqa ilmiy tushuntirib beruvchi matn.`;

  let delay = 3000;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Sending prompt to Gemini-3.5-Flash for topic: "${topicTitle}" (Attempt ${attempt}/${retries})...`);
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                correctAnswerIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswerIndex", "explanation"]
            }
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("No text response returned from Gemini API.");
      }

      const quizzes = JSON.parse(text);
      if (Array.isArray(quizzes) && quizzes.length > 0) {
        return quizzes;
      }
      throw new Error(`Invalid response shape: expected array of quizzes, got: ${typeof quizzes}`);
    } catch (error: any) {
      console.error(`Error on attempt ${attempt}:`, error.message || error);
      const isRateLimit = error.status === 429 || error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED');
      const isOverloaded = error.status === 503 || error.message?.includes('503') || error.message?.includes('UNAVAILABLE');
      
      if ((isRateLimit || isOverloaded) && attempt < retries) {
        const rateLimitDelay = 60000; // Sleep for 60 seconds to satisfy Free Tier rate limits
        console.log(`API rate limited or overloaded. Sleeping for ${rateLimitDelay}ms before retrying...`);
        await new Promise(resolve => setTimeout(resolve, rateLimitDelay));
      } else {
        throw error;
      }
    }
  }
  throw new Error(`Failed to generate quizzes for "${topicTitle}" after ${retries} attempts.`);
}

async function start() {
  console.log("=== ANATOMYA AI QUIZ GENERATOR (INCREMENTAL MODE) ===");
  console.log("Date:", new Date().toISOString());

  try {
    // 1. Fetch current active topics
    console.log("Fetching topics from Firestore...");
    const topicsSnap = await getDocs(collection(db, 'topics'));
    console.log(`Successfully fetched ${topicsSnap.size} topics.`);

    if (topicsSnap.size === 0) {
      console.log("No topics found in the database. Exiting.");
      return;
    }

    // 2. Map existing quizzes by topic identifier
    console.log("Fetching existing quizzes to map counts...");
    const quizzesSnap = await getDocs(collection(db, 'quizzes'));
    console.log(`Found ${quizzesSnap.size} total quizzes in the database currently.`);
    
    const quizCountsByTopic: Record<string, number> = {};
    quizzesSnap.forEach(doc => {
      const q = doc.data();
      const tId = q.topicId;
      if (tId) {
        quizCountsByTopic[tId] = (quizCountsByTopic[tId] || 0) + 1;
      }
    });

    // 3. Generate 30 quizzes for each of the 26 topics if missing
    let successfulTopics = 0;
    let skippedTopics = 0;
    let totalQuizzesInserted = 0;
    const MAX_TOPICS_PER_RUN = 3; // Process up to 3 topics per run to avoid gateway/command limits

    for (let i = 0; i < topicsSnap.docs.length; i++) {
      if (successfulTopics >= MAX_TOPICS_PER_RUN) {
        console.log(`\nReaching MAX_TOPICS_PER_RUN (${MAX_TOPICS_PER_RUN}) for this execution. stopping safely to avoid timeout. Please run the script again to process more topics!`);
        break;
      }

      const topicDoc = topicsSnap.docs[i];
      const topic = topicDoc.data();
      const topicId = topicDoc.id;
      
      const topicTitle = topic.title?.uz || topic.title?.en || topic.title || "Noma'lum Mavzu";
      const existingCount = quizCountsByTopic[topicId] || 0;

      // Skip this topic if it already has exactly or close to 30 quiz questions
      if (existingCount >= 30) {
        console.log(`Topic ${i + 1}/${topicsSnap.docs.length}: "${topicTitle}" already has ${existingCount} quizzes. Skipping.`);
        skippedTopics++;
        continue;
      }

      console.log(`\n========================================`);
      console.log(`Processing Topic ${i + 1}/${topicsSnap.docs.length}: "${topicTitle}" [ID: ${topicId}] (Has ${existingCount} quizzes, needs 30)`);
      console.log(`========================================`);

      try {
        // Generate 30 quizzes
        const quizzes = await generateQuizzesWithAI(topicTitle, 30);
        console.log(`Successfully generated ${quizzes.length} quiz questions for topic.`);

        // Insert into Firestore in a batch (30 writes is well under the 500 limit)
        const batch = writeBatch(db);
        quizzes.forEach((q: any) => {
          const newQuizRef = doc(collection(db, 'quizzes'));
          batch.set(newQuizRef, {
            topicId: topicId,
            question: q.question,
            options: q.options,
            correctAnswerIndex: Number(q.correctAnswerIndex),
            explanation: q.explanation || '',
            createdAt: serverTimestamp()
          });
        });

        await batch.commit();
        successfulTopics++;
        totalQuizzesInserted += quizzes.length;
        console.log(`✓ Batch saved successfully for topic. Cumulative inserted this run: ${totalQuizzesInserted}`);

        console.log("Waiting 7 seconds before next topic to remain safe under API Rate Limits...");
        await new Promise(resolve => setTimeout(resolve, 7000));

      } catch (err: any) {
        console.error(`✗ Failed to complete quizzes for topic "${topicTitle}":`, err.message || err);
        console.log("Stopping script execution to avoid exceeding API limits.");
        break;
      }
    }

    console.log(`\n=== GENERATION RUN COMPLETE ===`);
    console.log(`Successfully processed: ${successfulTopics} topics generated.`);
    console.log(`Skipped (already populated): ${skippedTopics} topics.`);
    console.log(`Total quiz questions inserted this run: ${totalQuizzesInserted}`);

  } catch (error) {
    console.error("Critical error in generator script:", error);
  }
}

start();
