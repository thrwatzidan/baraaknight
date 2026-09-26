import React, { useState } from 'react';
import { Sparkles, Trophy, RotateCcw, CheckCircle2, XCircle, Volume2, Compass, Flag } from 'lucide-react';
import confetti from 'canvas-confetti';
import { COMPREHENSION_QUIZ, QuizQuestion } from '../../data/poemData';
import { soundManager } from '../../utils/soundEffects';

interface KnightQuizGameProps {
  onEarnScore: (points: number) => void;
  onEarnStar: () => void;
  onUnlockAchievement: (id: string) => void;
}

export const KnightQuizGame: React.FC<KnightQuizGameProps> = ({
  onEarnScore,
  onEarnStar,
  onUnlockAchievement,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const question = COMPREHENSION_QUIZ[currentIdx];
  const totalQuestions = COMPREHENSION_QUIZ.length;
  // Knight progress percentage towards the summit (هام الذرى)
  const summitProgress = Math.round((currentIdx / totalQuestions) * 100);

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    const isCorrect = idx === question.correctIndex;
    if (isCorrect) {
      soundManager.playCorrect();
      setCorrectCount((prev) => prev + 1);
      const points = 50;
      setScore((prev) => prev + points);
      onEarnScore(points);
    } else {
      soundManager.playWrong();
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      soundManager.playFanfare();
      onEarnStar();
      if (correctCount >= 6) {
        onUnlockAchievement('speed_runner');
      }
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setCorrectCount(0);
    setIsFinished(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-amber-900 text-white rounded-2xl p-6 shadow-lg text-right relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-amber-950 font-bold text-xs rounded-full mb-2 font-cairo">
              <Compass className="w-3.5 h-3.5" />
              <span>وامْتَطَيْنا صَهْوَةَ المَجْدِ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-cairo">
              سباق صهوة المجد 🐎
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm font-tajawal mt-1">
              أجب عن أسئلة الفهم والمعاني ليمتطي فارسك صهوة المجد ويصل إلى قمة هام الذرى!
            </p>
          </div>

          <div className="flex items-center gap-4 bg-black/25 px-4 py-2 rounded-2xl border border-white/10 shrink-0">
            <div className="text-center">
              <span className="text-xs text-emerald-200 block font-tajawal">النقاط</span>
              <span className="text-xl font-black text-amber-300 font-mono tabular-nums">
                {score}
              </span>
            </div>
            <div className="h-6 w-px bg-white/20" />
            <div className="text-center">
              <span className="text-xs text-emerald-200 block font-tajawal">الصحيحة</span>
              <span className="text-xl font-black text-emerald-400 font-mono tabular-nums">
                {correctCount} / {totalQuestions}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Knight Mountain Summit Progress Track */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-xs text-right">
        <div className="flex items-center justify-between text-xs font-bold font-cairo text-slate-600 mb-2">
          <span>بداية المسير (الثَّرَى) 🌾</span>
          <span className="text-emerald-700">قمة المجد (هَام الذُّرَى) 🏔️</span>
        </div>

        <div className="relative h-6 bg-amber-100 rounded-full overflow-visible border border-amber-300">
          {/* Progress fill */}
          <div
            className="h-full bg-gradient-to-l from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
            style={{ width: `${summitProgress}%` }}
          />

          {/* Knight Avatar */}
          <div
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-500 flex items-center justify-center"
            style={{ right: `${summitProgress}%`, transform: 'translate(50%, -50%)' }}
          >
            <div className="w-9 h-9 rounded-full bg-amber-400 border-2 border-white shadow-md flex items-center justify-center text-lg">
              🏇
            </div>
          </div>

          {/* Summit Flag */}
          <div className="absolute top-1/2 left-2 -translate-y-1/2 flex items-center gap-1">
            <Flag className="w-4 h-4 text-emerald-800" />
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      {!isFinished && question && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-md text-right">
          {/* Question Index */}
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-500 font-tajawal">
              السؤال {currentIdx + 1} من {totalQuestions}
            </span>
            <span className="text-xs font-bold text-emerald-700 font-cairo">
              +50 نقطة للإجابة الصحيحة
            </span>
          </div>

          {/* Question Text */}
          <div className="my-4">
            <h3 className="text-xl sm:text-2xl font-bold font-cairo text-slate-900 leading-snug">
              {question.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3 my-6">
            {question.options.map((opt, idx) => {
              const isSelected = selectedOpt === idx;
              const isCorrectOpt = idx === question.correctIndex;

              let style = 'bg-white hover:bg-emerald-50/50 border-slate-200 text-slate-800';
              if (isAnswered) {
                if (isCorrectOpt) {
                  style = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-400';
                } else if (isSelected) {
                  style = 'bg-rose-100 border-rose-500 text-rose-950';
                } else {
                  style = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-xl border-2 text-right transition-all flex items-center justify-between font-tajawal text-base font-semibold cursor-pointer active:scale-98 ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold font-cairo flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswered && isCorrectOpt && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrectOpt && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {isAnswered && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 mb-4 text-xs sm:text-sm text-slate-700 space-y-1 animate-fade-in">
              <strong className="text-amber-900 font-cairo block">
                💡 التوضيح والفائدة:
              </strong>
              <p className="font-tajawal">{question.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="text-left">
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-cairo rounded-xl transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>{currentIdx < totalQuestions - 1 ? 'السؤال التالي' : 'إعلان النتيجة'}</span>
                <span>←</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Finished Summary */}
      {isFinished && (
        <div className="bg-white rounded-3xl p-8 border border-amber-200 shadow-xl text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-3xl shadow-sm">
            🏔️
          </div>
          <h3 className="text-2xl sm:text-3xl font-black font-cairo text-slate-900">
            وصلت إلى هام الذرى وامتطيت صهوة المجد!
          </h3>
          <p className="text-slate-600 text-sm font-tajawal max-w-md mx-auto">
            أجبت عن <strong className="text-emerald-700">{correctCount}</strong> من أصل{' '}
            <strong className="text-slate-900">{totalQuestions}</strong> أسئلة بصورة صحيحة.
          </p>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 inline-block text-center px-8">
            <span className="text-xs text-emerald-800 font-cairo block">مجموع النقاط</span>
            <span className="text-3xl font-black text-emerald-700 font-mono">{score}</span>
          </div>

          <div className="pt-2">
            <button
              onClick={handleRestart}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-cairo rounded-xl transition-all shadow-md inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة السباق</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
