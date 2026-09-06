import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { dbService, isSupabaseEnabled, isAppwriteEnabled } from '../lib/dbService';
import { SystemSettings } from '../types';
import bsmiLogo from '../assets/images/bsmi.jpg';

export function normalizeTelegram(val?: string): string {
  if (!val) return '@Medai_support_bot';
  const trimmed = val.trim();
  const clean = trimmed.replace('@', '').toLowerCase();
  if (clean === 'medai_support' || clean === 'medai_support_bot') {
    return '@Medai_support_bot';
  }
  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
}

const defaultSettings: SystemSettings = {
  siteName: 'BSMI ANATOMY',
  logoUrl: bsmiLogo,
  tagline: 'ANATOMY SYSTEM',
  priceUZS: 30000,
  priceUSD: 4,
  durationMonths: 6,
  telegramBotUsername: '@Medai_support_bot',
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
    accentColor: '#cc0f0f',
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
  const [settings, setSettings] = useState<SystemSettings>(() => {
    try {
      const cached = localStorage.getItem('bsmi_app_design');
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          ...defaultSettings,
          design: {
            ...defaultSettings.design,
            ...parsed
          }
        };
      }
    } catch (e) {}
    return defaultSettings;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We always listen to Firebase 'settings/global' for live design & feature toggles!
    const unsub = onSnapshot(doc(db, 'settings', 'global'), async (docSnap) => {
      let firebaseData: any = {};
      if (docSnap.exists()) {
        firebaseData = docSnap.data();

        let needsDbFix = false;
        const updates: any = {};
        if (firebaseData.telegramBotUsername && firebaseData.telegramBotUsername.toLowerCase().replace('@', '') === 'medai_support') {
          firebaseData.telegramBotUsername = '@Medai_support_bot';
          updates.telegramBotUsername = '@Medai_support_bot';
          needsDbFix = true;
        }
        if (firebaseData.contactEmail && firebaseData.contactEmail.toLowerCase().replace('@', '') === 'medai_support') {
          firebaseData.contactEmail = '@Medai_support_bot';
          updates.contactEmail = '@Medai_support_bot';
          needsDbFix = true;
        }
        if (firebaseData.contactPhone && firebaseData.contactPhone.toLowerCase().replace('@', '') === 'medai_support') {
          firebaseData.contactPhone = '@Medai_support_bot';
          updates.contactPhone = '@Medai_support_bot';
          needsDbFix = true;
        }

        if (needsDbFix) {
          try {
            setDoc(doc(db, 'settings', 'global'), updates, { merge: true }).catch(() => {});
          } catch (e) {}
        }
      }

      let finalSettings: SystemSettings = {
        ...defaultSettings,
        ...firebaseData,
        telegramBotUsername: normalizeTelegram(firebaseData.telegramBotUsername || defaultSettings.telegramBotUsername),
        design: { ...defaultSettings.design, ...firebaseData.design },
        features: { ...defaultSettings.features, ...firebaseData.features }
      };

      if (finalSettings.contactEmail && finalSettings.contactEmail.toLowerCase().replace('@', '') === 'medai_support') {
        finalSettings.contactEmail = '@Medai_support_bot';
      }
      if (finalSettings.contactPhone && finalSettings.contactPhone.toLowerCase().replace('@', '') === 'medai_support') {
        finalSettings.contactPhone = '@Medai_support_bot';
      }

      if (isAppwriteEnabled() || isSupabaseEnabled()) {
        try {
          const cloudData = await dbService.getSettings();
          if (cloudData) {
            finalSettings = {
              ...finalSettings,
              telegramBotUsername: normalizeTelegram(cloudData.telegramBotUsername || finalSettings.telegramBotUsername),
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
                telegramBotUsername: normalizeTelegram(data.telegramBotUsername || defaultSettings.telegramBotUsername),
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
    try {
      localStorage.setItem('bsmi_app_design', JSON.stringify(design));
    } catch (e) {}

    const root = document.documentElement;
    root.style.setProperty('--brand-primary', design.primaryColor);
    root.style.setProperty('--color-brand-primary', design.primaryColor);
    root.style.setProperty('--brand-accent', design.accentColor);
    root.style.setProperty('--color-brand-accent', design.accentColor);
    root.style.setProperty('--brand-bg', design.backgroundColor);
    root.style.setProperty('--color-brand-bg', design.backgroundColor);
    root.style.setProperty('--brand-card', design.cardColor);
    root.style.setProperty('--color-brand-card', design.cardColor);
    root.style.setProperty('--brand-text', design.textColor);
    root.style.setProperty('--color-brand-text', design.textColor);
    root.style.setProperty('--brand-muted', design.mutedColor);
    root.style.setProperty('--color-brand-muted', design.mutedColor);
    root.style.setProperty('--brand-radius', design.borderRadius);
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
