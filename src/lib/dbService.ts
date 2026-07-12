import { supabase, isSupabaseConfigured } from './supabase';
import { db, auth, OperationType, handleFirestoreError } from './firebase';
import { appwriteDb, appwriteDatabaseId, isAppwriteEnabled, activateAppwriteFallback, appwriteStorage } from './appwrite';
import { ID, Query } from 'appwrite';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  orderBy, 
  limit 
} from 'firebase/firestore';

export let supabaseFallbackActive = false;

export const isSupabaseEnabled = (): boolean => {
  return isSupabaseConfigured() && !supabaseFallbackActive;
};

export { isAppwriteEnabled };

// Map Appwrite documents back to frontend camelCase objects
const mapAppwriteSemester = (doc: any) => ({
  id: doc.$id,
  number: doc.number,
  title: doc.title,
  description: doc.description,
  isActive: doc.is_active !== undefined ? doc.is_active : doc.isActive,
  order: doc.order
});

const mapAppwriteTopic = (doc: any) => ({
  id: doc.$id,
  semester: doc.semester,
  order: doc.order,
  title: doc.title,
  theory: doc.theory,
  latinTerms: doc.latin_terms !== undefined ? doc.latin_terms : doc.latinTerms,
  videos: typeof doc.videos === 'string' ? JSON.parse(doc.videos) : (doc.videos || []),
  image: doc.image
});

const mapAppwriteQuiz = (doc: any) => {
  const ansIdx = doc.correctAnswerIndex !== undefined ? doc.correctAnswerIndex : (doc.correct_answer_index !== undefined ? doc.correct_answer_index : (doc.answer_index !== undefined ? doc.answer_index : doc.answerIndex));
  return {
    id: doc.$id,
    topicId: doc.topic_id !== undefined ? doc.topic_id : doc.topicId,
    question: doc.question,
    options: typeof doc.options === 'string' ? JSON.parse(doc.options) : (doc.options || []),
    answerIndex: ansIdx,
    correctAnswerIndex: ansIdx,
    explanation: doc.explanation
  };
};

const mapAppwriteLatinTerm = (doc: any) => ({
  id: doc.$id,
  latin: doc.latin,
  uzbek: doc.uzbek,
  english: doc.english,
  russian: doc.russian,
  pronunciation: doc.pronunciation
});

const mapAppwriteAtlas = (doc: any) => {
  let descriptionValue = '';
  let modelUrlValue = '';

  if (doc.details) {
    if (typeof doc.details === 'string') {
      try {
        const trimmed = doc.details.trim();
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
          const parsed = JSON.parse(doc.details);
          descriptionValue = parsed.text || parsed.description || parsed.details || '';
          modelUrlValue = parsed.modelUrl || parsed.model_url || '';
        } else {
          descriptionValue = doc.details;
        }
      } catch (e) {
        descriptionValue = doc.details;
      }
    } else if (typeof doc.details === 'object' && doc.details !== null) {
      descriptionValue = doc.details.text || doc.details.description || doc.details.details || '';
      modelUrlValue = doc.details.modelUrl || doc.details.model_url || '';
    }
  }

  return {
    id: doc.$id,
    latinName: doc.latin_name !== undefined ? doc.latin_name : (doc.latinName || ''),
    uzbekName: doc.uzbek_name !== undefined ? doc.uzbek_name : (doc.uzbekName || ''),
    englishName: doc.english_name !== undefined ? doc.english_name : (doc.englishName || ''),
    russianName: doc.russian_name !== undefined ? doc.russian_name : (doc.russianName || ''),
    image: doc.image_url !== undefined ? doc.image_url : (doc.image || doc.imageUrl || ''),
    description: descriptionValue || doc.description || doc.details || '',
    modelUrl: doc.model_url !== undefined ? doc.model_url : (doc.modelUrl || modelUrlValue || ''),
    topicId: doc.topic_id !== undefined ? doc.topic_id : (doc.topicId || ''),
    semester: doc.semester !== undefined ? Number(doc.semester) : 1
  };
};

const mapAppwriteAnnouncement = (doc: any) => ({
  id: doc.$id,
  title: doc.title,
  content: doc.content,
  isActive: doc.is_active !== undefined ? doc.is_active : doc.isActive,
  createdAt: doc.created_at ? new Date(doc.created_at) : (doc.$createdAt ? new Date(doc.$createdAt) : null)
});

const mapAppwritePayment = (doc: any) => ({
  id: doc.$id,
  userId: doc.user_id !== undefined ? doc.user_id : doc.userId,
  semesterId: doc.semester_id !== undefined ? doc.semester_id : doc.semesterId,
  status: doc.status,
  receiptUrl: doc.receipt_url !== undefined ? doc.receipt_url : doc.receiptUrl,
  amount: doc.amount,
  cardHolder: doc.card_holder !== undefined ? doc.card_holder : doc.cardHolder,
  phoneNumber: doc.phone_number !== undefined ? doc.phone_number : doc.phoneNumber,
  adminNote: doc.admin_note !== undefined ? doc.admin_note : doc.adminNote,
  createdAt: doc.created_at ? new Date(doc.created_at) : (doc.$createdAt ? new Date(doc.$createdAt) : null)
});

export const activateSupabaseFallback = () => {
  supabaseFallbackActive = true;
};

export const deactivateSupabaseFallback = () => {
  supabaseFallbackActive = false;
};

// Map Postgres snake_case back to frontend camelCase objects
const mapSemester = (s: any) => ({
  id: s.id,
  number: s.number,
  title: s.title,
  description: s.description,
  isActive: s.is_active !== undefined ? s.is_active : s.isActive,
  order: s.order
});

