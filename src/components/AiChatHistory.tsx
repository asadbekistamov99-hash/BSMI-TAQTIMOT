import React from 'react';
import { Plus, Trash2, MessageSquare } from 'lucide-react';
import type { ChatSession } from '../lib/aiChatSessions';

type Props = {
  sessions: ChatSession[];
  activeId: string | null;
  language: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
};

const LABELS: Record<string, { title: string; add: string; empty: string; del: string }> = {
  uz: { title: 'Chat tarixi', add: 'Yangi chat', empty: "Hali suhbat yo'q", del: "O'chirish" },
  ru: { title: 'История чатов', add: 'Новый чат', empty: 'Пока нет диалогов', del: 'Удалить' },
  en: { title: 'Chat history', add: 'New chat', empty: 'No conversations yet', del: 'Delete' },
};

function formatDate(iso: string, language: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleString(language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  });
}

export default function AiChatHistory({ sessions, activeId, language, onSelect, onNew, onDelete }: Props) {
  const t = LABELS[language] || LABELS.uz;
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col h-[650px] bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200/60 flex items-center justify-between gap-2">
        <span className="text-xs font-black text-slate-700 uppercase tracking-wide">{t.title}</span>
        <button
          onClick={onNew}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-700"
        >
          <Plus size={14} /> {t.add}
        </button>
      </div>
      <ul className="flex-1 overflow-y-auto p-2 space-y-1">
        {sessions.length === 0 && <li className="p-3 text-xs text-slate-400">{t.empty}</li>}
        {sessions.map((s) => (
          <li key={s.id}>
            <div
              onClick={() => onSelect(s.id)}
              className={`group flex items-center gap-2 rounded-xl px-3 py-2 cursor-pointer ${
                s.id === activeId ? 'bg-slate-100' : 'hover:bg-slate-50'
              }`}
            >
              <MessageSquare size={14} className="text-slate-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-700 truncate">{s.title}</p>
                <p className="text-[10px] text-slate-400">{formatDate(s.updatedAt, language)}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(s.id); }}
                aria-label={t.del}
                title={t.del}
                className="text-slate-300 hover:text-red-500 shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
