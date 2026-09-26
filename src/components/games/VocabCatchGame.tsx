import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Trophy, RotateCcw, Volume2, CheckCircle2, XCircle, Flame, Shield, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VOCABULARY_LIST, VocabularyWord } from '../../data/poemData';
import { soundManager } from '../../utils/soundEffects';

interface VocabCatchGameProps {
  onEarnScore: (points: number) => void;
  onEarnStar: () => void;
  onUnlockAchievement: (id: string) => void;
}

interface QuestionRound {
  targetWord: VocabularyWord;
  mode: 'word_to_meaning' | 'meaning_to_word';
  promptText: string;
  contextVerse: string;
  choices: string[];
  correctAnswer: string;
}

export const VocabCatchGame: React.FC<VocabCatchGameProps> = ({
  onEarnScore,
  onEarnStar,
  onUnlockAchievement,
}) => {
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [rounds, setRounds] = useState<QuestionRound[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [perfectRun, setPerfectRun] = useState<boolean>(true);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [timerProgress, setTimerProgress] = useState<number>(100);

  // Generate question rounds from VOCABULARY_LIST
  const generateRounds = useCallback(() => {
    const shuffledVocab = [...VOCABULARY_LIST].sort(() => 0.5 - Math.random());
    const generated: QuestionRound[] = shuffledVocab.map((item, index) => {
      // 50% word to meaning, 50% meaning to word
      const isWordToMeaning = index % 2 === 0;

      if (isWordToMeaning) {
        // Distractors from other meanings
        const otherMeanings = VOCABULARY_LIST.filter((v) => v.id !== item.id)
          .map((v) => v.meaning)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        const choices = [item.meaning, ...otherMeanings].sort(() => 0.5 - Math.random());

        return {
          targetWord: item,
          mode: 'word_to_meaning',
          promptText: `ما معنى كلمة «${item.word}» في النشيد؟`,
          contextVerse: `شاهد البيت: «${item.contextInPoem}»`,
          choices,
          correctAnswer: item.meaning,
        };
      } else {
        // Distractors from other words
        const otherWords = VOCABULARY_LIST.filter((v) => v.id !== item.id)
          .map((v) => v.word)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        const choices = [item.word, ...otherWords].sort(() => 0.5 - Math.random());

        return {
          targetWord: item,
          mode: 'meaning_to_word',
          promptText: `ما الكلمة التي تعني: «${item.meaning}»؟`,
          contextVerse: `تلميح من البيت: «${item.contextInPoem}»`,
          choices,
          correctAnswer: item.word,
        };
      }
    });

    setRounds(generated);
    setCurrentRoundIndex(0);
    setSelectedChoice(null);
    setIsAnswered(false);
    setScore(0);
    setCombo(0);
    setPerfectRun(true);
    setGameFinished(false);
    setTimerProgress(100);
  }, []);

  useEffect(() => {
    generateRounds();
  }, [generateRounds]);

  const currentRound = rounds[currentRoundIndex];

  // Timer countdown
  useEffect(() => {
    if (isAnswered || gameFinished || !currentRound) return;

    const interval = setInterval(() => {
      setTimerProgress((prev) => {
        if (prev <= 0) {
          // Time out - trigger wrong answer
          handleChoiceSelect('');
          return 0;
        }
        return prev - 2;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isAnswered, gameFinished, currentRound]);

  const handleChoiceSelect = (choice: string) => {
    if (isAnswered || !currentRound) return;

    setSelectedChoice(choice);
    setIsAnswered(true);

    const isCorrect = choice === currentRound.correctAnswer;

    if (isCorrect) {
      soundManager.playCorrect();
      const points = 50 + combo * 10 + Math.round(timerProgress / 3);
      const newCombo = combo + 1;
      setCombo(newCombo);
      setScore((prev) => prev + points);
      onEarnScore(points);

      if (newCombo % 3 === 0) {
        soundManager.playCombo(newCombo);
      }
    } else {
      soundManager.playWrong();
      setCombo(0);
      setPerfectRun(false);
    }
  };

  const handleNextRound = () => {
    soundManager.playClick();
    if (currentRoundIndex < rounds.length - 1) {
      setCurrentRoundIndex((prev) => prev + 1);
      setSelectedChoice(null);
      setIsAnswered(false);
      setTimerProgress(100);
    } else {
      setGameFinished(true);
      soundManager.playFanfare();
      onEarnStar();
      if (perfectRun) {
        onUnlockAchievement('vocab_master');
      }
      confetti({
        particleCount: 100,
        spread: 75,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white rounded-2xl p-6 shadow-lg text-right relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-amber-950 font-bold text-xs rounded-full mb-2 font-cairo">
              <Shield className="w-3.5 h-3.5" />
              <span>معجم النشيد المقرّر</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-cairo">
              صياد المفردات والمعاني 🎯
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm font-tajawal mt-1">
              اختر المعنى الصحيح أو الكلمة المطابقة قبل نفاد شريط الوقت لتحصد أوسمة الفرسان!
            </p>
          </div>

          <div className="flex items-center gap-3 bg-black/25 px-4 py-2 rounded-2xl border border-white/10 shrink-0">
            <div className="text-center">
              <span className="text-xs text-emerald-200 block font-tajawal">النقاط</span>
              <span className="text-xl font-black text-amber-300 font-mono tabular-nums">
                {score}
              </span>
            </div>
            {combo > 1 && (
              <>
                <div className="h-6 w-px bg-white/20" />
                <div className="flex items-center gap-1 text-amber-300 font-bold text-xs sm:text-sm font-cairo">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>{combo} متتالي!</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Game Card */}
      {!gameFinished && currentRound && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200 shadow-md text-right relative">
          {/* Progress & Round indicator */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 font-tajawal">
              السؤال {currentRoundIndex + 1} من {rounds.length}
            </span>
            <div className="flex items-center gap-1">
              {rounds.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentRoundIndex
                      ? 'bg-amber-500 scale-125'
                      : idx < currentRoundIndex
                      ? 'bg-emerald-600'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Timer Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-6">
            <div
              className={`h-full transition-all duration-200 ${
                timerProgress > 50
                  ? 'bg-emerald-500'
                  : timerProgress > 25
                  ? 'bg-amber-500'
                  : 'bg-rose-500 animate-pulse'
              }`}
              style={{ width: `${timerProgress}%` }}
            />
          </div>

          {/* Question Box */}
          <div className="bg-amber-50/70 border-2 border-amber-300/80 rounded-2xl p-5 mb-6 text-center space-y-2">
            <h3 className="text-xl sm:text-2xl font-black font-cairo text-slate-900 leading-snug">
              {currentRound.promptText}
            </h3>
            <p className="text-xs sm:text-sm font-amiri font-bold text-emerald-800 bg-white/70 py-1.5 px-3 rounded-xl inline-block border border-amber-200">
              {currentRound.contextVerse}
            </p>
            <div className="pt-1">
              <button
                onClick={() =>
                  soundManager.speakArabic(
                    currentRound.mode === 'word_to_meaning'
                      ? currentRound.targetWord.word
                      : currentRound.targetWord.meaning
                  )
                }
                className="text-xs font-bold text-slate-600 hover:text-emerald-700 inline-flex items-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>استمع للنطق</span>
              </button>
            </div>
          </div>

          {/* 4 Choices Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {currentRound.choices.map((choice, idx) => {
              const isSelected = selectedChoice === choice;
              const isCorrectChoice = choice === currentRound.correctAnswer;

              let btnStyle = 'bg-white hover:bg-emerald-50/60 border-slate-200 text-slate-800';
              if (isAnswered) {
                if (isCorrectChoice) {
                  btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-400';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-100 border-rose-500 text-rose-950';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleChoiceSelect(choice)}
                  className={`p-4 rounded-xl border-2 text-right transition-all flex items-center justify-between text-base font-tajawal cursor-pointer active:scale-98 ${btnStyle}`}
                >
                  <span className="font-semibold">{choice}</span>
                  {isAnswered && isCorrectChoice && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrectChoice && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box After Answering */}
          {isAnswered && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 text-xs sm:text-sm text-slate-700 animate-fade-in space-y-1">
              <p className="font-bold text-emerald-900 font-cairo">
                💡 شرح وإضاءة لغوية:
              </p>
              <p className="font-tajawal">
                {currentRound.targetWord.explanation}
              </p>
              <p className="text-2xs text-slate-500 font-tajawal mt-1">
                مثال في جملة: {currentRound.targetWord.exampleSentence}
              </p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="text-left">
              <button
                onClick={handleNextRound}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-cairo rounded-xl transition-all shadow-md active:scale-95 inline-flex items-center gap-2"
              >
                <span>{currentRoundIndex < rounds.length - 1 ? 'السؤال التالي' : 'عرض النتيجة'}</span>
                <span>←</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Completion Screen */}
      {gameFinished && (
        <div className="bg-white rounded-3xl p-8 border border-amber-200 shadow-xl text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-3xl shadow-sm">
            🏆
          </div>
          <h3 className="text-2xl sm:text-3xl font-black font-cairo text-slate-900">
            أحسنت يا بطل! أتقنت معاني النشيد!
          </h3>
          <p className="text-slate-600 text-sm font-tajawal max-w-md mx-auto">
            لقد أثبتّ فهمك لمعاني كلمات نشيد فن البرعة التراثي الجميل.
          </p>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 inline-block text-center px-8">
            <span className="text-xs text-amber-800 font-cairo block">النقاط الإجمالية</span>
            <span className="text-3xl font-black text-emerald-700 font-mono">{score}</span>
          </div>

          <div className="flex items-center justify-center gap-3 pt-3">
            <button
              onClick={generateRounds}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-cairo rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>العب جولة جديدة</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
