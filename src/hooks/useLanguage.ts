import { useState, useEffect } from 'react';

type LanguageCode = 'uz' | 'ru' | 'en';

const uzDict: Record<string, string> = {
  // Navigation
  'nav.semester1': 'SEMESTR 1',
  'nav.semester2': 'SEMESTR 2',
  'nav.glossary': "LUG'AT",
  'nav.atlas': 'ATLAS',
  'nav.models': '3D MODELLAR',
  'nav.dashboard': 'BOSHQARUV',
  'nav.logout': 'CHIQISH',
  'nav.login': 'KIRISH',
  'nav.ai_assistant': 'AI YORDAMCHI',
  
  // Home Page
  'home.hero_title': 'Anatomiya fanini professional darajada o‘rganing',
  'home.hero_desc': 'ANATOMY SYSTEM. Abu Ali ibn Sino nomidagi Buxoro davlat tibbiyot instituti talabalari uchun yaratilgan maxsus platforma. Nazariya, atlas, testlar va videodarslar bir joyda.',
  'home.start_sem1': '1-SEMESTRDAN BOSHLASH',
  'home.view_atlas': '3D ATLAS',
  'home.features_title': 'PLATFORMA IMKONIYATLARI',
  'home.feat_theory': 'To‘liq nazariya',
  'home.feat_theory_desc': 'Batafsil tibbiy matnlar, rasmlar va illyustratsiyalar.',
  'home.feat_latin': 'Lotin terminlari',
  'home.feat_latin_desc': "Anatomik tuzilmalarning xalqaro nomlanishi va lotincha lug'ati.",
  'home.feat_quizzes': 'Interaktiv testlar',
  'home.feat_quizzes_desc': 'Bilimingizni tekshirish uchun har bir dars oxiridagi testlar.',
  'home.feat_atlas': 'Visual Atlas',
  'home.feat_atlas_desc': 'Organlar va tizimlarning aniq tasvirlangan professional anatomik atlas.',
  'home.curriculum': 'O‘quv reja',
  'home.curriculum_desc': 'Semestrlar bo‘yicha darslar taqsimoti',
  
  // Shared / Semester Lists
  'study.topics_list': "MAVZULAR RO'YXATI",
  'study.topics': 'Mavzular',
  'study.duration': 'Davomiyligi',
  'study.price': 'Narxi',
  'study.unlocked': 'Ochilmoqda',
  'study.locked': 'Bloklangan',
  'study.pending': 'To‘lov kutilmoqda',
  'study.subscribe': 'Hozir kirishni sotib olish',
  'study.pay_desc': 'Ushbu semestrdagi barcha darslar, visual 3D atlas va interaktiv testlardan to‘liq foydalanish uchun obunani faollashtiring.',
  'study.methods': 'To‘lov uslublari',
  'study.payment_success': "To'lov muvaffaqiyatli amalga oshirildi! Tasdiqlash kutilmoqda.",
  'study.upload_receipt': 'Kvitansiya rasmini yuklash (ixtiyoriy)',
  'study.card_copy_desc': 'Karta raqamiga to‘lov qilib, kvitansiyani pastda tasdiqlash uchun yuboring:',
  'study.verify_btn': 'TO‘LOVNI TASDIQLASH',
  'study.active_access': 'Sizda ushbu semestr uchun to‘liq kirish faol.',
  'study.status_pending_desc': 'Sizning to‘lovingiz tekshirilmoqda. Tez orada mavzular avtomatik ochiladi.',

  // Topic Details
  'topic.theory': "Nazariy darslik",
  'topic.latin': "Lotin terminlari",
  'topic.video': "Video darslar",
  'topic.no_video': "Ushbu dars uchun video dars yuklanmagan.",
  'topic.take_quiz': "Test topshirish",
  'topic.quiz_desc': "Bilimingizni mustahkamlash uchun har bir dars so‘ngidagi testlardan o‘ting.",
  'topic.video_desc': 'Mavzuni tasvirlab beruvchi professional video ma’ruzalar ro’yxati.',
  'topic.locked_alert': 'Ushbu mavzudan foydalanish uchun semestr darslarini sotib olish kerak.',
  'topic.pending_alert': 'Ushbu darsga kirish to‘lovingiz hozirda tekshiruv jarayonida.',

  // Quizzes / Exams
  'quiz.locked_title': 'Test bloklangan',
  'quiz.locked_desc': 'Bilimingizni sinash uchun mo‘ljallangan ushbu testlardan o‘tish uchun semestr obunasini olishingiz lozim.',
  'quiz.correct': "To'g'ri javob",
  'quiz.wrong': "Noto'g'ri javob",
  'quiz.next': 'Keyingi savol',
  'quiz.prev': 'Oldingi savol',
  'quiz.finish': 'Testni yakunlash',
  'quiz.your_score': 'Natijangiz',
  'quiz.questions': 'Javob berildi',
  'quiz.correct_answers': 'To‘g‘ri javoblar',
  'quiz.wrong_answers': 'Noto‘g‘ri javoblar',
  'quiz.retake': 'Qayta topshirish',
  'quiz.home': 'Bosh sahifaga qaytish',
  'quiz.back_topic': 'Mavzuga qaytish',
  'quiz.explanation': 'Tushuntirish va ma’lumot',

  // Glossary
  'gloss_title': "Lotin-O'zbek anatomik lug'ati",
  'gloss_desc': 'GBS va xalqaro anatomik terminologiya bo‘yicha darslik lug‘ati',
  'gloss_placeholder': 'Terminni lotincha yoki o‘zbekcha qidirish...',
  'gloss_all': 'Barcha terminlar',

  // Atlas
  'atlas.title': 'Visual 3D Atlas',
  'atlas.desc': 'Organlar, muskullar va skelet tuzilishining interaktiv anatomik xaritasi',
  'atlas.placeholder': 'Atlas darsliklaridan qidirish...',
  'atlas.no_model': 'Ushbu darslik uchun 3D model biriktirilmagan',
  'atlas.loading_model': '3D Model yuklanmoqda...',
  'atlas.not_found': 'Siz izlagan anatomik tushuncha topilmadi.',
  
  // Progress
  'progress.title': 'Mening o‘zlashtirish progressim',
  'progress.desc': 'Mavzularni o‘qib tugatish va o‘zlashtirish ko‘rsatkichlari',
  'progress.overall': 'Umumiy o‘zlashtirish',
  'progress.completed_topics': 'O‘zlashtirilgan darslar',
  'progress.percentage': 'O‘zlashtirildi',
  'progress.no_progress': 'Siz hali biror darsni o‘qib tugatmadingiz. Dars sahifasida "Mavzuni tugatish" tugmasini bosing!',

  // Footer
  'footer.about': 'ANATOMY SYSTEM. Abu Ali ibn Sino nomidagi Buxoro davlat tibbiyot instituti talabalari uchun yaratilgan professional anatomiya o‘quv platformasi.',
  'footer.sections_title': "BO'LIMLAR",
  'footer.semester1': '1-Semester',
  'footer.semester2': '2-Semester',
  'footer.3d_atlas': '3D Atlas',
  'footer.contact': 'ALOQA',
  'footer.address': "Buxoro, O'zbekiston",
  'footer.rights': 'Barcha huquqlar himoyalangan.'
};

