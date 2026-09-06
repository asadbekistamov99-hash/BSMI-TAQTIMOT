import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, Medal, Award, Flame, Users, User, Clock, 
  Search, ShieldCheck, ArrowUpRight, Sparkles, BookOpen, Star,
  PlusCircle, LogIn, Key, Copy, Check, Info, LogOut, X,
  GraduationCap, Hash, ArrowRight, UserPlus, CheckCircle2,
  Calendar, Gift, ChevronRight, Target, Brain, Stethoscope, 
  HelpCircle, Zap, RefreshCw, Layers, Presentation
} from 'lucide-react';
import { 
  collection, doc, getDocs, getDoc, setDoc, updateDoc, 
  query, orderBy, limit, serverTimestamp, arrayUnion, arrayRemove 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import SEO from '../components/SEO';

export interface GroupMember {
  userId: string;
  displayName: string;
  photoURL?: string;
  score: number;
  quizzesCompleted: number;
  pomodoroHours: number;
  joinedAt: string;
  role?: 'leader' | 'member';
}

export interface AcademicGroupRank {
  id: string;
  groupName: string;
  faculty: string;
  description?: string;
  groupCode: string;
  createdBy: string;
  createdByName: string;
  createdAt: any;
  members: GroupMember[];
  totalScore: number;
  membersCount: number;
  avgAccuracy: number;
  topStudent: string;
  rank?: number;
}

export interface LeaderboardUser {
  id: string;
  rank: number;
  displayName: string;
  photoURL?: string;
  academicGroup: string;
  totalScore: number;
  quizzesCompleted: number;
  pomodoroHours: number;
  streakDays: number;
  isCurrentUser?: boolean;
}

const FACULTIES = [
  "Davolash Fakulteti",
  "Pediatriya Fakulteti",
  "Stomatologiya Fakulteti",
  "Tibbiy-profilaktika Fakulteti",
  "Farmatsevtika Fakulteti",
  "Oliy Hamshiralik Ishi",
  "Xalqaro Tibbiyot Fakulteti"
];

export default function LeaderboardPage({ user }: { user?: any }) {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState<'groups' | 'students' | 'rules'>('groups');
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'all'>('weekly');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Real data state (without fake mock participants)
  const [students, setStudents] = useState<LeaderboardUser[]>([]);
  const [groups, setGroups] = useState<AcademicGroupRank[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userGroup, setUserGroup] = useState<AcademicGroupRank | null>(null);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
  const [selectedGroupDetails, setSelectedGroupDetails] = useState<AcademicGroupRank | null>(null);

  // Form states
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [newFaculty, setNewFaculty] = useState<string>(FACULTIES[0]);
  const [newDescription, setNewDescription] = useState<string>('');
  const [newGroupCode, setNewGroupCode] = useState<string>('');
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Calculate current user's actual academic progress and score
  const getCurrentUserProgress = () => {
    try {
      const completedTopics = JSON.parse(localStorage.getItem('completed_topics') || '[]');
      const quizHistory = JSON.parse(localStorage.getItem('quiz_history') || '[]');
      const pomodoroMinutes = parseInt(localStorage.getItem('bsmi_pomodoro_total_minutes') || '0', 10);
      const streak = parseInt(localStorage.getItem('bsmi_study_streak_days') || '1', 10);
      const bonusScore = parseInt(localStorage.getItem('bsmi_mission_bonus_score') || '0', 10);

      // Score calculation for students: Quizzes (50 pts) + Pomodoro (2 pts/min) + Completed Topics (60 pts) + Streak Bonus
      const calculatedScore = (quizHistory.length * 50) + 
                              Math.floor(pomodoroMinutes * 2) + 
                              (completedTopics.length * 60) +
                              (streak * 20) +
                              bonusScore;

      const pomodoroHrs = Math.round((pomodoroMinutes / 60) * 10) / 10;

      return {
        score: Math.max(calculatedScore, 50),
        quizzesCompleted: quizHistory.length,
        completedTopicsCount: completedTopics.length,
        pomodoroHours: pomodoroHrs,
        pomodoroMinutes: pomodoroMinutes,
        streakDays: streak
      };
    } catch {
      return {
        score: 50,
        quizzesCompleted: 0,
        completedTopicsCount: 0,
        pomodoroHours: 0,
        pomodoroMinutes: 0,
        streakDays: 1
      };
    }
  };

  // Fetch real groups and students from Firestore / LocalStorage
  const loadData = async () => {
    setLoading(true);
    try {
      const userProgress = getCurrentUserProgress();
      const currentUserId = user?.uid || 'guest_user';
      const currentUserName = user?.displayName || user?.email?.split('@')[0] || "Talaba (Siz)";
      const currentUserPhoto = user?.photoURL || "https://api.iconify.design/healthicons:doctor-male.svg";

      // 1. Fetch real groups from Firestore
      let fetchedGroups: AcademicGroupRank[] = [];
      try {
        const groupsSnap = await getDocs(collection(db, 'academic_groups'));
        groupsSnap.forEach(docSnap => {
          const data = docSnap.data() as any;
          fetchedGroups.push({
            id: docSnap.id,
            groupName: data.groupName || 'Nomsiz Guruh',
            faculty: data.faculty || FACULTIES[0],
            description: data.description || '',
            groupCode: data.groupCode || '',
            createdBy: data.createdBy || '',
            createdByName: data.createdByName || 'Guruh Sardori',
            createdAt: data.createdAt,
            members: Array.isArray(data.members) ? data.members : [],
            totalScore: typeof data.totalScore === 'number' ? data.totalScore : 0,
            membersCount: typeof data.membersCount === 'number' ? data.membersCount : (data.members?.length || 0),
            avgAccuracy: typeof data.avgAccuracy === 'number' ? data.avgAccuracy : 90,
            topStudent: data.topStudent || (data.members?.[0]?.displayName || data.createdByName || 'Talaba')
          });
        });
      } catch (e) {
        console.warn("Could not read academic_groups from Firestore, checking localStorage:", e);
      }

      // Check localStorage for offline/cached groups
      const localGroupsRaw = localStorage.getItem('bsmi_academic_groups');
      if (localGroupsRaw) {
        try {
          const localGroups: AcademicGroupRank[] = JSON.parse(localGroupsRaw);
          localGroups.forEach(lg => {
            if (!fetchedGroups.some(fg => fg.id === lg.id || fg.groupName === lg.groupName)) {
              fetchedGroups.push(lg);
            }
          });
        } catch (e) {
          console.error("Error reading local groups:", e);
        }
      }

      // 2. Sync / find user's active group
      let activeUserGroup: AcademicGroupRank | null = null;
      const savedGroupId = localStorage.getItem('bsmi_user_group_id');

      fetchedGroups.forEach(g => {
        const isMember = g.members?.some(m => m.userId === currentUserId) || 
                         g.createdBy === currentUserId ||
                         g.id === savedGroupId;
        if (isMember) {
          activeUserGroup = g;
        }
      });

      // Recalculate group totals and rank groups
      fetchedGroups = fetchedGroups.map(g => {
        let total = 0;
        let highestMemberScore = 0;
        let topName = g.createdByName || 'Talaba';

        if (Array.isArray(g.members) && g.members.length > 0) {
          g.members.forEach(m => {
            // Update current user's score inside group in real-time
            if (m.userId === currentUserId) {
              m.score = Math.max(m.score || 0, userProgress.score);
              m.quizzesCompleted = Math.max(m.quizzesCompleted || 0, userProgress.quizzesCompleted);
              m.pomodoroHours = Math.max(m.pomodoroHours || 0, userProgress.pomodoroHours);
            }
            total += (m.score || 0);
            if ((m.score || 0) >= highestMemberScore) {
              highestMemberScore = m.score || 0;
              topName = m.displayName;
            }
          });
        } else {
          total = g.totalScore || 0;
        }

        return {
          ...g,
          totalScore: total,
          membersCount: g.members?.length || 1,
          topStudent: topName
        };
      });

      // Sort groups by total score descending
      fetchedGroups.sort((a, b) => b.totalScore - a.totalScore);
      fetchedGroups = fetchedGroups.map((g, idx) => ({ ...g, rank: idx + 1 }));

      setGroups(fetchedGroups);
      setUserGroup(activeUserGroup);

      // 3. Build real student list from group members & current user
      const studentMap = new Map<string, LeaderboardUser>();

      // Add current user
      studentMap.set(currentUserId, {
        id: currentUserId,
        rank: 1,
        displayName: currentUserName,
        photoURL: currentUserPhoto,
        academicGroup: activeUserGroup ? activeUserGroup.groupName : (user?.academicGroup || "Guruhsiz"),
        totalScore: userProgress.score,
        quizzesCompleted: userProgress.quizzesCompleted,
        pomodoroHours: userProgress.pomodoroHours,
        streakDays: userProgress.streakDays,
        isCurrentUser: true
      });

      // Add all real members from all groups
      fetchedGroups.forEach(g => {
        if (Array.isArray(g.members)) {
          g.members.forEach(m => {
            if (!studentMap.has(m.userId)) {
              studentMap.set(m.userId, {
                id: m.userId,
                rank: 0,
                displayName: m.displayName,
                photoURL: m.photoURL || "https://api.iconify.design/healthicons:user-outline.svg",
                academicGroup: g.groupName,
                totalScore: m.score || 0,
                quizzesCompleted: m.quizzesCompleted || 0,
                pomodoroHours: m.pomodoroHours || 0,
                streakDays: 1,
                isCurrentUser: m.userId === currentUserId
              });
            } else if (m.userId === currentUserId) {
              const curr = studentMap.get(currentUserId)!;
              curr.academicGroup = g.groupName;
            }
          });
        }
      });

      const realStudentsList = Array.from(studentMap.values()).sort((a, b) => b.totalScore - a.totalScore);
      setStudents(realStudentsList.map((s, idx) => ({ ...s, rank: idx + 1 })));

    } catch (err) {
      console.error("Error loading real leaderboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Handle creating a new academic group
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      showToast("Iltimos, guruh nomini kiriting!");
      return;
    }

    const trimmedName = newGroupName.trim();
    const generatedCode = newGroupCode.trim().toUpperCase() || `BSMI-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      setActionLoading(true);
      const userProgress = getCurrentUserProgress();
      const currentUserId = user?.uid || `user_${Date.now()}`;
      const currentUserName = user?.displayName || user?.email?.split('@')[0] || "Guruh Sardori";
      const currentUserPhoto = user?.photoURL || "https://api.iconify.design/healthicons:doctor-male.svg";

      const newGroupDocId = `grp_${Date.now()}`;
      const initialMember: GroupMember = {
        userId: currentUserId,
        displayName: currentUserName,
        photoURL: currentUserPhoto,
        score: userProgress.score,
        quizzesCompleted: userProgress.quizzesCompleted,
        pomodoroHours: userProgress.pomodoroHours,
        joinedAt: new Date().toISOString(),
        role: 'leader'
      };

      const newGroupData: AcademicGroupRank = {
        id: newGroupDocId,
        groupName: trimmedName,
        faculty: newFaculty,
        description: newDescription.trim() || `${newFaculty} akademik anatomiya o'quv guruhi`,
        groupCode: generatedCode,
        createdBy: currentUserId,
        createdByName: currentUserName,
        createdAt: new Date().toISOString(),
        members: [initialMember],
        totalScore: userProgress.score,
        membersCount: 1,
        avgAccuracy: 95,
        topStudent: currentUserName
      };

      // 1. Try to save in Firestore
      try {
        await setDoc(doc(db, 'academic_groups', newGroupDocId), {
          ...newGroupData,
          createdAt: serverTimestamp()
        });
      } catch (fireErr) {
        console.warn("Failed saving group to Firestore directly, caching locally:", fireErr);
      }

      // 2. Save in LocalStorage
      const localGroupsRaw = localStorage.getItem('bsmi_academic_groups');
      const localGroups: AcademicGroupRank[] = localGroupsRaw ? JSON.parse(localGroupsRaw) : [];
      const updatedLocal = [newGroupData, ...localGroups.filter(g => g.id !== newGroupDocId)];
      localStorage.setItem('bsmi_academic_groups', JSON.stringify(updatedLocal));
      localStorage.setItem('bsmi_user_group_id', newGroupDocId);
      localStorage.setItem('bsmi_user_academic_group', trimmedName);

      setShowCreateModal(false);
      setNewGroupName('');
      setNewDescription('');
      setNewGroupCode('');
      showToast(`🎉 "${trimmedName}" guruhi muvaffaqiyatli yaratildi! Guruh kodi: ${generatedCode}`);
      
      await loadData();
    } catch (err: any) {
      console.error("Error creating group:", err);
      showToast("Guruh yaratishda xatolik yuz berdi.");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle joining a group by Code
  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) {
      showToast("Iltimos, guruh kodini kiriting!");
      return;
    }

    const codeToFind = joinCodeInput.trim().toUpperCase();
    const matchingGroup = groups.find(g => (g.groupCode || '').toUpperCase() === codeToFind);

    if (!matchingGroup) {
      showToast("Bunday kodli guruh topilmadi. Kodni tekshirib qaytadan kiriting.");
      return;
    }

    await performJoinGroup(matchingGroup);
    setShowJoinModal(false);
    setJoinCodeInput('');
  };

  // Core Join Group Execution
  const performJoinGroup = async (groupToJoin: AcademicGroupRank) => {
    try {
      setActionLoading(true);
      const userProgress = getCurrentUserProgress();
      const currentUserId = user?.uid || `user_${Date.now()}`;
      const currentUserName = user?.displayName || user?.email?.split('@')[0] || "Talaba";
      const currentUserPhoto = user?.photoURL || "https://api.iconify.design/healthicons:user-outline.svg";

      // Check if already member
      if (groupToJoin.members?.some(m => m.userId === currentUserId)) {
        showToast(`Siz allaqachon "${groupToJoin.groupName}" guruhi a'zosisiz!`);
        return;
      }

      const newMember: GroupMember = {
        userId: currentUserId,
        displayName: currentUserName,
        photoURL: currentUserPhoto,
        score: userProgress.score,
        quizzesCompleted: userProgress.quizzesCompleted,
        pomodoroHours: userProgress.pomodoroHours,
        joinedAt: new Date().toISOString(),
        role: 'member'
      };

      const updatedMembers = [...(groupToJoin.members || []), newMember];
      const updatedTotalScore = (groupToJoin.totalScore || 0) + userProgress.score;
      const updatedCount = updatedMembers.length;

      // 1. Try to update Firestore
      try {
        const groupRef = doc(db, 'academic_groups', groupToJoin.id);
        await updateDoc(groupRef, {
          members: arrayUnion(newMember),
          totalScore: updatedTotalScore,
          membersCount: updatedCount
        });
      } catch (fireErr) {
        console.warn("Firestore update error, updating local store:", fireErr);
      }

      // 2. Update LocalStorage
      const localGroupsRaw = localStorage.getItem('bsmi_academic_groups');
      let localGroups: AcademicGroupRank[] = localGroupsRaw ? JSON.parse(localGroupsRaw) : [];
      localGroups = localGroups.map(g => {
        if (g.id === groupToJoin.id) {
          return {
            ...g,
            members: updatedMembers,
            totalScore: updatedTotalScore,
            membersCount: updatedCount
          };
        }
        return g;
      });
      localStorage.setItem('bsmi_academic_groups', JSON.stringify(localGroups));
      localStorage.setItem('bsmi_user_group_id', groupToJoin.id);
      localStorage.setItem('bsmi_user_academic_group', groupToJoin.groupName);

      showToast(`👏 Siz "${groupToJoin.groupName}" guruhiga muvaffaqiyatli qo'shildingiz!`);
      await loadData();
    } catch (err) {
      console.error("Error joining group:", err);
      showToast("Guruhga qo'shilishda xatolik yuz berdi.");
    } finally {
      setActionLoading(false);
    }
  };

  // Leave Group
  const handleLeaveGroup = async () => {
    if (!userGroup) return;
    if (!window.confirm(`Haqiqatan ham "${userGroup.groupName}" guruhidan chiqmoqchimisiz?`)) {
      return;
    }

    try {
      setActionLoading(true);
      const currentUserId = user?.uid || 'guest_user';

      // 1. Remove from Firestore
      try {
        const memberToRemove = userGroup.members?.find(m => m.userId === currentUserId);
        if (memberToRemove) {
          const groupRef = doc(db, 'academic_groups', userGroup.id);
          await updateDoc(groupRef, {
            members: arrayRemove(memberToRemove),
            totalScore: Math.max((userGroup.totalScore || 0) - (memberToRemove.score || 0), 0),
            membersCount: Math.max((userGroup.membersCount || 1) - 1, 0)
          });
        }
      } catch (fireErr) {
        console.warn("Firestore remove member error:", fireErr);
      }

      // 2. Clear from LocalStorage
      localStorage.removeItem('bsmi_user_group_id');
      localStorage.removeItem('bsmi_user_academic_group');

      const localGroupsRaw = localStorage.getItem('bsmi_academic_groups');
      if (localGroupsRaw) {
        let localGroups: AcademicGroupRank[] = JSON.parse(localGroupsRaw);
        localGroups = localGroups.map(g => {
          if (g.id === userGroup.id) {
            const filtered = (g.members || []).filter(m => m.userId !== currentUserId);
            return {
              ...g,
              members: filtered,
              membersCount: filtered.length
            };
          }
          return g;
        });
        localStorage.setItem('bsmi_academic_groups', JSON.stringify(localGroups));
      }

      showToast(`Siz "${userGroup.groupName}" guruhidan chiqdingiz.`);
      setUserGroup(null);
      await loadData();
    } catch (err) {
      console.error("Error leaving group:", err);
      showToast("Guruhdan chiqishda xatolik yuz berdi.");
    } finally {
      setActionLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
    showToast(`Guruh kodi nusxalandi: ${text}`);
  };

  const filteredStudents = students.filter(s => 
    s.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.academicGroup.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter(g =>
    g.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.faculty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (g.groupCode && g.groupCode.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const currentUserRank = students.find(s => s.isCurrentUser);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Talabalar va Akademik Guruhlar Reytingi | BSMI Anatomy"
        description="Buxoro Davlat Tibbiyot Instituti anatomiya fanidan eng faol talabalar, akademik guruhlar reytingi, test natijalari va o'quv yutuqlari."
        keywords="anatomiya reyting, talabalar reytingi, bsmi leaderboard, akademik guruhlar, anatomiya ballari"
      />
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-800 border-2 border-amber-500/80 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in text-sm font-semibold">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Banner Header */}
        <div className="bg-gradient-to-r from-amber-950/70 via-slate-800 to-indigo-950/80 rounded-2xl p-6 sm:p-8 border border-amber-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
                <Trophy className="w-4 h-4 text-amber-400" />
                BuxDMI Anatomiya Musobaqasi & Reyting Tizimi
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Guruhlar & Talabalar Reytingi
              </h1>
              <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
                Mavzularni o‘rganish, testlar topshirish va Pomodoro darslari orqali ballar to‘plang, shaxsiy hamda guruhingiz reytingini eng yuqori pog‘onaga olib chiqing!
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
              <button
                onClick={() => setViewType('rules')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 ${
                  viewType === 'rules' 
                    ? 'bg-amber-500 text-slate-950 shadow-amber-900/40' 
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-900/30'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-slate-950" />
                Ballar & Reyting Qoidalari
              </button>

              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all border border-slate-700 flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
              >
                <PlusCircle className="w-4 h-4 text-amber-400" />
                Guruh Yaratish
              </button>

              <button
                onClick={() => setShowJoinModal(true)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all border border-slate-700 flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
              >
                <LogIn className="w-4 h-4 text-emerald-400" />
                Kod bilan qo‘shilish
              </button>
            </div>
          </div>
        </div>

        {/* ===================== POINTS & RATING QUICK METRICS STRIP ===================== */}
        <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white">Ballar Qanday Yig‘iladi va Reyting Ko‘tariladi?</h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                    Avtomatik Hisob
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Har bir ta‘limiy harakatingiz uchun profilingiz va guruhingizga real vaqtda ballar qo‘shib boriladi
                </p>
              </div>
            </div>

            <button
              onClick={() => setViewType('rules')}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-amber-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              Batafsil Qo‘llanma
            </button>
          </div>

          {/* 4 Core Point Sources Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-amber-500/40 transition-all flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-amber-400 uppercase font-mono">+60 Ball / Mavzu</div>
                <h4 className="text-xs font-bold text-white mt-0.5">Mavzularni O‘zlashtirish</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Har bir to‘liq o‘rganilgan konspekt va darslik mavzusi uchun.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-emerald-500/40 transition-all flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-emerald-400 uppercase font-mono">+50 Ball / Test</div>
                <h4 className="text-xs font-bold text-white mt-0.5">Anatomiya Testlari</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Mavzular bo‘yicha test sinovlarini muvaffaqiyatli topshirganingizda.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-indigo-500/40 transition-all flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-indigo-400 uppercase font-mono">+2 Ball / Daqiqa</div>
                <h4 className="text-xs font-bold text-white mt-0.5">Pomodoro Fokus Darsi</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  25 daqiqa dars = +50 Ball, 1 soat diqqatli mustaqil ta‘lim = +120 Ball.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-amber-500/40 transition-all flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-amber-400 uppercase font-mono">+20 Ball / Kunlik Streak</div>
                <h4 className="text-xs font-bold text-white mt-0.5">Kunlik Muntazamlik</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Har kuni tizimga kirib ta‘lim olish uzluksizligi va doimiy faollik.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Active Group Banner (if user has joined or created a group) */}
        {userGroup && (
          <div className="bg-gradient-to-r from-emerald-950/50 via-slate-800 to-teal-950/40 rounded-2xl p-5 border border-emerald-500/40 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Sizning Guruhingiz:</span>
                  <h3 className="text-lg font-black text-white">{userGroup.groupName}</h3>
                </div>
                <p className="text-xs text-slate-300">
                  {userGroup.faculty} • {userGroup.membersCount || 1} nafar talaba • Jami ball: <strong className="text-amber-400">{userGroup.totalScore}</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 rounded-xl border border-slate-700 text-xs font-mono">
                <span className="text-slate-400 font-sans">Guruh Kodi:</span>
                <strong className="text-amber-300 font-black tracking-wider">{userGroup.groupCode}</strong>
                <button 
                  onClick={() => copyToClipboard(userGroup.groupCode)}
                  className="text-slate-400 hover:text-white p-1 transition-colors cursor-pointer"
                  title="Kodni nusxalash"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                onClick={() => setSelectedGroupDetails(userGroup)}
                className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                A‘zolar ro‘yxati
              </button>

              <button
                onClick={handleLeaveGroup}
                disabled={actionLoading}
                className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Guruhdan chiqish"
              >
                <LogOut className="w-3.5 h-3.5" />
                Chiqish
              </button>
            </div>
          </div>
        )}

        {/* Current User Rank Strip (Individual) */}
        {currentUserRank && (
          <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-800/80 rounded-2xl p-4 sm:p-5 border border-blue-500/40 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-mono font-black text-lg text-white border-2 border-blue-400 shadow-md">
                #{currentUserRank.rank}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">
                    {currentUserRank.displayName}
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase border border-blue-500/30">
                    Siz
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {currentUserRank.academicGroup} • {currentUserRank.quizzesCompleted} ta test • {currentUserRank.pomodoroHours} soat Pomodoro
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-xs text-slate-400 uppercase font-semibold">Umumiy Ballingiz</div>
                <div className="text-2xl font-mono font-black text-amber-300">
                  {currentUserRank.totalScore}
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-slate-300">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Streak: <strong>{currentUserRank.streakDays} kun</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* Controls: View Tabs + Time Filter + Search */}
        <div className="bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-700 shadow-xl flex flex-wrap items-center justify-between gap-4">
          
          {/* View Tab Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setViewType('groups')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${viewType === 'groups' ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold' : 'bg-slate-900 text-slate-300 hover:text-white'}`}
            >
              <Users className="w-4 h-4" />
              Guruhlar Musobaqasi ({groups.length})
            </button>
            
            <button
              onClick={() => setViewType('students')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${viewType === 'students' ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold' : 'bg-slate-900 text-slate-300 hover:text-white'}`}
            >
              <User className="w-4 h-4" />
              Talabalar Reytingi ({students.length})
            </button>

            <button
              onClick={() => setViewType('rules')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${viewType === 'rules' ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold' : 'bg-slate-900 text-slate-300 hover:text-white'}`}
            >
              <HelpCircle className="w-4 h-4" />
              Qanday Qilib Ball Yig‘ish Kerak?
            </button>
          </div>

          {/* Time Filter & Search */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {viewType !== 'rules' && (
              <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-700 text-xs">
                <button
                  onClick={() => setTimeRange('weekly')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${timeRange === 'weekly' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Haftalik
                </button>
                <button
                  onClick={() => setTimeRange('monthly')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${timeRange === 'monthly' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Oylik
                </button>
                <button
                  onClick={() => setTimeRange('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${timeRange === 'all' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Barchasi
                </button>
              </div>
            )}

            {viewType !== 'rules' && (
              <div className="relative flex-1 sm:w-60">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={viewType === 'students' ? "Talaba yoki guruh..." : "Guruh nomi yoki kodi..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* ===================== VIEW: HOW TO EARN POINTS & BOOST RATING (RULES & GUIDE) ===================== */}
        {viewType === 'rules' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Hero Guide Card */}
            <div className="bg-gradient-to-r from-amber-950/40 via-slate-800 to-indigo-950/40 rounded-3xl p-6 sm:p-8 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Rasmiy Reyting va Ballar Reglamenti
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
                  Ballar Yig‘ish va Reytingni Ko‘tarish Bo‘yicha Qo‘llanma
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Buxoro Davlat Tibbiyot Instituti Anatomiya platformasida reyting to‘liq real ta‘limiy faolligingizga asoslangan. Qanchalik ko‘p dars qilsangiz, test topshirsangiz va guruhdoshlaringiz bilan birga o‘rgansangiz, reytingingiz shunchalik baland bo‘ladi!
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 text-center min-w-[220px] space-y-2 shadow-xl">
                <div className="text-[11px] text-slate-400 uppercase font-bold">Sizning Hozirgi Ballingiz</div>
                <div className="text-3xl font-mono font-black text-amber-400">
                  {currentUserRank?.totalScore || 50}
                </div>
                <div className="text-[11px] text-emerald-400 font-bold flex items-center justify-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> {currentUserRank?.streakDays || 1} kunlik faollik streak
                </div>
              </div>
            </div>

            {/* Section 1: Detailed Point Calculation Matrix */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Shaxsiy Ballar Qanday Hisoblanadi?</h3>
                  <p className="text-xs text-slate-400">Platformadagi har bir faoliyatingiz uchun avtomatik beriladigan ballar mezonlari:</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-slate-600 transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-mono font-black text-sm border border-blue-500/30">
                      +60 Ball
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">Har bir O‘rganilgan Mavzu</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Semestrlar bo‘limiga kirib, yangi mavzuning ma‘ruzasi, konspekti va lotincha atamalari bilan to‘liq tanishib chiqqaningizda hisobingizga qo‘shiladi.
                  </p>
                  <div className="pt-2 text-xs text-blue-400 font-bold flex items-center gap-1">
                    <span>Mavzularni o‘qish</span> <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-slate-600 transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-black text-sm border border-emerald-500/30">
                      +50 Ball
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">Har bir Topshirilgan Test Sinovi</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Mavzu yuzasidan test sinovlarini yechib, to‘g‘ri javoblarni belgilaganingizda bilim darajangiz mustahkamlanadi va ballaringiz ortadi.
                  </p>
                  <div className="pt-2 text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <span>Testlarni topshirish</span> <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-slate-600 transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <Clock className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-black text-sm border border-indigo-500/30">
                      +2 Ball / daqiqa
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">Pomodoro Taymeri Bilan Dars Qilish</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Diqqatni jamlab mustaqil ta‘lim olgan har bir daqiqangiz uchun +2 ball beriladi (masalan: 25 min dars = +50 Ball, 60 min dars = +120 Ball).
                  </p>
                  <div className="pt-2 text-xs text-indigo-400 font-bold flex items-center gap-1">
                    <span>Fokusli ta‘lim</span> <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-slate-600 transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Flame className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono font-black text-sm border border-amber-500/30">
                      +20 Ball / kun
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">Kunlik Muntazamlik (Streak)</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Har kuni tizimga kirib ta‘lim olish zanjirini uzmasangiz, har bir uzluksiz kun uchun qo‘shimcha bonus ballari profilga yoziladi.
                  </p>
                  <div className="pt-2 text-xs text-amber-400 font-bold flex items-center gap-1">
                    <span>Uzluksiz davomiylik</span> <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Group Rating Mechanics */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Akademik Guruh Reytingini Qanday Ko‘tarish Mumkin?</h3>
                  <p className="text-xs text-slate-400">Guruhlar musobaqasi va jamoaviy g‘alaba mexanikasi:</p>
                </div>
              </div>

              <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-white">1. Barcha A‘zolar Balli Jamlanadi</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Guruhning umumiy balli alohida emas — guruhingizdagi barcha talabalar to‘plagan ballar to‘g‘ridan-to‘g‘ri guruh umumiy hisobiga qo‘shiladi!
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-white">2. Guruhdoshlarni Taklif Qiling</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Guruh kodingizni (masalan: <span className="font-mono text-amber-300 font-bold">201-A</span>) guruhdoshlarga yuboring. Guruhda talabalar qancha ko‘p va faol bo‘lsa, guruh shuncha tez 1-o‘ringa chiqadi!
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-white">3. Institut Miqyosida E‘tirof</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Haftalik va oylik musobaqalarda TOP-3 talikka kirgan akademik guruhlar kafedra va institut darajasida eng faol jamoa sifatida e‘tirof etiladi.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-slate-300">
                    O‘z akademik guruhingiz bormi? Hozirning o‘zida guruh yarating yoki mavjud guruh kodini kiriting!
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer"
                    >
                      Guruh Yaratish
                    </button>
                    <button
                      onClick={() => setShowJoinModal(true)}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
                    >
                      Kod Bilan Qo‘shilish
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: 4 Golden Tips for Medical Students */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-black text-sm">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Reytingda TOP-1 Bo‘lish Bo‘yicha 4 Ta Oltin Maslahat</h3>
                  <p className="text-xs text-slate-400">Tibbiyot talabalari uchun eng samarali va natijali ta‘lim taktikasi:</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-850 border border-slate-700 space-y-2">
                  <div className="text-amber-400 font-mono font-black text-sm">01. KUNLIK REJA</div>
                  <h4 className="text-sm font-bold text-white">Har Kuni 25-30 Daqiqa</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Katta hajmdagi anatomiyani birdaniga emas, har kuni muntazam ravishda kichik bo‘limlarga bo‘lib o‘rganing.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-850 border border-slate-700 space-y-2">
                  <div className="text-emerald-400 font-mono font-black text-sm">02. TESTLAR BILAN MUSTAHKAMLASH</div>
                  <h4 className="text-sm font-bold text-white">Nazariyadan So‘ng Test</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Har bir mavzuni o‘qib bo‘lgach darhol test sinovini topshiring. Bu xotirada 3 barobar mustahkam saqlanadi.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-850 border border-slate-700 space-y-2">
                  <div className="text-blue-400 font-mono font-black text-sm">03. LOTINCHA LUG‘AT</div>
                  <h4 className="text-sm font-bold text-white">Terminlarni Takrorlash</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Lotincha atamalar lug‘atidan muntazam foydalaning va tushunarsiz joylarni AI Yordamchidan so‘rab oling.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-850 border border-slate-700 space-y-2">
                  <div className="text-purple-400 font-mono font-black text-sm">04. GURUHDA O‘RGANISH</div>
                  <h4 className="text-sm font-bold text-white">Jamoaviy Raqobat</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Guruhdoshlaringiz bilan birgalikda dars qiling va o‘zaro bilim sinovlarida peshqadamlikka intiling.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Navigation CTAs */}
            <div className="bg-gradient-to-r from-amber-500/10 via-slate-800 to-indigo-500/10 rounded-3xl p-6 sm:p-8 border border-amber-500/30 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-400 shadow-lg">
                <Target className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-xl font-black text-white">Hozirning O‘zida Darsni Boshlang!</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Semestrlarga o‘ting, konspektlarni o‘rganing, testlarni topshiring va reytingda 1-o‘ringa ko‘tariling!
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={() => navigate('/semester/1')}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-900/30 active:scale-95"
                >
                  <BookOpen className="w-4 h-4" />
                  Semestrlarga O‘tish (+60 Ball)
                </button>
                <button
                  onClick={() => navigate('/latin-glossary')}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all border border-slate-700 flex items-center gap-2 cursor-pointer"
                >
                  <Brain className="w-4 h-4 text-emerald-400" />
                  Lotincha Lug‘at
                </button>
                <button
                  onClick={() => navigate('/presentation')}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all border border-slate-700 flex items-center gap-2 cursor-pointer"
                >
                  <Presentation className="w-4 h-4 text-amber-400" />
                  Anatomik Taqdimotlar
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ===================== VIEW: GROUPS LEADERBOARD ===================== */}
        {viewType === 'groups' && (
          <div className="space-y-6">
            
            {groups.length === 0 ? (
              /* Empty Groups State */
              <div className="bg-slate-800/60 border border-dashed border-slate-700 rounded-3xl p-10 sm:p-14 text-center space-y-5">
                <div className="w-20 h-20 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
                  <Users className="w-10 h-10" />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-xl font-bold text-white">Hozircha akademik guruhlar mavjud emas</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Siz birinchi bo‘lib o‘z akademik guruhingizni (masalan: 201-A Davolash) yarating va guruhdoshlaringiz bilan birgalikda Anatomiya musobaqasida qatnashing!
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-4 pt-2">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xl shadow-amber-900/30"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Birinchi Bo‘lib Guruh Yaratish
                  </button>
                  <button
                    onClick={() => setShowJoinModal(true)}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all border border-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <Key className="w-4 h-4 text-emerald-400" />
                    Guruh Kodini Kiritish
                  </button>
                </div>
              </div>
            ) : (
              /* Groups Table and Grid */
              <div className="bg-slate-800/90 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700">
                      <tr>
                        <th className="py-4 px-6">O‘rin</th>
                        <th className="py-4 px-6">Akademik Guruh</th>
                        <th className="py-4 px-6">Fakultet</th>
                        <th className="py-4 px-6 text-center">A‘zolar</th>
                        <th className="py-4 px-6">Yetakchi Talaba</th>
                        <th className="py-4 px-6 text-right">Guruh Balli</th>
                        <th className="py-4 px-6 text-center">Harakat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {filteredGroups.map(group => {
                        const isUserMember = group.members?.some(m => m.userId === (user?.uid || 'guest_user')) || userGroup?.id === group.id;
                        return (
                          <tr 
                            key={group.id} 
                            className={`hover:bg-slate-700/40 transition-colors ${isUserMember ? 'bg-emerald-950/20' : ''}`}
                          >
                            <td className="py-4 px-6 font-mono font-black text-sm">
                              {group.rank === 1 && <span className="text-amber-400 text-base">🏆 1</span>}
                              {group.rank === 2 && <span className="text-slate-300 text-base">🥈 2</span>}
                              {group.rank === 3 && <span className="text-amber-600 text-base">🥉 3</span>}
                              {group.rank && group.rank > 3 && <span className="text-slate-400">#{group.rank}</span>}
                            </td>

                            <td className="py-4 px-6">
                              <div>
                                <div className="font-bold text-white text-sm flex items-center gap-2">
                                  {group.groupName}
                                  {isUserMember && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                                      Guruhingiz
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                                  <span>Kod: <strong className="text-amber-300">{group.groupCode}</strong></span>
                                  <button
                                    onClick={() => copyToClipboard(group.groupCode)}
                                    className="hover:text-white"
                                    title="Kodni nusxalash"
                                  >
                                    <Copy className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-6 text-slate-300">
                              {group.faculty}
                            </td>

                            <td className="py-4 px-6 text-center font-mono">
                              <button
                                onClick={() => setSelectedGroupDetails(group)}
                                className="text-teal-400 hover:text-teal-300 underline font-semibold cursor-pointer"
                              >
                                {group.membersCount || group.members?.length || 1} nafar
                              </button>
                            </td>

                            <td className="py-4 px-6 text-slate-200">
                              <div className="flex items-center gap-1.5 font-medium">
                                <Star className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span className="truncate max-w-[150px]">{group.topStudent}</span>
                              </div>
                            </td>

                            <td className="py-4 px-6 text-right font-mono font-black text-sm text-amber-400">
                              {group.totalScore.toLocaleString()}
                            </td>

                            <td className="py-4 px-6 text-center">
                              {isUserMember ? (
                                <button
                                  onClick={() => setSelectedGroupDetails(group)}
                                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                                >
                                  Ko‘rish
                                </button>
                              ) : (
                                <button
                                  onClick={() => performJoinGroup(group)}
                                  disabled={actionLoading}
                                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer mx-auto shadow-md shadow-emerald-950/40 active:scale-95"
                                >
                                  <UserPlus className="w-3 h-3" />
                                  Qo‘shilish
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ===================== VIEW: STUDENTS LEADERBOARD ===================== */}
        {viewType === 'students' && (
          <div className="space-y-6">
            
            {/* Podium for top 3 students */}
            {students.length > 0 && !searchQuery && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                
                {/* 2nd Place */}
                {students[1] && (
                  <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 flex flex-col items-center text-center relative order-2 md:order-1 shadow-lg">
                    <div className="w-10 h-10 rounded-full bg-slate-400/20 text-slate-300 font-mono font-bold flex items-center justify-center text-lg border border-slate-400 mb-3">
                      🥈 2
                    </div>
                    <img
                      src={students[1].photoURL || "https://api.iconify.design/healthicons:user-outline.svg"}
                      alt={students[1].displayName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-slate-400 shadow-md mb-3"
                    />
                    <h4 className="text-base font-bold text-white">{students[1].displayName}</h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{students[1].academicGroup}</p>
                    <div className="mt-3 text-xl font-mono font-black text-slate-200">
                      {students[1].totalScore} <span className="text-xs text-slate-400">ball</span>
                    </div>
                  </div>
                )}

                {/* 1st Place (Champion) */}
                {students[0] && (
                  <div className="bg-gradient-to-b from-amber-950/40 via-slate-800 to-slate-800 rounded-2xl p-6 border-2 border-amber-500/50 flex flex-col items-center text-center relative order-1 md:order-2 shadow-2xl scale-[1.03]">
                    <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 font-mono font-black flex items-center justify-center text-xl shadow-lg mb-3">
                      👑 1
                    </div>
                    <img
                      src={students[0].photoURL || "https://api.iconify.design/healthicons:doctor-male.svg"}
                      alt={students[0].displayName}
                      className="w-20 h-20 rounded-full object-cover border-3 border-amber-400 shadow-xl mb-3"
                    />
                    <h4 className="text-lg font-black text-amber-300">{students[0].displayName}</h4>
                    <p className="text-xs text-slate-300 font-mono mt-0.5">{students[0].academicGroup}</p>
                    <div className="mt-3 text-2xl font-mono font-black text-amber-400">
                      {students[0].totalScore} <span className="text-xs text-amber-200">ball</span>
                    </div>
                    <div className="mt-2 text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      🔥 {students[0].streakDays || 1} kunlik dars seriyasi
                    </div>
                  </div>
                )}

                {/* 3rd Place */}
                {students[2] && (
                  <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 flex flex-col items-center text-center relative order-3 shadow-lg">
                    <div className="w-10 h-10 rounded-full bg-amber-700/20 text-amber-600 font-mono font-bold flex items-center justify-center text-lg border border-amber-700/40 mb-3">
                      🥉 3
                    </div>
                    <img
                      src={students[2].photoURL || "https://api.iconify.design/healthicons:user-outline.svg"}
                      alt={students[2].displayName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-amber-700 shadow-md mb-3"
                    />
                    <h4 className="text-base font-bold text-white">{students[2].displayName}</h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{students[2].academicGroup}</p>
                    <div className="mt-3 text-xl font-mono font-black text-amber-500">
                      {students[2].totalScore} <span className="text-xs text-slate-400">ball</span>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Students Table */}
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700">
                    <tr>
                      <th className="py-4 px-6">O‘rin</th>
                      <th className="py-4 px-6">Talaba</th>
                      <th className="py-4 px-6">Akademik Guruh</th>
                      <th className="py-4 px-6 text-center">Testlar</th>
                      <th className="py-4 px-6 text-center">Pomodoro</th>
                      <th className="py-4 px-6 text-right">Umumiy Ball</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {filteredStudents.map(student => (
                      <tr 
                        key={student.id}
                        className={`hover:bg-slate-700/40 transition-colors ${student.isCurrentUser ? 'bg-blue-950/30 font-semibold' : ''}`}
                      >
                        <td className="py-4 px-6 font-mono font-black text-sm">
                          {student.rank === 1 && <span className="text-amber-400 text-base">🥇 1</span>}
                          {student.rank === 2 && <span className="text-slate-300 text-base">🥈 2</span>}
                          {student.rank === 3 && <span className="text-amber-600 text-base">🥉 3</span>}
                          {student.rank > 3 && <span className="text-slate-400">#{student.rank}</span>}
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={student.photoURL || "https://api.iconify.design/healthicons:user-outline.svg"}
                              alt={student.displayName}
                              className="w-9 h-9 rounded-full object-cover border border-slate-600 shadow-sm"
                            />
                            <div>
                              <div className="font-bold text-white flex items-center gap-1.5">
                                {student.displayName}
                                {student.isCurrentUser && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold">
                                    Siz
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Flame className="w-3 h-3 text-amber-500" />
                                {student.streakDays || 1} kunlik seriya
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6 font-mono text-slate-300">
                          {student.academicGroup}
                        </td>

                        <td className="py-4 px-6 text-center font-mono font-semibold">
                          {student.quizzesCompleted} ta
                        </td>

                        <td className="py-4 px-6 text-center font-mono font-semibold">
                          {student.pomodoroHours} soat
                        </td>

                        <td className="py-4 px-6 text-right font-mono font-black text-sm text-amber-400">
                          {student.totalScore}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ===================== MODAL: CREATE GROUP ===================== */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6 animate-scale-up">
              
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
                  <PlusCircle className="w-3.5 h-3.5" />
                  Yangi Akademik Guruh
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">Guruh Yaratish</h3>
                <p className="text-xs text-slate-400">
                  Guruhingizni ro‘yxatdan o‘tkazing va guruhdoshlaringizni anatomik musobaqaga taklif qiling.
                </p>
              </div>

              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Guruh Nomi <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: 201-A Davolash yoki Kardiologlar"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Fakultet
                  </label>
                  <select
                    value={newFaculty}
                    onChange={(e) => setNewFaculty(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {FACULTIES.map(fac => (
                      <option key={fac} value={fac}>{fac}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Guruhga Qo‘shilish Maxfiy Kodi (Ixtiyoriy)
                  </label>
                  <div className="relative">
                    <Hash className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Masalan: BSMI-201 (Bo'sh qolsa avtomatik generatsiya bo'ladi)"
                      value={newGroupCode}
                      onChange={(e) => setNewGroupCode(e.target.value.toUpperCase())}
                      className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 uppercase font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Ushbu kodni guruhdoshlaringizga berib guruhga qo'shishingiz mumkin.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Guruh Shiori / Tavsifi (Ixtiyoriy)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Guruh maqsadlari va shiori..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs transition-all shadow-lg shadow-amber-900/30 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {actionLoading ? "Yaratilmoqda..." : "Guruhni Tasdiqlash"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* ===================== MODAL: JOIN GROUP BY CODE ===================== */}
        {showJoinModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-6 animate-scale-up">
              
              <button
                onClick={() => setShowJoinModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                  <LogIn className="w-3.5 h-3.5" />
                  Guruhga Qo‘shilish
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">Guruh Kodi Orqali Kirish</h3>
                <p className="text-xs text-slate-400">
                  Sardoringiz yoki guruhdoshlaringiz bergan maxfiy kodni kiriting.
                </p>
              </div>

              <form onSubmit={handleJoinByCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Guruh Kodi <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Masalan: BSMI-201"
                      value={joinCodeInput}
                      onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                      className="w-full pl-10 pr-4 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-base text-white placeholder-slate-500 uppercase font-mono tracking-widest focus:outline-none focus:border-emerald-500 font-bold"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowJoinModal(false)}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-xl text-xs transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {actionLoading ? "Qo‘shilmoqda..." : "Guruhga Qo‘shilish"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* ===================== MODAL: GROUP DETAILS & MEMBERS LIST ===================== */}
        {selectedGroupDetails && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 animate-scale-up max-h-[90vh] overflow-y-auto">
              
              <button
                onClick={() => setSelectedGroupDetails(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-bold border border-teal-500/20">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {selectedGroupDetails.faculty}
                </div>
                <h3 className="text-2xl font-black text-white">{selectedGroupDetails.groupName}</h3>
                {selectedGroupDetails.description && (
                  <p className="text-xs text-slate-300 italic">"{selectedGroupDetails.description}"</p>
                )}
              </div>

              {/* Group stats ribbon */}
              <div className="grid grid-cols-3 gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-center">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Umumiy Ball</div>
                  <div className="text-lg font-mono font-black text-amber-400">{selectedGroupDetails.totalScore}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">A‘zolar Soni</div>
                  <div className="text-lg font-mono font-black text-teal-400">{selectedGroupDetails.membersCount || selectedGroupDetails.members?.length || 1} nafar</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Guruh Kodi</div>
                  <div className="text-sm font-mono font-black text-amber-300 mt-1">{selectedGroupDetails.groupCode}</div>
                </div>
              </div>

              {/* Members Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Guruh Talabalari Ro‘yxati</span>
                  <span className="text-slate-400 font-mono">({selectedGroupDetails.members?.length || 1} talaba)</span>
                </h4>

                <div className="bg-slate-800 rounded-2xl border border-slate-700/80 divide-y divide-slate-700/50 max-h-64 overflow-y-auto">
                  {(selectedGroupDetails.members || []).map((member, mIdx) => (
                    <div key={member.userId || mIdx} className="p-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-slate-700 font-mono text-xs font-bold flex items-center justify-center text-slate-300">
                          {mIdx + 1}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            {member.displayName}
                            {member.role === 'leader' && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                                Sardor
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {member.quizzesCompleted || 0} ta test • {member.pomodoroHours || 0} soat dars
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-black text-amber-400">{member.score || 0} ball</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedGroupDetails(null)}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  Yopish
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