const mapTopic = (t: any) => ({
  id: t.id,
  semester: t.semester,
  order: t.order,
  title: t.title,
  theory: t.theory,
  latinTerms: t.latin_terms !== undefined ? t.latin_terms : t.latinTerms,
  videos: t.videos,
  image: t.image
});

const mapQuiz = (q: any) => {
  const ansIdx = q.correctAnswerIndex !== undefined ? q.correctAnswerIndex : (q.correct_answer_index !== undefined ? q.correct_answer_index : (q.answer_index !== undefined ? q.answer_index : q.answerIndex));
  return {
    id: q.id,
    topicId: q.topic_id !== undefined ? q.topic_id : q.topicId,
    question: q.question,
    options: q.options,
    answerIndex: ansIdx,
    correctAnswerIndex: ansIdx,
    explanation: q.explanation
  };
};

const mapLatinTerm = (l: any) => ({
  id: l.id,
  latin: l.latin,
  uzbek: l.uzbek
});

const mapAtlas = (a: any) => {
  if (!a) return null as any;

  let descriptionValue = '';
  let modelUrlValue = '';

  if (a.details) {
    if (typeof a.details === 'string') {
      try {
        const trimmed = a.details.trim();
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
          const parsed = JSON.parse(a.details);
          descriptionValue = parsed.text || parsed.description || parsed.details || '';
          modelUrlValue = parsed.modelUrl || parsed.model_url || '';
        } else {
          descriptionValue = a.details;
        }
      } catch (e) {
        descriptionValue = a.details;
      }
    } else if (typeof a.details === 'object' && a.details !== null) {
      descriptionValue = a.details.text || a.details.description || a.details.details || '';
      modelUrlValue = a.details.modelUrl || a.details.model_url || '';
    }
  }

  return {
    id: a.id,
    latinName: a.latin_name !== undefined ? a.latin_name : (a.latinName || ''),
    uzbekName: a.uzbek_name !== undefined ? a.uzbek_name : (a.uzbekName || ''),
    englishName: a.english_name !== undefined ? a.english_name : (a.englishName || ''),
    russianName: a.russian_name !== undefined ? a.russian_name : (a.russianName || ''),
    image: a.image_url !== undefined ? a.image_url : (a.image || a.imageUrl || ''),
    description: descriptionValue || a.description || a.details || '',
    modelUrl: a.model_url !== undefined ? a.model_url : (a.modelUrl || modelUrlValue || ''),
    topicId: a.topic_id !== undefined ? a.topic_id : (a.topicId || ''),
    semester: a.semester !== undefined ? Number(a.semester) : 1
  };
};

const mapPayment = (p: any) => ({
  id: p.id,
  userId: p.user_id !== undefined ? p.user_id : p.userId,
  semesterId: p.semester_id !== undefined ? p.semester_id : p.semesterId,
  status: p.status,
  receiptUrl: p.receipt_url !== undefined ? p.receipt_url : p.receiptUrl,
  amount: p.amount,
  cardHolder: p.card_holder !== undefined ? p.card_holder : p.cardHolder,
  phoneNumber: p.phone_number !== undefined ? p.phone_number : p.phoneNumber,
  adminNote: p.admin_note !== undefined ? p.admin_note : p.adminNote,
  createdAt: p.created_at ? new Date(p.created_at) : null
});

const mapAnnouncement = (a: any) => ({
  id: a.id,
  title: a.title,
  content: a.content,
  isActive: a.is_active !== undefined ? a.is_active : a.isActive,
  createdAt: a.created_at ? new Date(a.created_at) : null
});

