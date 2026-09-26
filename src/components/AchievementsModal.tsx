import React from 'react';
import { X, Award, CheckCircle2, Lock } from 'lucide-react';
import { Achievement } from '../data/poemData';
import { soundManager } from '../utils/soundEffects';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  stars: number;
  score: number;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  achievements,
  stars,
  score,
}) => {
  if (!isOpen) return null;

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-amber-200 p-5 sm:p-6 text-right overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-cairo">
                أوسمة فرسان البرعة
              </h3>
              <p className="text-xs text-slate-500 font-tajawal">
                فتحت {unlockedCount} من أصل {achievements.length} أوسمة
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Points & Stars Bar */}
        <div className="my-4 p-3 bg-amber-50/80 border border-amber-200/70 rounded-xl flex items-center justify-around text-center">
          <div>
            <span className="text-xs text-slate-500 block">مجموع النجوم</span>
            <span className="text-xl font-black text-amber-600 font-cairo">⭐ {stars}</span>
          </div>
          <div className="h-8 w-px bg-amber-200" />
          <div>
            <span className="text-xs text-slate-500 block">مجموع النقاط</span>
            <span className="text-xl font-black text-emerald-700 font-cairo">🏆 {score}</span>
          </div>
          <div className="h-8 w-px bg-amber-200" />
          <div>
            <span className="text-xs text-slate-500 block">رتبة الفارس</span>
            <span className="text-xs font-bold text-slate-800 font-cairo block mt-1">
              {score >= 1000
                ? 'فارس عُمان العظيم 👑'
                : score >= 500
                ? 'فارس البرعة الماهر 🗡️'
                : 'فارس ناشئ 🛡️'}
            </span>
          </div>
        </div>

        {/* Achievements List */}
        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {achievements.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                item.unlocked
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                  : 'bg-slate-50 border-slate-200 opacity-60 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl p-1 bg-white rounded-lg shadow-2xs">
                  {item.icon}
                </span>
                <div>
                  <h4 className="text-sm font-bold font-cairo">{item.title}</h4>
                  <p className="text-xs font-tajawal text-slate-600">
                    {item.description}
                  </p>
                </div>
              </div>

              {item.unlocked ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 text-center">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl font-cairo text-sm transition-colors"
          >
            متابعة المغامرة
          </button>
        </div>
      </div>
    </div>
  );
};
