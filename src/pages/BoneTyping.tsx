import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import {
  BONE_REGION_LABELS, BoneEntry, BoneRegion, Round, Attempt, Lang,
  bonesForRegion, bonesForRegions, regionsForTopic, hintFor, isCorrect, pickBones, scoreAttempts,
  boneName, regionLabel, roundInfo,
} from '../lib/boneTypingEngine';

type Stage = 'setup' | 'play' | 'done';
type RegionChoice = BoneRegion | 'all';

const ROUNDS: Round[] = [1, 2, 3];

type UiKey = 'figureCaption' | 'kicker' | 'title' | 'subtitle' | 'topicTitle' | 'topicAll' | 'chooseRegion' | 'wholeSkeleton' | 'countLine' | 'best' | 'start' | 'check' | 'next' | 'nextRound' | 'seeResult' | 'correct' | 'wrong' | 'inputLabel' | 'inputPlaceholder' | 'noHint' | 'result' | 'answers' | 'newBest' | 'playAgain' | 'pickPart' | 'tabs' | 'modelTitle' | 'modelCredit' | 'modelCreditSuffix' | 'pts' | 'topicOnly' | 'partLegend';
const UI: Record<Lang, Record<UiKey, any>> = {
  uz: {
    figureCaption: 'Suyak sxemasi. Qizil rang: hozirgi suyak.', kicker: 'Anatomiya mashqi', title: 'Suyaklarni yozib o‘rganing', subtitle: 'Suyak nomini lotincha yozing. Har bir bosqichda yordam kamayadi, ball esa ortadi.',
    topicTitle: 'Mavzu bo‘yicha mashq', topicAll: 'Bu mavzu bo‘yicha butun skelet suyaklari so‘raladi.', topicOnly: (l: string) => `Faqat shu mavzu suyaklari so‘raladi: ${l}.`,
    chooseRegion: 'Qaysi qism?', wholeSkeleton: 'Butun skelet', countLine: (n: number) => `3 bosqich, har birida ${n} ta suyak`, best: (n: number) => `Eng yaxshi natija: ${n} ball`,
    start: 'Boshlash', check: 'Tekshirish', next: 'Keyingisi', nextRound: 'Keyingi bosqich', seeResult: 'Natijani ko‘rish',
    correct: 'To‘g‘ri!', wrong: (e: string) => `Noto‘g‘ri. To‘g‘ri javob: ${e}`, inputLabel: 'Suyak nomini lotincha yozing', inputPlaceholder: 'Lotincha nomini yozing',
    noHint: '— yordamsiz —', result: 'Natija', answers: (c: number, t: number, a: number) => `To‘g‘ri javoblar: ${c} / ${t} (${a}%)`, newBest: 'Yangi eng yaxshi natija!',
    playAgain: 'Qayta o‘ynash', pickPart: 'Qism tanlash', tabs: '3D model tanlash', modelTitle: (l: string) => `${l} — 3D model`, modelCredit: '3D model:', modelCreditSuffix: ', CC BY (Sketchfab).', pts: 'ball', partLegend: 'Qaysi qism?',
  },
  ru: {
    figureCaption: 'Схема костей. Красным: текущая кость.', kicker: 'Анатомическая тренировка', title: 'Учите кости, записывая их названия', subtitle: 'Пишите название кости латинскими буквами. С каждым этапом подсказок меньше, а баллы больше.',
    topicTitle: 'Тренировка по теме', topicAll: 'По этой теме спрашиваются кости всего скелета.', topicOnly: (l: string) => `Спрашиваются только кости этой темы: ${l}.`,
    chooseRegion: 'Какая часть?', wholeSkeleton: 'Весь скелет', countLine: (n: number) => `3 этапа, в каждом ${n} костей`, best: (n: number) => `Лучший результат: ${n} баллов`,
    start: 'Начать', check: 'Проверить', next: 'Далее', nextRound: 'Следующий этап', seeResult: 'Показать результат',
    correct: 'Верно!', wrong: (e: string) => `Неверно. Правильный ответ: ${e}`, inputLabel: 'Напишите название кости латинскими буквами', inputPlaceholder: 'Латинское название',
    noHint: '— без подсказки —', result: 'Результат', answers: (c: number, t: number, a: number) => `Правильных ответов: ${c} из ${t} (${a}%)`, newBest: 'Новый лучший результат!',
    playAgain: 'Играть снова', pickPart: 'Выбрать часть', tabs: 'Выбор 3D-модели', modelTitle: (l: string) => `${l} — 3D-модель`, modelCredit: '3D-модель:', modelCreditSuffix: ', CC BY (Sketchfab).', pts: 'баллов', partLegend: 'Какая часть?',
  },
  en: {
    figureCaption: 'Bone diagram. Red: the current bone.', kicker: 'Anatomy drill', title: 'Learn the bones by typing them', subtitle: 'Type each bone name in Latin. Hints shrink each round and points grow.',
    topicTitle: 'Topic drill', topicAll: 'This topic uses bones from the whole skeleton.', topicOnly: (l: string) => `Only bones from this topic: ${l}.`,
    chooseRegion: 'Which part?', wholeSkeleton: 'Whole skeleton', countLine: (n: number) => `3 rounds, ${n} bones each`, best: (n: number) => `Best score: ${n} pts`,
    start: 'Start', check: 'Check', next: 'Next', nextRound: 'Next round', seeResult: 'See result',
    correct: 'Correct!', wrong: (e: string) => `Wrong. Correct answer: ${e}`, inputLabel: 'Type the Latin name', inputPlaceholder: 'Latin name',
    noHint: '— no hint —', result: 'Result', answers: (c: number, t: number, a: number) => `Correct answers: ${c} of ${t} (${a}%)`, newBest: 'New personal best!',
    playAgain: 'Play again', pickPart: 'Choose part', tabs: 'Choose 3D model', modelTitle: (l: string) => `${l} — 3D model`, modelCredit: '3D model:', modelCreditSuffix: ', CC BY (Sketchfab).', pts: 'pts', partLegend: 'Which part?',
  },
};


