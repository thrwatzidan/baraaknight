import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, RotateCcw, Check, CheckCircle2, Shuffle, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VERSES, Verse } from '../../data/poemData';
import { soundManager } from '../../utils/soundEffects';

interface VersePuzzleGameProps {
  onEarnScore: (points: number) => void;
  onEarnStar: () => void;
  onUnlockAchievement: (id: string) => void;
}

export const VersePuzzleGame: React.FC<VersePuzzleGameProps> = ({
  onEarnScore,
  onEarnStar,
  onUnlockAchievement,
}) => {
  const [selectedSadr, setSelectedSadr] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [shuffledAjuzList, setShuffledAjuzList] = useState<{ id: number; ajuz: string }[]>([]);
  const [shuffledSadrList, setShuffledSadrList] = useState<Verse[]>([]);
  const [score, setScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [wrongPairAnimation, setWrongPairAnimation] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const initGame = () => {
    const sadrShuffled = [...VERSES].sort(() => 0.5 - Math.random());
    const ajuzShuffled = [...VERSES]
      .map((v) => ({ id: v.id, ajuz: v.ajuz }))
      .sort(() => 0.5 - Math.random());

    setShuffledSadrList(sadrShuffled);
    setShuffledAjuzList(ajuzShuffled);
    setSelectedSadr(null);
    setMatchedPairs([]);
    setScore(0);
    setAttempts(0);
    setIsCompleted(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleSelectSadr = (id: number) => {
    if (matchedPairs.includes(id)) return;
    soundManager.playClick();
    setSelectedSadr(id);
  };

  const handleSelectAjuz = (ajuzId: number) => {
    if (matchedPairs.includes(ajuzId) || selectedSadr === null) return;

    setAttempts((prev) => prev + 1);

    if (selectedSadr === ajuzId) {
      // Correct Match!
      soundManager.playCorrect();
      const nextMatched = [...matchedPairs, ajuzId];
      setMatchedPairs(nextMatched);
      setSelectedSadr(null);

      const addedPoints = 40;
      setScore((prev) => prev + addedPoints);
      onEarnScore(addedPoints);

      // Check if all 7 verses are matched
      if (nextMatched.length === VERSES.length) {
        setIsCompleted(true);
        soundManager.playFanfare();
        onEarnStar();
        onUnlockAchievement('verse_architect');
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.5 },
        });
      }
    } else {
      // Wrong Match
      soundManager.playWrong();
      setWrongPairAnimation(ajuzId);
      setTimeout(() => {
        setWrongPairAnimation(null);
        setSelectedSadr(null);
      }, 500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-amber-900 text-white rounded-2xl p-6 shadow-lg text-right relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-amber-950 font-bold text-xs rounded-full mb-2 font-cairo">
              <Layers className="w-3.5 h-3.5" />
              <span>هندسة وبناء القصيدة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-cairo">
              تحدي تركيب شطري البيت 🧩
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm font-tajawal mt-1">
              اختر الشطر الأول (الصدر) ثم اضغط على الشطر المكمل له (العجز) لتكتمل أبيات النشيد!
            </p>
          </div>

          <div className="flex items-center gap-4 bg-black/25 px-4 py-2 rounded-2xl border border-white/10 shrink-0">
            <div className="text-center">
              <span className="text-xs text-emerald-200 block font-tajawal">الأبيات المكتملة</span>
              <span className="text-xl font-black text-amber-300 font-mono">
                {matchedPairs.length} / {VERSES.length}
              </span>
            </div>
            <div className="h-6 w-px bg-white/20" />
            <div className="text-center">
              <span className="text-xs text-emerald-200 block font-tajawal">النقاط</span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                {score}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Matching Columns Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: الصدر (First Half) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
              <h3 className="font-bold font-cairo text-emerald-800 text-base flex items-center gap-2">
                <span>1️⃣ الشطر الأول (الصَّدْر)</span>
              </h3>
              <span className="text-xs text-slate-400 font-tajawal">انقر لاختيار الشطر</span>
            </div>

            {shuffledSadrList.map((verse) => {
              const isMatched = matchedPairs.includes(verse.id);
              const isSelected = selectedSadr === verse.id;

              return (
                <button
                  key={verse.id}
                  disabled={isMatched}
                  onClick={() => handleSelectSadr(verse.id)}
                  className={`w-full text-right p-4 rounded-xl border-2 transition-all font-amiri text-lg font-bold flex items-center justify-between gap-3 ${
                    isMatched
                      ? 'bg-emerald-50/70 border-emerald-400 text-emerald-900 opacity-60'
                      : isSelected
                      ? 'bg-amber-100 border-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400'
                      : 'bg-white hover:bg-emerald-50/40 border-slate-200 text-slate-800 hover:border-emerald-300'
                  }`}
                >
                  <span>{verse.sadr}</span>
                  {isMatched && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isSelected && (
                    <span className="text-xs font-cairo bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full shrink-0">
                      محدد
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Column 2: العجز (Second Half) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
              <h3 className="font-bold font-cairo text-emerald-800 text-base flex items-center gap-2">
                <span>2️⃣ الشطر الثاني (العَجُز)</span>
              </h3>
              <span className="text-xs text-slate-400 font-tajawal">اختر الشطر المتمم</span>
            </div>

            {shuffledAjuzList.map((item) => {
              const isMatched = matchedPairs.includes(item.id);
              const isWrong = wrongPairAnimation === item.id;

              return (
                <button
                  key={item.id}
                  disabled={isMatched || selectedSadr === null}
                  onClick={() => handleSelectAjuz(item.id)}
                  className={`w-full text-right p-4 rounded-xl border-2 transition-all font-amiri text-lg font-bold flex items-center justify-between gap-3 ${
                    isMatched
                      ? 'bg-emerald-50/70 border-emerald-400 text-emerald-900 opacity-60'
                      : isWrong
                      ? 'bg-rose-100 border-rose-500 text-rose-900 animate-shake'
                      : selectedSadr !== null
                      ? 'bg-amber-50/40 hover:bg-amber-100 border-amber-300 text-slate-900 cursor-pointer shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>{item.ajuz}</span>
                  {isMatched && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Completed Announcement */}
        {isCompleted && (
          <div className="mt-8 p-6 bg-emerald-50 border-2 border-emerald-400 rounded-2xl text-center space-y-3 animate-fade-in">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-2xl font-bold shadow-sm">
              🌟
            </div>
            <h4 className="text-2xl font-bold font-cairo text-emerald-950">
              مبارك! ركّبت جميع أبيات النشيد السبعة بنجاح باهر!
            </h4>
            <p className="text-slate-600 text-sm font-tajawal">
              عدد المحاولات: {attempts} · النقاط المكتسبة: {score}
            </p>
            <div className="pt-2">
              <button
                onClick={initGame}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-cairo rounded-xl transition-all shadow-md inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة اللعب والترتيب</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
