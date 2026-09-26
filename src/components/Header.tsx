import React from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen, Trophy, Award } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface HeaderProps {
  currentTab: 'adventure' | 'poem' | 'rhythm' | 'vocab' | 'puzzle' | 'memory' | 'quiz';
  onSelectTab: (tab: 'adventure' | 'poem' | 'rhythm' | 'vocab' | 'puzzle' | 'memory' | 'quiz') => void;
  stars: number;
  score: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenPoemModal: () => void;
  onOpenAchievements: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  stars,
  score,
  isMuted,
  onToggleMute,
  onOpenPoemModal,
  onOpenAchievements,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-200/70 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-sm ring-2 ring-emerald-400/40">
            <span className="text-xl">🇴🇲</span>
          </div>
          <button
            onClick={() => onSelectTab('adventure')}
            className="text-right text-slate-900 hover:text-emerald-700 transition-colors"
          >
            <h1 className="text-lg sm:text-xl font-bold tracking-tight font-cairo">
              فرسان البَرعة
            </h1>
            <p className="text-xs text-emerald-700 font-medium font-tajawal hidden sm:block">
              نشيد نبت الحق عليها مزهرا
            </p>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-amber-100/50 rounded-xl border border-amber-200/60">
          <button
            onClick={() => onSelectTab('adventure')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              currentTab === 'adventure'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-amber-200/60'
            }`}
          >
            🗺️ خريطة المغامرة
          </button>
          <button
            onClick={() => onSelectTab('poem')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              currentTab === 'poem'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-amber-200/60'
            }`}
          >
            📖 قراءة وإنشاد
          </button>
          <button
            onClick={() => onSelectTab('rhythm')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              currentTab === 'rhythm'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-amber-200/60'
            }`}
          >
            🥁 إيقاع الدان دان
          </button>
          <button
            onClick={() => onSelectTab('vocab')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              currentTab === 'vocab'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-amber-200/60'
            }`}
          >
            🎯 صياد المفردات
          </button>
          <button
            onClick={() => onSelectTab('puzzle')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              currentTab === 'puzzle'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-amber-200/60'
            }`}
          >
            🧩 تركيب الأبيات
          </button>
          <button
            onClick={() => onSelectTab('memory')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              currentTab === 'memory'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-amber-200/60'
            }`}
          >
            🃏 بطاقات الذاكرة
          </button>
          <button
            onClick={() => onSelectTab('quiz')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              currentTab === 'quiz'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-amber-200/60'
            }`}
          >
            🐎 صهوة المجد
          </button>
        </nav>

        {/* Zone 3: Actions & Player Stats */}
        <div className="flex items-center gap-2">
          {/* Stars & Points Indicator */}
          <div className="flex items-center gap-2 bg-amber-100/70 border border-amber-300/80 px-2.5 py-1 rounded-xl shadow-2xs">
            <div className="flex items-center gap-1 text-amber-700 font-bold text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>{stars}</span>
            </div>
            <span className="text-amber-300">|</span>
            <div className="flex items-center gap-1 text-emerald-800 font-bold text-xs sm:text-sm">
              <Trophy className="w-3.5 h-3.5 text-emerald-600" />
              <span>{score}</span>
            </div>
          </div>

          {/* Poem Reference Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenPoemModal();
            }}
            title="عرض نص النشيد الأصلي"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/60 rounded-xl transition-all"
          >
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span className="hidden sm:inline">نص النشيد</span>
          </button>

          {/* Achievements Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenAchievements();
            }}
            title="لوحة الأوسمة والإنجازات"
            className="p-1.5 text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300/60 rounded-xl transition-all"
          >
            <Award className="w-4 h-4 text-amber-600" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'تشغيل المؤثرات الصوتية' : 'كتم الصوت'}
            className={`p-1.5 rounded-xl border transition-all ${
              isMuted
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Secondary Scrollable Tab Bar */}
      <div className="lg:hidden flex items-center gap-1 px-3 py-1.5 overflow-x-auto bg-amber-50/80 border-t border-amber-200/50 no-scrollbar">
        <button
          onClick={() => onSelectTab('adventure')}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg shrink-0 ${
            currentTab === 'adventure' ? 'bg-emerald-600 text-white' : 'text-slate-700'
          }`}
        >
          🗺️ المغامرة
        </button>
        <button
          onClick={() => onSelectTab('poem')}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg shrink-0 ${
            currentTab === 'poem' ? 'bg-emerald-600 text-white' : 'text-slate-700'
          }`}
        >
          📖 النشيد
        </button>
        <button
          onClick={() => onSelectTab('rhythm')}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg shrink-0 ${
            currentTab === 'rhythm' ? 'bg-emerald-600 text-white' : 'text-slate-700'
          }`}
        >
          🥁 الإيقاع
        </button>
        <button
          onClick={() => onSelectTab('vocab')}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg shrink-0 ${
            currentTab === 'vocab' ? 'bg-emerald-600 text-white' : 'text-slate-700'
          }`}
        >
          🎯 المفردات
        </button>
        <button
          onClick={() => onSelectTab('puzzle')}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg shrink-0 ${
            currentTab === 'puzzle' ? 'bg-emerald-600 text-white' : 'text-slate-700'
          }`}
        >
          🧩 الأبيات
        </button>
        <button
          onClick={() => onSelectTab('memory')}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg shrink-0 ${
            currentTab === 'memory' ? 'bg-emerald-600 text-white' : 'text-slate-700'
          }`}
        >
          🃏 الذاكرة
        </button>
        <button
          onClick={() => onSelectTab('quiz')}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg shrink-0 ${
            currentTab === 'quiz' ? 'bg-emerald-600 text-white' : 'text-slate-700'
          }`}
        >
          🐎 صهوة المجد
        </button>
      </div>
    </header>
  );
};
