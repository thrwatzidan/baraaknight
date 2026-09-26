import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Volume2, Sparkles, Award, Music, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/soundEffects';

interface RhythmGameProps {
  onEarnScore: (points: number) => void;
  onUnlockAchievement: (id: string) => void;
}

interface BeatNote {
  id: number;
  type: 'doum' | 'tek';
  targetTime: number; // millisecond in the song loop
  label: string;
  hit?: 'perfect' | 'great' | 'miss';
}

const RHYTHM_PATTERN: Array<{ type: 'doum' | 'tek'; delay: number; label: string }> = [
  { type: 'doum', delay: 1000, label: 'دَانْ' },
  { type: 'tek', delay: 1500, label: 'يَا' },
  { type: 'tek', delay: 2000, label: 'دَانَا' },
  { type: 'doum', delay: 2600, label: 'لِدَانْ' },
  { type: 'tek', delay: 3100, label: 'دَانْ' },
  { type: 'doum', delay: 3700, label: 'دِينْ' },
  // Second bar
  { type: 'doum', delay: 4700, label: 'دَانْ' },
  { type: 'tek', delay: 5200, label: 'يَا' },
  { type: 'tek', delay: 5700, label: 'دَانَا' },
  { type: 'doum', delay: 6300, label: 'لِدَانْ' },
  { type: 'tek', delay: 6800, label: 'دَانْ' },
  { type: 'doum', delay: 7400, label: 'دِينْ' },
  // Climax bar: "نَبَتَ الحَقُّ عَلَيها مُزْهِرا"
  { type: 'doum', delay: 8400, label: 'نَبَتَ' },
  { type: 'tek', delay: 8900, label: 'الحَقُّ' },
  { type: 'doum', delay: 9500, label: 'عَلَيْهَا' },
  { type: 'tek', delay: 10100, label: 'مُزْ' },
  { type: 'doum', delay: 10600, label: 'هِرَا!' },
];

const SONG_DURATION = 12000; // 12 seconds per round

