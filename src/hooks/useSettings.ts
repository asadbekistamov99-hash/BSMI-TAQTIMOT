import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { dbService, isSupabaseEnabled, isAppwriteEnabled } from '../lib/dbService';
import { SystemSettings } from '../types';
import bsmiLogo from '../assets/images/bsmi.jpg';

const defaultSettings: SystemSettings = {
  siteName: 'BSMI ANATOMY',
  logoUrl: bsmiLogo,
  tagline: 'ANATOMY SYSTEM',
  priceUZS: 30000,
  priceUSD: 4,
  durationMonths: 6,
  telegramBotUsername: '@MEDAI_SUPPORT_BOT',
  aiModel: 'Gemini 1.5 Pro',
  footerText: '© 2026 BSMI ANATOMY. Buxoro Davlat Tibbiyot Instituti.',
  contactPhone: '+998 90 123 45 67',
  contactEmail: 'support@bsmi-anatomy.uz',
  loadingBgUrl: '',
  loadingLogoAnim: 'pulse',
  loadingText: 'SISTEMA YUKLANMOQDA...',
  homeHeroTitle: '',
  homeHeroDesc: '',
  homeHeroBtnStart: '',
  homeHeroBtnAtlas: '',
  homeFeaturesTitle: '',
  homeFeatTheoryTitle: '',
  homeFeatTheoryDesc: '',
  homeFeatLatinTitle: '',
  homeFeatLatinDesc: '',
  homeFeatQuizzesTitle: '',
  homeFeatQuizzesDesc: '',
  homeFeatAtlasTitle: '',
  homeFeatAtlasDesc: '',
  homeCurriculumTitle: '',
  homeCurriculumDesc: '',
  footerAboutDesc: '',
  footerSectionsTitle: '',
  footerContactTitle: '',
  footerAddress: '',
  design: {
    primaryColor: '#1E293B',
    accentColor: '#38BDF8',
    backgroundColor: '#F0F2F5',
    cardColor: '#FFFFFF',
    textColor: '#1A202C',
    mutedColor: '#64748B',
    borderRadius: '32px',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    glassEffect: true
  },
  features: {
    enableAI: true,
    enableAtlas: true,
    enableVideos: true,
    enableQuizzes: true,
    enableMidterms: true,
    enableLatin: true,
    enableNotifications: true
  }
};

export function useSettings() {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We always listen to Firebase 'settings/global' for live design & feature toggles!
    const unsub = onSnapshot(doc(db, 'settings', 'global'), async (docSnap) => {
      let firebaseData: any = {};
      if (docSnap.exists()) {
        firebaseData = docSnap.data();
      }

      let finalSettings: SystemSettings = {
        ...defaultSettings,
        ...firebaseData,
        design: { ...defaultSettings.design, ...firebaseData.design },
        features: { ...defaultSettings.features, ...firebaseData.features }
      };

      if (isAppwriteEnabled() || isSupabaseEnabled()) {
        try {
          const cloudData = await dbService.getSettings();
          if (cloudData) {
            finalSettings = {
              ...finalSettings,
              telegramBotUsername: cloudData.telegramBotUsername || finalSettings.telegramBotUsername,
              priceSemester1: cloudData.priceSemester1 || finalSettings.priceSemester1,
              priceSemester2: cloudData.priceSemester2 || finalSettings.priceSemester2,
              cardNumber: cloudData.cardNumber || finalSettings.cardNumber,
              cardHolder: cloudData.cardHolder || finalSettings.cardHolder,
            };
          }
        } catch (error) {
          console.warn("Cloud settings load info (offline or cached):", error);
        }
      }

      setSettings(finalSettings);
      applyDesignSettings(finalSettings.design!);
      setLoading(false);
    }, (error) => {
      console.warn("Settings fetch notice:", error);
      // Fallback
      if (isAppwriteEnabled() || isSupabaseEnabled()) {
        const fetchCloudOnly = async () => {
          try {
            const data = await dbService.getSettings();
            if (data) {
              const merged = {
                ...defaultSettings,
                telegramBotUsername: data.telegramBotUsername || defaultSettings.telegramBotUsername,
                priceSemester1: data.priceSemester1 || defaultSettings.priceSemester1,
                priceSemester2: data.priceSemester2 || defaultSettings.priceSemester2,
                cardNumber: data.cardNumber || defaultSettings.cardNumber,
                cardHolder: data.cardHolder || defaultSettings.cardHolder,
              } as SystemSettings;
              setSettings(merged);
              applyDesignSettings(merged.design!);
            }
          } catch (e) {
            setSettings(defaultSettings);
            applyDesignSettings(defaultSettings.design!);
          } finally {
            setLoading(false);
          }
        };
        fetchCloudOnly();
      } else {
        setSettings(defaultSettings);
        applyDesignSettings(defaultSettings.design!);
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);


  const applyDesignSettings = (design: NonNullable<SystemSettings['design']>) => {
    const root = document.documentElement;
    root.style.setProperty('--color-brand-primary', design.primaryColor);
    root.style.setProperty('--color-brand-accent', design.accentColor);
    root.style.setProperty('--color-brand-bg', design.backgroundColor);
    root.style.setProperty('--color-brand-card', design.cardColor);
    root.style.setProperty('--color-brand-text', design.textColor);
    root.style.setProperty('--color-brand-muted', design.mutedColor);
    root.style.setProperty('--radius-brand', design.borderRadius);
    root.style.setProperty('--font-brand', design.fontFamily);
    
    if (design.glassEffect) {
      root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.7)');
      root.style.setProperty('--glass-blur', '10px');
    } else {
      root.style.setProperty('--glass-bg', design.cardColor);
      root.style.setProperty('--glass-blur', '0px');
    }
  };

  return { settings, loading };
}