const ruDict: Record<string, string> = {
  // Navigation
  'nav.semester1': 'СЕМЕСТР 1',
  'nav.semester2': 'СЕМЕСТР 2',
  'nav.glossary': 'СЛОВАРЬ',
  'nav.atlas': 'АТЛАС',
  'nav.models': '3D МОДЕЛИ',
  'nav.dashboard': 'АДМИНКА',
  'nav.logout': 'ВЫХОД',
  'nav.login': 'ВОЙТИ',
  'nav.ai_assistant': 'ИИ ПОМОЩНИК',
  
  // Home Page
  'home.hero_title': 'Изучайте анатомию на профессиональном уровне',
  'home.hero_desc': 'ANATOMY SYSTEM. Специальная платформа, созданная для студентов Бухарского государственного медицинского института имени Абу Али ибн Сины. Теория, атлас, тесты и видеоуроки в одном месте.',
  'home.start_sem1': 'НАЧАТЬ С 1-ГО СЕМЕСТРА',
  'home.view_atlas': '3D АТЛАС',
  'home.features_title': 'ВОЗМОЖНОСТИ ПЛАТФОРМЫ',
  'home.feat_theory': 'Полная теория',
  'home.feat_theory_desc': 'Подробные подробные медицинские тексты, рисунки и иллюстрации.',
  'home.feat_latin': 'Латинские термины',
  'home.feat_latin_desc': 'Международная номенклатура анатомических структур и латинский словарь.',
  'home.feat_quizzes': 'Интерактивные тесты',
  'home.feat_quizzes_desc': 'Тесты в конце каждого урока для автоматической проверки знаний.',
  'home.feat_atlas': '3D Атлас',
  'home.feat_atlas_desc': 'Профессиональный интерактивный анатомический атлас органов и систем человека.',
  'home.curriculum': 'Учебный план',
  'home.curriculum_desc': 'Распределение уроков по семестрам',
  
  // Shared / Semester Lists
  'study.topics_list': 'СПИСОК ТЕМ',
  'study.topics': 'Темы',
  'study.duration': 'Длительность',
  'study.price': 'Стоимость',
  'study.unlocked': 'Открыто',
  'study.locked': 'Заблокировано',
  'study.pending': 'Ожидается оплата',
  'study.subscribe': 'Получить доступ сейчас',
  'study.pay_desc': 'Активируйте подписку, чтобы получить полный доступ ко всем урокам данного семестра, визуальному 3D-атласу и тестам.',
  'study.methods': 'Способы оплаты',
  'study.payment_success': 'Оплата проведена успешно! Ожидает подтверждения.',
  'study.upload_receipt': 'Загрузить чек (необязательно)',
  'study.card_copy_desc': 'Переведите указанную сумму на карточный счет и отправьте чек ниже:',
  'study.verify_btn': 'ПОДТВЕРДИТЬ ПЛАТЕЖ',
  'study.active_access': 'У вас уже есть полный активный доступ к этому семестру.',
  'study.status_pending_desc': 'Ваш платеж находится на проверке. Уроки откроются автоматически в ближайшее время.',

  // Topic Details
  'topic.theory': 'Теоретический материал',
  'topic.latin': 'Латинские термины',
  'topic.video': 'Видеоуроки',
  'topic.no_video': 'Видеоуроки для данного урока еще не загружены.',
  'topic.take_quiz': 'Пройти тест',
  'topic.quiz_desc': 'Пройдите интерактивные тесты в конце каждого урока, чтобы закрепить знания.',
  'topic.video_desc': 'Список профессиональных видеолекций, наглядно объясняющих тему.',
  'topic.locked_alert': 'Для доступа к материалам темы необходимо приобрести подписку.',
  'topic.pending_alert': 'Ваша оплата для доступа к этому семестру сейчас находится на проверке.',

  // Quizzes / Exams
  'quiz.locked_title': 'Тест заблокирован',
  'quiz.locked_desc': 'Чтобы получить доступ к тестам проверки знаний, необходимо активировать подписку на семестр.',
  'quiz.correct': 'Правильный ответ',
  'quiz.wrong': 'Неправильный ответ',
  'quiz.next': 'Следующий вопрос',
  'quiz.prev': 'Предыдущий вопрос',
  'quiz.finish': 'Завершить тест',
  'quiz.your_score': 'Ваш результат',
  'quiz.questions': 'Вопросы',
  'quiz.correct_answers': 'Правильных ответов',
  'quiz.wrong_answers': 'Неправильных ответов',
  'quiz.retake': 'Пройти заново',
  'quiz.home': 'На главную',
  'quiz.back_topic': 'Вернуться к теме',
  'quiz.explanation': 'Объяснение и подробности',

  // Glossary
  'gloss_title': 'Латинско-Узбекский словарь',
  'gloss_desc': 'Учебный словарь международной анатомической терминологии',
  'gloss_placeholder': 'Искать термин на латыни или узбекском...',
  'gloss_all': 'Все термины',

  // Atlas
  'atlas.title': 'Визуальный 3D Атлас',
  'atlas.desc': 'Интерактивная карта системы органов, мышц и костей человека',
  'atlas.placeholder': 'Искать в анатомическом атласе...',
  'atlas.no_model': '3D-модель не прикреплена к этому учебнику',
  'atlas.loading_model': 'Загрузка 3D-модели...',
  'atlas.not_found': 'Анатомическое понятие не найдено.',
  
  // Progress
  'progress.title': 'Мой прогресс обучения',
  'progress.desc': 'Показатели изучения и освоения тем курса',
  'progress.overall': 'Общий прогресс',
  'progress.completed_topics': 'Изучено тем',
  'progress.percentage': 'Освоено',
  'progress.no_progress': 'Вы еще не завершили ни одного урока. Нажмите кнопку "Завершить тему" на странице урока!',

  // Footer
  'footer.about': 'ANATOMY SYSTEM. Профессиональная образовательная анатомическая платформа, созданная для студентов Бухарского государственного медицинского института имени Абу Али ибн Сины.',
  'footer.sections_title': 'РАЗДЕЛЫ',
  'footer.semester1': '1-Семестр',
  'footer.semester2': '2-Семестр',
  'footer.3d_atlas': '3D Атлас',
  'footer.contact': 'СВЯЗЬ',
  'footer.address': 'Бухара, Узбекистан',
  'footer.rights': 'Все права защищены.'
};