export const RhythmGame: React.FC<RhythmGameProps> = ({
  onEarnScore,
  onUnlockAchievement,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [mode, setMode] = useState<'challenge' | 'freeplay'>('challenge');
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ text: string; color: string; id: number } | null>(null);
  const [gameTime, setGameTime] = useState<number>(0);
  const [notes, setNotes] = useState<BeatNote[]>([]);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [doumActive, setDoumActive] = useState<boolean>(false);
  const [tekActive, setTekActive] = useState<boolean>(false);

  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Initialize round
  const startChallenge = () => {
    soundManager.playFanfare();
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setGameFinished(false);
    setFeedback(null);

    const generatedNotes: BeatNote[] = RHYTHM_PATTERN.map((p, idx) => ({
      id: idx,
      type: p.type,
      targetTime: p.delay,
      label: p.label,
    }));
    setNotes(generatedNotes);
    setIsPlaying(true);
    startTimeRef.current = performance.now();
  };

  // Drum animation trigger
  const triggerDrum = useCallback((type: 'doum' | 'tek') => {
    if (type === 'doum') {
      soundManager.playDrumDoum();
      setDoumActive(true);
      setTimeout(() => setDoumActive(false), 150);
    } else {
      soundManager.playDrumTek();
      setTekActive(true);
      setTimeout(() => setTekActive(false), 150);
    }
  }, []);

  // Player action logic
  const handleHit = useCallback((type: 'doum' | 'tek') => {
    triggerDrum(type);

    if (!isPlaying || mode === 'freeplay') return;

    const currentT = performance.now() - startTimeRef.current;
    // Find closest unhit note of this type within 500ms
    const candidate = notes.find(
      (n) => !n.hit && n.type === type && Math.abs(n.targetTime - currentT) < 550
    );

    if (candidate) {
      const diff = Math.abs(candidate.targetTime - currentT);
      let hitRating: 'perfect' | 'great' = 'great';
      let pointsEarned = 15;

      if (diff < 180) {
        hitRating = 'perfect';
        pointsEarned = 30;
      }

      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      if (newCombo % 3 === 0) soundManager.playCombo(newCombo);

      const added = pointsEarned + Math.min(newCombo * 2, 20);
      setScore((prev) => prev + added);
      onEarnScore(added);

      setFeedback({
        text: hitRating === 'perfect' ? '🎯 ممتاز! (إيقاع دقيق)' : '✨ رائع!',
        color: hitRating === 'perfect' ? 'text-amber-400' : 'text-emerald-400',
        id: Date.now(),
      });

      setNotes((prev) =>
        prev.map((n) => (n.id === candidate.id ? { ...n, hit: hitRating } : n))
      );
    } else {
      // Missed tap
      setCombo(0);
      setFeedback({
        text: 'استمع للإيقاع جيداً',
        color: 'text-slate-400',
        id: Date.now(),
      });
    }
  }, [triggerDrum, isPlaying, mode, notes, combo, maxCombo, onEarnScore]);

  // Main game animation loop
  useEffect(() => {
    if (!isPlaying || mode === 'freeplay') return;

    const loop = (timestamp: number) => {
      const elapsed = timestamp - startTimeRef.current;
      setGameTime(elapsed);

      // Check for missed notes that passed beyond 400ms
      setNotes((prev) =>
        prev.map((n) => {
          if (!n.hit && elapsed > n.targetTime + 450) {
            return { ...n, hit: 'miss' };
          }
          return n;
        })
      );

      if (elapsed >= SONG_DURATION) {
        setIsPlaying(false);
        setGameFinished(true);
        soundManager.playFanfare();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        if (score >= 250) {
          onUnlockAchievement('first_rhythm');
        }
      } else {
        requestRef.current = requestAnimationFrame(loop);
      }
    };

    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, mode, score, onUnlockAchievement]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyD' || e.code === 'ArrowRight' || e.code === 'KeyA') {
        handleHit('doum');
      } else if (e.code === 'KeyK' || e.code === 'ArrowLeft' || e.code === 'KeyL') {
        handleHit('tek');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleHit]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-amber-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg text-right relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 border border-amber-300/30 text-amber-300 font-bold text-xs rounded-full mb-2">
              <Music className="w-3.5 h-3.5" />
              <span>فن البرعة العُماني · إيقاع المرواس والرحماني</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-cairo">
              لعبة إيقاع الدان دان 🥁
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm font-tajawal mt-1 max-w-xl">
              اضغط على طبل "الدوم" باليمين أو "التك" باليسار عند وصول الكلمات إلى دائرة الهدف لتصنع الإيقاع التراثي الأصيل!
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 bg-black/30 p-1.5 rounded-xl border border-white/10 shrink-0">
            <button
              onClick={() => {
                soundManager.playClick();
                setMode('challenge');
                setIsPlaying(false);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all font-cairo ${
                mode === 'challenge'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              🏆 تحدي الدان دان
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setMode('freeplay');
                setIsPlaying(false);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all font-cairo ${
                mode === 'freeplay'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              🎵 عزف حر
            </button>
          </div>
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-emerald-700/60 shadow-xl text-white relative overflow-hidden">
        {/* HUD Bar (Score & Combo) */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-xl text-center">
              <span className="text-xs text-slate-400 block font-tajawal">النقاط</span>
              <span className="text-2xl font-black text-amber-400 font-mono tabular-nums">
                {score}
              </span>
            </div>

            {combo > 1 && (
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 px-3 py-1.5 rounded-xl animate-bounce">
                <Flame className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-bold text-amber-300 font-cairo">
                  {combo} متتالي!
                </span>
              </div>
            )}
          </div>

          {/* Feedback Flash Text */}
          {feedback && (
            <div
              key={feedback.id}
              className={`text-lg sm:text-xl font-bold font-cairo animate-fade-in ${feedback.color}`}
            >
              {feedback.text}
            </div>
          )}

          {/* Action Button */}
          {mode === 'challenge' && (
            <div>
              {!isPlaying ? (
                <button
                  onClick={startChallenge}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-cairo rounded-xl transition-all shadow-md active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{gameFinished ? 'إعادة التحدي' : 'ابدأ التحدي'}</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsPlaying(false)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إلغاء</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Falling Notes Rhythm Track */}
        {mode === 'challenge' && (
          <div className="relative h-44 bg-slate-950/70 rounded-2xl border border-slate-800 mb-8 overflow-hidden">
            {/* Visual Tracks: Left for Doum, Right for Tek */}
            <div className="absolute inset-0 grid grid-cols-2 divide-x divide-slate-800 pointer-events-none">
              <div className="flex items-center justify-center opacity-10 text-emerald-400 font-black text-5xl">
                دوم
              </div>
              <div className="flex items-center justify-center opacity-10 text-amber-400 font-black text-5xl">
                تك
              </div>
            </div>

            {/* Target Strike Zone Bar */}
            <div className="absolute bottom-4 left-4 right-4 h-12 border-2 border-dashed border-emerald-400/60 rounded-xl bg-emerald-950/30 flex items-center justify-around pointer-events-none">
              <span className="text-xs font-bold text-emerald-400 font-cairo bg-emerald-950/80 px-2 py-0.5 rounded-md">
                🎯 منطقة النقر (دوم)
              </span>
              <span className="text-xs font-bold text-amber-400 font-cairo bg-amber-950/80 px-2 py-0.5 rounded-md">
                🎯 منطقة النقر (تك)
              </span>
            </div>

            {/* Active Moving Beat Notes */}
            {notes.map((note) => {
              const timeDiff = note.targetTime - gameTime;
              // Map timeDiff: from 2000ms (top: 0%) to 0ms (target line: bottom ~80%)
              const progress = 1 - timeDiff / 1800;
              const topPercent = Math.max(0, Math.min(100, progress * 80));

              // If note is too far in future or past
              if (timeDiff > 1800 || timeDiff < -400) return null;

              const isLeft = note.type === 'doum';

              return (
                <div
                  key={note.id}
                  style={{
                    top: `${topPercent}%`,
                    left: isLeft ? '20%' : '70%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`absolute px-4 py-1.5 rounded-xl font-bold font-cairo text-sm shadow-lg transition-transform ${
                    note.hit === 'perfect'
                      ? 'bg-amber-400 text-slate-950 scale-125 opacity-0 duration-300'
                      : note.hit === 'great'
                      ? 'bg-emerald-400 text-slate-950 scale-110 opacity-0 duration-300'
                      : note.hit === 'miss'
                      ? 'bg-rose-500/40 text-slate-400 scale-75 opacity-20'
                      : isLeft
                      ? 'bg-emerald-600 text-white border-2 border-emerald-300 shadow-emerald-500/40'
                      : 'bg-amber-600 text-white border-2 border-amber-300 shadow-amber-500/40'
                  }`}
                >
                  {note.label}
                </div>
              );
            })}
          </div>
        )}

        {/* Freeplay or Challenge Prompt */}
        {mode === 'freeplay' && (
          <div className="text-center py-4 mb-4 bg-emerald-950/40 border border-emerald-700/50 rounded-2xl">
            <p className="text-emerald-300 font-cairo font-bold text-base">
              🎵 وضع العزف التراثي الحر
            </p>
            <p className="text-xs text-slate-400 font-tajawal mt-1">
              استمتع بالنقر على طبل الرحماني (دوم) والمرواس (تك) لتأليف إيقاع فن البرعة العماني!
            </p>
          </div>
        )}

        {/* Interactive Drums Hit Pads */}
        <div className="grid grid-cols-2 gap-4 sm:gap-8 max-w-lg mx-auto">
          {/* Doum Drum Pad (Right in Arabic RTL view or Left) */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => handleHit('doum')}
              className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 transition-all duration-100 flex flex-col items-center justify-center relative select-none shadow-2xl active:scale-95 cursor-pointer ${
                doumActive
                  ? 'bg-emerald-500 border-amber-300 scale-95 shadow-emerald-400/80 ring-4 ring-emerald-300'
                  : 'bg-gradient-to-b from-emerald-700 to-teal-900 border-emerald-400/80 hover:border-emerald-300 hover:scale-102'
              }`}
            >
              <div className="w-24 h-24 sm:w-30 sm:h-30 rounded-full border-2 border-dashed border-emerald-300/40 flex flex-col items-center justify-center bg-emerald-800/40">
                <span className="text-2xl sm:text-3xl font-black font-cairo text-white">
                  دُومْ
                </span>
                <span className="text-2xs text-emerald-200 font-tajawal mt-0.5">
                  طبل الرحماني
                </span>
              </div>
            </button>
            <span className="mt-3 text-xs text-slate-400 font-tajawal">
              زر [D] أو [سهم يمين]
            </span>
          </div>

          {/* Tek Drum Pad */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => handleHit('tek')}
              className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 transition-all duration-100 flex flex-col items-center justify-center relative select-none shadow-2xl active:scale-95 cursor-pointer ${
                tekActive
                  ? 'bg-amber-500 border-white scale-95 shadow-amber-400/80 ring-4 ring-amber-300'
                  : 'bg-gradient-to-b from-amber-600 to-orange-900 border-amber-400/80 hover:border-amber-300 hover:scale-102'
              }`}
            >
              <div className="w-24 h-24 sm:w-30 sm:h-30 rounded-full border-2 border-dashed border-amber-300/40 flex flex-col items-center justify-center bg-amber-800/40">
                <span className="text-2xl sm:text-3xl font-black font-cairo text-white">
                  تَكْ
                </span>
                <span className="text-2xs text-amber-200 font-tajawal mt-0.5">
                  طبل المِرواس
                </span>
              </div>
            </button>
            <span className="mt-3 text-xs text-slate-400 font-tajawal">
              زر [K] أو [سهم يسار]
            </span>
          </div>
        </div>

        {/* Victory / Round Finish Modal */}
        {gameFinished && (
          <div className="mt-8 p-6 bg-emerald-950/80 border-2 border-emerald-400 rounded-2xl text-center space-y-3 animate-fade-in">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-2xl font-bold">
              👑
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold font-cairo text-white">
              عظيم! أتممت إيقاع الدان دان بنجاح!
            </h3>
            <p className="text-emerald-200 text-sm font-tajawal">
              مجموع النقاط: <strong className="text-amber-400 font-mono">{score}</strong> · أعلى سلسلة: <strong className="text-amber-400">{maxCombo}</strong>
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={startChallenge}
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold font-cairo rounded-xl transition-all shadow-md"
              >
                العب مرة أخرى
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