const BEST_KEY = 'bone_typing_best_v1';
const QUESTIONS_PER_ROUND = 8;

// Har bir savol uchun mintaqaga mos anatomik model. O'yin savol/ball logikasiga tegmaydi.
const REGION_MODEL_IDS: Record<BoneRegion | 'all', string> = {
  all: '911b9df7e7834175b69b4840ea15e054',
  head: 'daaaa5668efa43f280e23196adb792ca',
  spine: '9ef040d718cd4c269844cc5cabf6ceaa',
  thorax: '4aba9b2ced344bdf8f09656c6a298b50',
  upperLimb: 'f39e683a0af342b9801adedebf2b2a9a',
  lowerLimb: 'e0401c95f53c46df97b1db1cf21f3a56',
};
const BONE_MODEL_IDS: Record<string, string> = {
  // Mavjud katalogdagi alohida suyak/kompleks modellari.
  radius: 'f39e683a0af342b9801adedebf2b2a9a',
  ulna: 'f39e683a0af342b9801adedebf2b2a9a',
  humerus: '548132dc5a0a423581e2cba2014ea521',
  femur: 'a9c1f1a88b104c3fbfe975fa10b31b31',
  talus: 'd69e5651252e44d0bb5d7742670d1d48',
  scaphoid: '1704c8bec5db422fbe17c1e9650c293a',
  lunate: '1704c8bec5db422fbe17c1e9650c293a',
  metacarpal: '1704c8bec5db422fbe17c1e9650c293a',
  occipital: 'baf6ac7b781a46218dca2b59dee58817',
};