const enDict: Record<string, string> = {
  // Navigation
  'nav.semester1': 'SEMESTER 1',
  'nav.semester2': 'SEMESTER 2',
  'nav.glossary': 'GLOSSARY',
  'nav.atlas': 'ATLAS',
  'nav.models': '3D MODELS',
  'nav.dashboard': 'DASHBOARD',
  'nav.logout': 'LOGOUT',
  'nav.login': 'LOGIN',
  'nav.ai_assistant': 'AI ASSISTANT',
  
  // Home Page
  'home.hero_title': 'Learn anatomy at a highly professional level',
  'home.hero_desc': 'ANATOMY SYSTEM. A specialized platform built for students of the Bukhara State Medical Institute named after Abu Ali ibn Sina. Theory, atlas, quizzes and video lectures in one single place.',
  'home.start_sem1': 'START FROM SEMESTER 1',
  'home.view_atlas': '3D ATLAS',
  'home.features_title': 'PLATFORM ADVANTAGES & FEATURES',
  'home.feat_theory': 'Full Theory',
  'home.feat_theory_desc': 'Highly-detailed localized medical theories, textbook chapters and anatomical illustrations.',
  'home.feat_latin': 'Latin Glossary & Terms',
  'home.feat_latin_desc': 'Official international nomenclature and Latin-Uzbek integrated anatomical search glossary.',
  'home.feat_quizzes': 'Interactive Quizzes',
  'home.feat_quizzes_desc': 'Tailor-made testing system at the end of each topic to check student retention.',
  'home.feat_atlas': '3D Virtual Atlas',
  'home.feat_atlas_desc': 'Professional 3D interactive structure maps of human organs, muscular systems and bone models.',
  'home.curriculum': 'Academic Plan',
  'home.curriculum_desc': 'Syllabus and lessons distributed by semesters',
  
  // Shared / Semester Lists
  'study.topics_list': 'TOPICS CURRICULUM',
  'study.topics': 'Topics',
  'study.duration': 'Duration',
  'study.price': 'Price',
  'study.unlocked': 'Unlocked',
  'study.locked': 'Locked',
  'study.pending': 'Pending review',
  'study.subscribe': 'Purchase Full Access Now',
  'study.pay_desc': 'Unlock full premium access to explore all medical theories, 3D anatomical models, video courses, and quizzes for this semester.',
  'study.methods': 'Payment Channels',
  'study.payment_success': 'Payment sent successfully! Verification is currently pending.',
  'study.upload_receipt': 'Upload a copy of payment receipt (optional)',
  'study.card_copy_desc': 'Transfer subscription amount to the card below and submit the transaction receipt:',
  'study.verify_btn': 'VERIFY PAYMENT STATUS',
  'study.active_access': 'You already have active premium access to this semester courses.',
  'study.status_pending_desc': 'Your receipt is currently being verified by an admin. Accessible lessons will open shortly.',

  // Topic Details
  'topic.theory': 'Anatomical Theoretical Textbook',
  'topic.latin': 'Associated Latin Terminology',
  'topic.video': 'Video Lectures',
  'topic.no_video': 'No learning video is uploaded for this specific chapter yet.',
  'topic.take_quiz': 'Take Chapter Quiz',
  'topic.quiz_desc': 'Go through interactive chapter quizzes to assess and consolidate your knowledge.',
  'topic.video_desc': 'Curated professional video explanations from verified teachers.',
  'topic.locked_alert': 'To unlock and read this theoretical chapter, subscription is required.',
  'topic.pending_alert': 'Your access request and payment receipt are currently under admin review.',

  // Quizzes / Exams
  'quiz.locked_title': 'Quiz Locked',
  'quiz.locked_desc': 'To test your anatomical knowledge and access this testing center, semester subscription is required.',
  'quiz.correct': 'Correct Answer',
  'quiz.wrong': 'Wrong Answer',
  'quiz.next': 'Next Question',
  'quiz.prev': 'Previous Question',
  'quiz.finish': 'Finish Attempt',
  'quiz.your_score': 'Your Final Result',
  'quiz.questions': 'Questions',
  'quiz.correct_answers': 'Correct Answers',
  'quiz.wrong_answers': 'Incorrect Answers',
  'quiz.retake': 'Retake Quiz Module',
  'quiz.home': 'Back to Home',
  'quiz.back_topic': 'Return to Lesson',
  'quiz.explanation': 'Explanation & Details',

  // Glossary
  'gloss_title': 'Anatomical Latin-Uzbek Glossary',
  'gloss_desc': 'Academic vocabulary based on international terminology (Nomina Anatomica)',
  'gloss_placeholder': 'Search terminology in Latin OR Uzbek...',
  'gloss_all': 'Show all terms',

  // Atlas
  'atlas.title': 'Interactive 3D Atlas',
  'atlas.desc': 'Interactive 3D structures and illustrated details of organs, tissues, skeletal systems',
  'atlas.placeholder': 'Search anatomical structure inside atlas...',
  'atlas.no_model': 'No interactive 3D GLB model is linked to this atlas card yet',
  'atlas.loading_model': 'Loading interactive 3D asset...',
  'atlas.not_found': 'We couldn’t find the anatomy entry you are looking for.',
  
  // Progress
  'progress.title': 'My Learning Progress',
  'progress.desc': 'Metrics of studied and completed course topics',
  'progress.overall': 'Overall Progress',
  'progress.completed_topics': 'Completed Topics',
  'progress.percentage': 'Completed',
  'progress.no_progress': 'You have not completed any topics yet. Click "Complete Topic" button on the topic page!',

  // Footer
  'footer.about': 'ANATOMY SYSTEM. A professional anatomy educational platform built for students of the Bukhara State Medical Institute named after Abu Ali ibn Sina.',
  'footer.sections_title': 'SECTIONS',
  'footer.semester1': '1-Semester',
  'footer.semester2': '2-Semester',
  'footer.3d_atlas': '3D Atlas',
  'footer.contact': 'CONTACT',
  'footer.address': 'Bukhara, Uzbekistan',
  'footer.rights': 'All rights reserved.'
};

