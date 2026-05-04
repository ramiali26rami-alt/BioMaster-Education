import React from "react";
import ReactDOM from "react-dom/client";

function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>BioMaster Education - تطبيق تعليمي</h1>
      <p>مرحباً! هذا التطبيق قيد التطوير.</p>
      <p>شاشات الاختبار جاهزة في:</p>
      <ul>
        <li><code>app/quiz/[id].tsx</code> - شاشة الاختبار مع عداد التوالي</li>
        <li><code>app/quiz/result.tsx</code> - شاشة النتيجة</li>
      </ul>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