// App data service
export const dbService = {
  // 1. SEMESTERS
  async getSemesters(): Promise<any[]> {
    if (isAppwriteEnabled() && appwriteDb) {
      try {
        const res = await appwriteDb.listDocuments(appwriteDatabaseId, 'semesters', [
          Query.equal('isActive', true),
          Query.orderAsc('number'),
          Query.limit(100)
        ]);
        if (res.documents.length > 0) {
          return res.documents.map(mapAppwriteSemester);
        }
        console.warn("Appwrite semesters empty, trying fallback...");
        activateAppwriteFallback();
      } catch (err) {
        console.warn("Appwrite getSemesters failed, trying fallback:", err);
        activateAppwriteFallback();
      }
    }

    if (isSupabaseEnabled() && supabase) {
      try {
        const { data, error } = await supabase
          .from('semesters')
          .select('*')
          .eq('is_active', true)
          .order('number', { ascending: true });
        if (error) throw error;
        
        // If semesters is empty, Supabase is unseeded. Walk back to Firebase!
        if (!data || data.length === 0) {
          console.warn("Supabase semesters is empty, activating Firebase fallback...");
          supabaseFallbackActive = true;
          const q = query(collection(db, 'semesters'), where('isActive', '==', true), orderBy('number', 'asc'));
          const snapshot = await getDocs(q);
          return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
        
        return (data || []).map(mapSemester);
      } catch (err) {
        console.warn("Supabase getSemesters failed, fallback to Firebase:", err);
        supabaseFallbackActive = true;
        const q = query(collection(db, 'semesters'), where('isActive', '==', true), orderBy('number', 'asc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } else {
      const q = query(collection(db, 'semesters'), where('isActive', '==', true), orderBy('number', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  },

  async addSemester(semester: any): Promise<any> {
    if (isAppwriteEnabled() && appwriteDb) {
      try {
        const payload = {
          number: semester.number,
          title: semester.title,
          description: semester.description,
          isActive: semester.isActive ?? true,
          order: semester.order || semester.number
        };
        const data = await appwriteDb.createDocument(appwriteDatabaseId, 'semesters', ID.unique(), payload);
        return mapAppwriteSemester(data);
      } catch (err) {
        console.warn("Appwrite addSemester failed, falling back:", err);
      }
    }

    if (isSupabaseEnabled() && supabase) {
      const { data, error } = await supabase
        .from('semesters')
        .insert([{
          number: semester.number,
          title: semester.title,
          description: semester.description,
          is_active: semester.isActive ?? true,
          order: semester.order || semester.number
        }])
        .select()
        .single();
      if (error) throw error;
      return mapSemester(data);
    } else {
      const docRef = await addDoc(collection(db, 'semesters'), semester);
      return { id: docRef.id, ...semester };
    }
  },

  // 2. TOPICS
  async getTopics(semesterId?: number): Promise<any[]> {
    if (isAppwriteEnabled() && appwriteDb) {
      try {
        const queries = [Query.orderAsc('order'), Query.limit(100)];
        if (semesterId) {
          queries.push(Query.equal('semester', semesterId));
        }
        const res = await appwriteDb.listDocuments(appwriteDatabaseId, 'topics', queries);
        if (res.documents.length > 0) {
          return res.documents.map(mapAppwriteTopic);
        }
        console.warn("Appwrite topics empty, trying fallback...");
        activateAppwriteFallback();
      } catch (err) {
        console.warn("Appwrite getTopics failed, trying fallback:", err);
        activateAppwriteFallback();
      }
    }

    if (isSupabaseEnabled() && supabase) {
      try {
        let queryBuilder = supabase.from('topics').select('*');
        if (semesterId) {
          queryBuilder = queryBuilder.eq('semester', semesterId);
        }
        const { data, error } = await queryBuilder.order('order', { ascending: true });
        if (error) throw error;
        
        // If topics is empty, Supabase is unseeded. Fall back to Firebase.
        if (!data || data.length === 0) {
          console.warn("Supabase topics is empty, activating Firebase fallback...");
          supabaseFallbackActive = true;
          const q = semesterId 
            ? query(collection(db, 'topics'), where('semester', '==', semesterId))
            : query(collection(db, 'topics'), orderBy('order', 'asc'));
          const snapshot = await getDocs(q);
          const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          return list.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        }
        
        return (data || []).map(mapTopic);
      } catch (err) {
        console.warn("Supabase getTopics failed, fallback to Firebase:", err);
        supabaseFallbackActive = true;
        const q = semesterId 
          ? query(collection(db, 'topics'), where('semester', '==', semesterId))
          : query(collection(db, 'topics'), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return list.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
      }
    } else {
      const q = semesterId 
        ? query(collection(db, 'topics'), where('semester', '==', semesterId))
        : query(collection(db, 'topics'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return list.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    }
  },

  async getTopicDetail(topicId: string): Promise<any> {
    if (isAppwriteEnabled() && appwriteDb) {
      try {
        const data = await appwriteDb.getDocument(appwriteDatabaseId, 'topics', topicId);
        return mapAppwriteTopic(data);
      } catch (err) {
        console.warn("Appwrite getTopicDetail failed, falling back...", err);
      }
    }

    if (isSupabaseEnabled() && supabase) {
      try {
        const { data, error } = await supabase
          .from('topics')
          .select('*')
          .eq('id', topicId)
          .single();
        if (error) throw error;
        return mapTopic(data);
      } catch (err) {
        console.warn("Supabase getTopicDetail failed, fallback to Firebase:", err);
        supabaseFallbackActive = true;
        const snapshot = await getDoc(doc(db, 'topics', topicId));
        if (!snapshot.exists()) {
          throw new Error('Mavzu topilmadi');
        }
        return { id: snapshot.id, ...snapshot.data() };
      }
    } else {
      const snapshot = await getDoc(doc(db, 'topics', topicId));
      if (!snapshot.exists()) {
        throw new Error('Mavzu topilmadi');
      }
      return { id: snapshot.id, ...snapshot.data() };
    }
  },

  async saveTopic(topicId: string | null, topicData: any): Promise<any> {
    if (isAppwriteEnabled() && appwriteDb) {
      try {
        const payload = {
          semester: Number(topicData.semester),
          order: Number(topicData.order),
          title: topicData.title,
          theory: topicData.theory,
          latinTerms: typeof topicData.latinTerms === 'object' ? JSON.stringify(topicData.latinTerms) : (topicData.latinTerms || '[]'),
          videos: typeof topicData.videos === 'object' ? JSON.stringify(topicData.videos) : (topicData.videos || '[]'),
          image: topicData.image || ''
        };
        if (topicId) {
          const data = await appwriteDb.updateDocument(appwriteDatabaseId, 'topics', topicId, payload);
          return mapAppwriteTopic(data);
        } else {
          const data = await appwriteDb.createDocument(appwriteDatabaseId, 'topics', ID.unique(), payload);
          return mapAppwriteTopic(data);
        }
      } catch (err) {
        console.warn("Appwrite saveTopic failed, falling back:", err);
      }
    }

    if (isSupabaseEnabled() && supabase) {
      const payload = {
        semester: Number(topicData.semester),
        order: Number(topicData.order),
        title: topicData.title,
        theory: topicData.theory,
        latin_terms: topicData.latinTerms || [],
        videos: topicData.videos || [],
        image: topicData.image || null
      };

      if (topicId) {
        const { data, error } = await supabase
          .from('topics')
          .update(payload)
          .eq('id', topicId)
          .select()
          .single();
        if (error) throw error;
        return mapTopic(data);
      } else {
        const { data, error } = await supabase
          .from('topics')
          .insert([payload])
          .select()
          .single();
        if (error) throw error;
        return mapTopic(data);
      }
    } else {
      if (topicId) {
        await setDoc(doc(db, 'topics', topicId), topicData, { merge: true });
        return { id: topicId, ...topicData };
      } else {
        const docRef = await addDoc(collection(db, 'topics'), topicData);
        return { id: docRef.id, ...topicData };
      }
    }
  },

  async deleteTopic(topicId: string): Promise<void> {
    if (isAppwriteEnabled() && appwriteDb) {
      try {
        await appwriteDb.deleteDocument(appwriteDatabaseId, 'topics', topicId);
        return;
      } catch (err) {
        console.warn("Appwrite deleteTopic failed, falling back:", err);
      }
    }

    if (isSupabaseEnabled() && supabase) {
      const { error } = await supabase.from('topics').delete().eq('id', topicId);
      if (error) throw error;
    } else {
      await deleteDoc(doc(db, 'topics', topicId));
    }
  },

  // 3. QUIZZES
  async getQuizzes(topicId?: string): Promise<any[]> {
    if (isAppwriteEnabled() && appwriteDb) {
      try {
        const queries = [Query.limit(100)];
        if (topicId) {
          queries.push(Query.equal('topicId', topicId));
        }
        const res = await appwriteDb.listDocuments(appwriteDatabaseId, 'quizzes', queries);
        return res.documents.map(mapAppwriteQuiz);
      } catch (err) {
        console.warn("Appwrite getQuizzes failed, falling back:", err);
      }
    }

    if (isSupabaseEnabled() && supabase) {
      try {
        let queryBuilder = supabase.from('quizzes').select('*');
        if (topicId) {
          queryBuilder = queryBuilder.eq('topic_id', topicId);
        }
        const { data, error } = await queryBuilder;
        if (error) throw error;
        return (data || []).map(mapQuiz);
      } catch (err) {
        console.warn("Supabase getQuizzes failed, fallback to Firebase:", err);
        supabaseFallbackActive = true;
        const q = topicId 
          ? query(collection(db, 'quizzes'), where('topicId', '==', topicId))
          : query(collection(db, 'quizzes'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } else {
      const q = topicId 
        ? query(collection(db, 'quizzes'), where('topicId', '==', topicId))
        : query(collection(db, 'quizzes'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  },

  async saveQuiz(quizId: string | null, quizData: any): Promise<any> {
    if (isAppwriteEnabled() && appwriteDb) {
      try {
        const payload = {
          topicId: quizData.topicId,
          question: quizData.question,
          options: typeof quizData.options === 'object' ? JSON.stringify(quizData.options) : (quizData.options || []),
          answerIndex: Number(quizData.answerIndex),
          explanation: quizData.explanation || ''
        };
        if (quizId) {
          const data = await appwriteDb.updateDocument(appwriteDatabaseId, 'quizzes', quizId, payload);
          return mapAppwriteQuiz(data);
        } else {
          const data = await appwriteDb.createDocument(appwriteDatabaseId, 'quizzes', ID.unique(), payload);
          return mapAppwriteQuiz(data);
        }
      } catch (err) {
        console.warn("Appwrite saveQuiz failed, falling back:", err);
      }
    }

    if (isSupabaseEnabled() && supabase) {
      const payload = {
        topic_id: quizData.topicId,
        question: quizData.question,
        options: quizData.options,
        answer_index: Number(quizData.answerIndex),
        explanation: quizData.explanation || null
      };

      if (quizId) {
        const { data, error } = await supabase
          .from('quizzes')
          .update(payload)
          .eq('id', quizId)
          .select()
          .single();
        if (error) throw error;
        return mapQuiz(data);
      } else {
        const { data, error } = await supabase
          .from('quizzes')
          .insert([payload])
          .select()
          .single();
        if (error) throw error;
        return mapQuiz(data);
      }
    } else {
      if (quizId) {
        await setDoc(doc(db, 'quizzes', quizId), quizData, { merge: true });
        return { id: quizId, ...quizData };
      } else {
        const docRef = await addDoc(collection(db, 'quizzes'), quizData);
        return { id: docRef.id, ...quizData };
      }
    }
  },

  async deleteQuiz(quizId: string): Promise<void> {
    if (isAppwriteEnabled() && appwriteDb) {
      try {
        await appwriteDb.deleteDocument(appwriteDatabaseId, 'quizzes', quizId);
        return;
      } catch (err) {
        console.warn("Appwrite deleteQuiz failed, falling back:", err);
      }
    }

    if (isSupabaseEnabled() && supabase) {
      const { error } = await supabase.from('quizzes').delete().eq('id', quizId);
      if (error) throw error;
    } else {
      await deleteDoc(doc(db, 'quizzes', quizId));
    }
  },

  // 4. LATIN TERMS
  async getLatinTerms(): Promise<any[]> {
    if (isAppwriteEnabled() && appwriteDb) {
      try {
        const res = await appwriteDb.listDocuments(appwriteDatabaseId, 'latin_terms', [
          Query.orderAsc('latin'),
          Query.limit(100)
        ]);
        return res.documents.map(mapAppwriteLatinTerm);
      } catch (err) {
        console.warn("Appwrite getLatinTerms failed, falling back:", err);
      }
    }

    if (isSupabaseEnabled() && supabase) {
      try {
        const { data, error } = await supabase
          .from('latin_terms')
          .select('*')
          .order('latin', { ascending: true });
        if (error) throw error;
        return (data || []).map(mapLatinTerm);
      } catch (err) {
        console.warn("Supabase getLatinTerms failed, fallback to Firebase:", err);
        supabaseFallbackActive = true;
        const q = query(collection(db, 'latin_terms'), orderBy('latin', 'asc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } else {
      const q = query(collection(db, 'latin_terms'), orderBy('latin', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  },

  async saveLatinTerm(latinTerm: any): Promise<any> {
    if (isAppwriteEnabled() && appwriteDb) {
      try {
        const payload = {
          latin: latinTerm.latin,
          uzbek: latinTerm.uzbek,
          english: latinTerm.english || '',
          russian: latinTerm.russian || '',
          pronunciation: latinTerm.pronunciation || ''
        };
        const existing = await appwriteDb.listDocuments(appwriteDatabaseId, 'latin_terms', [
          Query.equal('latin', latinTerm.latin),
          Query.limit(1)
        ]);
        if (existing.documents.length > 0) {
          const data = await appwriteDb.updateDocument(appwriteDatabaseId, 'latin_terms', existing.documents[0].$id, payload);
          return mapAppwriteLatinTerm(data);
        } else {
          const data = await appwriteDb.createDocument(appwriteDatabaseId, 'latin_terms', ID.unique(), payload);
          return mapAppwriteLatinTerm(data);
        }
      } catch (err) {
        console.warn("Appwrite saveLatinTerm failed, falling back:", err);
      }
    }

    if (isSupabaseEnabled() && supabase) {
      const payload = {
        latin: latinTerm.latin,
        uzbek: latinTerm.uzbek,
        english: latinTerm.english || null,
        russian: latinTerm.russian || null,
        pronunciation: latinTerm.pronunciation || null
      };
      
      const { data, error } = await supabase
        .from('latin_terms')
        .upsert(payload, { onConflict: 'latin' })
        .select()
        .single();
      if (error) throw error;
      return mapLatinTerm(data);
    } else {
      const dRef = await addDoc(collection(db, 'latin_terms'), latinTerm);
      return { id: dRef.id, ...latinTerm };
    }
  },

  // 5. ATLAS
  async getAtlasEntries(semesterId?: number): Promise<any[]> {
    if (isAppwriteEnabled() && appwriteDb) {
      try {
        const queries = [Query.orderAsc('latinName'), Query.limit(100)];
        if (semesterId) {
          queries.push(Query.equal('semester', semesterId));
        }
        const res = await appwriteDb.listDocuments(appwriteDatabaseId, 'atlas', queries);
        return res.documents.map(mapAppwriteAtlas);
      } catch (err) {
        console.warn("Appwrite getAtlasEntries failed, falling back:", err);
      }
    }

    if (isSupabaseEnabled() && supabase) {
      try {
        let q = supabase.from('atlas').select('*');
        if (semesterId) {
          q = q.eq('semester', semesterId);
        }
        const { data, error } = await q.order('latin_name', { ascending: true });
        if (error) throw error;
        return (data || []).map(mapAtlas);
      } catch (err) {
        console.warn("Supabase getAtlasEntries failed, fallback to Firebase:", err);
        supabaseFallbackActive = true;
        const qRef = semesterId 
          ? query(collection(db, 'atlas'), where('semester', '==', semesterId))
          : query(collection(db, 'atlas'), orderBy('latinName', 'asc'));
        const snapshot = await getDocs(qRef);
        return snapshot.docs.map(doc => mapAtlas({ id: doc.id, ...doc.data() }));
      }
    } else {
      const qRef = semesterId 
        ? query(collection(db, 'atlas'), where('semester', '==', semesterId))
        : query(collection(db, 'atlas'), orderBy('latinName', 'asc'));
      const snapshot = await getDocs(qRef);
      return snapshot.docs.map(doc => mapAtlas({ id: doc.id, ...doc.data() }));
    }
  },

  async addAtlasEntry(entry: any): Promise<any> {
    if (isAppwriteEnabled() && appwriteDb) {
      try {
        const payload = {
          latinName: entry.latinName,
          uzbekName: entry.uzbekName,
          englishName: entry.englishName || '',
          russianName: entry.russianName || '',
          image: entry.image || entry.imageUrl || '',
          description: entry.description || entry.details || '',
          modelUrl: entry.modelUrl || '',
          semester: entry.semester ? Number(entry.semester) : 1
        };
        const data = await appwriteDb.createDocument(appwriteDatabaseId, 'atlas', ID.unique(), payload);
        return mapAppwriteAtlas(data);
      } catch (err) {
        console.warn("Appwrite addAtlasEntry failed, falling back:", err);
      }
    }

    if (isSupabaseEnabled() && supabase) {
      const payload: any = {
        latin_name: entry.latinName,
        uzbek_name: entry.uzbekName,
        english_name: entry.englishName || null,
        russian_name: entry.russianName || null,
        image_url: entry.image || entry.imageUrl || '',
        details: {
          text: entry.description || entry.details || '',
          modelUrl: entry.modelUrl || ''
        },
        semester: entry.semester ? Number(entry.semester) : 1
      };
      
      try {
        payload.model_url = entry.modelUrl || null;
      } catch (e) {}

      const { data, error } = await supabase
        .from('atlas')
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      return mapAtlas(data);
    } else {
      const docRef = await addDoc(collection(db, 'atlas'), entry);
      return { id: docRef.id, ...entry };
    }
  },

  async updateAtlasEntry(id: string, entry: any): Promise<any> {
    if (isAppwriteEnabled() && appwriteDb) {
      try {
        const payload: any = {};
        if (entry.latinName !== undefined) payload.latinName = entry.latinName;
        if (entry.uzbekName !== undefined) payload.uzbekName = entry.uzbekName;
        if (entry.englishName !== undefined) payload.englishName = entry.englishName;
        if (entry.russianName !== undefined) payload.russianName = entry.russianName;
        if (entry.image !== undefined) payload.image = entry.image;
        if (entry.description !== undefined) payload.description = entry.description;
        if (entry.modelUrl !== undefined) payload.modelUrl = entry.modelUrl;
        if (entry.semester !== undefined) payload.semester = Number(entry.semester);
        if (entry.topicId !== undefined) payload.topicId = entry.topicId;

        const data = await appwriteDb.updateDocument(appwriteDatabaseId, 'atlas', id, payload);
        return mapAppwriteAtlas(data);
      } catch (err) {
        console.warn("Appwrite updateAtlasEntry failed, falling back:", err);
      }
    }

    if (isSupabaseEnabled() && supabase) {
      const payload: any = {};
      if (entry.latinName !== undefined) payload.latin_name = entry.latinName;
      if (entry.uzbekName !== undefined) payload.uzbek_name = entry.uzbekName;
      if (entry.englishName !== undefined) payload.english_name = entry.englishName;
      if (entry.russianName !== undefined) payload.russian_name = entry.russianName;
      if (entry.image !== undefined) payload.image_url = entry.image;
      if (entry.description !== undefined) payload.details = entry.description;
      if (entry.modelUrl !== undefined) payload.model_url = entry.modelUrl;
      if (entry.semester !== undefined) payload.semester = entry.semester;
      if (entry.topicId !== undefined) payload.topic_id = entry.topicId;

      const { data, error } = await supabase
        .from('atlas')
        .update(payload)
        .eq('id', id);
      if (error) throw error;
      return data;
    } else {
      const docRef = doc(db, 'atlas', id);
      const payload: any = {};
      if (entry.latinName !== undefined) payload.latinName = entry.latinName;
      if (entry.uzbekName !== undefined) payload.uzbekName = entry.uzbekName;
      if (entry.englishName !== undefined) payload.englishName = entry.englishName;
      if (entry.russianName !== undefined) payload.russianName = entry.russianName;
      if (entry.image !== undefined) payload.image = entry.image;
      if (entry.description !== undefined) payload.description = entry.description;
      if (entry.modelUrl !== undefined) payload.modelUrl = entry.modelUrl;
      if (entry.semester !== undefined) payload.semester = entry.semester;
      if (entry.topicId !== undefined) payload.topicId = entry.topicId;

      await updateDoc(docRef, payload);
      return { id, ...entry };
    }
  },

  // 6. ANNOUNCEMENTS
  async getAnnouncements(): Promise<any[]> {
    if (isAppwriteEnabled() && appwriteDb) {
      try {
        const res = await appwriteDb.listDocuments(appwriteDatabaseId, 'announcements', [
          Query.equal('isActive', true),
          Query.orderDesc('createdAt'),
          Query.limit(10)
        ]);
        return res.documents.map(mapAppwriteAnnouncement);
      } catch (err) {
        console.warn("Appwrite getAnnouncements failed, falling back:", err);
      }
    }

    if (isSupabaseEnabled() && supabase) {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        if (error) throw error;
        return (data || []).map(mapAnnouncement);
      } catch (err) {
        console.warn("Supabase getAnnouncements failed, fallback to Firebase:", err);
        supabaseFallbackActive = true;
        const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } else {
      const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  },

  async addAnnouncement(ann: any): Promise<any> {
    if (isAppwriteEnabled() && appwriteDb) {
      try {
        const payload = {
          title: ann.title,
          content: ann.content,
          isActive: ann.isActive ?? true,
          createdAt: new Date().toISOString()
        };
        const data = await appwriteDb.createDocument(appwriteDatabaseId, 'announcements', ID.unique(), payload);
        return mapAppwriteAnnouncement(data);
      } catch (err) {
        console.warn("Appwrite addAnnouncement failed, falling back:", err);
      }
    }

    if (isSupabaseEnabled() && supabase) {
      const { data, error } = await supabase
        .from('announcements')
        .insert([{
          title: ann.title,
          content: ann.content,
          is_active: ann.isActive ?? true
        }])
        .select()
        .single();
      if (error) throw error;
      return mapAnnouncement(data);
    } else {
      const docRef = await addDoc(collection(db, 'announcements'), ann);
      return { id: docRef.id, ...ann };
    }
  },

  // 7. PAYMENTS
  async getPayment(userId: string, semesterId: number): Promise<any | null> {
    if (isAppwriteEnabled() && appwriteDb) {
      try {
        const paymentId = `${userId}_${semesterId}`;
        const data = await appwriteDb.getDocument(appwriteDatabaseId, 'payments', paymentId);
        return mapAppwritePayment(data);
      } catch (err) {
        // Soft error, try Supabase or Firebase naturally
      }
    }

    if (isSupabaseEnabled() && supabase) {
      try {
        const uniqueId = `${userId}_${semesterId}`;
        const { data, error } = await supabase
          .from('payments')
          .select('*')
          .eq('id', uniqueId)
          .maybeSingle();
        if (error && error.code !== 'PGRST116') throw error;
        return data ? mapPayment(data) : null;
      } catch (err) {
        console.warn("Supabase getPayment failed, fallback to Firebase:", err);
        supabaseFallbackActive = true;
        try {
          const paymentId = `${userId}_${semesterId}`;
          const pSnap = await getDoc(doc(db, 'payments', paymentId));
          if (pSnap.exists()) {
            return { id: pSnap.id, ...pSnap.data() };
          }
        } catch (fbErr) {
          console.warn("Firestore getPayment failed, using local fallback state", fbErr);
        }
      }
    } else {
      try {
        const paymentId = `${userId}_${semesterId}`;
        const pSnap = await getDoc(doc(db, 'payments', paymentId));
        if (pSnap.exists()) {
          return { id: pSnap.id, ...pSnap.data() };
        }
      } catch (fbErr) {
        console.warn("Firestore getPayment failed, using local fallback state", fbErr);
      }
    }

    // Try local storage local state backup
    try {
      const localPay = localStorage.getItem(`payment_${userId}_${semesterId}`);
      if (localPay) return JSON.parse(localPay);
    } catch (e) {}

    // For a local_virtual_guest or unregistered sandbox user, auto-approve so they can test the premium modules
    if (userId === 'local_virtual_guest' || !userId) {
      return {
        id: `${userId}_${semesterId}`,
        userId: userId || 'local_virtual_guest',
        semesterId: Number(semesterId),
        status: 'approved',
        amount: 49000,
        createdAt: new Date().toISOString()
      };
    }
    return null;
  },

  async getAllPayments(): Promise<any[]> {
    if (isAppwriteEnabled() && appwriteDb) {
      try {
        const res = await appwriteDb.listDocuments(appwriteDatabaseId, 'payments', [
          Query.orderDesc('createdAt'),
          Query.limit(100)
        ]);
        return res.documents.map(mapAppwritePayment);
      } catch (err) {
        console.warn("Appwrite getAllPayments failed, falling back:", err);
      }
    }

    if (isSupabaseEnabled() && supabase) {
      try {
        const { data, error } = await supabase
          .from('payments')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return (data || []).map(mapPayment);
      } catch (err) {
        console.warn("Supabase getAllPayments failed, fallback to Firebase:", err);
        supabaseFallbackActive = true;
        try {
          const snapshot = await getDocs(collection(db, 'payments'));
          return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (fbErr) {
          return [];
        }
      }
    } else {
      try {
        const snapshot = await getDocs(collection(db, 'payments'));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (fbErr) {
        return [];
      }
    }
  },

  async savePayment(userId: string, semesterId: number, paymentData: any): Promise<any> {
    const uniqueId = `${userId}_${semesterId}`;
    let savedData: any = null;

    if (isAppwriteEnabled() && appwriteDb) {
      try {
        const payload = {
          userId,
          semesterId: Number(semesterId),
          status: paymentData.status || 'pending',
          receiptUrl: paymentData.receiptUrl || '',
          amount: paymentData.amount || 0,
          cardHolder: paymentData.cardHolder || '',
          phoneNumber: paymentData.phoneNumber || '',
          adminNote: paymentData.adminNote || '',
          createdAt: paymentData.createdAt || new Date().toISOString()
        };

        let existingDoc = null;
        try {
          existingDoc = await appwriteDb.getDocument(appwriteDatabaseId, 'payments', uniqueId);
        } catch (e) {}

        if (existingDoc) {
          const data = await appwriteDb.updateDocument(appwriteDatabaseId, 'payments', uniqueId, payload);
          savedData = mapAppwritePayment(data);
        } else {
          const data = await appwriteDb.createDocument(appwriteDatabaseId, 'payments', uniqueId, payload);
          savedData = mapAppwritePayment(data);
        }
      } catch (err) {
        console.warn("Appwrite savePayment failed, trying Supabase...", err);
      }
    }

    if (!savedData && isSupabaseEnabled() && supabase) {
      try {
        const payload = {
          id: uniqueId,
          user_id: userId,
          semester_id: Number(semesterId),
          status: paymentData.status || 'pending',
          receipt_url: paymentData.receiptUrl || null,
          amount: paymentData.amount || null,
          card_holder: paymentData.cardHolder || null,
          phone_number: paymentData.phoneNumber || null,
          admin_note: paymentData.adminNote || null,
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('payments')
          .upsert(payload, { onConflict: 'id' })
          .select()
          .single();
        if (error) throw error;
        savedData = mapPayment(data);
      } catch (err) {
        console.warn("Supabase savePayment failed, trying Firebase...", err);
      }
    }

    if (!savedData) {
      try {
        await setDoc(doc(db, 'payments', uniqueId), {
          userId,
          semesterId: Number(semesterId),
          ...paymentData,
          createdAt: paymentData.createdAt || new Date(),
          updatedAt: new Date()
        }, { merge: true });
        savedData = { id: uniqueId, userId, semesterId, ...paymentData };
      } catch (fbErr) {
        console.warn("Firestore savePayment failed, falling back to Local Storage save", fbErr);
      }
    }

    const finalData = savedData || {
      id: uniqueId,
      userId,
      semesterId: Number(semesterId),
      ...paymentData,
      createdAt: paymentData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(`payment_${userId}_${semesterId}`, JSON.stringify(finalData));
    } catch (e) {}

    return finalData;
  },

  // 8. GLOBAL SETTINGS
  async getSettings(): Promise<any> {
    if (isAppwriteEnabled() && appwriteDb) {
      try {
        const data = await appwriteDb.getDocument(appwriteDatabaseId, 'app_settings', 'global');
        return {
          telegramBotUsername: data.telegramBotUsername || data.telegram_bot_username,
          cardNumber: data.cardNumber || data.card_number,
          cardHolder: data.cardHolder || data.card_holder,
          priceSemester1: data.priceSemester1 ?? data.price_semester_1 ?? 49000,
          priceSemester2: data.priceSemester2 ?? data.price_semester_2 ?? 49000
        };
      } catch (err) {
        console.warn("Appwrite getSettings failed, trying fallback:", err);
      }
    }

    if (isSupabaseEnabled() && supabase) {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('*')
          .eq('id', 'global')
          .maybeSingle();
        if (error) throw error;
        if (data) {
          return {
            telegramBotUsername: data.telegram_bot_username,
            cardNumber: data.card_number,
            cardHolder: data.card_holder,
            priceSemester1: data.price_semester_1 ?? 49000,
            priceSemester2: data.price_semester_2 ?? 49000
          };
        }
      } catch (err) {
        console.warn("Supabase getSettings failed, fallback to Firebase:", err);
      }
    }
    const docRef = doc(db, 'settings', 'global');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  },

  // 9. PROFILES
  async getProfile(userId: string): Promise<any | null> {
    if (isAppwriteEnabled() && appwriteDb) {
      try {
        const data = await appwriteDb.getDocument(appwriteDatabaseId, 'profiles', userId);
        return {
          uid: data.$id,
          email: data.email,
          displayName: data.displayName || data.display_name,
          photoURL: data.photoURL || data.photo_url,
          isAdmin: data.isAdmin || data.is_admin,
          role: data.role,
          purchasedSemesters: data.purchasedSemesters || data.purchased_semesters || [],
          isBlocked: data.isBlocked || data.is_blocked
        };
      } catch (err) {
        console.warn("Appwrite getProfile failed, trying Supabase...", err);
      }
    }

    if (isSupabaseEnabled() && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        if (error) throw error;
        return data ? {
          uid: data.id,
          email: data.email,
          displayName: data.display_name,
          photoURL: data.photo_url,
          isAdmin: data.is_admin,
          role: data.role,
          purchasedSemesters: data.purchased_semesters || [],
          isBlocked: data.is_blocked
        } : null;
      } catch (err) {
        console.warn("Supabase getProfile failed, fallback to Firebase:", err);
        supabaseFallbackActive = true;
        try {
          const userRef = doc(db, 'users', userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            return { uid: userSnap.id, ...userSnap.data() };
          }
        } catch (fbErr) {
          console.warn("Firestore getProfile failed, attempting local fallback profile", fbErr);
        }
      }
    } else {
      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          return { uid: userSnap.id, ...userSnap.data() };
        }
      } catch (fbErr) {
        console.warn("Firestore getProfile failed, attempting local fallback profile", fbErr);
      }
    }

    // Try local storage local state backup
    try {
      const localProf = localStorage.getItem(`profile_${userId}`);
      if (localProf) return JSON.parse(localProf);
    } catch (e) {}

    // Auto-create fallback profile for sandbox/iframe testing
    const defaultProf = {
      uid: userId || 'local_virtual_guest',
      email: 'guest@bsmi-anatomy.uz',
      displayName: 'Mehmon Talaba',
      photoURL: 'https://api.iconify.design/healthicons:user-outline.svg',
      isAdmin: false,
      role: 'user',
      purchasedSemesters: [1, 2], // Auto-unlock course semesters for best app review experience
      isBlocked: false
    };

    try {
      localStorage.setItem(`profile_${userId}`, JSON.stringify(defaultProf));
    } catch (e) {}

    return defaultProf;
  },

  // 10. STORAGE / UPLOADS
  async uploadFileWithProgress(
    bucketName: string,
    filePath: string,
    file: File,
    onProgress: (progress: number) => void
  ): Promise<string> {
    if (isAppwriteEnabled() && appwriteStorage) {
      try {
        onProgress(10);
        const uniqueFileId = ID.unique();
        const res = await appwriteStorage.createFile(bucketName, uniqueFileId, file);
        onProgress(100);
        const endpoint = (import.meta as any).env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
        const project = (import.meta as any).env.VITE_APPWRITE_PROJECT || '';
        return `${endpoint}/storage/buckets/${bucketName}/files/${res.$id}/view?project=${project}`;
      } catch (err) {
        console.warn("Appwrite storage upload failed, trying Supabase...", err);
      }
    }

    if (isSupabaseEnabled() && supabase) {
      try {
        // Attempt to create bucket if it doesn't already exist
        await supabase.storage.createBucket(bucketName, { public: true });
      } catch (err) {
        // Fails gracefully (e.g. if bucket exists or policy doesn't permit direct creation)
      }

      onProgress(1);
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          onUploadProgress: (progressEvent: any) => {
            const percent = (progressEvent.loaded / progressEvent.total) * 100;
            onProgress(isNaN(percent) ? 5 : Math.round(percent));
          }
        } as any);

      if (error) {
        console.error("Supabase upload error:", error);
        throw new Error(
          `Supabase storage'ga yuklashda xatolik: ${error.message}. Iltimos, Supabase panelingizda '${bucketName}' nomli public (ochiq) bucket yaratilganiga ishonch hosil qiling.`
        );
      }

      onProgress(100);
      const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(filePath);
      return publicUrl;
    } else {
      const { ref, uploadBytesResumable, getDownloadURL } = await import('firebase/storage');
      const { storage } = await import('./firebase');
      const storageRef = ref(storage, `${bucketName}/${filePath}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(isNaN(p) ? 5 : Math.round(p));
          },
          (err) => reject(err),
          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              onProgress(100);
              resolve(url);
            } catch (err) {
              reject(err);
            }
          }
        );
      });
    }
  },

  // 11. ANATOMY MODELS
  async getAnatomyModels(): Promise<any[]> {
    if (isSupabaseEnabled() && supabase) {
      try {
        const { data, error } = await supabase
          .from('anatomy_models')
          .select('*')
          .order('id', { ascending: true });
        if (error) throw error;
        return (data || []);
      } catch (err) {
        console.warn("Supabase getAnatomyModels failed, fallback to Firebase:", err);
        supabaseFallbackActive = true;
        const q = query(collection(db, 'anatomy_models'), orderBy('id', 'asc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } else {
      const q = query(collection(db, 'anatomy_models'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  },

  async saveAnatomyModel(model: any): Promise<any> {
    if (isSupabaseEnabled() && supabase) {
      try {
        const { data, error } = await supabase
          .from('anatomy_models')
          .upsert(model, { onConflict: 'id' })
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn("Supabase saveAnatomyModel failed, fallback to Firebase:", err);
        supabaseFallbackActive = true;
        await setDoc(doc(db, 'anatomy_models', model.id), model, { merge: true });
        return model;
      }
    } else {
      await setDoc(doc(db, 'anatomy_models', model.id), model, { merge: true });
      return model;
    }
  },

  async deleteAnatomyModel(id: string): Promise<void> {
    if (isSupabaseEnabled() && supabase) {
      try {
        const { error } = await supabase.from('anatomy_models').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.warn("Supabase deleteAnatomyModel failed, fallback to Firebase:", err);
        supabaseFallbackActive = true;
        await deleteDoc(doc(db, 'anatomy_models', id));
      }
    } else {
      await deleteDoc(doc(db, 'anatomy_models', id));
    }
  }
};
