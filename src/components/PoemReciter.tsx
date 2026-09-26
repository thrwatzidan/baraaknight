import React, { useState, useEffect } from 'react';
import { Volume2, Play, Pause, RotateCcw, Sparkles, BookOpen, Music, CheckCircle } from 'lucide-react';
import { POEM_INFO, VERSES, VOCABULARY_LIST, Verse } from '../data/poemData';
import { soundManager } from '../utils/soundEffects';

interface PoemReciterProps {
  onEarnScore: (points: number) => void;
}

export const PoemReciter: React.FC<PoemReciterProps> = ({ onEarnScore }) => {
  const [activeVerseIndex, setActiveVerseIndex] = useState<number | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState<boolean>(false);
  const [selectedWord, setSelectedWord] = useState<{ word: string; meaning: string } | null>(null);
  const [completedRecitation, setCompletedRecitation] = useState<boolean>(false);

  // Auto playback loop for reciting whole poem
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingAll) {
      if (activeVerseIndex === null) {
        setActiveVerseIndex(0);
        const verse = VERSES[0];
        soundManager.speakArabic(`${verse.sadr} ... ${verse.ajuz}`);
      } else if (activeVerseIndex < VERSES.length - 1) {
        timer = setTimeout(() => {
          const nextIndex = activeVerseIndex + 1;
          setActiveVerseIndex(nextIndex);
          const verse = VERSES[nextIndex];
          soundManager.speakArabic(`${verse.sadr} ... ${verse.ajuz}`);
        }, 5000);
      } else {
        timer = setTimeout(() => {
          soundManager.speakArabic(`${POEM_INFO.chorus} ... كلمات: ${POEM_INFO.poet}`);
          setIsPlayingAll(false);
          setActiveVerseIndex(null);
          setCompletedRecitation(true);
          soundManager.playFanfare();
          onEarnScore(100);
        }, 5500);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlayingAll, activeVerseIndex, onEarnScore]);

  const handlePlaySingle = (index: number) => {
    setIsPlayingAll(false);
    setActiveVerseIndex(index);
    const verse = VERSES[index];
    soundManager.speakArabic(`${verse.sadr} ... ${verse.ajuz}`);
  };

  const handleTogglePlayAll = () => {
    if (isPlayingAll) {
      soundManager.stopSpeaking();
      setIsPlayingAll(false);
      setActiveVerseIndex(null);
    } else {
      setActiveVerseIndex(0);
      setIsPlayingAll(true);
      const verse = VERSES[0];
      soundManager.speakArabic(`نشيد نبت الحق عليها مزهرا من فن البرعة .. ${verse.sadr} ... ${verse.ajuz}`);
    }
  };

  const handleWordClick = (wordText: string) => {
    soundManager.playClick();
    const matched = VOCABULARY_LIST.find((v) => wordText.includes(v.word) || v.word.includes(wordText));
    if (matched) {
      setSelectedWord({ word: matched.word, meaning: matched.meaning });
      soundManager.speakArabic(`${matched.word} .. تعني ${matched.meaning}`);
    } else {
      setSelectedWord(null);
      soundManager.speakArabic(wordText);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Header Card */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden text-right">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-right">
            <span className="inline-block px-3 py-1 bg-amber-400 text-amber-950 font-bold text-xs rounded-full shadow-2xs font-cairo">
              📖 قاعة الاستماع والإنشاد التعليمي
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-cairo tracking-tight">
              {POEM_INFO.title}
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm font-tajawal max-w-xl">
              استمع إلى قراءة النشيد بيتاً بيتاً بصوت واضح، واضغط على أي كلمة لاكتشاف معناها وشرحها الأدبي البديع.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleTogglePlayAll}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold font-cairo text-sm transition-all shadow-md active:scale-95 ${
                isPlayingAll
                  ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                  : 'bg-amber-400 hover:bg-amber-300 text-amber-950'
              }`}
            >
              {isPlayingAll ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>إيقاف القراءة</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>استمع للنشيد كاملاً</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                soundManager.stopSpeaking();
                setIsPlayingAll(false);
                setActiveVerseIndex(null);
                soundManager.playDrumDoum();
              }}
              title="إعادة ضبط"
              className="p-3 bg-white/15 hover:bg-white/25 text-white rounded-xl transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Selected Word Meaning Bubble Notification */}
      {selectedWord && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm animate-bounce-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-lg font-cairo">
              💡
            </div>
            <div>
              <span className="text-xs text-amber-800 font-bold block font-cairo">
                معنى الكلمة من معجم النشيد:
              </span>
              <p className="text-sm sm:text-base font-bold text-slate-900 font-tajawal">
                <span className="text-emerald-800 font-cairo underline decoration-amber-400">
                  {selectedWord.word}
                </span>
                : {selectedWord.meaning}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedWord(null)}
            className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 bg-amber-200/60 rounded-md"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Completion Bonus Notification */}
      {completedRecitation && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold font-cairo text-base">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>أحسنت! استمعت إلى كامل النشيد وكسبت 100 نقطة! 🌟</span>
          </div>
        </div>
      )}

      {/* Dan Dan Mawwal Header Card */}
      <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-xs text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 rounded-full text-amber-800 text-xs font-bold font-cairo">
          <Music className="w-3.5 h-3.5" />
          <span>الافتتاحية التراثية (موال الدان دان)</span>
        </div>
        <p className="font-amiri text-lg sm:text-2xl font-bold text-emerald-900 tracking-wide">
          {POEM_INFO.dandanIntro}
        </p>
        <p className="font-amiri text-xl sm:text-2xl font-bold text-emerald-700">
          {POEM_INFO.chorus}
        </p>
        <div className="pt-2">
          <button
            onClick={() => {
              soundManager.playDrumDoum();
              setTimeout(() => soundManager.playDrumTek(), 300);
              soundManager.speakArabic("دان يا دانا لدان دان دين ... نبت الحق عليها مزهرا");
            }}
            className="px-4 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors inline-flex items-center gap-1.5 font-cairo"
          >
            <Volume2 className="w-4 h-4" />
            <span>نطق الموال</span>
          </button>
        </div>
      </div>

      {/* The 7 Verses Interactive Board */}
      <div className="space-y-3">
        {VERSES.map((verse, index) => {
          const isActive = activeVerseIndex === index;
          return (
            <div
              key={verse.id}
              className={`rounded-2xl p-4 sm:p-5 border transition-all duration-300 ${
                isActive
                  ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-400/40 -translate-y-0.5'
                  : 'bg-white border-slate-200/80 hover:border-emerald-300 hover:shadow-xs'
              }`}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-right">
                {/* Verse Number & Play Button */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={() => handlePlaySingle(index)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-amber-100 hover:bg-emerald-100 text-emerald-800'
                    }`}
                    title="استمع لهذا البيت"
                  >
                    {isActive ? <Volume2 className="w-4 h-4 animate-pulse" /> : verse.id}
                  </button>

                  {/* Sadr (First Half) */}
                  <div className="flex-1 md:flex-initial">
                    <p className="font-amiri text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
                      {verse.sadr}
                    </p>
                  </div>
                </div>

                {/* Decorative Separator */}
                <div className="text-amber-400 font-bold text-base hidden md:block">
                  ❖
                </div>

                {/* Ajuz (Second Half) */}
                <div className="w-full md:w-auto text-left md:text-right">
                  <p className="font-amiri text-lg sm:text-xl font-bold text-slate-800 leading-relaxed">
                    {verse.ajuz}
                  </p>
                </div>
              </div>

              {/* Verse Details / Meaning & Vocabulary Tags */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <p className="text-slate-600 font-tajawal">
                  <strong className="text-emerald-800 font-cairo">المعنى: </strong>
                  {verse.meaning}
                </p>

                {/* Highlighted Words clickable */}
                <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                  <span className="text-slate-400 text-xs">كلمات مميزة:</span>
                  {verse.keywords.map((kw, ki) => (
                    <button
                      key={ki}
                      onClick={() => handleWordClick(kw)}
                      className="px-2 py-0.5 rounded-md bg-amber-100/70 hover:bg-amber-200 text-amber-900 font-cairo text-xs font-semibold transition-colors"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Poet & Artwork Info Footer */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 text-right flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold font-cairo text-emerald-900 text-sm sm:text-base">
            الشاعر: {POEM_INFO.poet}
          </h4>
          <p className="text-xs text-slate-600 font-tajawal mt-1">
            {POEM_INFO.aboutPoet}
          </p>
        </div>
        <div className="shrink-0">
          <span className="inline-block px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold font-cairo rounded-xl border border-emerald-300/50">
            تراث اليونسكو 2010 🇴🇲
          </span>
        </div>
      </div>
    </div>
  );
};
