import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, getDocFromServer, setDoc, updateDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import Home from './pages/Home';
import Semester from './pages/Semester';
import TopicDetail from './pages/TopicDetail';
import QuizPage from './pages/QuizPage';
import AnatomyModels from './pages/AnatomyModels';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import LatinGlossary from './pages/LatinGlossary';
import AiAssistant from './pages/AiAssistant';
import Presentation from './pages/Presentation';
import LeaderboardPage from './pages/LeaderboardPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnnouncementBar from './components/AnnouncementBar';
import BiometricFaceGate from './components/BiometricFaceGate';
import ActivityTracker from './components/ActivityTracker';
import DailyRevisionReminder from './components/DailyRevisionReminder';
import PomodoroTimer from './components/PomodoroTimer';
import ErrorBoundary from './components/ErrorBoundary';
import { useSettings } from './hooks/useSettings';
import { Microscope } from 'lucide-react';
import bsmiLogo from './assets/images/bsmi.jpg';

function ShortcutHandler() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + A
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        navigate('/admin/login');
      }
    };

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        const val = target.value.toLowerCase().trim();
        if (val === 'wingo') {
          target.value = '';
          target.blur();
          navigate('/admin/login');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('input', handleInput);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('input', handleInput);
    };
  }, [navigate]);

  return null;
}

