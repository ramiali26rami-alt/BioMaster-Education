import React, { useState } from "react";
import ReactDOM from "react-dom/client";

// ============ HOME SCREEN ============
function HomeScreen({ onStartQuiz, onViewResults }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "40px 20px",
        fontFamily: "'Geist', 'Arial', sans-serif",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "60px 40px",
          textAlign: "center",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            fontWeight: 900,
            color: "#1a1a1a",
            margin: "0 0 20px 0",
            lineHeight: 1.2,
          }}
        >
          تطبيق BioMaster التعليمي
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "#666",
            margin: "0 0 50px 0",
            lineHeight: 1.6,
          }}
        >
          أختبر معلوماتك في التنسيق العصبي واعرف نتائجك الآن
        </p>

        <button
          onClick={onStartQuiz}
          style={{
            display: "block",
            width: "100%",
            padding: "28px 40px",
            margin: "0 0 20px 0",
            fontSize: "24px",
            fontWeight: 900,
            color: "white",
            backgroundColor: "#667eea",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
            textTransform: "none",
            lineHeight: 1.4,
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#5568d3";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#667eea";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
          }}
        >
          🧠 بدء اختبار التنسيق العصبي
        </button>

        <button
          onClick={onViewResults}
          style={{
            display: "block",
            width: "100%",
            padding: "28px 40px",
            fontSize: "24px",
            fontWeight: 900,
            color: "white",
            backgroundColor: "#764ba2",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 15px rgba(118, 75, 162, 0.4)",
            textTransform: "none",
            lineHeight: 1.4,
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#653a8a";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 20px rgba(118, 75, 162, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#764ba2";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 15px rgba(118, 75, 162, 0.4)";
          }}
        >
          📊 عرض النتائج الأخيرة
        </button>
      </div>
    </div>
  );
}

