import React from 'react';
import { X, Volume2, Bookmark, Info, Sparkles } from 'lucide-react';
import { POEM_INFO, VERSES, VOCABULARY_LIST } from '../data/poemData';
import { soundManager } from '../utils/soundEffects';

interface PoemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PoemModal: React.FC<PoemModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-amber-50/95 border-2 border-emerald-700/60 rounded-2xl shadow-2xl p-4 sm:p-6 my-8 text-right overflow-hidden"
        style={{
          boxShadow: '0 20px 40px -15px rgba(6, 78, 59, 0.3)'
        }}
      >
        {/* Decorative Omani border corner accents */}
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-emerald-700 pointer-events-none" />
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-emerald-700 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-emerald-700 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-emerald-700 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 left-4 p-1.5 rounded-full bg-amber-200/60 hover:bg-rose-100 text-slate-700 hover:text-rose-600 transition-colors"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title Box matching textbook image */}
        <div className="text-center pb-4 mb-4 border-b-2 border-emerald-600/30">
          <div className="inline-block px-6 py-2 border-2 border-emerald-700/80 rounded-xl bg-emerald-50 shadow-2xs mb-2">
            <h2 className="text-xl sm:text-2xl font-bold font-cairo text-emerald-800">
              {POEM_INFO.title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-emerald-700 font-medium font-tajawal">
            تراث عُماني خالد · أداء فن البرعة بالسيف والخنجر
          </p>
        </div>

        {/* Poem Sheet Card Frame (like the green border in image) */}
        <div className="p-4 sm:p-6 rounded-xl border-2 border-emerald-700/40 bg-white/70 shadow-inner mb-6">
          {/* Dan Dan Mawwal Opening */}
          <div className="text-center py-2 mb-4 bg-amber-100/60 rounded-lg border border-amber-300/40">
            <p className="font-amiri text-base sm:text-lg text-emerald-950 font-bold tracking-wide">
              {POEM_INFO.dandanIntro}
            </p>
            <p className="font-amiri text-lg sm:text-xl font-bold text-emerald-700 mt-1">
              {POEM_INFO.chorus}
            </p>
            <button
              onClick={() => soundManager.speakArabic("دان يا دانا لدان دان دين . نبت الحق عليها مزهرا")}
              className="mt-2 inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-full transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              استمع للمقطع
            </button>
          </div>

          {/* Verses Table */}
          <div className="space-y-3 sm:space-y-4 my-4">
            {VERSES.map((verse) => (
              <div 
                key={verse.id}
                className="group p-2.5 rounded-lg hover:bg-emerald-50/70 border border-transparent hover:border-emerald-200 transition-all flex flex-col md:flex-row items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">
                    {verse.id}
                  </span>
                  <p className="font-amiri text-base sm:text-lg font-bold text-slate-800">
                    {verse.sadr}
                  </p>
                </div>
                
                <span className="text-emerald-400 font-bold text-sm hidden md:inline">···</span>

                <div className="flex items-center justify-between w-full md:w-auto gap-3">
                  <p className="font-amiri text-base sm:text-lg font-bold text-slate-800">
                    {verse.ajuz}
                  </p>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      soundManager.speakArabic(`${verse.sadr} .. ${verse.ajuz}`);
                    }}
                    title="استمع للبيت"
                    className="p-1 rounded-full text-slate-400 hover:text-emerald-700 hover:bg-emerald-100 transition-colors shrink-0"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Concluding Refrain */}
          <div className="text-center py-2 mt-4 border-t border-emerald-600/30">
            <p className="font-amiri text-lg font-bold text-emerald-800">
              {POEM_INFO.chorus}
            </p>
            <p className="text-rose-600 font-bold text-xs sm:text-sm font-cairo mt-1">
              كلمات: {POEM_INFO.poet}
            </p>
          </div>
        </div>

        {/* Vocabulary Box (matching the lower right section of textbook image) */}
        <div className="rounded-xl border border-emerald-600/30 bg-white/90 p-4">
          <div className="flex items-center justify-between mb-3 border-b border-emerald-100 pb-2">
            <div className="flex items-center gap-2 text-emerald-800">
              <Bookmark className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold font-cairo text-base sm:text-lg">
                معاني الكلمات (المقررة في النشيد)
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-tajawal">
              اضغط على أي كلمة للاستماع لنطقها
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
            {VOCABULARY_LIST.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  soundManager.playClick();
                  soundManager.speakArabic(`${item.word} .. تعني: ${item.meaning}`);
                }}
                className="cursor-pointer p-2 rounded-lg bg-amber-50/60 hover:bg-emerald-50 border border-amber-200/50 hover:border-emerald-300 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-700 font-cairo">
                    {item.id}- {item.word}:
                  </span>
                  <span className="text-slate-800 font-tajawal font-medium">
                    {item.meaning}
                  </span>
                </div>
                <Volume2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Heritage Info Note */}
        <div className="mt-4 p-3 bg-amber-100/50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p>
            <strong>فن البرعة:</strong> تراث أصيل يُؤدى بخفة ورشاقة متناهية وانسجام بين المؤديين رافعين الخنجر العماني، والنشيد تعبير صادق عن الولاء لعُمان وقائدها الهمام جلالة السلطان هيثم بن طارق المعظم، واستعداد شباب الوطن للجد والعمل دون كسل.
          </p>
        </div>
      </div>
    </div>
  );
};
