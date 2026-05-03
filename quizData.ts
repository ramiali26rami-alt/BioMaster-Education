export interface QuizQuestion {
  id: string;
  htmlAr: string;
  htmlEn: string;
  optionsAr: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationAr: string;
  explanationEn: string;
}

export interface Quiz {
  id: string;
  titleAr: string;
  titleEn: string;
  questions: QuizQuestion[];
}

export const QUIZZES: Record<string, Quiz> = {
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
          "Primary nerve cells connected to sensory cells and response cells",
          "Only muscle cells",
          "Epithelial digestive cells",
          "Sexual reproductive cells",
        ],
        correctIndex: 0,
        explanationAr:
          "تتكون الشبكة العصبية في الهيدرا من خلايا عصبية بدائية مرتبطة بخلايا حسية وخلايا استجابة (انقباضية ولاسعة) مُشكِّلةً أبسط قوس عصبي.",
        explanationEn:
          "Hydra's nerve net consists of primary nerve cells connected to sensory cells and response cells (contractile and stinging), forming the simplest nerve arch.",
      },
      {
        id: "q-nc-5",
        htmlAr: `<p><strong>السؤال الخامس</strong></p><p>أيٌّ من الكائنات التالية يمتلك أبسط قوس عصبي في المملكة الحيوانية؟</p>`,
        htmlEn: `<p><strong>Question 5</strong></p><p>Which organism possesses the simplest nerve arch in the animal kingdom?</p>`,
        optionsAr: [
          "الهيدرا",
          "الأميبا",
          "البراميسيوم",
          "الديدان الأسطوانية",
        ],
        optionsEn: [
          "Hydra",
          "Amoeba",
          "Paramecium",
          "Roundworms",
        ],
        correctIndex: 0,
        explanationAr:
          "الهيدرا تمتلك أبسط قوس عصبي معروف، يتكوّن من: خلية حسية ← خلية عصبية بدائية ← خلية استجابة (انقباضية أو لاسعة).",
        explanationEn:
          "Hydra possesses the simplest known nerve arch: sensory cell → primary nerve cell → response cell (contractile or stinging).",
      },
    ],
  },
};
