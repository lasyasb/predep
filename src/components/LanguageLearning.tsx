import React, { useState } from 'react';
import { Languages, Play, RotateCcw, CheckCircle2, X } from 'lucide-react';

interface FlashCard {
  front: string;
  back: string;
}

interface LanguageGame {
  question: string;
  options: string[];
  correct: string;
}

interface LanguageData {
  name: string;
  code: string;
  flashcards: FlashCard[];
  games: LanguageGame[];
}

const languageData: Record<string, LanguageData> = {
  japanese: {
    name: 'Japanese',
    code: 'ja',
    flashcards: [
      { front: 'こんにちは', back: 'Hello' },
      { front: 'ありがとう', back: 'Thank you' },
      { front: 'お願いします', back: 'Please' },
      { front: '私の名前は...', back: 'My name is...' },
      { front: 'さようなら', back: 'Goodbye' },
    ],
    games: [
      {
        question: 'What does "こんにちは" mean?',
        options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
        correct: 'Hello'
      },
      {
        question: 'How do you say "Thank you" in Japanese?',
        options: ['さようなら', 'こんにちは', 'ありがとう', 'お願いします'],
        correct: 'ありがとう'
      }
    ]
  },
  mandarin: {
    name: 'Mandarin Chinese',
    code: 'zh',
    flashcards: [
      { front: '你好', back: 'Hello' },
      { front: '谢谢', back: 'Thank you' },
      { front: '请', back: 'Please' },
      { front: '我的名字是...', back: 'My name is...' },
      { front: '再见', back: 'Goodbye' },
    ],
    games: [
      {
        question: 'What does "你好" mean?',
        options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
        correct: 'Hello'
      },
      {
        question: 'How do you say "Thank you" in Mandarin?',
        options: ['再见', '你好', '谢谢', '请'],
        correct: '谢谢'
      }
    ]
  },
  korean: {
    name: 'Korean',
    code: 'ko',
    flashcards: [
      { front: '안녕하세요', back: 'Hello' },
      { front: '감사합니다', back: 'Thank you' },
      { front: '주세요', back: 'Please' },
      { front: '제 이름은...', back: 'My name is...' },
      { front: '안녕히 가세요', back: 'Goodbye' },
    ],
    games: [
      {
        question: 'What does "안녕하세요" mean?',
        options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
        correct: 'Hello'
      },
      {
        question: 'How do you say "Thank you" in Korean?',
        options: ['안녕히 가세요', '안녕하세요', '감사합니다', '주세요'],
        correct: '감사합니다'
      }
    ]
  }
};

export default function LanguageLearning({ selectedCountry }: { selectedCountry: string }) {
  const [mode, setMode] = useState<'flashcards' | 'quiz'>('flashcards');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  // Map countries to their primary language
  const countryToLanguage: Record<string, string> = {
    japan: 'japanese',
    china: 'mandarin',
    korea: 'korean',
    taiwan: 'mandarin',
    hongkong: 'mandarin'
  };

  const language = languageData[countryToLanguage[selectedCountry] || 'japanese'];
  const currentCard = language.flashcards[currentCardIndex];
  const currentQuestion = language.games[currentQuestionIndex];

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % language.flashcards.length);
    setIsFlipped(false);
  };

  const checkAnswer = (selected: string) => {
    setShowAnswer(true);
    if (selected === currentQuestion.correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % language.games.length);
    setShowAnswer(false);
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowAnswer(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{language.name} Learning</h3>
          <p className="text-sm text-gray-600">Master essential phrases</p>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => setMode('flashcards')}
            className={`px-4 py-2 rounded-lg ${
              mode === 'flashcards' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            Flashcards
          </button>
          <button
            onClick={() => setMode('quiz')}
            className={`px-4 py-2 rounded-lg ${
              mode === 'quiz' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            Quiz Game
          </button>
        </div>
      </div>

      {mode === 'flashcards' ? (
        <div className="relative">
          <div
            className={`bg-white p-8 rounded-xl shadow-lg cursor-pointer min-h-[200px] flex items-center justify-center transform transition-transform duration-500 ${
              isFlipped ? 'scale-[-1]' : ''
            }`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className={`text-2xl font-medium ${isFlipped ? 'scale-[-1]' : ''}`}>
              {isFlipped ? currentCard.back : currentCard.front}
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Flip Card
            </button>
            <button
              onClick={nextCard}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next Card
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="mb-4 flex justify-between items-center">
            <span className="text-sm font-medium">Score: {score}/{language.games.length}</span>
            <button
              onClick={resetGame}
              className="flex items-center text-sm text-gray-600 hover:text-gray-800"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </button>
          </div>
          
          <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
          
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showAnswer && checkAnswer(option)}
                className={`w-full p-3 rounded-lg text-left ${
                  showAnswer
                    ? option === currentQuestion.correct
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                disabled={showAnswer}
              >
                {option}
                {showAnswer && option === currentQuestion.correct && (
                  <CheckCircle2 className="w-5 h-5 text-green-600 float-right" />
                )}
              </button>
            ))}
          </div>

          {showAnswer && (
            <button
              onClick={nextQuestion}
              className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next Question
            </button>
          )}
        </div>
      )}
    </div>
  );
}