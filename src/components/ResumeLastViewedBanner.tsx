import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Clock, Bookmark, X, Sparkles } from 'lucide-react';
import { LastViewedPage } from './ActivityTracker';

interface ResumeLastViewedBannerProps {
  user: any;
}

export default function ResumeLastViewedBanner({ user }: ResumeLastViewedBannerProps) {
  const location = useLocation();
  const [lastPage, setLastPage] = useState<LastViewedPage | null>(null);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    // Determine source for last viewed page
    let foundPage: LastViewedPage | null = null;

    if (user?.lastViewedPage && user.lastViewedPage.path) {
      foundPage = user.lastViewedPage;
    } else {
      try {
        const storageKey = user?.uid ? `last_viewed_${user.uid}` : 'last_viewed_guest';
        const saved = localStorage.getItem(storageKey) || sessionStorage.getItem(storageKey);
        if (saved) {
          foundPage = JSON.parse(saved);
        }
      } catch (e) {}
    }

    // Do not show banner if we are already on that exact page, or if path is home '/'
    if (foundPage && foundPage.path && foundPage.path !== '/' && foundPage.path !== location.pathname) {
      setLastPage(foundPage);
    } else {
      setLastPage(null);
    }
  }, [user, location.pathname]);

  if (!lastPage || dismissed) {
    return null;
  }

  // Format relative time if available
  const getTimeAgo = (isoString?: string) => {
    if (!isoString) return 'Yaqinda';
    try {
      const diffMs = new Date().getTime() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Hozirgina';
      if (diffMins < 60) return `${diffMins} daqiqa oldin`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} soat oldin`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} kun oldin`;
    } catch (e) {
      return 'Yaqinda';
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-4 sm:p-5 text-white shadow-xl shadow-indigo-950/20 my-6">
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-40 h-40 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 rounded-xl border border-indigo-500/30 text-cyan-400 shrink-0 mt-0.5 sm:mt-0">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Qolgan joydan davom ettirish
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {getTimeAgo(lastPage.updatedAt)}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white mt-1 line-clamp-1">
              {lastPage.title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Link
            to={lastPage.path}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group active:scale-95"
          >
            <span>Davom ettirish</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition shrink-0"
            title="Yopish"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