const normalizeKey = (str: string): string => {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/[‘’'ʼ`´‘]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
};

const TOPIC_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  "sath to'g'risida tushuncha. anatomik terminologiya. umurtqa pog'onasi": {
    uz: "Sath to‘g‘risida tushuncha. Anatomik terminologiya. Umurtqa pog‘onasi",
    ru: "Понятие о плоскостях. Анатомическая терминология. Позвоночный столб",
    en: "Concept of planes. Anatomical terminology. Vertebral column"
  },
  "qovurg'alar. kurak suyagi. to'sh suyagi. o'mrov suyagi": {
    uz: "Qovurg‘alar. Kurak suyagi. To‘sh suyagi. O‘mrov suyagi",
    ru: "Ребра. Лопатка. Грудина. Ключица",
    en: "Ribs. Scapula. Sternum. Clavicle"
  },
  "yelka suyagi. bilak va tirsak suyaklari. qo'l panja suyaklari": {
    uz: "Yelka suyagi. Bilak va tirsak suyaklari. Qo‘l panja suyaklari",
    ru: "Плечевая кость. Кости предплечья (лучевая и локтевая). Кости кисти",
    en: "Humerus. Bones of the forearm (radius and ulna). Bones of the hand"
  },
  "chanoq suyagi. son, boldir va oyoq panja suyaklari": {
    uz: "Chanoq suyagi. Son, boldir va oyoq panja suyaklari",
    ru: "Тазовая кость. Бедренная, кости голени и стопы",
    en: "Hip bone. Femur, tibia, fibula and bones of the foot"
  },
  "kalla suyaklari (umumiy). ensa, tepa, peshona, chakka, ponasimon suyaklar. yuz suyaklari": {
    uz: "Kalla suyaklari (umumiy). Ensa, tepa, peshona, chakka, ponasimon suyaklar. Yuz suyaklari",
    ru: "Кости черепа (общий обзор). Затылочная, теменная, лобная, височная, клиновидная кости. Кости лица",
    en: "Bones of the skull (general). Occipital, parietal, frontal, temporal, sphenoid bones. Facial bones"
  },
  "kallaning miya qismi va yuz qismi. ko'z kosasi. og'iz bo'shlig'i. burun bo'shlig'i": {
    uz: "Kallaning miya qismi va yuz qismi. Ko‘z kosasi. Og‘iz bo‘shlig‘i. Burun bo‘shlig‘i",
    ru: "Мозговой и лицевой отделы черепа. Глазница. Полость рта. Полость носа",
    en: "Neurocranium and viscerocranium. Orbit. Oral cavity. Nasal cavity"
  },
  "chakka osti va qanot-tanglay chuqurchalari. bolalarda kalla suyaklari": {
    uz: "Chakka osti va qanot-tanglay chuqurchalari. Bolalarda kalla suyaklari",
    ru: "Подвисочная и крыловидно-небная ямки. Череп у детей",
    en: "Infratemporal and pterygopalatine fossae. Skull in children"
  },
  "umurtqalar birlashuvi. ko'krak qafasi. yelka kamari va qo'l suyaklari birlashuvi": {
    uz: "Umurtqalar birlashuvi. Ko‘krak qafasi. Yelka kamari va qo‘l suyaklari birlashuvi",
    ru: "Соединения позвонков. Грудная клетка. Соединения костей плечевого пояса и свободной верхней конечности",
    en: "Connections of vertebrae. Thoracic cage. Connections of the pectoral girdle and free upper limb"
  },
  "chanoq va oyoq suyaklari birlashuvi. chanoq-son bo'g'imi. jag' bo'g'imi. rentgen anatomiyasi": {
    uz: "Chanoq va oyoq suyaklari birlashuvi. Chanoq-son bo‘g‘imi. Jag‘ bo‘g‘imi. Rentgen anatomiyasi",
    ru: "Соединения костей таза и свободной нижней конечности. Тазобедренный сустав. Височно-нижнечелюстной сустав. Рентгенанатомия",
    en: "Connections of pelvic bones and free lower limb. Hip joint. Temporomandibular joint. Radiographic anatomy"
  },
  "ko'krak mushaklari va fastsiyalari. diafragma. qorin mushaklari va topografiyasi": {
    uz: "Ko‘krak mushaklari va fastsiyalari. Diafragma. Qorin mushaklari va topografiyasi",
    ru: "Мышцы и фасции груди. Диафрагма. Мышцы и топография живота",
    en: "Muscles and fasciae of the thorax. Diaphragm. Muscles and topography of the abdomen"
  },
  "bo'yin mushaklari. bosh mushaklari. chaynov va mimika mushaklari": {
    uz: "Bo‘yin mushaklari. Bosh mushaklari. Chaynov va mimika mushaklari",
    ru: "Мышцы шеи. Мышцы головы. Жевательные и мимические мышцы",
    en: "Muscles of the neck. Muscles of the head. Masticatory and facial muscles"
  },
  "orqa mushaklari. yelka, bilak va qo'l panja mushaklari": {
    uz: "Orqa mushaklari. Yelka, bilak va qo‘l panja mushaklari",
    ru: "Мышцы спины. Мышцы плеча, предплечья и кисти",
    en: "Muscles of the back. Muscles of the arm, forearm and hand"
  },
  "chanoq, son, boldir va oyoq panja mushaklari": {
    uz: "Chanoq, son, boldir va oyoq panja mushaklari",
    ru: "Мышцы таза, бедра, голени и стопы",
    en: "Muscles of the pelvis, thigh, leg and foot"
  },
  "og'iz bo'shlig'i. tishlar. til. tanglay. halqum. qizilo'ngach": {
    uz: "Og‘iz bo‘shlig‘i. Tishlar. Til. Tanglay. Halqum. Qizilo‘ngach",
    ru: "Полость рта. Зубы. Язык. Небо. Глотка. Пищевод",
    en: "Oral cavity. Teeth. Tongue. Palate. Pharynx. Esophagus"
  },
  "qorin bo'shlig'i a'zolari: oshqozon, ichaklar, jigar, o't pufagi, oshqozon osti bezi": {
    uz: "Qorin bo‘shlig‘i a’zolari: oshqozon, ichaklar, jigar, o‘t pufagi, oshqozon osti bezi",
    ru: "Органы брюшной полости: желудок, кишечник, печень, желчный пузырь, поджелудочная железа",
    en: "Abdominal organs: stomach, intestines, liver, gallbladder, pancreas"
  },
  "qorin pardasi va qorin bo'shlig'i topografiyasi": {
    uz: "Qorin pardasi va qorin bo‘shlig‘i topografiyasi",
    ru: "Брюшина и топография брюшной полости",
    en: "Peritoneum and topography of the abdominal cavity"
  },
  "nafas tizimi: burun, hiqildoq, traxeya, bronxlar, o'pka, plevra": {
    uz: "Nafas tizimi: burun, hiqildoq, traxeya, bronxlar, o‘pka, plevra",
    ru: "Дыхательная система: нос, гортань, traxeya, бронхи, легкие, плевра",
    en: "Respiratory system: nose, larynx, trachea, bronchi, lungs, pleura"
  },
  "endokrin tizim: qalqonsimon, qalqon orqasi, buyrak usti bezlari": {
    uz: "Endokrin tizim: qalqonsimon, qalqon orqasi, buyrak usti bezlari",
    ru: "Эндокринная система: щитовидная, паращитовидные, надпочечники",
    en: "Endocrine system: thyroid, parathyroid, adrenal glands"
  },
  "siydik tizimi: buyrak, siydik yo'llari, siydik pufagi": {
    uz: "Siydik tizimi: buyrak, siydik yo‘llari, siydik pufagi",
    ru: "Мочевыделительная система: почка, мочеточники, мочевой пузырь",
    en: "Urinary system: kidney, ureters, urinary bladder"
  },
  "ayollar jinsiy tizimi. sut bezi": {
    uz: "Ayollar jinsiy tizimi. Sut bezi",
    ru: "Женская половая система. Молочная железа",
    en: "Female reproductive system. Mammary gland"
  },
  "erkaklar jinsiy tizimi": {
    uz: "Erkaklar jinsiy tizimi",
    ru: "Мужская половая система",
    en: "Male reproductive system"
  },
  "yurak. qon aylanish doirasi. aorta. uyqu arteriyalari": {
    uz: "Yurak. Qon aylanish doirasi. Aorta. Uyqu arteriyalari",
    ru: "Сердце. Круги кровообращения. Аорта. Сонные артерии",
    en: "Heart. Circulatory loops. Aorta. Carotid arteries"
  },
  "qo'l arteriyalari. o'mrov osti arteriyasi": {
    uz: "Qo‘l arteriyalari. O‘mrov osti arteriyasi",
    ru: "Артерии верхней конечности. Подключичная артерия",
    en: "Arteries of the upper limb. Subclavian artery"
  },
  "ko'krak va qorin aortasi. tarmoqlari": {
    uz: "Ko‘krak va qorin aortasi. Tarmoqlari",
    ru: "Грудная и брюшная аорта. Ветви",
    en: "Thoracic and abdominal aorta. Branches"
  },
  "yuqori kovak vena. pastki kovak vena. darvoza venasi": {
    uz: "Yuqori kovak vena. Pastki kovak vena. Darvoza venasi",
    ru: "Верхняя полая вена. Нижняя полая вена. Воротная вена",
    en: "Superior vena cava. Inferior vena cava. Portal vein"
  },
  "limfa tizimi. limfa yo'llari. anastomozlar": {
    uz: "Limfa tizimi. Limfa yo‘llari. Anastomozlar",
    ru: "Лимфатическая система. Лимфатические пути. Анастомозы",
    en: "Lymphatic system. Lymphatic vessels. Anastomoses"
  }
};

