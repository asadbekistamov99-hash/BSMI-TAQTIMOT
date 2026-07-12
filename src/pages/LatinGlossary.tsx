import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Globe, ChevronRight, Book, Sparkles, Languages, Heart, Volume2 } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { dbService } from '../lib/dbService';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import FlashcardStudy from '../components/FlashcardStudy';
import AnatomicalDictation from '../components/AnatomicalDictation';

interface LatinTerm {
  id: string;
  latin: string;
  uzbek: string;
}

export default function LatinGlossary({ isAdmin: isAdminProp, user }: { isAdmin?: boolean, user?: any }) {
  const { language, t, getLocalized } = useLanguage();
  const location = useLocation();
  const [terms, setTerms] = useState<LatinTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlpha, setSelectedAlpha] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<'glossary' | 'flashcards' | 'dictation'>('glossary');
  const [favorites, setFavorites] = useState<Record<string, any>>({});
  const isAdmin = isAdminProp ?? !!localStorage.getItem('adminToken');

  useEffect(() => {
    if (location.state?.search) {
      setSearchQuery(location.state.search);
    } else {
      const params = new URLSearchParams(location.search);
      const searchParam = params.get('search');
      if (searchParam) {
        setSearchQuery(searchParam);
      }
    }
  }, [location]);

  const getLocalizedTermStr = (val: string, term?: any) => {
    if (!val) return '';
    
    if (term) {
      if (language === 'ru' && term.russian) return term.russian;
      if (language === 'en' && term.english) return term.english;
      if (language === 'uz' && term.uzbek) return term.uzbek;
    }

    const cleanVal = val.trim().replace(/[‘’'ʼ`´‘]/g, "'");

    const termTranslations: Record<string, Record<string, string>> = {
      // Body parts & systems
      "Bosh": { uz: "Bosh", ru: "Голова", en: "Head" },
      "Bo'yin": { uz: "Bo'yin", ru: "Шея", en: "Neck" },
      "Bosh chanoq": { uz: "Bosh chanoq", ru: "Череп", en: "Skull" },
      "Kalla": { uz: "Kalla", ru: "Череп / Голова", en: "Skull / Head" },
      "Yuz": { uz: "Yuz", ru: "Лицо", en: "Face" },
      "Tana": { uz: "Tana", ru: "Тело / Туловище", en: "Body / Trunk" },
      "Ko'krak qafasi": { uz: "Ko'krak qafasi", ru: "Грудная клетка", en: "Ribcage / Chest" },
      "Qorin": { uz: "Qorin", ru: "Живот", en: "Abdomen" },
      "Chanoq": { uz: "Chanoq", ru: "Таз", en: "Pelvis" },
      "Orqa": { uz: "Orqa", ru: "Спина", en: "Back" },
      "Qo'l-oyoqlar (a'zolar)": { uz: "Qo'l-oyoqlar (a'zolar)", ru: "Конечности", en: "Limbs" },
      "Yuqori a'zo (qo'l)": { uz: "Yuqori a'zo (qo'l)", ru: "Верхняя конечность", en: "Upper limb" },
      "Pastki a'zo (oyoq)": { uz: "Pastki a'zo (oyoq)", ru: "Нижняя конечность", en: "Lower limb" },
      "Yuqori qo'l-oyoq": { uz: "Yuqori qo'l-oyoq", ru: "Верхняя конечность", en: "Upper limb" },
      "Pastki qo'l-oyoq": { uz: "Pastki qo'l-oyoq", ru: "Нижняя конечность", en: "Lower limb" },

      // Directionals / Positions
      "Yuqori": { uz: "Yuqori", ru: "Верхний", en: "Superior" },
      "Pastki": { uz: "Pastki", ru: "Нижний", en: "Inferior" },
      "Oldingi": { uz: "Oldingi", ru: "Передний", en: "Anterior" },
      "Medial (o'rata chiziqqa yaqin)": { uz: "Medial", ru: "Медиальный", en: "Medial" },
      "Medial (o'rta chiziqqa yaqin)": { uz: "Medial", ru: "Медиальный", en: "Medial" },
      "Lateral (o'rta chiziqdan uzoq)": { uz: "Lateral", ru: "Латеральный", en: "Lateral" },
      "O'ng": { uz: "O'ng", ru: "Правый", en: "Right" },
      "Chap": { uz: "Chap", ru: "Левый", en: "Left" },
      "Yuzaki": { uz: "Yuzaki", ru: "Поверхностный", en: "Superficial" },
      "Chuqur": { uz: "Chuqur", ru: "Глубокий", en: "Deep" },
      "Proksimal (gavdaga yaqin)": { uz: "Proksimal (gavdaga yaqin)", ru: "Проксимальный", en: "Proximal" },
      "Distal (gavdadan uzoq)": { uz: "Distal (gavdadan uzoq)", ru: "Дистальный", en: "Distal" },
      "Sagittal (oldingi-orqa yo'nalish)": { uz: "Sagittal", ru: "Сагиттальный", en: "Sagittal" },
      "Frontal (peshona yo'nalishi)": { uz: "Frontal", ru: "Фронтальный", en: "Frontal" },
      "Gorizontal": { uz: "Gorizontal", ru: "Горизонтальный", en: "Horizontal" },

      // Organs
      "Yurak": { uz: "Yurak", ru: "Сердце", en: "Heart" },
      "O'pka": { uz: "O'pka", ru: "Легкое", en: "Lung" },
      "Jigar": { uz: "Jigar", ru: "Печень", en: "Liver" },
      "Oshqozon": { uz: "Oshqozon", ru: "Желудок", en: "Stomach" },
      "Buyrak": { uz: "Buyrak", ru: "Почка", en: "Kidney" },
      "Taloq": { uz: "Taloq", ru: "Селезенка", en: "Spleen" },
      "Oshqozon osti bezi": { uz: "Oshqozon osti bezi", ru: "Поджелудочная железа", en: "Pancreas" },
      "O't pufagi": { uz: "O't pufagi", ru: "Желчный пузырь", en: "Gallbladder" },
      "Ingichka ichak": { uz: "Ingichka ichak", ru: "Тонкая кишка", en: "Small intestine" },
      "Yo'g'on ichak": { uz: "Yo'g'on ichak", ru: "Толстая кишка", en: "Large intestine" },
      "Qizilo'ngach": { uz: "Qizilo'ngach", ru: "Пищевод", en: "Esophagus" },
      "Traxeya": { uz: "Traxeya", ru: "Трахея", en: "Trachea" },
      "Hiqildoq": { uz: "Hiqildoq", ru: "Гортань", en: "Larynx" },
      "Halqum": { uz: "Halqum", ru: "Глотка", en: "Pharynx" },
      "Qalqonsimon bez": { uz: "Qalqonsimon bez", ru: "Щитовидная железа", en: "Thyroid gland" },
      "Ayrisimon bez": { uz: "Ayrisimon bez", ru: "Тимус", en: "Thymus" },
      "Siydik yo'li": { uz: "Siydik yo'li", ru: "Мочеточник", en: "Ureter" },
      "Siydik pufagi": { uz: "Siydik pufagi", ru: "Мочевой пузырь", en: "Urinary bladder" },
      "Siydik chiqarish kanali": { uz: "Siydik chiqarish kanali", ru: "Мочеиспускательный канал", en: "Urethra" },

      // Bones & Skeletal
      "Suyak": { uz: "Suyak", ru: "Кость", en: "Bone" },
      "Skelet": { uz: "Skelet", ru: "Скелет", en: "Skeleton" },
      "Umurtqa": { uz: "Umurtqa", ru: "Позвонок", en: "Vertebra" },
      "Umurtqa pog'onasi": { uz: "Umurtqa pog'onasi", ru: "Позвоночный столб", en: "Vertebral column" },
      "Qovurg'a": { uz: "Qovurg'a", ru: "Ребро", en: "Rib" },
      "To'sh suyagi": { uz: "To'sh suyagi", ru: "Грудина", en: "Sternum" },
      "Peshona suyagi": { uz: "Peshona suyagi", ru: "Лобная кость", en: "Frontal bone" },
      "Tepa suyagi": { uz: "Tepa suyagi", ru: "Теменная кость", en: "Parietal bone" },
      "Chakka suyagi": { uz: "Chakka suyagi", ru: "Височная кость", en: "Temporal bone" },
      "Ensa suyagi": { uz: "Ensa suyagi", ru: "Затылочная кость", en: "Occipital bone" },
      "Asosiy (ponasimon) suyak": { uz: "Asosiy (ponasimon) suyak", ru: "Клиновидная кость", en: "Sphenoid bone" },
      "G'alvirsimon suyak": { uz: "G'alvirsimon suyak", ru: "Решетчатая кость", en: "Ethmoid bone" },
      "Yuqori jag'": { uz: "Yuqori jag'", ru: "Верхняя челюсть", en: "Maxilla" },
      "Pastki jag'": { uz: "Pastki jag'", ru: "Нижняя челюсть", en: "Mandible" },
      "Yonoq suyagi": { uz: "Yonoq suyagi", ru: "Скуловая кость", en: "Zygomatic bone" },
      "Burun suyagi": { uz: "Burun suyagi", ru: "Носовая кость", en: "Nasal bone" },
      "Ko'z yosh suyagi": { uz: "Ko'z yosh suyagi", ru: "Слезная кость", en: "Lacrimal bone" },
      "Dimog' suyagi": { uz: "Dimog' suyagi", ru: "Сошник", en: "Vomer" },
      "Kurak suyagi": { uz: "Kurak suyagi", ru: "Лопатка", en: "Scapula" },
      "O'mrov suyagi": { uz: "O'mrov suyagi", ru: "Ключица", en: "Clavicle" },
      "Yelka suyagi": { uz: "Yelka suyagi", ru: "Плечевая кость", en: "Humerus" },
      "Bilak suyagi": { uz: "Bilak suyagi", ru: "Лучевая кость", en: "Radius" },
      "Tirsak suyagi": { uz: "Tirsak suyagi", ru: "Локтевая кость", en: "Ulna" },
      "Kaft usti suyaklari": { uz: "Kaft usti suyaklari", ru: "Кости запястья", en: "Carpal bones" },
      "Kaft suyaklari": { uz: "Kaft suyaklari", ru: "Пястные кости", en: "Metacarpal bones" },
      "Barmoq suyaklari": { uz: "Barmoq suyaklari", ru: "Фаланги пальцев", en: "Phalanges" },
      "Chanoq suyagi": { uz: "Chanoq suyagi", ru: "Тазовая кость", en: "Hip bone" },
      "Yonbosh suyak": { uz: "Yonbosh suyak", ru: "Подвздошная кость", en: "Ilium" },
      "O'tirg'ich suyagi": { uz: "O'tirg'ich suyagi", ru: "Седалищная кость", en: "Ischium" },
      "Qov suyagi": { uz: "Qov suyagi", ru: "Лобковая кость", en: "Pubis" },
      "Tizza qopqog'i": { uz: "Tizza qopqog'i", ru: "Надколенник", en: "Patella" },
      "Katta boldir suyagi": { uz: "Katta boldir suyagi", ru: "Большеберцовая кость", en: "Tibia" },
      "Kichik boldir suyagi": { uz: "Kichik boldir suyagi", ru: "Малоберцовая кость", en: "Fibula" },
      "Oyoq kaft usti suyaklari": { uz: "Oyoq kaft usti suyaklari", ru: "Кости предплюсны", en: "Tarsal bones" },
      "Oshiq suyak": { uz: "Oshiq suyak", ru: "Таранная кость", en: "Talus" },
      "Tovon suyagi": { uz: "Tovon suyagi", ru: "Пяточная кость", en: "Calcaneus" },

      // Nervous System
      "Asab tizimi": { uz: "Asab tizimi", ru: "Нервная система", en: "Nervous system" },
      "Bosh miya": { uz: "Bosh miya", ru: "Головной мозг", en: "Brain" },
      "Katta miya": { uz: "Katta miya", ru: "Большой мозг", en: "Cerebrum" },
      "Miyacha": { uz: "Miyacha", ru: "Мозжечок", en: "Cerebellum" },
      "Uzunchoq miya": { uz: "Uzunchoq miya", ru: "Продолговатый мозг", en: "Medulla oblongata" },
      "Ko'prik": { uz: "Ko'prik", ru: "Мост", en: "Pons" },
      "O'rta miya": { uz: "O'rta miya", ru: "Средний мозг", en: "Mesencephalon" },
      "Oraliq miya": { uz: "Oraliq miya", ru: "Промежуточный мозг", en: "Diencephalon" },
      "Ko'rish do'mboqlari": { uz: "Ko'rish do'mboqlari", ru: "Таламус", en: "Thalamus" },
      "Gipotalamus": { uz: "Gipotalamus", ru: "Гипоталамус", en: "Hypothalamus" },
      "Orqa miya": { uz: "Orqa miya", ru: "Спинной мозг", en: "Spinal cord" },
      "Asab": { uz: "Asab", ru: "Нерв", en: "Nerve" },
      "Ko'ruv asabi": { uz: "Ko'ruv asabi", ru: "Зрительный нерв", en: "Optic nerve" },
      "Adashgan asab": { uz: "Adashgan asab", ru: "Блуждающий нерв", en: "Vagus nerve" },
      "O'tirg'ich asabi": { uz: "O'tirg'ich asabi", ru: "Седалищный нерв", en: "Sciatic nerve" },
      "Chigal": { uz: "Chigal", ru: "Сплетение", en: "Plexus" },
      "Tugun": { uz: "Tugun", ru: "Узел / Ганглий", en: "Ganglion" },

      // Cardiovascular
      "Arteriya": { uz: "Arteriya", ru: "Артерия", en: "Artery" },
      "Vena": { uz: "Vena", ru: "Вена", en: "Vein" },
      "Qon tomir": { uz: "Qon tomir", ru: "Сосуд", en: "Blood vessel" },
      "Aorta": { uz: "Aorta", ru: "Аорта", en: "Aorta" },
      "Yurak bo'lmachasi": { uz: "Yurak bo'lmachasi", ru: "Предсердие", en: "Atrium" },
      "Yurak qorinchasi": { uz: "Yurak qorinchasi", ru: "Желудочек сердца", en: "Heart ventricle" },
      "Klapan": { uz: "Klapan", ru: "Клапан", en: "Valve" },
      "Yurak ichki pardasi": { uz: "Yurak ichki pardasi", ru: "Эндокард", en: "Endocardium" },
      "Yurak mushak pardasi": { uz: "Yurak mushak pardasi", ru: "Миокард", en: "Myocardium" },
      "Yurak oldi xaltasi": { uz: "Yurak oldi xaltasi", ru: "Перикард", en: "Pericardium" },
      "Kapilyar": { uz: "Kapilyar", ru: "Капилляр", en: "Capillary" },

      // Muscular
      "Mushak": { uz: "Mushak", ru: "Мышца", en: "Muscle" },
      "Pay": { uz: "Pay", ru: "Сухожилие", en: "Tendon" },
      "Fastsiya": { uz: "Fastsiya", ru: "Фасция", en: "Fascia" },
      "Yelkaning ikki boshli mushagi": { uz: "Yelkaning ikki boshli mushagi", ru: "Двуглавая мышца плеча", en: "Biceps brachii" },
      "Yelkaning uch boshli mushagi": { uz: "Yelkaning uch boshli mushagi", ru: "Трехглавая мышца плеча", en: "Triceps brachii" },
      "Katta ko'krak mushagi": { uz: "Katta ko'krak mushagi", ru: "Большая грудная мышца", en: "Pectoralis major" },
      "Deltoidsimon mushak": { uz: "Deltoidsimon mushak", ru: "Дельтовидная мышца", en: "Deltoid" },
      "Qorinning to'g'ri mushagi": { uz: "Qorinning to'g'ri mushagi", ru: "Прямая мышца живота", en: "Rectus abdominis" },
      "Katta dumba mushagi": { uz: "Katta dumba mushagi", ru: "Большая ягодичная мышца", en: "Gluteus maximus" },
      "Diafragma": { uz: "Diafragma", ru: "Диафрагма", en: "Diaphragm" },

      // Senses
      "Ko'z": { uz: "Ko'z", ru: "Глаз", en: "Eye" },
      "To'r parda": { uz: "To'r parda", ru: "Сетчатка", en: "Retina" },
      "Shox parda": { uz: "Shox parda", ru: "Роговица", en: "Cornea" },
      "Kamalak parda": { uz: "Kamalak parda", ru: "Радужка", en: "Iris" },
      "Qorachiq": { uz: "Qorachiq", ru: "Зрачок", en: "Pupil" },
      "Gavhar": { uz: "Gavhar", ru: "Хрусталик", en: "Lens" },
      "Quloq": { uz: "Quloq", ru: "Ухо", en: "Ear" },
      "Nog'ora parda": { uz: "Nog'ora parda", ru: "Барабанная перепонка", en: "Tympanic membrane" },
      "Chig'anoq": { uz: "Chig'anoq", ru: "Улитка", en: "Cochlea" },
      "Burun": { uz: "Burun", ru: "Нос", en: "Nose" },
      "Til": { uz: "Til", ru: "Язык", en: "Tongue" },
      "Teri": { uz: "Teri", ru: "Кожа", en: "Skin" },

      // Digestion/Mouth
      "Og'iz": { uz: "Og'iz", ru: "Рот", en: "Mouth" },
      "Lab": { uz: "Lab", ru: "Губа", en: "Lip" },
      "Tish": { uz: "Tish", ru: "Зуб", en: "Tooth" },
      "Tanglay": { uz: "Tanglay", ru: "Небо", en: "Palate" },
      "Tilcha": { uz: "Tilcha", ru: "Язычок", en: "Uvula" },
      "Milk": { uz: "Milk", ru: "Десна", en: "Gingiva" },
      "Quloq oldi so'lak bezi": { uz: "Quloq oldi so'lak bezi", ru: "Околоушная слюнная железа", en: "Parotid gland" },

      // Joints
      "Bo'g'im": { uz: "Bo'g'im", ru: "Сустав", en: "Joint" },
      "Bo'g'im xaltasi": { uz: "Bo'g'im xaltasi", ru: "Суставная капсула", en: "Joint capsule" },
      "Boylam": { uz: "Boylam", ru: "Связка", en: "Ligament" },
      "Bo'g'im ichki suyuqligi": { uz: "Bo'g'im ichki suyuqligi", ru: "Синовиальная жидкость", en: "Synovia" },
      "Menisk": { uz: "Menisk", ru: "Мениск", en: "Meniscus" },

      // Clinical/Medical
      "Aura (sezish)": { uz: "Aura (sezish)", ru: "Аура", en: "Aura" },
      "Xavfsiz": { uz: "Xavfsiz", ru: "Доброкачественный", en: "Benign" },
      "Xavfli": { uz: "Xavfli", ru: "Злокачественный", en: "Malign" },
      "Tashxis": { uz: "Tashxis", ru: "Диагноз", en: "Diagnosis" },
      "Og'riq": { uz: "Og'riq", ru: "Боль", en: "Pain" },
      "Isitma": { uz: "Isitma", ru: "Лихорадка", en: "Fever" },
      "Yallig'lanish": { uz: "Yallig'lanish", ru: "Воспаление", en: "Inflammation" },
      "Infeksiya": { uz: "Infeksiya", ru: "Инфекция", en: "Infection" },
      "Kasallik": { uz: "Kasallik", ru: "Болезнь", en: "Disease" },
      "Yiring": { uz: "Yiring", ru: "Гной", en: "Pus" },
      "Qon": { uz: "Qon", ru: "Кровь", en: "Blood" },
      "Siydik": { uz: "Siydik", ru: "Моча", en: "Urine" },
      "Qusish": { uz: "Qusish", ru: "Рвота", en: "Vomiting" },
      "Jarohat": { uz: "Jarohat", ru: "Рана / Травма", en: "Wound" },
      "Salomatlik": { uz: "Salomatlik", ru: "Здоровье", en: "Health" },
      "Davolash": { uz: "Davolash", ru: "Лечение", en: "Treatment" },
      "Dori": { uz: "Dori", ru: "Лекарство", en: "Remedy" },

      // Anatomiya general terms
      "Fiziologiya": { uz: "Fiziologiya", ru: "Физиология", en: "Physiology" },
      "Anatomiya": { uz: "Anatomiya", ru: "Анатомия", en: "Anatomy" },
      "A'zo": { uz: "A'zo", ru: "Орган", en: "Organ" },
      "Qism": { uz: "Qism", ru: "Часть", en: "Part" },
      "Asos": { uz: "Asos", ru: "Основание", en: "Base" },
      "Uchi": { uz: "Uchi", ru: "Верхушка", en: "Apex" },
      "Kanal": { uz: "Kanal", ru: "Канал", en: "Canal" },
      "Bo'shliq": { uz: "Bo'shliq", ru: "Полость", en: "Cavity" },
      "Teshik": { uz: "Teshik", ru: "Отверстие", en: "Foramen" },
      "Chuqurcha": { uz: "Chuqurcha", ru: "Ямка", en: "Fossa" },
      "O'simta": { uz: "O'simta", ru: "Отросток", en: "Processus" },
      "Egat": { uz: "Egat", ru: "Борозда", en: "Sulcus" },
      "Qirra/O'simta": { uz: "Qirra/O'simta", ru: "Ость", en: "Spina" },
      "O'yiq": { uz: "O'yiq", ru: "Вырезка", en: "Incisura" },
      "Burchak": { uz: "Burchak", ru: "Угол", en: "Angulus" },
      "Qirra": { uz: "Qirra", ru: "Край", en: "Margo" },
      "Yuza/Yuz": { uz: "Yuza/Yuz", ru: "Поверхность", en: "Facies" },
      "Chiziq": { uz: "Chiziq", ru: "Линия", en: "Linea" },
      "Taroq": { uz: "Taroq", ru: "Гребень", en: "Crista" },
      "Do'mboq": { uz: "Do'mboq", ru: "Бугор", en: "Tuber" },
      "Do'mboqcha": { uz: "Do'mboqcha", ru: "Бугорок", en: "Tuberculum" }
    };
    
    const matched = termTranslations[cleanVal] || termTranslations[val];
    if (matched) {
      return matched[language] || val;
    }
    return val;
  };

  useEffect(() => {
    fetchTerms();
  }, [isAdmin]);

  useEffect(() => {
    loadFavorites();
  }, [user]);

  useEffect(() => {
    const handleUpdate = () => {
      loadFavorites();
    };
    window.addEventListener('favorites_updated', handleUpdate);
    return () => window.removeEventListener('favorites_updated', handleUpdate);
  }, [user]);

  const loadFavorites = async () => {
    try {
      if (user) {
        const qRef = collection(db, 'users', user.uid, 'flashcards');
        const snap = await getDocs(qRef);
        const fetched: Record<string, any> = {};
        snap.forEach(docSnap => {
          fetched[docSnap.id] = docSnap.data();
        });
        setFavorites(fetched);
      } else {
        const localData = localStorage.getItem('flashcards_data_guest');
        if (localData) {
          setFavorites(JSON.parse(localData));
        } else {
          setFavorites({});
        }
      }
    } catch (e) {
      console.error("Error loading glossary favorites:", e);
    }
  };

  const toggleFavoriteFromGlossary = async (termId: string) => {
    const existing = favorites[termId];
    let updated: any;
    if (existing && existing.isFavorite) {
      updated = {
        ...existing,
        isFavorite: false
      };
    } else {
      updated = {
        termId,
        isFavorite: true,
        interval: 0,
        repetitions: 0,
        easeFactor: 2.5,
        nextReview: new Date().toISOString()
      };
    }

    const newFavorites = { ...favorites, [termId]: updated };
    setFavorites(newFavorites);

    try {
      if (user) {
        const docRef = doc(db, 'users', user.uid, 'flashcards', termId);
        await setDoc(docRef, updated, { merge: true });
      } else {
        localStorage.setItem('flashcards_data_guest', JSON.stringify(newFavorites));
      }
    } catch (e) {
      console.error("Error saving favorite in glossary list: ", e);
    }
  };

  const fetchTerms = async () => {
    setLoading(true);
    try {
      const data = await dbService.getLatinTerms();
      
      if (data.length === 0 && isAdmin) {
        await seedGlossary();
        const freshData = await dbService.getLatinTerms();
        setTerms(freshData);
      } else {
        setTerms(data);
      }
    } catch (error) {
      console.error("Error fetching terms:", error);
    } finally {
      setLoading(false);
    }
  };

  const seedGlossary = async () => {
    const initialTerms = [
      { latin: "Anatomia", uzbek: "Anatomiya" },
      { latin: "Caput", uzbek: "Kalla" },
      { latin: "Cranium", uzbek: "Bosh chanoq" },
      { latin: "Facies", uzbek: "Yuz" },
      { latin: "Collum", uzbek: "Bo'yin" },
      { latin: "Truncus", uzbek: "Tana" },
      { latin: "Thorax", uzbek: "Ko'krak qafasi" },
      { latin: "Abdomen", uzbek: "Qorin" },
      { latin: "Pelvis", uzbek: "Chanoq" },
      { latin: "Dorsum", uzbek: "Orqa" },
      { latin: "Membra", uzbek: "Qo'l-oyoqlar (a'zolar)" },
      { latin: "Membrum superius", uzbek: "Yuqori a'zo (qo'l)" },
      { latin: "Membrum inferius", uzbek: "Pastki a'zo (oyoq)" }
    ];
    
    for (const term of initialTerms) {
      try {
        await dbService.saveLatinTerm(term);
      } catch (err) {
        console.warn("Seeding term failed:", term.latin, err);
      }
    }
  };

  const speakLatinWord = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'la';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const alphabet = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');

  const filteredTerms = terms.filter(t => {
    const locUzb = getLocalizedTermStr(t.uzbek, t);
    const matchesSearch = t.latin.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.uzbek.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          locUzb.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAlpha = selectedAlpha ? t.latin.toUpperCase().startsWith(selectedAlpha) : true;
    return matchesSearch && matchesAlpha;
  });

  return (
    <div className="bg-brand-bg min-h-screen">
      {/* Header */}
      <header className="bg-brand-primary py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-accent/10 blur-[100px] -mr-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Globe className="text-brand-accent w-6 h-6" />
                <span className="text-xs font-black text-brand-accent uppercase tracking-[0.3em]">{t('nav.glossary') || 'Anatomik Terminologiya'}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-2">
                {t('nav.glossary') || "Lotincha Lug'at"}
              </h1>
              <p className="text-slate-400 font-bold text-lg max-w-xl">
                {t('gloss_desc') || "Anatomiyaning barcha fundamental terminlarini lotincha va o'zbekcha variantlari bilan o'rganing."}
              </p>
            </motion.div>

            <div className="w-full md:w-96">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder={t('gloss_placeholder') || "Termin qidirish..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-6 py-6 bg-slate-800/50 border-2 border-slate-700/50 rounded-[24px] text-white focus:border-brand-accent outline-none transition-all placeholder:text-slate-500 font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-24">
        
        {/* Mode Toggle Button */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-2xl border border-brand-border flex flex-wrap gap-1.5 shadow-xl shadow-slate-200/40">
            <button
              onClick={() => setActiveMode('glossary')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeMode === 'glossary'
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'text-brand-muted hover:text-brand-primary'
              }`}
            >
              📖 {{ uz: "Lug'at", ru: "Словарь", en: "Glossary" }[language] || "Lug'at"}
            </button>
            <button
              onClick={() => setActiveMode('flashcards')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeMode === 'flashcards'
                  ? 'bg-[#0B0F17] text-brand-accent shadow-md shadow-slate-900/10 border border-brand-accent/20'
                  : 'text-brand-muted hover:text-[#0B0F17]'
              }`}
            >
              🎴 {{ uz: "Yodlash Kartalari", ru: "Карточки", en: "Flashcards" }[language] || "Yodlash"}
            </button>
            <button
              onClick={() => setActiveMode('dictation')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeMode === 'dictation'
                  ? 'bg-gradient-to-r from-sky-600 to-[#0e45e9] text-white shadow-md'
                  : 'text-brand-muted hover:text-[#0e45e9]'
              }`}
            >
              ✍️ {{ uz: "Lotincha Diktant", ru: "Диктант", en: "Latin Dictation" }[language] || "Diktant"}
            </button>
          </div>
        </div>

        {activeMode === 'flashcards' ? (
          <FlashcardStudy user={user} terms={terms} getLocalizedTermStr={getLocalizedTermStr} />
        ) : activeMode === 'dictation' ? (
          <AnatomicalDictation user={user} terms={terms} getLocalizedTermStr={getLocalizedTermStr} />
        ) : (
          <>
            {/* Alphabet Filter */}
            <div className="bg-white p-6 rounded-[32px] shadow-xl shadow-slate-200/50 border border-brand-border mb-10 overflow-x-auto">
              <div className="flex items-center gap-2 min-w-max">
                <button 
                  onClick={() => setSelectedAlpha(null)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${!selectedAlpha ? 'bg-brand-primary text-white' : 'text-brand-muted hover:bg-slate-50'}`}
                >
                  {t('gloss_all') || 'BARCHASI'}
                </button>
                {alphabet.map(char => (
                  <button 
                    key={char}
                    onClick={() => setSelectedAlpha(char)}
                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all flex items-center justify-center border ${selectedAlpha === char ? 'bg-brand-accent border-brand-accent text-brand-primary' : 'border-slate-100 text-slate-400 hover:border-brand-accent hover:text-brand-accent'}`}
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="w-16 h-16 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
                <p className="text-brand-muted font-black uppercase text-[10px] tracking-[0.2em] animate-pulse">
                  { { uz: "Lug'at yuklanmoqda...", ru: "Загрузка словаря...", en: "Loading glossary..." }[language] }
                </p>
              </div>
            ) : filteredTerms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTerms.map((term, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index % 30 * 0.02 }}
                    key={term.id}
                    className="group bg-white p-8 rounded-[40px] border border-brand-border hover:border-brand-accent hover:shadow-2xl hover:shadow-brand-accent/5 transition-all duration-500 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-accent/5 rounded-bl-[60px] -mr-12 -mt-12 transition-all group-hover:bg-brand-accent/10"></div>
                    
                    {/* Actions panel right on each card */}
                    <div className="absolute top-6 right-6 z-20 flex gap-2">
                      <button
                        onClick={(e) => speakLatinWord(term.latin, e)}
                        className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100/50 hover:bg-sky-50 hover:scale-110 active:scale-90 flex items-center justify-center transition-all cursor-pointer shadow-sm text-slate-400 hover:text-sky-500 hover:border-sky-100"
                        title="Darslik talaffuzi (Lotincha)"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleFavoriteFromGlossary(term.id)}
                        className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100/50 hover:bg-red-50 hover:scale-110 active:scale-90 flex items-center justify-center transition-all cursor-pointer shadow-sm group-hover:border group-hover:border-red-100"
                        title="Yodlash kartalariga qo'shish / o'chirish"
                      >
                        <Heart 
                          className={`w-4 h-4 transition-all ${favorites[term.id]?.isFavorite ? 'text-red-500 fill-red-500' : 'text-slate-300 hover:text-red-500'}`} 
                        />
                      </button>
                    </div>

                    <div className="relative z-10 pr-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-brand-bg rounded-2xl flex items-center justify-center text-brand-accent border border-brand-border">
                          <Languages size={20} />
                        </div>
                        <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">
                          { { uz: "Lotincha-O'zbekcha", ru: "Латынь-Русский", en: "Latin-English" }[language] }
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-black text-brand-primary mb-2 italic tracking-tight group-hover:text-brand-accent transition-colors">
                        {term.latin}
                      </h3>
                      
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-brand-border">
                        <ChevronRight size={16} className="text-brand-accent" />
                        <span className="text-lg font-bold text-slate-700">{getLocalizedTermStr(term.uzbek, term)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-white rounded-[48px] border border-brand-border border-dashed">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                  <Search size={40} />
                </div>
                <h3 className="text-2xl font-black text-brand-primary uppercase tracking-tight">{t('atlas.not_found') || "Termin topilmadi"}</h3>
                <p className="text-brand-muted mt-2 max-w-sm mx-auto">
                  { { uz: "Siz qidirgan qidiruv so'rovi bo'yicha lug'atdan ma'lumot topilmadi. Qidiruvni o'zgartirib ko'ring.", ru: "По вашему запросу ничего не найдено в словаре. Пожалуйста, измените фильтр.", en: "No dictionary entries found matching your query. Please filter again." }[language] }
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Quick Access Info Section */}
      <section className="bg-brand-primary py-24 mb-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-8 leading-tight">
                { { uz: "Anatomiya tilini mukammal o'zlashtiring", ru: "Освойте язык анатомии идеально", en: "Master the language of anatomy perfectly" }[language] }
              </h2>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
                { { uz: "Tibbiyot olamiga kirish lotin tilidan boshlanadi. Bizning lug'atimizda 200 dan ortiq eng kerakli anatomik terminlar yig'ilgan bo'lib, har bir mavzu bo'yicha alohida o'rganish imkoniyati ham mavjud.", ru: "Вход в мир медицины начинается с латыни. В нашем словаре собраны сотни самых нужных анатомических терминов.", en: "Entry to medicine begins with Latin. Our glossary contains hundreds of essential anatomical terms with state-of-the-art interactive lookups." }[language] }
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-brand-accent shrink-0">
                    <Book size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-black text-sm uppercase tracking-tight mb-1">
                      { { uz: "Standartlar", ru: "Стандарты", en: "Standards" }[language] }
                    </h4>
                    <p className="text-slate-500 text-xs font-medium">
                      { { uz: "Nomina Anatomica xalqaro standartlari.", ru: "Международные стандарты Nomina Anatomica.", en: "Nomina Anatomica international medical standards." }[language] }
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-brand-accent shrink-0">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-black text-sm uppercase tracking-tight mb-1">
                      { { uz: "Tezkor Qidiruv", ru: "Быстрый поиск", en: "Instant Search" }[language] }
                    </h4>
                    <p className="text-slate-500 text-xs font-medium">
                      { { uz: "Minglab terminlar ichidan lahzada topish.", ru: "Поиск среди тысяч терминов в долю секунды.", en: "Find any term instantly among thousands of words." }[language] }
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-brand-accent/20 rounded-[80px] rotate-6 absolute inset-0"></div>
              <div className="relative aspect-square bg-[#0B0F17] rounded-[80px] p-10 border border-white/5 flex flex-col justify-center">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 group">
                    <div className="w-3 h-3 bg-brand-accent rounded-full animate-pulse"></div>
                    <div className="text-2xl font-black italic text-brand-accent">Humerus</div>
                    <div className="h-px bg-white/20 flex-grow"></div>
                    <div className="text-lg font-bold text-white/60">{getLocalizedTermStr("Yelka suyagi")}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-white/10 rounded-full"></div>
                    <div className="text-2xl font-black italic text-white/80">Femur</div>
                    <div className="h-px bg-white/20 flex-grow"></div>
                    <div className="text-lg font-bold text-white/40">{getLocalizedTermStr("Son suyagi")}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-white/10 rounded-full"></div>
                    <div className="text-2xl font-black italic text-white/60">Cranium</div>
                    <div className="h-px bg-white/20 flex-grow"></div>
                    <div className="text-lg font-bold text-white/30">{getLocalizedTermStr("Kalla")}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-white/10 rounded-full"></div>
                    <div className="text-2xl font-black italic text-white/40">Articulatio</div>
                    <div className="h-px bg-white/20 flex-grow"></div>
                    <div className="text-lg font-bold text-white/20">{getLocalizedTermStr("Bo'g'im")}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
