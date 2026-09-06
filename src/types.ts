export interface User {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  isBlocked: boolean;
  role: 'user' | 'admin';
  createdAt: any;
  lastLogin?: any;
  purchasedSemesters: number[];
  expiryDate?: any;
}

export interface CustomLectureFile {
  fileUrl: string;
  fileName: string;
  fileType: 'pdf' | 'pptx';
  fileSize?: number;
  uploadedAt?: any;
}

export interface TopicTerm {
  id: string;
  latin: string;
  uzbek: string;
  russian?: string;
  english?: string;
  uz?: string;
  ru?: string;
  en?: string;
  description?: string;
  pronunciation?: string;
}

export interface TopicReference {
  id: string;
  title: string;
  authors?: string;
  year?: string;
  type?: 'textbook' | 'atlas' | 'article' | 'manual' | 'online' | string;
  pages?: string;
  link?: string;
  note?: string;
}

export interface Topic {
  id: string;
  semester: number;
  order: number;
  title: Record<string, string>; // Multi-language support
  theory: Record<string, string>;
  latinTerms: string[];
  terms?: TopicTerm[];
  references?: TopicReference[];
  image?: string;
  videos?: string[] | Record<string, string[]>;
  lectureType?: 'text' | 'pdf' | 'pptx';
  customLectureFile?: CustomLectureFile | null;
  pdfUrl?: string;
  pptxUrl?: string;
  diagramReplacements?: Record<string, any>;
}

export interface Semester {
  id: string;
  number: number;
  title: Record<string, string>;
  description: Record<string, string>;
  isActive: boolean;
  order: number;
  price?: number;
  duration?: string;
}

export interface MidtermFile {
  id: string;
  topicId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: any;
}

export interface Quiz {
  id: string;
  topicId: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface AtlasEntry {
  id: string;
  latinName: string;
  uzbekName: string;
  description: string;
  image: string;
  modelUrl?: string; // For GLB/GLTF
  embedUrl?: string; // For Sketchfab
  __catalog?: boolean;
  topicId?: string;
  semester?: number;
  russianName?: string;
  englishName?: string;
  pins?: {
    id: string;
    latinName: string;
    uzbekName: string;
    englishName: string;
    russianName: string;
    system: string;
    position: string;
    normal?: string;
    description: Record<string, string>;
  }[];
}

export interface LatinTerm {
  id: string;
  latin: string;
  uzbek: string;
  russian?: string;
  english?: string;
  semester?: number;
  topicOrder?: number;
  description?: string;
  pronunciation?: string;
  isDeleted?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface UserPayment {
  id: string;
  userId: string;
  userName: string;
  semesterId: number;
  amount: number;
  currency: 'UZS' | 'USD';
  status: 'pending' | 'completed' | 'rejected';
  paymentMethod: string;
  receiptUrl?: string;
  adminNote?: string;
  createdAt: any;
  updatedAt?: any;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  isActive: boolean;
  createdAt: any;
}

export interface SystemSettings {
  siteName: string;
  logoUrl: string;
  tagline: string;
  priceUZS: number;
  priceUSD: number;
  durationMonths: number;
  telegramBotToken?: string;
  telegramBotUsername?: string;
  aiModel?: string;
  footerText?: string;
  contactPhone?: string;
  contactEmail?: string;
  cardNumber?: string;
  cardHolder?: string;
  priceSemester1?: number;
  priceSemester2?: number;
  loadingBgUrl?: string;
  loadingLogoAnim?: 'none' | 'pulse' | 'spin' | 'float' | 'bounce';
  loadingText?: string;
  homeHeroTitle?: string;
  homeHeroDesc?: string;
  homeHeroBtnStart?: string;
  homeHeroBtnAtlas?: string;
  homeFeaturesTitle?: string;
  homeFeatTheoryTitle?: string;
  homeFeatTheoryDesc?: string;
  homeFeatLatinTitle?: string;
  homeFeatLatinDesc?: string;
  homeFeatQuizzesTitle?: string;
  homeFeatQuizzesDesc?: string;
  homeFeatAtlasTitle?: string;
  homeFeatAtlasDesc?: string;
  homeCurriculumTitle?: string;
  homeCurriculumDesc?: string;
  footerAboutDesc?: string;
  footerSectionsTitle?: string;
  footerContactTitle?: string;
  footerAddress?: string;
  design?: {
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
    cardColor: string;
    textColor: string;
    mutedColor: string;
    borderRadius: string;
    fontFamily: string;
    glassEffect: boolean;
  };
  features?: {
    enableAI: boolean;
    enableAtlas: boolean;
    enableVideos: boolean;
    enableQuizzes: boolean;
    enableMidterms: boolean;
    enableLatin: boolean;
    enableNotifications: boolean;
  };
}