function LayoutWrapper({ children, isAdmin, user, handleAdminLogout }: any) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('offline'))) {
          console.warn("[FIREBASE] Application is running in offline mode. Local cache will be used.");
        } else {
          console.warn("[FIREBASE] Connection test info:", error);
        }
      }
    };
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {!isAdminRoute && <Navbar isAdmin={isAdmin} user={user} onLogout={handleAdminLogout} />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAdminRoute && <AnnouncementBar />}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function App() {
  const { settings } = useSettings();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [logoError, setLogoError] = useState(false);
  const [faceIdVerified, setFaceIdVerified] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.removeItem('student_mode_active');
      localStorage.removeItem('anatomy_unlocked_semesters');
      // Clean any stale mock payment keys from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('payment_') || key.startsWith('profile_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {}
    // Face verification starts as false every time the application is loaded, user switches accounts,
    // or when the user's face ID enrollment state changes.
    setFaceIdVerified(false);
  }, [user?.uid, user?.faceIdEnrolled]);

  useEffect(() => {
    // Check if we have a locally saved virtual guest session
    const checkLocalGuest = () => {
      const localGuest = sessionStorage.getItem('virtualGuestUser');
      if (localGuest) {
        try {
          const parsed = JSON.parse(localGuest);
          setUser(parsed);
          setIsAdmin(false);
          setLoading(false);
          return true;
        } catch (e) {}
      }
      return false;
    };

    if (checkLocalGuest()) {
      // Set up simple listener in case of change
      const handleLocalAuth = () => {
        checkLocalGuest();
      };
      window.addEventListener('local_auth_changed', handleLocalAuth);
      return () => window.removeEventListener('local_auth_changed', handleLocalAuth);
    }

    const handleLocalAuth = () => {
      checkLocalGuest();
    };
    window.addEventListener('local_auth_changed', handleLocalAuth);

    let unsubscribeUserDoc: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Clean up any existing Firestore listener
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc();
        unsubscribeUserDoc = null;
      }

      // Re-verify local guest in case firebase login event comes as null
      const isGuest = checkLocalGuest();
      if (isGuest) {
        return;
      }

      const savedAdminToken = sessionStorage.getItem('adminToken');
      setIsAdmin(!!savedAdminToken);

      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        
        // Listen to the user's Firestore document in real-time
        unsubscribeUserDoc = onSnapshot(userRef, async (docSnap) => {
          const adminEmail = "asadbekistamov99@gmail.com";
          const isActuallyAdminEmail = firebaseUser?.email?.toLowerCase() === adminEmail;

          if (!docSnap.exists()) {
            const initialProfile = {
              email: firebaseUser.email || 'demo@bsmi.uz',
              displayName: firebaseUser.displayName || (firebaseUser.isAnonymous ? 'Demo Talaba' : 'Foydalanuvchi'),
              photoURL: firebaseUser.photoURL || 'https://api.iconify.design/healthicons:user-outline.svg',
              createdAt: new Date(),
              isAdmin: isActuallyAdminEmail,
              updatedAt: new Date(),
              purchasedSemesters: [],
              isBlocked: false,
              role: isActuallyAdminEmail ? 'admin' : 'user'
            };
            try {
              await setDoc(userRef, initialProfile);
              setUser({
                uid: firebaseUser.uid,
                isAnonymous: firebaseUser.isAnonymous,
                ...initialProfile
              });
            } catch (err) {
              console.error("Error setting initial profile:", err);
            }
          } else {
            const dbData = docSnap.data();
            setUser({
              uid: firebaseUser.uid,
              isAnonymous: firebaseUser.isAnonymous,
              ...dbData
            });
          }
          setLoading(false);
        }, (error) => {
          console.error("Error listening to user document:", error);
          setUser(firebaseUser);
          setLoading(false);
        });
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc();
      }
      window.removeEventListener('local_auth_changed', handleLocalAuth);
    };
  }, []);

  const handleAdminLogin = (token: string) => {
    sessionStorage.setItem('adminToken', token);
    setIsAdmin(true);
  };

  const handleAdminLogout = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem('adminToken');
      sessionStorage.removeItem('virtualGuestUser');
      setIsAdmin(false);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    const loadingBgUrl = settings?.loadingBgUrl || '';
    const loadingText = settings?.loadingText || 'SISTEMA YUKLANMOQDA...';
    const anim = settings?.loadingLogoAnim || 'pulse';
    const logoUrl = settings?.logoUrl || bsmiLogo;

    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-8 select-none"
        style={{
          backgroundImage: loadingBgUrl ? `url(${loadingBgUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: loadingBgUrl ? '#0D0F14' : '#0B0F19'
        }}
      >
        {/* Subtle Backdrop overlay for beautiful readability */}
        {loadingBgUrl && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[3px] z-0" />
        )}
        
        {/* Decorative Grid Mesh */}
        {!loadingBgUrl && (
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px] z-0" />
        )}

        {/* Elegant circular light glow effect under the logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center max-w-md w-full gap-8 text-center">
          {/* Logo container with decorative rotations */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-full border border-dashed border-[#FFD700]/20 animate-[spin_30s_linear_infinite]" />
            <div className="absolute -inset-8 rounded-full border border-white/5 animate-[spin_60s_linear_infinite_reverse]" />
            
            {logoError || !logoUrl ? (
              <div 
                className={`w-28 h-28 flex items-center justify-center rounded-full bg-gradient-to-b from-slate-950 to-slate-900 border border-[#FFD700]/35 text-[#FFD700] drop-shadow-[0_0_25px_rgba(255,215,0,0.25)] relative z-10 ${
                  anim === 'pulse' ? 'animate-pulse' :
                  anim === 'spin' ? 'animate-[spin_4s_linear_infinite]' :
                  anim === 'float' ? 'animate-[bounce_2.5s_infinite]' :
                  anim === 'bounce' ? 'animate-bounce' :
                  ''
                }`}
              >
                <svg className="w-16 h-16 text-[#FFD700]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Pulsing background glow rings */}
                  <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="2" strokeDasharray="3 4" className="opacity-30" />
                  <circle cx="50" cy="50" r="36" stroke="currentColor" strokeWidth="1.5" className="opacity-50" />
                  
                  {/* Double helix DNA intertwining wave */}
                  <path d="M30 50 C 40 35, 45 35, 50 50 C 55 65, 60 65, 70 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-80" />
                  <path d="M30 50 C 40 65, 45 65, 50 50 C 55 35, 60 35, 70 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-80" />
                  
                  {/* Vertical brain & heart axis connection */}
                  <line x1="50" y1="28" x2="50" y2="72" stroke="currentColor" strokeWidth="1.5" className="opacity-60" />
                  
                  {/* Base connections */}
                  <path d="M42 35 L 58 35" stroke="currentColor" strokeWidth="1.5" className="opacity-75" />
                  <path d="M38 50 L 62 50" stroke="currentColor" strokeWidth="1.5" className="opacity-75" />
                  <path d="M42 65 L 58 65" stroke="currentColor" strokeWidth="1.5" className="opacity-75" />
                  
                  {/* Main nodes */}
                  <circle cx="50" cy="28" r="3" fill="currentColor" />
                  <circle cx="50" cy="72" r="3" fill="currentColor" />
                  <circle cx="50" cy="50" r="4" fill="currentColor" className="animate-ping" />
                  <circle cx="50" cy="50" r="2.5" fill="currentColor" />
                </svg>
              </div>
            ) : (
              <img 
                src={logoUrl} 
                alt="Logo" 
                className={`w-28 h-28 object-cover rounded-full border-2 border-[#FFD700]/30 bg-white p-0.5 shadow-xl drop-shadow-[0_0_25px_rgba(255,215,0,0.25)] relative z-10 ${
                  anim === 'pulse' ? 'animate-pulse' :
                  anim === 'spin' ? 'animate-[spin_4s_linear_infinite]' :
                  anim === 'float' ? 'animate-[bounce_2.5s_infinite]' :
                  anim === 'bounce' ? 'animate-bounce' :
                  ''
                }`}
                onError={() => {
                  setLogoError(true);
                }}
              />
            )}
          </div>

          {/* Branding */}
          <div className="space-y-2 mt-2">
            <h2 className="text-white text-lg font-black tracking-[0.25em] uppercase leading-none drop-shadow-sm font-sans">
              {settings?.siteName || 'BSMI ANATOMY'}
            </h2>
            <p className="text-[#FFD700]/50 text-[9px] font-black tracking-[0.35em] uppercase italic">
              {settings?.tagline || 'ANATOMY SYSTEM'}
            </p>
          </div>

          {/* Progress bar and loading text */}
          <div className="space-y-4 w-48 mt-4">
            <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden relative">
              <div 
                className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-blue-500 via-[#FFD700] to-blue-500 rounded-full" 
                style={{
                  width: '60%',
                  animation: 'loadingProgress 1.8s infinite ease-in-out'
                }}
              />
            </div>
            
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-[#FFD700]/85 block">
              {loadingText}
            </span>
          </div>
        </div>

        {/* Custom CSS loader animation keyframe */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes loadingProgress {
            0% { left: -100%; right: 100%; }
            50% { left: 0%; right: 0%; }
            100% { left: 100%; right: -100%; }
          }
        `}} />
      </div>
    );
  }

  const needsFaceVerification = 
    user && 
    !isAdmin &&
    !user.isAnonymous && 
    (!user.faceIdEnrolled || !faceIdVerified);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <ShortcutHandler />
        <ActivityTracker user={user} />
        <DailyRevisionReminder user={user} />
        <PomodoroTimer user={user} />
        {needsFaceVerification && (
          <BiometricFaceGate 
            user={user} 
            onVerified={() => {
              setFaceIdVerified(true);
            }} 
          />
        )}
        <LayoutWrapper isAdmin={isAdmin} user={user} handleAdminLogout={handleAdminLogout}>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home isAdmin={isAdmin} user={user} />} />
              <Route path="/semester/:id" element={<Semester isAdmin={isAdmin} user={user} />} />
              <Route path="/topic/:id" element={<TopicDetail isAdmin={isAdmin} user={user} />} />
              <Route path="/quiz/:topicId" element={<QuizPage isAdmin={isAdmin} user={user} />} />
              <Route path="/atlas" element={<Navigate to="/models" replace />} />
              <Route path="/models" element={<AnatomyModels isAdmin={isAdmin} user={user} />} />
              <Route path="/latin-glossary" element={<LatinGlossary isAdmin={isAdmin} user={user} />} />
              <Route path="/pin-quiz" element={<Navigate to="/models" replace />} />
              <Route path="/leaderboard" element={<LeaderboardPage user={user} />} />
              <Route path="/ai-assistant" element={<Navigate to="/" replace />} />
              <Route path="/presentation" element={<Presentation user={user} isAdmin={isAdmin} />} />
              <Route path="/admin/login" element={!isAdmin ? <AdminLogin onLogin={handleAdminLogin} /> : <Navigate to="/admin" />} />
              <Route path="/admin/*" element={isAdmin ? <AdminDashboard onLogout={handleAdminLogout} /> : <Navigate to="/admin/login" />} />
            </Routes>
          </ErrorBoundary>
        </LayoutWrapper>
      </BrowserRouter>
    </HelmetProvider>
  );
}
