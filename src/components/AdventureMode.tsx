import React from 'react';
import { Sparkles, Trophy, Play, CheckCircle2, Lock, Star, ShieldCheck, MapPin } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface AdventureModeProps {
  onSelectGame: (tab: 'rhythm' | 'vocab' | 'puzzle' | 'memory' | 'quiz' | 'poem') => void;
  unlockedLevel: number; // 1 to 5
  levelStars: Record<number, number>; // levelId -> stars
  score: number;
  totalStars: number;
}

interface LevelInfo {
  id: number;
  title: string;
  subtitle: string;
  gameTab: 'rhythm' | 'vocab' | 'puzzle' | 'memory' | 'quiz';
  icon: string;
  badge: string;
  description: string;
}

const LEVELS: LevelInfo[] = [
  {
    id: 1,
    title: 'إيقاع الدان دان التراثي',
    subtitle: 'فن البرعة والطبول العمانية',
    gameTab: 'rhythm',
    icon: '🥁',
    badge: 'طبل المرواس والرحماني',
    description: 'تعلم وزن وإيقاع فن البرعة العماني الشهير «دان يا دانا لدان دان دين» بالنقر المتناغم.',
  },
  {
    id: 2,
    title: 'صياد معاني الكلمات المقررة',
    subtitle: 'معجم النشيد الثمانية',
    gameTab: 'vocab',
    icon: '🎯',
    badge: 'فارس المفردات',
    description: 'اختبر فهمك لمعاني كلمات النشيد (الثرى، الكرى، عاف، حداها، هيام، السرى، الذرى، جد بالركب).',
  },
  {
    id: 3,
    title: 'بنّاء أبيات النشيد',
    subtitle: 'مطابقة الصدر بالعجز',
    gameTab: 'puzzle',
    icon: '🧩',
    badge: 'مهندس القصيدة',
    description: 'طابق الشطر الأول من كل بيت مع شطره الثاني ليكتمل بنيان القصيدة الشامخ.',
  },
  {
    id: 4,
    title: 'تحدي بطاقات الذاكرة',
    subtitle: 'تطابق سريع للذاكرة الذكية',
    gameTab: 'memory',
    icon: '🃏',
    badge: 'الذاكرة البرعاوية',
    description: 'اقلب البطاقات وطابق الكلمات بمعانيها بأسرع وقت وأقل عدد من الحركات.',
  },
  {
    id: 5,
    title: 'سباق صهوة المجد والتتويج',
    subtitle: 'الوصول إلى قمة هام الذرى',
    gameTab: 'quiz',
    icon: '🐎',
    badge: 'بطل عُمان المتوج',
    description: 'أجب عن أسئلة الفهم والشاعر علي المعشني لتصل إلى أعلى قمم الذرى وتتوج بالوسام الأعظم!',
  },
];

export const AdventureMode: React.FC<AdventureModeProps> = ({
  onSelectGame,
  unlockedLevel,
  levelStars,
  score,
  totalStars,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-amber-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl text-right relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400 text-amber-950 text-xs font-bold font-cairo rounded-full shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>مغامرة تعليمية تفاعلية للطلاب</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-cairo tracking-tight">
              خريطة فرسان البرعة: نَبَتَ الحَقُّ مُزْهِراً 🇴🇲
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm font-tajawal max-w-xl leading-relaxed">
              مرحباً بك يا بطل! انطلق في رحلة مشوقة عبر 5 محطات تفاعلية لتتعلم فن البرعة وتتقن معاني النشيد وأبياته، وتجمع الأوسمة والنجوم الذهبية!
            </p>
          </div>

          {/* Knight Mascot Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 shrink-0 shadow-lg text-right">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 border-2 border-white flex items-center justify-center text-3xl shadow-md animate-bounce-gentle">
              🤺
            </div>
            <div>
              <span className="text-xs text-amber-300 font-bold font-cairo block">
                الفارس الصغير سالم يقول:
              </span>
              <p className="text-xs font-tajawal text-white max-w-44 leading-snug">
                «كلنا جندٌ على هذا الثرى.. هيا بنا نبدأ التحدي!»
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs text-center">
          <span className="text-xs text-slate-500 font-tajawal block">مجموع النجوم</span>
          <div className="text-xl sm:text-2xl font-black text-amber-600 font-cairo mt-0.5">
            ⭐ {totalStars} / 15
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs text-center">
          <span className="text-xs text-slate-500 font-tajawal block">رصيد النقاط</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 font-cairo mt-0.5">
            🏆 {score}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs text-center">
          <span className="text-xs text-slate-500 font-tajawal block">المراحل المفتوحة</span>
          <div className="text-xl sm:text-2xl font-black text-slate-800 font-cairo mt-0.5">
            🚩 {Math.min(unlockedLevel, 5)} / 5
          </div>
        </div>
      </div>

      {/* The 5 Progressive Quest Stages Map */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-bold font-cairo text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-700" />
            <span>محطات مسيرة المجد</span>
          </h3>
          <span className="text-xs text-slate-500 font-tajawal">
            أكمل كل مرحلة لفتح المرحلة التالية
          </span>
        </div>

        <div className="space-y-3">
          {LEVELS.map((level) => {
            const isUnlocked = level.id <= unlockedLevel;
            const stars = levelStars[level.id] || 0;

            return (
              <div
                key={level.id}
                className={`relative rounded-3xl p-5 border-2 transition-all text-right flex flex-col md:flex-row items-center justify-between gap-4 ${
                  isUnlocked
                    ? 'bg-white hover:bg-emerald-50/40 border-emerald-300/80 shadow-sm hover:shadow-md'
                    : 'bg-slate-50/80 border-slate-200 opacity-65'
                }`}
              >
                {/* Level Icon & Info */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-xs ${
                      isUnlocked
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-200 text-slate-500 border border-slate-300'
                    }`}
                  >
                    {level.icon}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-cairo">
                        المرحلة {level.id}
                      </span>
                      <span className="text-xs text-slate-500 font-tajawal">
                        · {level.badge}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold font-cairo text-slate-900 mt-1">
                      {level.title}
                    </h4>

                    <p className="text-xs font-tajawal text-slate-600 max-w-lg mt-0.5">
                      {level.description}
                    </p>
                  </div>
                </div>

                {/* Stars & Action Button */}
                <div className="flex items-center justify-between w-full md:w-auto gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {/* Stars Display */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((starNum) => (
                      <Star
                        key={starNum}
                        className={`w-5 h-5 ${
                          starNum <= stars
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Play / Locked Button */}
                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onSelectGame(level.gameTab);
                      }}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-cairo rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 text-sm shrink-0"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{stars > 0 ? 'إعادة اللعب' : 'خوض التحدي'}</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-400 rounded-xl text-xs font-bold font-cairo shrink-0">
                      <Lock className="w-4 h-4" />
                      <span>مغلقة</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Access to Original Poem & Heritage Info */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 text-right flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold font-cairo text-emerald-950">
            هل ترغب في قراءة النشيد كاملاً وسماع أبياته؟
          </h4>
          <p className="text-xs text-slate-600 font-tajawal mt-1">
            يمكنك دائماً الرجوع لقاعة الإنشاد والاستماع لنطق كل بيت ومفردة لغوية.
          </p>
        </div>
        <button
          onClick={() => {
            soundManager.playClick();
            onSelectGame('poem');
          }}
          className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold font-cairo text-xs sm:text-sm rounded-xl transition-colors shrink-0 shadow-xs"
        >
          📖 فتح قاعة الإنشاد
        </button>
      </div>
    </div>
  );
};