function readBest(): number {
  try {
    const n = Number(localStorage.getItem(BEST_KEY));
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}
function writeBest(n: number) {
  try {
    localStorage.setItem(BEST_KEY, String(n));
  } catch {
    /* saqlab bo‘lmasa ham mashq ishlayveradi */
  }
}

export default function BoneTyping() {
  const { language } = useLanguage();
  const lang: Lang = language === 'ru' || language === 'en' ? language : 'uz';
  const L = UI[lang];
  const [stage, setStage] = useState<Stage>('setup');
  const [region, setRegion] = useState<RegionChoice>('all');
  const [searchParams] = useSearchParams();
  const topicKey = searchParams.get('topic');
  const topicRegions = regionsForTopic(topicKey);
  const topicMode = topicKey !== null;
  const [round, setRound] = useState<Round>(1);
  const [queue, setQueue] = useState<BoneEntry[]>([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<null | { ok: boolean; expected: string }>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [best, setBest] = useState<number>(readBest);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = queue[index];
  const roundQueueLength = queue.length;
  const modelRegion: BoneRegion | 'all' = current?.region ?? (region === 'all' ? 'all' : region);
  const modelId = (current && BONE_MODEL_IDS[current.id]) || REGION_MODEL_IDS[modelRegion];

  const startRound = (r: Round, reg: RegionChoice) => {
    setRound(r);
    const pool = topicMode ? bonesForRegions(topicRegions) : bonesForRegion(reg);
    setQueue(pickBones(pool, QUESTIONS_PER_ROUND));
    setIndex(0);
    setInput('');
    setFeedback(null);
    setStage('play');
  };

  const start = () => {
    setAttempts([]);
    startRound(1, region);
  };

  useEffect(() => {
    if (stage === 'play') inputRef.current?.focus();
  }, [stage, index, round]);

  const submit = () => {
    if (!current || feedback) return;
    const ok = isCorrect(current.latin, input);
    setFeedback({ ok, expected: current.latin });
    setAttempts((prev) => [...prev, { boneId: current.id, round, correct: ok }]);
  };

  const next = () => {
    setFeedback(null);
    setInput('');
    if (index + 1 < roundQueueLength) {
      setIndex(index + 1);
      return;
    }
    const nextRound = ROUNDS[ROUNDS.indexOf(round) + 1];
    if (nextRound) {
      startRound(nextRound, region);
      return;
    }
    setStage('done');
  };

  const summary = useMemo(() => scoreAttempts(attempts), [attempts]);

  useEffect(() => {
    if (stage === 'done' && summary.points > best) {
      writeBest(summary.points);
      setBest(summary.points);
    }
  }, [stage, summary.points, best]);

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    if (feedback) next();
    else if (input.trim()) submit();
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 text-brand-text">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted">{L.kicker}</p>
        <h1 className="mt-2 text-3xl font-bold">{L.title}</h1>
        <p className="mt-2 text-brand-muted">
          {L.subtitle}
        </p>
      </header>

      <section className="mb-8">
        <div className="mx-auto flex h-[30rem] items-center justify-center rounded-2xl border border-brand-border bg-white p-4">
          <iframe
            title="Human Skeleton 3D anatomy model"
            className="h-full w-full rounded-xl"
            src={`https://sketchfab.com/models/${modelId}/embed?autostart=1&ui_theme=light&ui_infos=0&ui_watermark=0`}
            allow="autoplay; fullscreen; xr-spatial-tracking"
          />
        </div>
        <p className="mt-2 text-center text-xs text-brand-muted">Human Skeleton — Terrie Simmons-Ehrhardt, CC-BY (Sketchfab).</p>
      </section>

      {stage === 'setup' && (
        <section className="space-y-6">
          {topicMode ? (
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
              <p className="font-semibold">{L.topicTitle}</p>
              <p className="mt-1">
                {topicRegions === 'all'
                  ? L.topicAll
                  : L.topicOnly(topicRegions.map((r) => regionLabel(r, lang)).join(', '))}
              </p>
            </div>
          ) : (
          <fieldset>
            <legend className="mb-3 text-sm font-semibold">{L.partLegend}</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(['all', ...Object.keys(BONE_REGION_LABELS)] as RegionChoice[]).map((r) => (
                <label
                  key={r}
                  className={`cursor-pointer rounded-xl border px-3 py-2 text-sm transition ${
                    region === r
                      ? 'border-brand-primary bg-brand-primary text-white'
                      : 'border-brand-border hover:border-brand-muted'
                  }`}
                >
                  <input
                    type="radio"
                    name="region"
                    value={r}
                    checked={region === r}
                    onChange={() => setRegion(r)}
                    className="sr-only"
                  />
                  {r === 'all' ? L.wholeSkeleton : regionLabel(r, lang)}
                </label>
              ))}
            </div>
          </fieldset>
          )}

          <div className="rounded-xl border border-brand-border p-4 text-sm">
            <p className="font-semibold">{L.countLine(QUESTIONS_PER_ROUND)}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-brand-muted">
              {ROUNDS.map((r) => (
                <li key={r}>
                  {roundInfo(r, lang).title}: {roundInfo(r, lang).description} ({roundInfo(r, lang).points} {L.pts})
                </li>
              ))}
            </ul>
            {best > 0 && <p className="mt-3 text-brand-muted">{L.best(best)}</p>}
          </div>

          <button
            onClick={start}
            className="w-full rounded-xl bg-brand-primary px-4 py-3 font-semibold text-white hover:opacity-90"
          >
            {L.start}
          </button>
        </section>
      )}

      {stage === 'play' && current && (
        <section className="space-y-5">
          <div>
            <div className="flex items-center justify-between text-sm text-brand-muted">
              <span>{roundInfo(round, lang).title}</span>
              <span>
                {index + 1} / {roundQueueLength}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-border">
              <div
                className="h-full bg-brand-primary transition-all"
                style={{ width: `${((index + (feedback ? 1 : 0)) / roundQueueLength) * 100}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-brand-border p-6 text-center">
            <p className="text-sm text-brand-muted">{regionLabel(current.region, lang)} · {boneName(current, lang)}</p>
            <p className="mt-3 min-h-[2.5rem] font-mono text-2xl tracking-wide">
              {hintFor(current, round, lang) ?? L.noHint}
            </p>
            <p className="mt-2 text-sm text-brand-muted">{roundInfo(round, lang).description}</p>
          </div>

          <div>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              readOnly={!!feedback}
              aria-label={L.inputLabel}
              placeholder={L.inputPlaceholder}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              className="w-full rounded-xl border border-brand-border bg-transparent px-4 py-3 text-lg outline-none focus:border-brand-primary"
            />
            {feedback && (
              <p
                role="status"
                className={`mt-3 text-sm font-medium ${feedback.ok ? 'text-emerald-600' : 'text-rose-600'}`}
              >
                {feedback.ok ? L.correct : L.wrong(feedback.expected)}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            {!feedback ? (
              <button
                onClick={submit}
                disabled={!input.trim()}
                className="flex-1 rounded-xl bg-brand-primary px-4 py-3 font-semibold text-white disabled:opacity-40"
              >
                {L.check}
              </button>
            ) : (
              <button
                onClick={next}
                className="flex-1 rounded-xl bg-brand-primary px-4 py-3 font-semibold text-white"
              >
                {index + 1 < roundQueueLength
                  ? L.next
                  : ROUNDS.indexOf(round) + 1 < ROUNDS.length
                    ? L.nextRound
                    : L.seeResult}
              </button>
            )}
          </div>
        </section>
      )}

      {stage === 'done' && (
        <section className="space-y-6 text-center">
          <div className="rounded-2xl border border-brand-border p-8">
            <p className="text-sm uppercase tracking-widest text-brand-muted">{L.result}</p>
            <p className="mt-2 text-5xl font-bold">
              {summary.points}
              <span className="text-2xl text-brand-muted"> / {summary.maxPoints}</span>
            </p>
            <p className="mt-3 text-brand-muted">
              {L.answers(summary.correctCount, summary.total, summary.accuracy)}
            </p>
            {summary.points >= best && summary.points > 0 && (
              <p className="mt-2 text-sm font-medium text-emerald-600">{L.newBest}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={start}
              className="rounded-xl bg-brand-primary px-4 py-3 font-semibold text-white"
            >
              {L.playAgain}
            </button>
            <button
              onClick={() => setStage('setup')}
              className="rounded-xl border border-brand-border px-4 py-3 font-semibold"
            >
              {L.pickPart}
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
