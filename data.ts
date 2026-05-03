export interface Lesson {
  id: string;
  title: string;
  titleAr: string;
  type: "video" | "pdf" | "quiz";
  duration: string;
  completed: boolean;
  pdfUrl?: string;
  videoUrl?: string;
  inlineContent?: string;
}

export interface Chapter {
  id: string;
  title: string;
  titleAr: string;
  lessonCount: number;
  duration: string;
  completed: boolean;
  lessons: Lesson[];
}

export interface Unit {
  id: string;
  number: number;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  chapters: Chapter[];
  totalLessons: number;
  estimatedHours: number;
  completedLessons: number;
  colorIndex: number;
  icon: string;
  locked: boolean;
}

const LESSON_HTML = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --green: #0D5C41; --green-dark: #074030; --green-light: #e8f4ef;
    --blue: #1A4D6E; --blue-light: #eaf1f8;
    --purple: #6B2FAA; --purple-light: #f4eefb;
    --gold: #C9821A; --gold-light: #fef6e8;
    --bg: #f0f4f2; --text: #1a1a2e; --muted: #6b7280;
    --card-bg: #ffffff; --border: #e0ede8;
    --amoeba-hdr: #e8f4ef; --param-hdr: #e6eef7; --hydra-hdr: #f0eaf7;
  }
  body.dark {
    --bg: #111927; --text: #e2e8f0; --muted: #94a3b8;
    --card-bg: #1a2435; --border: #2a3a50;
    /* brighten accent colors so they remain readable on dark backgrounds */
    --green: #34D399; --green-dark: #059669;
    --blue: #60A5FA;
    --purple: #C084FC;
    --gold: #FBBF24;
    --green-light: #0a2418; --blue-light: #0a1828; --purple-light: #1a0a2e;
    --gold-light: #2a1a08;
    --amoeba-hdr: #0d2a1c; --param-hdr: #0a1e32; --hydra-hdr: #1c0a30;
  }
  /* force all table cells to use the theme text color in dark mode */
  body.dark .comp-table td,
  body.dark .comp-table th { color: var(--text) !important; background: var(--card-bg) !important; }
  body.dark .comp-table th { border-bottom-color: var(--border) !important; }
  body.dark .comp-table td { border-bottom-color: var(--border) !important; }
  /* override hardcoded inline colors on algorithm branch titles */
  body.dark .algo-branch-title { color: var(--text) !important; }
  /* override inline gold spans in comparison section */
  body.dark .sl-ar[style], body.dark td[style] { color: var(--gold) !important; }
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    background: var(--bg); color: var(--text);
    padding: 14px 14px 110px; font-size: 15px; line-height: 1.75;
    transition: background 0.3s, color 0.3s;
  }

  /* ── PROGRESS BAR ── */
  #prog {
    position: fixed; top: 0; right: 0; left: 0; height: 4px;
    background: var(--green); width: 0%; z-index: 9999;
    border-radius: 0 3px 3px 0; transition: width 0.12s linear;
  }

  /* ── DARK TOGGLE ── */
  #dark-btn {
    position: fixed; top: 14px; left: 14px; z-index: 9998;
    width: 42px; height: 42px; border-radius: 21px;
    background: var(--card-bg); border: 2px solid var(--border);
    box-shadow: 0 3px 12px rgba(0,0,0,0.18); cursor: pointer;
    font-size: 19px; display: flex; align-items: center; justify-content: center;
    transition: background 0.3s, border-color 0.3s;
  }

  /* ── HERO ── */
  .hero {
    background: linear-gradient(135deg, var(--green-dark) 0%, var(--green) 60%, #1a7a57 100%);
    border-radius: 20px; padding: 26px 20px 22px;
    margin-bottom: 20px; margin-top: 10px; text-align: center;
    box-shadow: 0 6px 24px rgba(13,92,65,0.30);
    position: relative; overflow: hidden;
  }
  .hero::before {
    content: ''; position: absolute; top: -40px; right: -40px;
    width: 130px; height: 130px;
    background: rgba(255,255,255,0.06); border-radius: 50%;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,0.16); border-radius: 20px;
    padding: 4px 14px; font-size: 11px; color: rgba(255,255,255,0.90);
    margin-bottom: 14px; letter-spacing: 0.4px;
  }
  .hero-icon { font-size: 50px; margin-bottom: 12px; display: block; line-height: 1; }
  .hero-title { font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 16px; line-height: 1.35; }
  .hero-desc {
    background: rgba(255,255,255,0.12); border-radius: 12px;
    padding: 12px 16px; font-size: 13px; color: rgba(255,255,255,0.92);
    line-height: 1.70; text-align: right; margin-bottom: 12px;
  }
  .hero-quote {
    font-size: 14px; font-weight: 700; color: #fff;
    background: rgba(255,255,255,0.18); border-radius: 10px;
    padding: 10px 14px; border-right: 3px solid rgba(255,255,255,0.55);
  }

  /* ── SECTION LABELS ── */
  .section-label {
    display: flex; flex-direction: row-reverse; align-items: center;
    gap: 10px; margin-bottom: 12px; margin-top: 4px;
  }
  .sl-icon {
    width: 38px; height: 38px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center; font-size: 20px;
    flex-shrink: 0;
  }
  .sl-ar { font-size: 16px; font-weight: 800; }

  /* ── CARDS ── */
  .card {
    background: var(--card-bg); border-radius: 18px; margin-bottom: 14px;
    overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    transition: background 0.3s;
  }
  .card-header {
    display: flex; flex-direction: row-reverse; align-items: center;
    gap: 12px; padding: 16px 18px 14px;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    transition: background 0.3s;
  }
  .org-emoji { font-size: 38px; flex-shrink: 0; }
  .org-meta { text-align: right; flex: 1; }
  .org-tag {
    display: inline-block; font-size: 10px; font-weight: 700;
    letter-spacing: 0.4px; padding: 2px 9px; border-radius: 10px; margin-bottom: 4px;
  }
  .org-name-ar { font-size: 22px; font-weight: 800; }
  .card-body { padding: 14px 16px 16px; }

  /* ── POINTS ── */
  .point {
    border-radius: 12px; padding: 13px 14px;
    margin-bottom: 10px; border-right: 4px solid currentColor;
    transition: background 0.3s;
  }
  .point-head {
    display: flex; flex-direction: row-reverse; align-items: center;
    gap: 6px; margin-bottom: 8px;
  }
  .pt-icon { font-size: 16px; }
  .pt-title { font-size: 12px; font-weight: 800; letter-spacing: 0.4px; }
  .pt-ar { font-size: 14px; font-weight: 500; line-height: 1.75; text-align: right; }
  strong { font-weight: 700; }

  /* ── UPGRADE BANNER ── */
  .upgrade-banner {
    display: flex; flex-direction: row-reverse; align-items: center; gap: 10px;
    background: linear-gradient(to left, #1A4D6E, #1a6090);
    border-radius: 14px; padding: 14px 16px; margin-bottom: 12px;
    box-shadow: 0 3px 12px rgba(26,77,110,0.25);
  }
  .upg-icon { font-size: 26px; flex-shrink: 0; }
  .upg-label { font-size: 10px; color: rgba(255,255,255,0.72); font-weight: 700; letter-spacing: 0.4px; }
  .upg-title { font-size: 15px; font-weight: 800; color: #fff; }

  /* ── DOMINO ── */
  .domino-box {
    background: linear-gradient(135deg, var(--purple-light), #ece0fa);
    border-radius: 14px; padding: 16px 12px; margin-bottom: 10px;
    transition: background 0.3s;
  }
  body.dark .domino-box { background: linear-gradient(135deg, #1a0a2e, #220e38); }
  .domino-title { font-size: 14px; font-weight: 700; color: var(--purple); text-align: center; margin-bottom: 14px; }
  .domino-desc { font-size: 13px; line-height: 1.65; text-align: right; color: var(--text); margin-bottom: 12px; }
  .domino-flow {
    display: flex; flex-direction: row-reverse; align-items: center;
    justify-content: center; gap: 4px; flex-wrap: wrap;
  }
  .domino-cell {
    background: var(--card-bg); border: 2px solid var(--purple); border-radius: 10px;
    padding: 9px 10px; font-size: 12px; font-weight: 700; color: var(--purple);
    text-align: center; min-width: 62px; transition: background 0.3s;
  }
  .d-arrow { font-size: 16px; color: var(--purple); font-weight: 700; }

  /* ── NERVE ARCH ── */
  .arch-box {
    background: linear-gradient(135deg, #ece6f8, #f0eaf8);
    border-radius: 13px; padding: 16px 14px; margin-bottom: 10px;
    transition: background 0.3s;
  }
  body.dark .arch-box { background: linear-gradient(135deg, #1c0a30, #280e40); }
  .arch-title { font-size: 13px; font-weight: 800; color: var(--purple); text-align: right; margin-bottom: 13px; }
  .arch-flow { display: flex; flex-direction: row-reverse; align-items: stretch; gap: 4px; }
  .arch-step {
    flex: 1; background: var(--card-bg); border-radius: 10px;
    padding: 10px 6px; text-align: center;
    border-bottom: 3px solid var(--purple);
    box-shadow: 0 2px 6px rgba(107,47,170,0.10);
    transition: background 0.3s;
  }
  .arch-step-icon { font-size: 20px; margin-bottom: 6px; display: block; }
  .arch-step-ar { font-size: 11px; font-weight: 700; color: var(--purple); line-height: 1.35; }
  .arch-arr { display: flex; align-items: center; font-size: 16px; color: var(--purple); }

  /* ── VISUAL SUMMARY ── */
  .visual-card {
    background: var(--card-bg); border-radius: 18px; margin-bottom: 14px;
    overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    transition: background 0.3s;
  }
  .vis-header {
    background: linear-gradient(to left, var(--green-dark), var(--green));
    padding: 16px 18px;
    display: flex; flex-direction: row-reverse; align-items: center; gap: 10px;
  }
  .vis-hdr-icon { font-size: 24px; }
  .vis-hdr-ar { font-size: 16px; font-weight: 800; color: #fff; }
  .vis-body { padding: 16px; }

  /* ── TABLE ── */
  .comp-table { width: 100%; border-collapse: collapse; font-size: 13px; direction: rtl; }
  .comp-table th {
    background: var(--green-light); color: var(--green);
    padding: 11px 10px; font-weight: 700; text-align: right;
    border-bottom: 2px solid var(--border); transition: background 0.3s;
  }
  .comp-table td {
    padding: 11px 10px; border-bottom: 1px solid var(--border);
    vertical-align: middle; text-align: right;
  }
  .comp-table tr:last-child td { border-bottom: none; }
  .org-badge { display: inline-block; color: #fff; border-radius: 12px; padding: 3px 10px; font-size: 12px; font-weight: 700; }

  /* ── ALGORITHM TOGGLE ── */
  .algo-btn {
    width: 100%; background: var(--green); color: #fff; border: none;
    border-radius: 12px; padding: 14px 16px; font-size: 14px; font-weight: 700;
    font-family: 'Segoe UI', Arial, sans-serif; cursor: pointer;
    display: flex; flex-direction: row-reverse; align-items: center;
    justify-content: space-between; margin-top: 14px;
  }
  .algo-chevron { font-size: 14px; transition: transform 0.3s; }
  .algo-panel { overflow: hidden; max-height: 0; transition: max-height 0.4s ease; }
  .algo-panel.open { max-height: 800px; }
  .algo-inner { padding: 12px 0 4px; }
  .algo-branch { border-radius: 12px; padding: 14px; margin-bottom: 10px; transition: background 0.3s; }
  .algo-branch-title {
    font-size: 13px; font-weight: 800; margin-bottom: 8px; text-align: right;
    display: flex; flex-direction: row-reverse; align-items: center; gap: 6px;
  }
  .algo-detail { font-size: 13px; line-height: 1.85; text-align: right; }
  .algo-detail em { font-style: normal; font-weight: 700; }
  body.dark .algo-pos { background: #0a2418 !important; }
  body.dark .algo-neg { background: #2a0a0a !important; }

  /* ── FLOATING TOC ── */
  .fab-wrap { position: fixed; bottom: 22px; left: 14px; z-index: 9997; }
  .fab-btn {
    width: 52px; height: 52px; background: var(--green); border: none;
    border-radius: 26px; box-shadow: 0 4px 18px rgba(13,92,65,0.45);
    cursor: pointer; font-size: 22px; color: #fff;
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.2s; font-family: 'Segoe UI', Arial, sans-serif;
  }
  .fab-btn:active { transform: scale(0.92); }
  .toc-panel {
    position: absolute; bottom: 62px; left: 0;
    background: var(--card-bg); border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.22);
    width: 210px; overflow: hidden;
    max-height: 0; opacity: 0;
    transition: max-height 0.35s ease, opacity 0.25s, background 0.3s;
  }
  .toc-panel.open { max-height: 380px; opacity: 1; }
  .toc-hdr { background: var(--green); padding: 11px 14px; font-size: 13px; font-weight: 700; color: #fff; text-align: right; }
  .toc-item {
    display: flex; flex-direction: row-reverse; align-items: center;
    gap: 10px; padding: 13px 14px; border-bottom: 1px solid var(--border);
    cursor: pointer; transition: background 0.15s;
  }
  .toc-item:last-child { border-bottom: none; }
  .toc-item:active { background: var(--green-light); }
  .toc-item-ico { font-size: 18px; flex-shrink: 0; }
  .toc-item-ar { font-size: 13px; font-weight: 600; color: var(--text); }

  /* ── COLOR THEMES ── */
  .amoeba-tag { background: rgba(13,92,65,0.12); color: var(--green); }
  .amoeba-hdr { background: var(--amoeba-hdr); }
  .amoeba-c { color: var(--green); }
  .amoeba-pt { background: var(--green-light); color: var(--green); border-color: var(--green); }

  .param-tag { background: rgba(26,77,110,0.10); color: var(--blue); }
  .param-hdr { background: var(--param-hdr); }
  .param-c { color: var(--blue); }
  .param-pt { background: var(--blue-light); color: var(--blue); border-color: var(--blue); }

  .hydra-tag { background: rgba(107,47,170,0.10); color: var(--purple); }
  .hydra-hdr { background: var(--hydra-hdr); }
  .hydra-c { color: var(--purple); }
  .hydra-pt { background: var(--purple-light); color: var(--purple); border-color: var(--purple); }

  .divider { height: 1px; background: var(--border); margin: 6px 0 16px; }
</style>
</head>
<body>

<!-- ── PROGRESS BAR ── -->
<div id="prog"></div>

<!-- ── DARK MODE TOGGLE ── -->
<button id="dark-btn" onclick="toggleDark()" title="وضع ليلي">🌙</button>

<!-- ===== قسم 1: المقدمة ===== -->
<section id="intro">
<div class="hero">
  <span class="hero-badge">🔬 مخطط التطور العصبي</span>
  <span class="hero-icon">🧬</span>
  <div class="hero-title">التنظيم العصبي في الكائن الحي</div>
  <div class="hero-desc">
    يعتمد بقاء أي كائن حي على قدرته على <strong>الإحساس بالمنبهات والاستجابة لها بكفاءة</strong>.
    منذ الأميبا البدائية حتى الجهاز العصبي المركزي المعقد، كشفت لنا الطبيعة
    كيف تطوّرت "لغة البقاء" عبر ملايين السنين من التطور المتدرّج.
  </div>
  <div class="hero-quote">
    💬 "الجهاز العصبي ليس ترفاً — بل هو لغة البقاء"
  </div>
</div>
</section>

<!-- ===== قسم 2: الأميبا ===== -->
<section id="amoeba-sec">
<div class="section-label">
  <div class="sl-icon" style="background:#e8f4ef;">⚗️</div>
  <div class="sl-ar amoeba-c">الأميبا — كائن وحيد الخلية</div>
</div>

<div class="card">
  <div class="card-header amoeba-hdr">
    <span class="org-emoji">🔵</span>
    <div class="org-meta">
      <span class="org-tag amoeba-tag">كائن وحيد الخلية</span>
      <div class="org-name-ar amoeba-c">الأميبا</div>
    </div>
  </div>
  <div class="card-body">

    <div class="point amoeba-pt">
      <div class="point-head">
        <span class="pt-icon">🧠</span>
        <span class="pt-title amoeba-c">آلية الإحساس — السيتوبلازم</span>
      </div>
      <div class="pt-ar">
        تفتقر الأميبا تماماً لأي جهاز عصبي. تستجيب للمنبهات عن طريق
        <strong>السيتوبلازم (البروتوبلازم)</strong> مباشرةً — فالخلية
        بأكملها تعمل كجهاز استشعار متكامل.
      </div>
    </div>

    <div class="point amoeba-pt">
      <div class="point-head">
        <span class="pt-icon">🦶</span>
        <span class="pt-title amoeba-c">الحركة — الأقدام الكاذبة</span>
      </div>
      <div class="pt-ar">
        عند الإحساس بمنبه، تمتد امتدادات من السيتوبلازم تُعرف بـ
        <strong>الأقدام الكاذبة (Pseudopods)</strong> في اتجاه المنبه أو
        بعيداً عنه، مما يدفع الخلية للتحرك والاستجابة.
      </div>
    </div>

    <div class="point amoeba-pt">
      <div class="point-head">
        <span class="pt-icon">✅</span>
        <span class="pt-title amoeba-c">استجابة إيجابية</span>
      </div>
      <div class="pt-ar">
        تتحرك <strong>نحو</strong> الغذاء والتركيزات الكيميائية الملائمة
        ودرجة الحرارة المناسبة.
      </div>
    </div>

    <div class="point amoeba-pt">
      <div class="point-head">
        <span class="pt-icon">❌</span>
        <span class="pt-title amoeba-c">استجابة سلبية</span>
      </div>
      <div class="pt-ar">
        تبتعد عن <strong>الضوء الشديد</strong>، <strong>التركيزات
        الكيميائية العالية</strong>، والمنبهات الضارة.
      </div>
    </div>

  </div>
</div>
</section>

<!-- ===== قسم 3: البراميسيوم ===== -->
<section id="param-sec">
<div class="upgrade-banner">
  <span class="upg-icon">⚙️</span>
  <div>
    <div class="upg-label">ترقية ميكانيكية</div>
    <div class="upg-title">البراميسيوم</div>
  </div>
</div>

<div class="section-label">
  <div class="sl-icon" style="background:#eaf1f8;">🔧</div>
  <div class="sl-ar param-c">البراميسيوم — الترقية الميكانيكية</div>
</div>

<div class="card">
  <div class="card-header param-hdr">
    <span class="org-emoji">🟦</span>
    <div class="org-meta">
      <span class="org-tag param-tag">كائن وحيد الخلية متطور</span>
      <div class="org-name-ar param-c">البراميسيوم</div>
    </div>
  </div>
  <div class="card-body">

    <div class="point param-pt">
      <div class="point-head">
        <span class="pt-icon">🧵</span>
        <span class="pt-title param-c">الخيوط العصبية الحركية</span>
      </div>
      <div class="pt-ar">
        على عكس الأميبا، يمتلك البراميسيوم <strong>خيوطاً عصبية حركية
        (Neuromotor Fibers)</strong> تمتد أسفل الغشاء الخلوي على طول جسمه.
        تمثّل هذه الخيوط أولى "البنى التحتية العصبية" في تاريخ التطور.
      </div>
    </div>

    <div class="point param-pt">
      <div class="point-head">
        <span class="pt-icon">⚙️</span>
        <span class="pt-title param-c">الحبيبات القاعدية للأهداب</span>
      </div>
      <div class="pt-ar">
        تربط هذه الخيوط <strong>الحبيبات القاعدية (Basal Granules)</strong>
        للأهداب ببعضها، مما يُنسّق حركتها المتزامنة ويُوجّهها كاستجابة
        دقيقة للمنبهات البيئية المحيطة.
      </div>
    </div>

  </div>
</div>
</section>

<div class="divider"></div>

<!-- ===== قسم 4: الهيدرا ===== -->
<section id="hydra-sec">
<div class="section-label">
  <div class="sl-icon" style="background:#f0eaf7;">🌅</div>
  <div class="sl-ar hydra-c">الهيدرا — فجر الجهاز العصبي</div>
</div>

<div class="card">
  <div class="card-header hydra-hdr">
    <span class="org-emoji">🟣</span>
    <div class="org-meta">
      <span class="org-tag hydra-tag">أبسط حيوان ذو جهاز عصبي حقيقي</span>
      <div class="org-name-ar hydra-c">الهيدرا</div>
    </div>
  </div>
  <div class="card-body">

    <div class="point hydra-pt">
      <div class="point-head">
        <span class="pt-icon">🕸️</span>
        <span class="pt-title hydra-c">الشبكة العصبية — أبسط جهاز عصبي</span>
      </div>
      <div class="pt-ar">
        تمتلك الهيدرا <strong>شبكة عصبية (Nerve Net)</strong> تُعدّ
        <strong>أبسط جهاز عصبي في المملكة الحيوانية</strong>. لا مركز تحكم،
        لا دماغ — فقط شبكة من الخلايا المترابطة تنتشر في جميع أنحاء الجسم.
      </div>
    </div>

    <!-- تأثير الدومينو -->
    <div class="domino-box">
      <div class="domino-title">⚡ تأثير الدومينو</div>
      <div class="domino-desc">
        عند إثارة أي نقطة في جسم الهيدرا، تُحفَّز الخلايا العصبية
        المجاورة تسلسلياً كحجارة الدومينو حتى تصل الإشارة لخلايا الاستجابة.
      </div>
      <div class="domino-flow">
        <div class="domino-cell">منبّه</div>
        <div class="d-arrow">←</div>
        <div class="domino-cell">خلية حسية</div>
        <div class="d-arrow">←</div>
        <div class="domino-cell">شبكة عصبية</div>
        <div class="d-arrow">←</div>
        <div class="domino-cell">استجابة</div>
      </div>
    </div>

    <!-- القوس العصبي -->
    <div class="arch-box">
      <div class="arch-title">⚡ أبسط قوس عصبي في الطبيعة</div>
      <div class="arch-flow">
        <div class="arch-step">
          <span class="arch-step-icon">👁</span>
          <div class="arch-step-ar">خلية حسية</div>
        </div>
        <div class="arch-arr">←</div>
        <div class="arch-step">
          <span class="arch-step-icon">⚡</span>
          <div class="arch-step-ar">خلية عصبية بدائية</div>
        </div>
        <div class="arch-arr">←</div>
        <div class="arch-step">
          <span class="arch-step-icon">💪</span>
          <div class="arch-step-ar">خلية استجابة</div>
        </div>
      </div>
    </div>

  </div>
</div>
</section>

<div class="divider"></div>

<!-- ===== قسم 5: المقارنة والخلاصة ===== -->
<section id="compare-sec">
<div class="section-label">
  <div class="sl-icon" style="background:#fef6e8;">📊</div>
  <div class="sl-ar" style="color:#C9821A;">جدول المقارنة والمراجعة</div>
</div>

<div class="visual-card">
  <div class="vis-header">
    <span class="vis-hdr-icon">📋</span>
    <div class="vis-hdr-ar">مقارنة الكائنات الثلاثة</div>
  </div>
  <div class="vis-body">

    <table class="comp-table">
      <thead>
        <tr>
          <th>الكائن الحي</th>
          <th>آلية التنظيم العصبي</th>
          <th>مستوى التعقيد</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="org-badge" style="background:#0D5C41;">الأميبا</span></td>
          <td>سيتوبلازم + أقدام كاذبة</td>
          <td style="color:#C9821A; font-weight:700;">★☆☆</td>
        </tr>
        <tr>
          <td><span class="org-badge" style="background:#1A4D6E;">البراميسيوم</span></td>
          <td>خيوط عصبية حركية + حبيبات قاعدية</td>
          <td style="color:#C9821A; font-weight:700;">★★☆</td>
        </tr>
        <tr>
          <td><span class="org-badge" style="background:#6B2FAA;">الهيدرا</span></td>
          <td>شبكة عصبية — أبسط جهاز عصبي</td>
          <td style="color:#C9821A; font-weight:700;">★★★</td>
        </tr>
      </tbody>
    </table>

    <button class="algo-btn" id="algo-btn" onclick="toggleAlgo()">
      <span>⚙️ خوارزمية الاستجابة</span>
      <span class="algo-chevron" id="algo-chev">▼</span>
    </button>
    <div class="algo-panel" id="algo-panel">
      <div class="algo-inner">

        <div class="algo-branch algo-pos" style="background:#eef7f3; border-right:4px solid #0D5C41;">
          <div class="algo-branch-title" style="color:#0D5C41;">
            <span>✅</span>
            <span>استجابة إيجابية</span>
          </div>
          <div class="algo-detail">
            🔍 <strong>المنبه:</strong> الغذاء / حرارة مناسبة / تركيز كيميائي منخفض<br>
            ⚡ <strong>القرار:</strong> <em>اقتراب!</em><br>
            🏃 <strong>الحركة:</strong><br>
            • الأميبا: امتداد الأقدام الكاذبة نحو المصدر<br>
            • البراميسيوم: ضرب الأهداب باتجاه المصدر<br>
            • الهيدرا: انقباض الخلايا نحو المنبه
          </div>
        </div>

        <div class="algo-branch algo-neg" style="background:#fef2f2; border-right:4px solid #dc2626;">
          <div class="algo-branch-title" style="color:#dc2626;">
            <span>❌</span>
            <span>استجابة سلبية</span>
          </div>
          <div class="algo-detail">
            🔍 <strong>المنبه:</strong> الضوء الشديد / تركيز كيميائي عالٍ / مواد ضارة<br>
            ⚡ <strong>القرار:</strong> <em>ابتعاد!</em><br>
            🏃 <strong>الحركة:</strong><br>
            • الأميبا: امتداد الأقدام الكاذبة بعيداً<br>
            • البراميسيوم: عكس حركة الأهداب<br>
            • الهيدرا: تقلص الخلايا اللاسعة
          </div>
        </div>

      </div>
    </div>

  </div>
</div>
</section>

<!-- ===== الفهرس العائم ===== -->
<div class="fab-wrap">
  <div class="toc-panel" id="toc-panel">
    <div class="toc-hdr">📚 فهرس الدرس</div>
    <div class="toc-item" onclick="goTo('intro')">
      <span class="toc-item-ico">🧬</span>
      <div class="toc-item-ar">المقدمة</div>
    </div>
    <div class="toc-item" onclick="goTo('amoeba-sec')">
      <span class="toc-item-ico">🔵</span>
      <div class="toc-item-ar">الأميبا</div>
    </div>
    <div class="toc-item" onclick="goTo('param-sec')">
      <span class="toc-item-ico">🟦</span>
      <div class="toc-item-ar">البراميسيوم</div>
    </div>
    <div class="toc-item" onclick="goTo('hydra-sec')">
      <span class="toc-item-ico">🟣</span>
      <div class="toc-item-ar">الهيدرا</div>
    </div>
    <div class="toc-item" onclick="goTo('compare-sec')">
      <span class="toc-item-ico">📊</span>
      <div class="toc-item-ar">جدول المقارنة</div>
    </div>
  </div>
  <button class="fab-btn" onclick="toggleTOC()">📚</button>
</div>

<script>
var tocOpen = false;
var algoOpen = false;
var darkOn = false;

// شريط التقدم
window.addEventListener('scroll', function() {
  var s = document.documentElement.scrollTop || document.body.scrollTop;
  var h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  document.getElementById('prog').style.width = (h > 0 ? (s / h) * 100 : 0) + '%';
});

// وضع ليلي
function toggleDark() {
  darkOn = !darkOn;
  document.body.classList.toggle('dark', darkOn);
  document.getElementById('dark-btn').textContent = darkOn ? '☀️' : '🌙';
}

// الفهرس العائم
function toggleTOC() {
  tocOpen = !tocOpen;
  var p = document.getElementById('toc-panel');
  p.classList.toggle('open', tocOpen);
}

function goTo(id) {
  var el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  tocOpen = false;
  document.getElementById('toc-panel').classList.remove('open');
}

// خوارزمية الاستجابة
function toggleAlgo() {
  algoOpen = !algoOpen;
  document.getElementById('algo-panel').classList.toggle('open', algoOpen);
  document.getElementById('algo-chev').style.transform = algoOpen ? 'rotate(180deg)' : '';
}
</script>

</body>
</html>`;

export const BIOLOGY_UNITS: Unit[] = [
  {
    id: "unit-nc-1",
    number: 1,
    title: "Nervous Coordination in Living Organisms",
    titleAr: "التنظيم العصبي في الكائن الحي",
    description:
      "Study how living organisms coordinate their responses to stimuli, from unicellular organisms to complex nervous systems.",
    descriptionAr:
      "دراسة كيفية تنسيق الكائنات الحية لاستجاباتها للمنبهات، من الكائنات وحيدة الخلية إلى الأجهزة العصبية المعقدة.",
    colorIndex: 0,
    icon: "cellular",
    locked: false,
    estimatedHours: 0.5,
    totalLessons: 2,
    completedLessons: 0,
    chapters: [
      {
        id: "ch-nc-1-1",
        title: "Nervous Coordination in Simple Organisms",
        titleAr: "التنظيم العصبي في الكائنات البسيطة",
        lessonCount: 2,
        duration: "25 min",
        completed: false,
        lessons: [
          {
            id: "l-nc-1-1-1",
            title: "Nervous Coordination in: Amoeba, Paramecium, and Hydra",
            titleAr: "التنظيم العصبي في: الأميبا، البراميسيوم، والهيدرا",
            type: "pdf",
            duration: "15 min",
            completed: false,
            inlineContent: LESSON_HTML,
          },
          {
            id: "l-nc-1-1-2",
            title: "Nervous Coordination Quiz",
            titleAr: "اختبار التنظيم العصبي",
            type: "quiz",
            duration: "10 min",
            completed: false,
          },
        ],
      },
    ],
  },
];