// ============ QUIZ SCREEN ============
function QuizScreen({ onHome, questions, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(
    new Array(questions.length).fill(null)
  );
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreak] = useState(0);

  const currentQuestion = questions[currentIndex];
  const isAnswered = selectedAnswers[currentIndex] !== null;
  const isCorrect =
    isAnswered && selectedAnswers[currentIndex] === currentQuestion.correctIndex;

  const handleSelectAnswer = (index) => {
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

  const correctCount = selectedAnswers.filter(
    (ans, idx) => ans === questions[idx].correctIndex
  ).length;

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
          <div style={{ marginBottom: "40px" }}>
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
                      e.target.style.backgroundColor = "#e3f2fd";
                      e.target.style.borderColor = "#667eea";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isAnswered) {
                      e.target.style.backgroundColor = "#f5f5f5";
                      e.target.style.borderColor = "#ddd";
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
                }}
              >
                التالي →
              </button>
            ) : null}
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
            <button
              onClick={onHome}
              style={{
                display: "inline-block",
                padding: "14px 32px",
                fontSize: "16px",
                fontWeight: 700,
                backgroundColor: "#667eea",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              العودة للرئيسية
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ RESULTS SCREEN ============
function ResultsScreen({ onHome }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "40px 20px",
        fontFamily: "'Geist', 'Arial', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "white",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            fontWeight: 900,
            color: "#1a1a1a",
            margin: "0 0 30px 0",
            textAlign: "center",
          }}
        >
          📊 النتائج الأخيرة
        </h1>

        <div
          style={{
            background: "#f5f5f5",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "18px",
              color: "#666",
              margin: 0,
            }}
          >
            لم تكمل أي اختبار بعد. ابدأ الاختبار الآن للحصول على النتائج!
          </p>
        </div>

        <button
          onClick={onHome}
          style={{
            display: "block",
            width: "100%",
            padding: "16px 24px",
            fontSize: "18px",
            fontWeight: 700,
            backgroundColor: "#667eea",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
}

// ============ MAIN APP ============
function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const quizQuestions = [
    {
      id: "q-nc-1",
      htmlAr: `<p><strong>السؤال الأول</strong></p><p>كيف يحدث الإحساس والاستجابة في الأميبا؟</p>`,
      optionsAr: [
        "عن طريق السيتوبلازم (البروتوبلازم)",
        "عن طريق خلايا عصبية متخصصة",
        "عن طريق شبكة عصبية",
        "عن طريق خيوط حركية عصبية",
      ],
      correctIndex: 0,
      explanationAr:
        "تستجيب الأميبا للمنبهات عن طريق السيتوبلازم (البروتوبلازم) مباشرةً — فتتحرك إيجابياً نحو الغذاء وسلبياً بعيداً عن الضوء الشديد والتركيزات الكيميائية العالية.",
    },
    {
      id: "q-nc-2",
      htmlAr: `<p><strong>السؤال الثاني</strong></p><p>ما الذي تربطه الخيوط العصبية في البراميسيوم؟</p>`,
      optionsAr: [
        "الحبيبات القاعدية للأهداب",
        "النواة بالغشاء الخلوي",
        "الفجوات الانقباضية",
        "الخلايا اللاسعة",
      ],
      correctIndex: 0,
      explanationAr:
        "يحتوي البراميسيوم على خيوط عصبية تربط الحبيبات القاعدية للأهداب ببعضها، مما يُنسّق حركتها واستجابتها للمنبهات.",
    },
    {
      id: "q-nc-3",
      htmlAr: `<p><strong>السؤال الثالث</strong></p><p>ما نوع الجهاز العصبي الذي تمتلكه الهيدرا؟</p>`,
      optionsAr: [
        "شبكة عصبية (الجهاز العصبي الابتدائي)",
        "دماغ معقد",
        "حبل شوكي",
        "عقدة عصبية مركزية",
      ],
      correctIndex: 0,
      explanationAr:
        "تمتلك الهيدرا شبكة عصبية — وهي الجهاز العصبي الابتدائي وأبسط أشكال الجهاز العصبي المعروفة.",
    },
    {
      id: "q-nc-4",
      htmlAr: `<p><strong>السؤال الرابع</strong></p><p>تتكون الشبكة العصبية في الهيدرا من...</p>`,
      optionsAr: [
        "خلايا عصبية بدائية مرتبطة بخلايا حسية وخلايا استجابة",
        "خلايا عضلية فقط",
        "خلايا طلائية هضمية",
        "خلايا تكاثرية جنسية",
      ],
      correctIndex: 0,
      explanationAr:
        "تتكون الشبكة العصبية للهيدرا من خلايا عصبية بدائية متصلة بخلايا حسية وخلايا استجابة.",
    },
    {
      id: "q-nc-5",
      htmlAr: `<p><strong>السؤال الخامس</strong></p><p>ما الفرق بين الجهاز العصبي المركزي والطرفي؟</p>`,
      optionsAr: [
        "المركزي يتحكم بالمخ والحبل الشوكي، والطرفي يربط الأطراف",
        "المركزي أكثر أهمية من الطرفي",
        "لا توجد فروقات حقيقية بينهما",
        "الطرفي يتحكم بالعضلات فقط",
      ],
      correctIndex: 0,
      explanationAr:
        "الجهاز العصبي المركزي (المخ والحبل الشوكي) يستقبل ويعالج المعلومات، والجهاز العصبي الطرفي يربط الأطراف والأعضاء بالمركزي.",
    },
  ];

  if (currentPage === "quiz") {
    return (
      <QuizScreen
        onHome={() => setCurrentPage("home")}
        questions={quizQuestions}
        title="اختبار التنظيم العصبي"
      />
    );
  }

  if (currentPage === "results") {
    return <ResultsScreen onHome={() => setCurrentPage("home")} />;
  }

  return (
    <HomeScreen
      onStartQuiz={() => setCurrentPage("quiz")}
      onViewResults={() => setCurrentPage("results")}
    />
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
