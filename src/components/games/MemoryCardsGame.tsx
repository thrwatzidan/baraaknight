import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy, Sparkles, Layers, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VOCABULARY_LIST } from '../../data/poemData';
import { soundManager } from '../../utils/soundEffects';

interface MemoryCardsGameProps {
  onEarnScore: (points: number) => void;
  onEarnStar: () => void;
}

interface CardItem {
  id: number; // unique card id (0 to 15)
  pairId: number; // matching pair id (1 to 8)
  type: 'word' | 'meaning';
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryCardsGame: React.FC<MemoryCardsGameProps> = ({
  onEarnScore,
  onEarnStar,
}) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [matchedCount, setMatchedCount] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);

  const initCards = () => {
    const cardDeck: CardItem[] = [];
    let idCounter = 0;

    VOCABULARY_LIST.forEach((item) => {
      // Card A: Word
      cardDeck.push({
        id: idCounter++,
        pairId: item.id,
        type: 'word',
        content: item.word,
        isFlipped: false,
        isMatched: false,
      });

      // Card B: Meaning
      cardDeck.push({
        id: idCounter++,
        pairId: item.id,
        type: 'meaning',
        content: item.meaning,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle deck
    setCards(cardDeck.sort(() => 0.5 - Math.random()));
    setFlippedCards([]);
    setMoves(0);
    setMatchedCount(0);
    setIsLocked(false);
    setIsWon(false);
  };

  useEffect(() => {
    initCards();
  }, []);

  const handleCardClick = (cardId: number) => {
    if (isLocked) return;
    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    soundManager.playClick();

    // Flip the clicked card
    const newCards = cards.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c));
    setCards(newCards);

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      setIsLocked(true);

      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = card;

      if (firstCard && firstCard.pairId === secondCard.pairId) {
        // MATCH!
        setTimeout(() => {
          soundManager.playCorrect();
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c
            )
          );
          setFlippedCards([]);
          setIsLocked(false);
          const nextMatched = matchedCount + 1;
          setMatchedCount(nextMatched);
          onEarnScore(30);

          if (nextMatched === VOCABULARY_LIST.length) {
            setIsWon(true);
            soundManager.playFanfare();
            onEarnStar();
            confetti({
              particleCount: 100,
              spread: 75,
              origin: { y: 0.6 },
            });
          }
        }, 500);
      } else {
        // NO MATCH -> Flip back
        setTimeout(() => {
          soundManager.playWrong();
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
          setIsLocked(false);
        }, 1100);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-amber-900 text-white rounded-2xl p-6 shadow-lg text-right relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-amber-950 font-bold text-xs rounded-full mb-2 font-cairo">
              <Layers className="w-3.5 h-3.5" />
              <span>تحدي تقوية الذاكرة والتطابق</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-cairo">
              بطاقات الذاكرة البرعاوية 🃏
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm font-tajawal mt-1">
              اقلب البطاقات وطابق الكلمة التراثية مع معناها الصحيح بأقل عدد من الحركات!
            </p>
          </div>

          <div className="flex items-center gap-4 bg-black/25 px-4 py-2 rounded-2xl border border-white/10 shrink-0">
            <div className="text-center">
              <span className="text-xs text-emerald-200 block font-tajawal">عدد المحاولات</span>
              <span className="text-xl font-black text-amber-300 font-mono tabular-nums">
                {moves}
              </span>
            </div>
            <div className="h-6 w-px bg-white/20" />
            <div className="text-center">
              <span className="text-xs text-emerald-200 block font-tajawal">الأزواج المطابقة</span>
              <span className="text-xl font-black text-emerald-400 font-mono tabular-nums">
                {matchedCount} / {VOCABULARY_LIST.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="bg-amber-100/50 rounded-3xl p-4 sm:p-8 border border-amber-200/80 shadow-md">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {cards.map((card) => {
            const isRevealed = card.isFlipped || card.isMatched;

            return (
              <button
                key={card.id}
                disabled={card.isMatched || isLocked}
                onClick={() => handleCardClick(card.id)}
                className={`h-28 sm:h-32 rounded-2xl border-2 p-3 flex flex-col items-center justify-center text-center transition-all duration-300 transform select-none cursor-pointer ${
                  card.isMatched
                    ? 'bg-emerald-100/90 border-emerald-400 text-emerald-950 scale-98 shadow-2xs'
                    : isRevealed
                    ? 'bg-white border-amber-400 text-slate-900 shadow-md scale-102 ring-2 ring-amber-300'
                    : 'bg-gradient-to-br from-emerald-700 to-teal-900 border-emerald-600 hover:border-amber-300 text-white shadow-xs hover:scale-102'
                }`}
              >
                {isRevealed ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <span
                      className={`text-2xs font-bold font-cairo mb-1 px-1.5 py-0.5 rounded-full ${
                        card.type === 'word'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {card.type === 'word' ? 'كلمة' : 'معنى'}
                    </span>
                    <span
                      className={`font-bold ${
                        card.type === 'word'
                          ? 'font-cairo text-base sm:text-lg text-emerald-900'
                          : 'font-tajawal text-xs sm:text-sm text-slate-800 leading-snug'
                      }`}
                    >
                      {card.content}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-3xl mb-1 filter drop-shadow-sm">🇴🇲</span>
                    <span className="text-2xs font-bold font-cairo text-emerald-200">
                      فن البرعة
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Victory Box */}
        {isWon && (
          <div className="mt-8 p-6 bg-emerald-50 border-2 border-emerald-400 rounded-2xl text-center space-y-3 animate-fade-in">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-2xl font-bold shadow-sm">
              🏆
            </div>
            <h4 className="text-2xl font-bold font-cairo text-emerald-950">
              رائع جداً! طابقت جميع البطاقات بـ {moves} حركة فقط!
            </h4>
            <p className="text-slate-600 text-sm font-tajawal">
              ذاكرتك قوية كعزم فرسان البرعة على هام الذرى!
            </p>
            <div className="pt-2">
              <button
                onClick={initCards}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-cairo rounded-xl transition-all shadow-md inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>العب جولة جديدة</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