const dictionaries: Record<LanguageCode, Record<string, string>> = {
  uz: uzDict,
  ru: ruDict,
  en: enDict
};

export function useLanguage() {
  const [lang, setLang] = useState<LanguageCode>(() => {
    const raw = localStorage.getItem('systemLanguage') || 'UZ';
    const clean = raw.toLowerCase();
    return (clean === 'uz' || clean === 'ru' || clean === 'en') ? clean : 'uz';
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const raw = localStorage.getItem('systemLanguage') || 'UZ';
      const clean = raw.toLowerCase();
      if (clean === 'uz' || clean === 'ru' || clean === 'en') {
        setLang(clean);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('languageChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('languageChange', handleStorageChange);
    };
  }, []);

  const changeLanguage = (newLang: LanguageCode) => {
    localStorage.setItem('systemLanguage', newLang.toUpperCase());
    setLang(newLang);
    window.dispatchEvent(new Event('languageChange'));
  };

  const t = (key: string): string => {
    return dictionaries[lang][key] || dictionaries['uz'][key] || key;
  };

  const getLocalized = (field: any): string => {
    if (!field) return '';
    if (typeof field === 'string') {
      const norm = normalizeKey(field);
      const matched = TOPIC_TRANSLATIONS[norm];
      if (matched) {
        return matched[lang] || matched['uz'] || field;
      }
      return field;
    }
    if (typeof field === 'object') {
      const baseVal = field[lang] || field['uz'] || field['en'] || field['ru'] || '';
      const norm = normalizeKey(baseVal);
      const matched = TOPIC_TRANSLATIONS[norm];
      if (matched) {
        return matched[lang] || matched['uz'] || baseVal;
      }
      return baseVal;
    }
    return String(field);
  };

  return {
    language: lang,
    setLanguage: changeLanguage,
    t,
    getLocalized
  };
}
