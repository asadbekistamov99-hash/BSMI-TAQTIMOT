import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BONE_REGION_LABELS, BoneEntry, BoneRegion, ROUND_INFO, Round, Attempt,
  bonesForRegion, hintFor, isCorrect, pickBones, scoreAttempts,
} from '../lib/boneTypingEngine';

type Stage = 'setup' | 'play' | 'done';
type RegionChoice = BoneRegion | 'all';

const ROUNDS: Round[] = [1, 2, 3];
const BEST_KEY = 'bone_typing_best_v1';
const QUESTIONS_PER_ROUND = 8;

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
  const [stage, setStage] = useState<Stage>('setup');
  const [region, setRegion] = useState<RegionChoice>('all');
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

  const startRound = (r: Round, reg: RegionChoice) => {
    setRound(r);
    setQueue(pickBones(bonesForRegion(reg), QUESTIONS_PER_ROUND));
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
    <main className="mx-auto max-w-2xl px-4 py-10 text-slate-900 dark:text-slate-100">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Anatomiya mashqi</p>
        <h1 className="mt-2 text-3xl font-bold">Suyaklarni yozib o‘rganing</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Suyak nomini lotincha yozing. Har bir bosqichda yordam kamayadi, ball esa ortadi.
        </p>
      </header>

      {stage === 'setup' && (
        <section className="space-y-6">
          <fieldset>
            <legend className="mb-3 text-sm font-semibold">Qaysi qism?</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(['all', ...Object.keys(BONE_REGION_LABELS)] as RegionChoice[]).map((r) => (
                <label
                  key={r}
                  className={`cursor-pointer rounded-xl border px-3 py-2 text-sm transition ${
                    region === r
                      ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900'
                      : 'border-slate-300 hover:border-slate-500 dark:border-slate-700'
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
                  {r === 'all' ? 'Butun skelet' : BONE_REGION_LABELS[r]}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="rounded-xl border border-slate-200 p-4 text-sm dark:border-slate-800">
            <p className="font-semibold">3 bosqich, har birida {QUESTIONS_PER_ROUND} ta suyak</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-600 dark:text-slate-400">
              {ROUNDS.map((r) => (
                <li key={r}>
                  {ROUND_INFO[r].title}: {ROUND_INFO[r].description} ({ROUND_INFO[r].points} ball)
                </li>
              ))}
            </ul>
            {best > 0 && <p className="mt-3 text-slate-500">Eng yaxshi natija: {best} ball</p>}
          </div>

          <button
            onClick={start}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Boshlash
          </button>
        </section>
      )}

      {stage === 'play' && current && (
        <section className="space-y-5">
          <div>
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>{ROUND_INFO[round].title}</span>
              <span>
                {index + 1} / {roundQueueLength}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full bg-slate-900 transition-all dark:bg-white"
                style={{ width: `${((index + (feedback ? 1 : 0)) / roundQueueLength) * 100}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6 text-center dark:border-slate-800">
            <p className="text-sm text-slate-500">{BONE_REGION_LABELS[current.region]} · {current.uz}</p>
            <p className="mt-3 min-h-[2.5rem] font-mono text-2xl tracking-wide">
              {hintFor(current, round) ?? '— yordamsiz —'}
            </p>
            <p className="mt-2 text-sm text-slate-500">{ROUND_INFO[round].description}</p>
          </div>

          <div>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              readOnly={!!feedback}
              aria-label="Suyak nomini lotincha yozing"
              placeholder="Lotincha nomini yozing"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-3 text-lg outline-none focus:border-slate-900 dark:border-slate-700 dark:focus:border-white"
            />
            {feedback && (
              <p
                role="status"
                className={`mt-3 text-sm font-medium ${feedback.ok ? 'text-emerald-600' : 'text-rose-600'}`}
              >
                {feedback.ok ? 'To‘g‘ri!' : `Noto‘g‘ri. To‘g‘ri javob: ${feedback.expected}`}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            {!feedback ? (
              <button
                onClick={submit}
                disabled={!input.trim()}
                className="flex-1 rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white disabled:opacity-40 dark:bg-white dark:text-slate-900"
              >
                Tekshirish
              </button>
            ) : (
              <button
                onClick={next}
                className="flex-1 rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white dark:bg-white dark:text-slate-900"
              >
                {index + 1 < roundQueueLength
                  ? 'Keyingisi'
                  : ROUNDS.indexOf(round) + 1 < ROUNDS.length
                    ? 'Keyingi bosqich'
                    : 'Natijani ko‘rish'}
              </button>
            )}
          </div>
        </section>
      )}

      {stage === 'done' && (
        <section className="space-y-6 text-center">
          <div className="rounded-2xl border border-slate-200 p-8 dark:border-slate-800">
            <p className="text-sm uppercase tracking-widest text-slate-500">Natija</p>
            <p className="mt-2 text-5xl font-bold">
              {summary.points}
              <span className="text-2xl text-slate-400"> / {summary.maxPoints}</span>
            </p>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              To‘g‘ri javoblar: {summary.correctCount} / {summary.total} ({summary.accuracy}%)
            </p>
            {summary.points >= best && summary.points > 0 && (
              <p className="mt-2 text-sm font-medium text-emerald-600">Yangi eng yaxshi natija!</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={start}
              className="rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white dark:bg-white dark:text-slate-900"
            >
              Qayta o‘ynash
            </button>
            <button
              onClick={() => setStage('setup')}
              className="rounded-xl border border-slate-300 px-4 py-3 font-semibold dark:border-slate-700"
            >
              Qism tanlash
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
