import React, { useEffect, useState } from "react";
import { QuizScreen } from "./quiz-screen";

const QUIZ_DATA = {
  "l-nc-1-1-2": {
    id: "l-nc-1-1-2",
    titleAr: "اختبار التنظيم العصبي",
    titleEn: "Nervous Coordination Quiz",
    questions: [
      {
        id: "q-nc-1",
        htmlAr: `<p><strong>السؤال الأول</strong></p><p>كيف يحدث الإحساس والاستجابة في الأميبا؟</p>`,
        htmlEn: `<p><strong>Question 1</strong></p><p>How does sensation and response occur in Amoeba?</p>`,
        optionsAr: [
          "عن طريق السيتوبلازم (البروتوبلازم)",
          "عن طريق خلايا عصبية متخصصة",
          "عن طريق شبكة عصبية",
          "عن طريق خيوط حركية عصبية",
        ],
        optionsEn: [
          "Via the protoplasm (cytoplasm)",
          "Via specialised nerve cells",
          "Via a nerve net",
          "Via neuromotor fibers",
        ],
        correctIndex: 0,
        explanationAr:
          "تستجيب الأميبا للمنبهات عن طريق السيتوبلازم (البروتوبلازم) مباشرةً — فتتحرك إيجابياً نحو الغذاء وسلبياً بعيداً عن الضوء الشديد والتركيزات الكيميائية العالية.",
        explanationEn:
          "Amoeba responds to stimuli directly through its protoplasm — moving positively toward food and negatively away from strong light or high chemical concentrations.",
      },
      {
        id: "q-nc-2",
        htmlAr: `<p><strong>السؤال الثاني</strong></p><p>ما الذي تربطه الخيوط العصبية (الألياف الحركية العصبية) في البراميسيوم؟</p>`,
        htmlEn: `<p><strong>Question 2</strong></p><p>What do the neuromotor fibers (nerve threads) connect in Paramecium?</p>`,
        optionsAr: [
          "الحبيبات القاعدية للأهداب",
          "النواة بالغشاء الخلوي",
          "الفجوات الانقباضية",
          "الخلايا اللاسعة",
        ],
        optionsEn: [
          "The basal granules of the cilia",
          "The nucleus to the cell membrane",
          "The contractile vacuoles",
          "The stinging cells",
        ],
        correctIndex: 0,
        explanationAr:
          "يحتوي البراميسيوم على خيوط عصبية (ألياف حركية عصبية) تربط الحبيبات القاعدية للأهداب ببعضها، مما يُنسّق حركتها واستجابتها للمنبهات.",
        explanationEn:
          "Paramecium has neuromotor fibers that connect the basal granules of the cilia to each other, coordinating their movement and response to stimuli.",
      },
      {
        id: "q-nc-3",
        htmlAr: `<p><strong>السؤال الثالث</strong></p><p>ما نوع الجهاز العصبي الذي تمتلكه الهيدرا؟</p>`,
        htmlEn: `<p><strong>Question 3</strong></p><p>What type of nervous system does Hydra possess?</p>`,
        optionsAr: [
          "شبكة عصبية (الجهاز العصبي الابتدائي)",
          "دماغ معقد",
          "حبل شوكي",
          "عقدة عصبية مركزية",
        ],
        optionsEn: [
          "A nerve net (primary nervous system)",
          "A complex brain",
          "A spinal cord",
          "A central ganglion",
        ],
        correctIndex: 0,
        explanationAr:
          "تمتلك الهيدرا شبكة عصبية — وهي الجهاز العصبي الابتدائي وأبسط أشكال الجهاز العصبي المعروفة في المملكة الحيوانية.",
        explanationEn:
          "Hydra possesses a nerve net — the primary nervous system and the simplest form of nervous system known in the animal kingdom.",
      },
      {
        id: "q-nc-4",
        htmlAr: `<p><strong>السؤال الرابع</strong></p><p>تتكون الشبكة العصبية في الهيدرا من...</p>`,
        htmlEn: `<p><strong>Question 4</strong></p><p>Hydra's nerve net consists of...</p>`,
        optionsAr: [
          "خلايا عصبية بدائية مرتبطة بخلايا حسية وخلايا استجابة",
          "خلايا عضلية فقط",
          "خلايا طلائية هضمية",
          "خلايا تكاثرية جنسية",
        ],
        optionsEn: [
          "Primitive nerve cells connected to sensory and effector cells",
          "Only muscle cells",
          "Gastrodermal epithelial cells",
          "Sexual reproductive cells",
        ],
        correctIndex: 0,
        explanationAr:
          "تتكون الشبكة العصبية للهيدرا من خلايا عصبية بدائية متصلة بخلايا حسية (تستقبل المنبهات) وخلايا استجابة (تؤدي الحركات).",
        explanationEn:
          "Hydra's nerve net consists of primitive nerve cells connected to sensory cells (receiving stimuli) and effector cells (performing movement).",
      },
      {
        id: "q-nc-5",
        htmlAr: `<p><strong>السؤال الخامس</strong></p><p>ما الفرق بين الجهاز العصبي المركزي والجهاز العصبي الطرفي؟</p>`,
        htmlEn: `<p><strong>Question 5</strong></p><p>What is the difference between the central nervous system and the peripheral nervous system?</p>`,
        optionsAr: [
          "المركزي يتحكم بالمخ والحبل الشوكي، والطرفي يربط الأطراف",
          "المركزي أكثر أهمية من الطرفي",
          "لا توجد فروقات حقيقية بينهما",
          "الطرفي يتحكم بالعضلات فقط",
        ],
        optionsEn: [
          "Central controls the brain and spinal cord; peripheral connects the limbs",
          "Central is more important than peripheral",
          "There are no real differences between them",
          "Peripheral only controls muscles",
        ],
        correctIndex: 0,
        explanationAr:
          "الجهاز العصبي المركزي (المخ والحبل الشوكي) يستقبل ويعالج المعلومات، والجهاز العصبي الطرفي يربط الأطراف والأعضاء بالمركزي.",
        explanationEn:
          "The central nervous system (brain and spinal cord) receives and processes information, while the peripheral nervous system connects the limbs and organs to the central system.",
      },
    ],
  },
};

export function QuizPage() {
  const [quizId] = useState("l-nc-1-1-2");
  const quiz = QUIZ_DATA[quizId as keyof typeof QUIZ_DATA];

  if (!quiz) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontSize: "20px",
          fontWeight: "bold",
          color: "#666",
        }}
      >
        الاختبار غير موجود
      </div>
    );
  }

  return <QuizScreen quizId={quizId} questions={quiz.questions} title={quiz.titleAr} />;
}
