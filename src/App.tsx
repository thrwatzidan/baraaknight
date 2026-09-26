/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AdventureMode } from './components/AdventureMode';
import { PoemReciter } from './components/PoemReciter';
import { RhythmGame } from './components/games/RhythmGame';
import { VocabCatchGame } from './components/games/VocabCatchGame';
import { VersePuzzleGame } from './components/games/VersePuzzleGame';
import { MemoryCardsGame } from './components/games/MemoryCardsGame';
import { KnightQuizGame } from './components/games/KnightQuizGame';
import { PoemModal } from './components/PoemModal';
import { AchievementsModal } from './components/AchievementsModal';
import { INITIAL_ACHIEVEMENTS, Achievement } from './data/poemData';
import { soundManager } from './utils/soundEffects';

type GameTab = 'adventure' | 'poem' | 'rhythm' | 'vocab' | 'puzzle' | 'memory' | 'quiz';

export default function App() {
  const [currentTab, setCurrentTab] = useState<GameTab>('adventure');
  const [score, setScore] = useState<number>(() => {
    const saved = localStorage.getItem('barah_score');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [stars, setStars] = useState<number>(() => {
    const saved = localStorage.getItem('barah_stars');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [unlockedLevel, setUnlockedLevel] = useState<number>(() => {
    const saved = localStorage.getItem('barah_unlocked_level');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [levelStars, setLevelStars] = useState<Record<number, number>>(() => {
    const saved = localStorage.getItem('barah_level_stars');
    return saved ? JSON.parse(saved) : {};
  });
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('barah_achievements');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ACHIEVEMENTS;
      }
    }
    return INITIAL_ACHIEVEMENTS;
  });
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.getMuted());
  const [isPoemModalOpen, setIsPoemModalOpen] = useState<boolean>(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState<boolean>(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('barah_score', score.toString());
  }, [score]);

  useEffect(() => {
    localStorage.setItem('barah_stars', stars.toString());
  }, [stars]);

  useEffect(() => {
    localStorage.setItem('barah_unlocked_level', unlockedLevel.toString());
  }, [unlockedLevel]);

  useEffect(() => {
    localStorage.setItem('barah_level_stars', JSON.stringify(levelStars));
  }, [levelStars]);

  useEffect(() => {
    localStorage.setItem('barah_achievements', JSON.stringify(achievements));
  }, [achievements]);

  // Points & Stars handlers
  const handleEarnScore = (points: number) => {
    setScore((prev) => prev + points);
  };

  const handleEarnStar = (levelId?: number) => {
    soundManager.playStarEarned();
    setStars((prev) => prev + 1);

    if (levelId) {
      setLevelStars((prev) => {
        const current = prev[levelId] || 0;
        const updated = Math.min(3, current + 1);
        return { ...prev, [levelId]: updated };
      });
      // Unlock next level
      if (levelId === unlockedLevel && unlockedLevel < 5) {
        setUnlockedLevel(levelId + 1);
      }
    }
  };

  const handleUnlockAchievement = (id: string) => {
    setAchievements((prev) =>
      prev.map((a) => {
        if (a.id === id && !a.unlocked) {
          soundManager.playFanfare();
          return { ...a, unlocked: true };
        }
        return a;
      })
    );
  };

  const handleToggleMute = () => {
    const nextMute = soundManager.toggleMute();
    setIsMuted(nextMute);
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/30 text-slate-800">
      {/* Top Bar */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          soundManager.playClick();
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        stars={stars}
        score={score}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenPoemModal={() => setIsPoemModalOpen(true)}
        onOpenAchievements={() => setIsAchievementsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentTab === 'adventure' && (
          <AdventureMode
            onSelectGame={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            unlockedLevel={unlockedLevel}
            levelStars={levelStars}
            score={score}
            totalStars={stars}
          />
        )}

        {currentTab === 'poem' && (
          <PoemReciter onEarnScore={handleEarnScore} />
        )}

        {currentTab === 'rhythm' && (
          <RhythmGame
            onEarnScore={handleEarnScore}
            onUnlockAchievement={handleUnlockAchievement}
          />
        )}

        {currentTab === 'vocab' && (
          <VocabCatchGame
            onEarnScore={handleEarnScore}
            onEarnStar={() => handleEarnStar(2)}
            onUnlockAchievement={handleUnlockAchievement}
          />
        )}

        {currentTab === 'puzzle' && (
          <VersePuzzleGame
            onEarnScore={handleEarnScore}
            onEarnStar={() => handleEarnStar(3)}
            onUnlockAchievement={handleUnlockAchievement}
          />
        )}

        {currentTab === 'memory' && (
          <MemoryCardsGame
            onEarnScore={handleEarnScore}
            onEarnStar={() => handleEarnStar(4)}
          />
        )}

        {currentTab === 'quiz' && (
          <KnightQuizGame
            onEarnScore={handleEarnScore}
            onEarnStar={() => handleEarnStar(5)}
            onUnlockAchievement={handleUnlockAchievement}
          />
        )}
      </main>

      {/* Clean Footer adhering to design constitution */}
      <footer className="mt-auto border-t border-amber-200/60 bg-white/70 py-6 text-center text-xs text-slate-500 font-tajawal">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            تحدي فرسان البرعة · نشيد (نَبَتَ الحَقُّ عَلَيها مُزْهِرا) · كلمات الشاعر علي بن أحمد المعشني 🇴🇲
          </p>
          <div className="flex items-center gap-4 text-xs">
            <span>تراث عماني مدرج باليونسكو</span>
            <span aria-hidden="true">·</span>
            <span>تطبيق تعليمي تفاعلي للطلاب</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PoemModal
        isOpen={isPoemModalOpen}
        onClose={() => setIsPoemModalOpen(false)}
      />

      <AchievementsModal
        isOpen={isAchievementsModalOpen}
        onClose={() => setIsAchievementsModalOpen(false)}
        achievements={achievements}
        stars={stars}
        score={score}
      />
    </div>
  );
}
