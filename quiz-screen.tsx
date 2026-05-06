import React, { useState, useMemo } from "react";

interface QuizQuestion {
  id: string;
  htmlAr: string;
  htmlEn: string;
  optionsAr: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationAr: string;
  explanationEn: string;
}

interface QuizScreenProps {
  quizId: string;
  questions: QuizQuestion[];
  title: string;
}

export function QuizScreen({ quizId, questions, title }: QuizScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreak] = useState(0);

  const currentQuestion = questions[currentIndex];
  const isAnswered = selectedAnswers[currentIndex] !== null;
  const isCorrect =
    isAnswered && selectedAnswers[currentIndex] === currentQuestion.correctIndex;

  const handleSelectAnswer = (index: number) => {
    if (!isAnswered) {
      const newAnswers = [...selectedAnswers];
      newAnswers[currentIndex] = index;
      setSelectedAnswers(newAnswers);

      if (index === currentQuestion.correctIndex) {
        setStreak(streak + 1);
      } else {
        setStreak(0);
      }

      setShowExplanation(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowExplanation(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers(new Array(questions.length).fill(null));
    setShowExplanation(false);
    setStreak(0);
  };

  const correctCount = useMemo(() => {
    return selectedAnswers.filter(
      (ans, idx) => ans === questions[idx].correctIndex
    ).length;
  }, [selectedAnswers, questions]);

  const isQuizComplete = selectedAnswers.every((ans) => ans !== null);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
        fontFamily: "'Geist', 'Arial', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "white",
            borderRadius: "12px 12px 0 0",
            padding: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: 900,
                color: "#1a1a1a",
                margin: "0 0 8px 0",
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "#666",
                margin: 0,
              }}
            >
              السؤال {currentIndex + 1} من {questions.length}
            </p>
          </div>

          {/* Streak Badge */}
          {streak > 0 && (
            <div
              style={{
                background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
                color: "white",
                borderRadius: "12px",
                padding: "16px 24px",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(255, 107, 107, 0.3)",
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: 900,
                  marginBottom: "4px",
                }}
              >
                🔥 {streak}
              </div>
              <div style={{ fontSize: "12px", fontWeight: 600 }}>
                توالي صحيح
              </div>
            </div>
          )}
        </div>

        {/* Question Card */}
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "0 0 12px 12px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
            marginBottom: "24px",
          }}
        >
          {/* Question Text */}
          <div
            style={{
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#1a1a1a",
                lineHeight: 1.6,
              }}
              dangerouslySetInnerHTML={{ __html: currentQuestion.htmlAr }}
            />
          </div>

          {/* Options */}
          <div style={{ marginBottom: "40px" }}>
            {currentQuestion.optionsAr.map((option, idx) => {
              const isSelected = selectedAnswers[currentIndex] === idx;
              const isCorrectOption = idx === currentQuestion.correctIndex;
              let backgroundColor = "#f5f5f5";
              let borderColor = "#ddd";
              let textColor = "#1a1a1a";

              if (isAnswered) {
                if (isCorrectOption) {
                  backgroundColor = "#d4edda";
                  borderColor = "#28a745";
                  textColor = "#155724";
                } else if (isSelected && !isCorrect) {
                  backgroundColor = "#f8d7da";
                  borderColor = "#dc3545";
                  textColor = "#721c24";
                }
              } else if (isSelected) {
                backgroundColor = "#e3f2fd";
                borderColor = "#667eea";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(idx)}
                  disabled={isAnswered}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "20px 24px",
                    marginBottom: "12px",
                    fontSize: "18px",
                    fontWeight: 600,
                    textAlign: "right",
                    backgroundColor,
                    borderColor,
                    border: `2px solid ${borderColor}`,
                    borderRadius: "8px",
                    cursor: isAnswered ? "default" : "pointer",
                    transition: "all 0.2s ease",
                    color: textColor,
                  }}
                  onMouseEnter={(e) => {
                    if (!isAnswered) {
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.backgroundColor = "#e3f2fd";
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "#667eea";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isAnswered) {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        "#f5f5f5";
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "#ddd";
                    }
                  }}
                >
                  <span
                    style={{
                      marginRight: "12px",
                      fontWeight: 900,
                      fontSize: "16px",
                    }}
                  >
                    {String.fromCharCode(64 + idx + 1)}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div
              style={{
                background: isCorrect
                  ? "rgba(40, 167, 69, 0.1)"
                  : "rgba(220, 53, 69, 0.1)",
                border: `2px solid ${isCorrect ? "#28a745" : "#dc3545"}`,
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "30px",
              }}
            >
              <div
                style={{
                  fontWeight: 900,
                  color: isCorrect ? "#155724" : "#721c24",
                  marginBottom: "12px",
                  fontSize: "16px",
                }}
              >
                {isCorrect ? "✅ إجابة صحيحة!" : "❌ إجابة خاطئة"}
              </div>
              <div
                style={{
                  fontSize: "16px",
                  lineHeight: 1.6,
                  color: isCorrect ? "#155724" : "#721c24",
                }}
              >
                {currentQuestion.explanationAr}
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div
            style={{
              background: "#f0f0f0",
              borderRadius: "8px",
              height: "8px",
              marginBottom: "20px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                height: "100%",
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
                transition: "width 0.3s ease",
              }}
            />
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              style={{
                flex: 1,
                padding: "14px 24px",
                fontSize: "16px",
                fontWeight: 700,
                backgroundColor: currentIndex === 0 ? "#f0f0f0" : "#e0e0e0",
                color: currentIndex === 0 ? "#999" : "#1a1a1a",
                border: "none",
                borderRadius: "8px",
                cursor: currentIndex === 0 ? "default" : "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (currentIndex > 0) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "#d0d0d0";
                }
              }}
              onMouseLeave={(e) => {
                if (currentIndex > 0) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "#e0e0e0";
                }
              }}
            >
              ← السابق
            </button>

            {!isQuizComplete ? (
              <button
                onClick={handleNext}
                disabled={!isAnswered || currentIndex === questions.length - 1}
                style={{
                  flex: 1,
                  padding: "14px 24px",
                  fontSize: "16px",
                  fontWeight: 700,
                  backgroundColor:
                    !isAnswered || currentIndex === questions.length - 1
                      ? "#f0f0f0"
                      : "#667eea",
                  color:
                    !isAnswered || currentIndex === questions.length - 1
                      ? "#999"
                      : "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor:
                    !isAnswered || currentIndex === questions.length - 1
                      ? "default"
                      : "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (isAnswered && currentIndex < questions.length - 1) {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "#5568d3";
                  }
                }}
                onMouseLeave={(e) => {
                  if (isAnswered && currentIndex < questions.length - 1) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "#667eea";
                  }
                }}
              >
                التالي →
              </button>
            ) : (
              <button
                onClick={handleRestart}
                style={{
                  flex: 1,
                  padding: "14px 24px",
                  fontSize: "16px",
                  fontWeight: 700,
                  backgroundColor: "#764ba2",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "#653a8a";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "#764ba2";
                }}
              >
                🔄 إعادة المحاولة
              </button>
            )}
          </div>
        </div>

        {/* Results Summary */}
        {isQuizComplete && (
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "32px",
              textAlign: "center",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                fontWeight: 900,
                color: "#1a1a1a",
                margin: "0 0 16px 0",
              }}
            >
              🎉 تم إكمال الاختبار!
            </h2>
            <div
              style={{
                fontSize: "48px",
                fontWeight: 900,
                color: "#667eea",
                margin: "20px 0",
              }}
            >
              {correctCount} / {questions.length}
            </div>
            <div
              style={{
                fontSize: "18px",
                color: "#666",
                marginBottom: "24px",
              }}
            >
              {Math.round((correctCount / questions.length) * 100)}% نسبة النجاح
            </div>
            <a
              href="/"
              style={{
                display: "inline-block",
                padding: "14px 32px",
                fontSize: "16px",
                fontWeight: 700,
                backgroundColor: "#667eea",
                color: "white",
                border: "none",
                borderRadius: "8px",
                textDecoration: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  "#5568d3";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  "#667eea";
              }}
            >
              العودة للرئيسية
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
