import React, { useState } from 'react';
import { 
  FileText, Download, Printer, Copy, Check, X, 
  BookOpen, Sparkles, ShieldCheck, HelpCircle, Layers
} from 'lucide-react';
import bsmiLogo from '../assets/images/bsmi.jpg';

interface ExportTopicPdfModalProps {
  topic: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportTopicPdfModal({ topic, isOpen, onClose }: ExportTopicPdfModalProps) {
  const [includeTheory, setIncludeTheory] = useState<boolean>(true);
  const [includeLatinTerms, setIncludeLatinTerms] = useState<boolean>(true);
  const [includeClinical, setIncludeClinical] = useState<boolean>(true);
  const [includeQuizzes, setIncludeQuizzes] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen || !topic) return null;

  const topicTitle = topic.title?.uz || topic.title || "Anatomiya Mavzusi";
  const topicDesc = topic.description?.uz || topic.description || "";
  const latinTerms = topic.latinTerms || [];
  const clinicalPearls = topic.clinicalCases || topic.clinicalPearls || [];
  const quizzes = topic.quizzes || [];

  const generatePrintableHtml = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${topicTitle} - BSMI Anatomiya Konspekti</title>
        <meta charset="utf-8" />
        <style>
          @page {
            size: A4;
            margin: 20mm 15mm;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background: #fff;
          }
          .header {
            border-bottom: 2px solid #0284c7;
            padding-bottom: 15px;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .logo-text h1 {
            margin: 0;
            font-size: 18px;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .logo-text p {
            margin: 4px 0 0 0;
            font-size: 11px;
            color: #64748b;
            text-transform: uppercase;
          }
          .topic-title {
            font-size: 22px;
            font-weight: 800;
            color: #0369a1;
            margin-top: 0;
            margin-bottom: 10px;
          }
          .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
          }
          .section-title {
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            color: #0f172a;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 4px;
            margin-bottom: 10px;
          }
          .content-text {
            font-size: 13px;
            color: #334155;
            text-align: justify;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 12px;
          }
          th, td {
            border: 1px solid #cbd5e1;
            padding: 8px 10px;
            text-align: left;
          }
          th {
            background-color: #f1f5f9;
            color: #0f172a;
            font-weight: 700;
          }
          .latin-col {
            font-family: monospace;
            font-weight: 600;
            color: #0284c7;
          }
          .quiz-card {
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 10px 12px;
            margin-bottom: 10px;
            background: #f8fafc;
            page-break-inside: avoid;
          }
          .quiz-q {
            font-size: 12px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 6px;
          }
          .quiz-opts {
            font-size: 11px;
            color: #475569;
            padding-left: 15px;
          }
          .footer {
            margin-top: 40px;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
            font-size: 10px;
            color: #94a3b8;
            display: flex;
            justify-content: space-between;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-text">
            <h1>Buxoro Davlat Tibbiyot Instituti</h1>
            <p>Odam Anatomiyasi va Klinik Anatomiya Kafedrasi</p>
          </div>
          <div style="font-size: 11px; font-weight: bold; color: #0284c7; text-align: right;">
            BSMI ANATOMY PORTAL<br/>
            ${new Date().toLocaleDateString('uz-UZ')}
          </div>
        </div>

        <h2 class="topic-title">${topicTitle}</h2>

        ${includeTheory ? `
          <div class="section">
            <div class="section-title">1. Nazariy Asoslar va Tavsif</div>
            <div class="content-text">${topicDesc || "Mavzu bo‘yicha to‘liq anatomik konspekt va umumiy tuzilish."}</div>
          </div>
        ` : ''}

        ${includeLatinTerms && latinTerms.length > 0 ? `
          <div class="section">
            <div class="section-title">2. Lotincha Anatomik Terminlar Nomenklaturasi</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 35%;">Lotincha Nomi (Terminus)</th>
                  <th style="width: 35%;">O‘zbekcha Tarjimasi</th>
                  <th style="width: 30%;">Tavsifi / Sintopiyasi</th>
                </tr>
              </thead>
              <tbody>
                ${latinTerms.map((t: any) => `
                  <tr>
                    <td class="latin-col">${t.latin || t.term || t}</td>
                    <td>${t.uzbek || t.meaning || "-"}</td>
                    <td>${t.description || "-"}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}

        ${includeClinical && clinicalPearls.length > 0 ? `
          <div class="section">
            <div class="section-title">3. Klinik va Topografik Eslatmalar (High-Yield Pearls)</div>
            ${clinicalPearls.map((c: any, i: number) => `
              <div style="margin-bottom: 8px; font-size: 12px; color: #334155;">
                <strong>${i + 1}. ${c.title || c.diagnosis || "Klinik Holat"}:</strong> ${c.description || c.scenario || c}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${includeQuizzes && quizzes.length > 0 ? `
          <div class="section">
            <div class="section-title">4. Imtihon Nazorat Testlari (${quizzes.length} ta)</div>
            ${quizzes.map((q: any, i: number) => `
              <div class="quiz-card">
                <div class="quiz-q">${i + 1}. ${q.question}</div>
                <div class="quiz-opts">
                  ${(q.options || []).map((opt: string, optI: number) => `
                    <div>${String.fromCharCode(65 + optI)}) ${opt} ${optI === (q.correctAnswer ?? q.correctIndex) ? '<strong>(✓ To‘g‘ri javob)</strong>' : ''}</div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div class="footer">
          <span>BSMI Anatomiya O‘quv Portali • Rasmiy Konspekt</span>
          <span>BuxDMI Axborot Resurs Markazi</span>
        </div>
      </body>
      </html>
    `;
  };

  const handlePrint = () => {
    const html = generatePrintableHtml();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 350);
    }
  };

  const handleCopyMarkdown = () => {
    let md = `# ${topicTitle}\n*Buxoro Davlat Tibbiyot Instituti - Anatomiya Konspekti*\n\n`;
    if (includeTheory) {
      md += `## 1. Nazariy Tavsif\n${topicDesc}\n\n`;
    }
    if (includeLatinTerms && latinTerms.length > 0) {
      md += `## 2. Lotincha Terminlar\n`;
      latinTerms.forEach((t: any) => {
        md += `- **${t.latin || t.term || t}**: ${t.uzbek || t.meaning || ""} ${t.description ? `(${t.description})` : ''}\n`;
      });
      md += `\n`;
    }
    if (includeQuizzes && quizzes.length > 0) {
      md += `## 3. Test Savollari\n`;
      quizzes.forEach((q: any, i: number) => {
        md += `### ${i + 1}. ${q.question}\n`;
        (q.options || []).forEach((opt: string, optI: number) => {
          md += `- [${optI === (q.correctAnswer ?? q.correctIndex) ? 'x' : ' '}] ${opt}\n`;
        });
      });
    }

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Mavzu Konspektini PDF / Chop Etish
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {topicTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Options Checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Konspektga kiritiladigan bo‘limlarni tanlang:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-600 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={includeTheory}
                  onChange={(e) => setIncludeTheory(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded bg-slate-900 border-slate-600 focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-200">
                  📖 Nazariy Konspekt & Tavsif
                </span>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-600 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={includeLatinTerms}
                  onChange={(e) => setIncludeLatinTerms(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded bg-slate-900 border-slate-600 focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-200">
                  🏛️ Lotincha Terminlar Jadvali
                </span>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-600 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={includeClinical}
                  onChange={(e) => setIncludeClinical(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded bg-slate-900 border-slate-600 focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-200">
                  🩺 Klinik Eslatmalar & Keyslar
                </span>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-600 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={includeQuizzes}
                  onChange={(e) => setIncludeQuizzes(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded bg-slate-900 border-slate-600 focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-200">
                  📝 Test Savollari va Kalitlari
                </span>
              </label>
            </div>
          </div>

          {/* Quick Preview Card */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Eksport Namunasi Haqida:
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              PDF formati A4 sahifa standartiga moslangan bo‘lib, BuxDMI kafedra logotipi, lotincha atamalar jadvali va test kalitlari bilan birgalikda tayyorlanadi. Uni to‘g‘ridan-to‘g‘ri printerdan chiqarish yoki PDF qilib saqlash mumkin.
            </p>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleCopyMarkdown}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-slate-700 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? "Nusxalandi!" : "Markdown / Matn Nusxalash"}
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Bekor Qilish
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-900/30 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              PDF Yuklab Olish / Chop Etish
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
