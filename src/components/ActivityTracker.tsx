import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface LastViewedPage {
  path: string;
  title: string;
  updatedAt: string;
}

interface ActivityTrackerProps {
  user: any;
}

export function getFriendlyPageTitle(pathname: string): string {
  if (pathname === '/') return 'Bosh sahifa';
  if (pathname === '/semester/1') return '1-Semestr: Tayanch-harakat tizimi';
  if (pathname === '/semester/2') return '2-Semestr: Ichki a’zolar va tizimlar';
  if (pathname.startsWith('/semester/')) {
    const semId = pathname.replace('/semester/', '');
    return `${semId}-Semestr darslari`;
  }
  if (pathname.startsWith('/topic/')) {
    return 'Mavzu bo‘limi (Nazariya va media)';
  }
  if (pathname.startsWith('/quiz/')) {
    return 'Mavzu bo‘yicha test sinovi';
  }
  if (pathname === '/models' || pathname === '/atlas') return '3D Anatomik modellar va Atlas';
  if (pathname === '/latin-glossary') return 'Lotincha terminlar lug‘ati';
  if (pathname === '/ai-assistant') return 'Professor AI (Tibbiy Asistent)';
  if (pathname === '/presentation') return 'Interaktiv Taqdimot Rejimi';
  return 'O‘quv sahifasi';
}

export default function ActivityTracker({ user }: ActivityTrackerProps) {
  const location = useLocation();
  const lastSavedPathRef = useRef<string>('');

  useEffect(() => {
    const fullPath = location.pathname + location.search;

    // Ignore admin routes
    if (location.pathname.startsWith('/admin')) {
      return;
    }

    // Skip if path hasn't changed
    if (lastSavedPathRef.current === fullPath) {
      return;
    }

    lastSavedPathRef.current = fullPath;

    // Determine page title
    const pageTitle = getFriendlyPageTitle(location.pathname);

    const pageData: LastViewedPage = {
      path: fullPath,
      title: pageTitle,
      updatedAt: new Date().toISOString()
    };

    // Save locally for fast access / offline fallback
    try {
      const storageKey = user?.uid ? `last_viewed_${user.uid}` : 'last_viewed_guest';
      sessionStorage.setItem(storageKey, JSON.stringify(pageData));
      localStorage.setItem(storageKey, JSON.stringify(pageData));

      // Append to recent topics history if it's a topic or quiz route
      if (location.pathname.startsWith('/topic/') || location.pathname.startsWith('/quiz/') || location.pathname.startsWith('/semester/')) {
        const historyKey = user?.uid ? `recent_topics_history_${user.uid}` : 'recent_topics_history_guest';
        const existingHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
        const filtered = existingHistory.filter((item: any) => item.path !== fullPath);
        const updatedHistory = [pageData, ...filtered].slice(0, 10);
        localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
      }
    } catch (e) {
      console.warn('Could not save last viewed page locally:', e);
    }

    // Save to Firestore for logged in users
    if (user?.uid && !user.isAnonymous) {
      const timer = setTimeout(async () => {
        try {
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
            lastViewedPage: pageData
          });
        } catch (err) {
          console.warn('Activity tracker failed to update Firestore:', err);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.search, user]);

  return null;
}
