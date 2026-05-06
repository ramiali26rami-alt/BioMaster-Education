import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { QuizPage } from "./quiz-page";

function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "quiz" | "results">(
    "home"
  );

  const handleQuizStart = () => {
    setCurrentPage("quiz");
  };

  const handleViewResults = () => {
    setCurrentPage("results");
  };

  if (currentPage === "quiz") {
    return (
      <div>
        <QuizPage />
      </div>
    );
  }

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
          onClick={handleQuizStart}
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
            (e.target as HTMLButtonElement).style.backgroundColor = "#5568d3";
            (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
            (e.target as HTMLButtonElement).style.boxShadow =
              "0 6px 20px rgba(102, 126, 234, 0.6)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = "#667eea";
            (e.target as HTMLButtonElement).style.transform = "translateY(0)";
            (e.target as HTMLButtonElement).style.boxShadow =
              "0 4px 15px rgba(102, 126, 234, 0.4)";
          }}
        >
          🧠 بدء اختبار التنسيق العصبي
        </button>

        <button
          onClick={handleViewResults}
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
            (e.target as HTMLButtonElement).style.backgroundColor = "#653a8a";
            (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
            (e.target as HTMLButtonElement).style.boxShadow =
              "0 6px 20px rgba(118, 75, 162, 0.6)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = "#764ba2";
            (e.target as HTMLButtonElement).style.transform = "translateY(0)";
            (e.target as HTMLButtonElement).style.boxShadow =
              "0 4px 15px rgba(118, 75, 162, 0.4)";
          }}
        >
          📊 عرض النتائج الأخيرة
        </button>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
