import { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Trash2, 
  Edit, 
  Check, 
  Code, 
  AlertCircle,
  Eye,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  DiagramReplacement, 
  extractDiagramsFromTheory, 
  removeDiagramReplacement,
  saveDiagramReplacement 
} from '../lib/diagramHelper';
import ReplaceDiagramModal from './ReplaceDiagramModal';

interface TopicDiagramsEditorProps {
  topicId: string;
  theory: any;
  diagramReplacements?: Record<string, DiagramReplacement>;
  onChange?: (updated: Record<string, DiagramReplacement>) => void;
}

export default function TopicDiagramsEditor({
  topicId,
  theory,
  diagramReplacements = {},
  onChange
}: TopicDiagramsEditorProps) {
  const [activeModalDiagram, setActiveModalDiagram] = useState<{
    key: string;
    code: string;
    title: string;
  } | null>(null);
  const [expandedCodes, setExpandedCodes] = useState<Record<string, boolean>>({});

  // Extract all diagrams from the current theory text
  const diagrams = useMemo(() => {
    return extractDiagramsFromTheory(theory);
  }, [theory]);

  const toggleExpandCode = (key: string) => {
    setExpandedCodes(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleReplacementSuccess = (key: string, replacement: DiagramReplacement | null) => {
    const next = { ...diagramReplacements };
    if (replacement) {
      next[key] = replacement;
    } else {
      delete next[key];
    }
    onChange?.(next);
  };

  const handleQuickRemove = async (key: string) => {
    if (!window.confirm("Ushbu diagramma rasmini o'chirib, asl sxemaga qaytarmoqchimisiz?")) {
      return;
    }
    if (topicId) {
      await removeDiagramReplacement(topicId, key);
    }
    handleReplacementSuccess(key, null);
  };

  const replacedCount = Object.keys(diagramReplacements).length;

  return (
    <div className="bg-slate-50 border border-brand-border rounded-3xl p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-brand-primary uppercase tracking-wider">
                Darslik Sxemalari va Rasmlari Boshqaruvi
              </h4>
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-lg">
                {diagrams.length} ta sxema topildi
              </span>
            </div>
            <p className="text-xs text-brand-muted mt-0.5">
              Darslik matnidagi barcha oqim tarmoqlari (flowchart) va ASCII sxemalarini haqiqiy anatomik fotosuratlar yoki atlas rasmlariga almashtiring.
            </p>
          </div>
        </div>

        {replacedCount > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold shrink-0">
            <Check className="w-4 h-4" />
            <span>{replacedCount} ta sxema rasmga almashtirilgan</span>
          </div>
        )}
      </div>

      {/* Diagrams List */}
      {diagrams.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center">
          <Code className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-600">
            Ushbu mavzu matnida hozircha kod bloklari (``` sxemalar) topilmadi.
          </p>
          <p className="text-[11px] text-slate-400 mt-1 max-w-md mx-auto">
            Mavzu matniga ``` bilan sxema yozsangiz yoki yuqoridagi "+ Atlas Rasmi" tugmasini bossangiz, ular avtomatik shu yerda aks etadi.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {diagrams.map((diag, idx) => {
            const replacement = diagramReplacements[diag.key];
            const isReplaced = !!replacement?.imageUrl;
            const isExpanded = !!expandedCodes[diag.key];

            return (
              <div 
                key={diag.key}
                className={`bg-white border rounded-2xl p-5 transition-all shadow-xs ${
                  isReplaced 
                    ? 'border-emerald-200 bg-emerald-50/10 hover:border-emerald-300' 
                    : 'border-slate-200 hover:border-indigo-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Diagram Info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-mono font-bold">
                        #{idx + 1}
                      </span>
                      <h5 className="text-sm font-bold text-slate-900 truncate">
                        {diag.title}
                      </h5>
                      {isReplaced ? (
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-lg flex items-center gap-1">
                          <Check className="w-3 h-3" /> Haqiqiy rasm biriktirilgan
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg">
                          Standart Sxema / ASCII
                        </span>
                      )}
                    </div>

                    {/* Preview or snippet */}
                    {isReplaced ? (
                      <div className="flex items-center gap-3 pt-2">
                        <img
                          src={replacement.imageUrl}
                          alt={replacement.caption || diag.title}
                          referrerPolicy="no-referrer"
                          className="w-16 h-12 object-cover rounded-lg border border-slate-200 shrink-0 bg-slate-100"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            {replacement.caption || diag.title}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate max-w-md font-mono">
                            {replacement.imageUrl}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 font-mono truncate max-w-xl">
                        {diag.code.split('\n')[0]}...
                      </p>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleExpandCode(diag.key)}
                      className="px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Code className="w-3.5 h-3.5" />
                      {isExpanded ? "Kodni yashirish" : "Asl kod"}
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {isReplaced && (
                      <button
                        type="button"
                        onClick={() => handleQuickRemove(diag.key)}
                        className="px-3 py-1.5 text-[11px] font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                        title="Rasmni o'chirish va asl sxemaga qaytish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        O'chirish
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setActiveModalDiagram({
                        key: diag.key,
                        code: diag.code,
                        title: diag.title
                      })}
                      className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        isReplaced
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      <Edit className="w-3.5 h-3.5" />
                      {isReplaced ? "Rasmni o'zgartirish" : "Rasmga almashtirish"}
                    </button>
                  </div>
                </div>

                {/* Expanded ASCII code */}
                {isExpanded && (
                  <div className="mt-4 p-4 bg-slate-900 rounded-xl text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800">
                    <pre>{diag.code}</pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {activeModalDiagram && (
        <ReplaceDiagramModal
          isOpen={!!activeModalDiagram}
          onClose={() => setActiveModalDiagram(null)}
          topicId={topicId}
          diagramKey={activeModalDiagram.key}
          diagramTitle={activeModalDiagram.title}
          diagramCode={activeModalDiagram.code}
          currentReplacement={diagramReplacements[activeModalDiagram.key] || null}
          onSuccess={(replacement) => {
            handleReplacementSuccess(activeModalDiagram.key, replacement);
          }}
        />
      )}
    </div>
  );
}
