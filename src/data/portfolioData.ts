export type Lang = 'en' | 'tr';

export interface BilingualText {
  en: string;
  tr: string;
}

export interface ExperienceItem {
  id: string;
  role: BilingualText;
  company: string;
  period: BilingualText;
  location: BilingualText;
  type: BilingualText;
  repoUrl?: string;
  liveUrl?: string;
  mentors?: BilingualText;
  bullets: {
    en: string[];
    tr: string[];
  };
  tags: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  badge?: BilingualText;
  category: 'ml' | 'web' | 'systems';
  period: BilingualText;
  repoUrl?: string;
  liveUrl?: string;
  liveLabel?: string;
  tech: string[];
  summary: BilingualText;
  metrics?: {
    label: BilingualText;
    value: string;
  }[];
  bullets: {
    en: string[];
    tr: string[];
  };
  agentNote?: BilingualText;
}

export const PROFILE_DATA = {
  name: 'Süleyman Kara',
  title: {
    en: 'Computer Engineer · Machine Learning & Full-Stack Builder',
    tr: 'Bilgisayar Mühendisi · Makine Öğrenmesi & Full-Stack Geliştirici',
  },
  location: {
    en: 'Adana, Türkiye',
    tr: 'Adana, Türkiye',
  },
  email: 'suleymankara600@gmail.com',
  github: 'https://github.com/suleyman-kara',
  githubHandle: 'github.com/suleyman-kara',
  linkedin: 'https://linkedin.com/in/suleymankara',
  linkedinHandle: 'linkedin.com/in/suleymankara',
  kaggle: 'https://kaggle.com/sleymankara',
  summary: {
    en: 'Third-year Computer Engineering student at Çukurova University, focused on machine learning and on building web and AI-powered applications with AI coding agents, through internships, competitions, and independent projects.',
    tr: 'Çukurova Üniversitesi 3. sınıf Bilgisayar Mühendisliği öğrencisi. Stajlar, yarışmalar ve bağımsız projeler aracılığıyla makine öğrenmesi ile yapay zeka kodlama ajanlarını (AI coding agents) kullanarak web ve AI destekli uygulamalar geliştirmeye odaklanıyor.',
  },
  agenticStatement: {
    en: 'Build and ship full applications with AI coding agents (Claude Code), using agentic features such as Claude skills and sub-agents, plus agent rules files, tests, CI, and releases.',
    tr: 'Mimari tasarımı, kararları ve kod incelemesini yöneterek; Claude Code, alt ajanlar (sub-agents), CLAUDE.md proje hafızası kuralları, otomatik testler ve GitHub Actions CI/CD hatlarıyla uçtan uca uygulamalar geliştirir ve yayınlar.',
  },
  education: {
    school: {
      en: 'Çukurova University',
      tr: 'Çukurova Üniversitesi',
    },
    degree: {
      en: 'B.Sc. in Computer Engineering (3rd Year)',
      tr: 'Bilgisayar Mühendisliği Lisans (3. Sınıf)',
    },
    period: {
      en: 'Sep 2024 – Jun 2028 (Expected)',
      tr: 'Eylül 2024 – Haziran 2028 (Beklenen)',
    },
    gpa: '3.20 / 4.00',
    location: 'Adana, Türkiye',
  },
  systemMetrics: [
    {
      code: 'NODE-ML-01',
      label: { en: 'TEKNOFEST 2026 AI in Healthcare', tr: 'TEKNOFEST 2026 Sağlıkta Yapay Zeka' },
      value: '92/100',
      sub: { en: 'Prelim Score · Semi-Finalist (78/100 Tech)', tr: 'Ön Değerlendirme · Yarı Finalist (78/100 Teknik)' },
    },
    {
      code: 'NODE-GENAI-02',
      label: { en: 'GenAI Idea-to-Product Hackathon', tr: 'GenAI Fikirden Ürüne Maratonu' },
      value: '3rd Place',
      sub: { en: 'Çukurova GİK · DersimHazır (Dec 2025)', tr: 'Çukurova GİK · DersimHazır (Aralık 2025)' },
    },
    {
      code: 'NODE-GPA-03',
      label: { en: 'Çukurova University B.Sc. CE', tr: 'Çukurova Üni. Bilgisayar Müh.' },
      value: '3.20 / 4.00',
      sub: { en: '3rd Year Undergraduate · Class of 2028', tr: '3. Sınıf Lisans Öğrencisi · 2028 Mezuniyeti' },
    },
    {
      code: 'NODE-OPS-04',
      label: { en: 'Languages & Communication', tr: 'Dil Yetkinliği & İletişim' },
      value: 'EN C1 / TR',
      sub: { en: 'Turkish (Native) · English (C1 Advanced)', tr: 'Türkçe (Ana Dil) · İngilizce (C1 İleri)' },
    },
  ],
};

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'efa-ml',
    role: {
      en: 'Data Science & ML Intern',
      tr: 'Veri Bilimi ve Makine Öğrenmesi Stajyeri',
    },
    company: 'EFA',
    period: {
      en: 'Jun 2026 – Jul 2026',
      tr: 'Haziran 2026 – Temmuz 2026',
    },
    location: {
      en: 'Adana, Türkiye · Hybrid',
      tr: 'Adana, Türkiye · Hibrit',
    },
    type: {
      en: 'Internship',
      tr: 'Staj',
    },
    repoUrl: 'https://github.com/suleyman-kara/retail-sales-forecasting',
    mentors: {
      en: 'Advisors: Sude Sarı, Prof. Mehmet Fatih Akay',
      tr: 'Danışmanlar: Sude Sarı, Prof. Dr. Mehmet Fatih Akay',
    },
    bullets: {
      en: [
        'Built an end-to-end sales forecasting pipeline (XGBoost) on the Walmart Sales Forecast dataset, covering data preprocessing, feature engineering, and model evaluation.',
        'Compared feature selection algorithms (MRMR, RFE, SFS) across varying feature counts to identify the best-performing feature subset.',
        'Tuned model hyperparameters using Grid Search and Bayesian Optimization (scikit-optimize).',
        'Built a dataset-agnostic Streamlit web application that runs the same pipeline on any uploaded dataset, with configurable feature engineering and tuning options.',
        'Engineered Year, Month, Week of Year, Quarter, and lag features (Target Lag 1, Target Lag 52); joined train and test sets before feature engineering so lag features do not restart at zero in the test set.',
        'Diagnosed a MAPE failure on zero-valued targets (scikit-learn epsilon division spike) and resolved it by filtering zero actuals and ranking models by MAE.',
      ],
      tr: [
        'Walmart Satış Tahmini veri seti üzerinde veri ön işleme, özellik mühendisliği (feature engineering) ve model değerlendirmesini kapsayan uçtan uca bir satış tahminleme hattı (XGBoost) kurdu.',
        'En iyi performans gösteren özellik alt kümesini belirlemek için farklı özellik sayılarında seçim algoritmalarını (MRMR, RFE, SFS) karşılaştırdı.',
        'Grid Search ve Bayesian Optimization (scikit-optimize) kullanarak model hiperparametrelerini optimize etti.',
        'Yüklenen herhangi bir veri seti üzerinde aynı hattı çalıştırabilen, yapılandırılabilir özellik mühendisliği ve optimizasyon seçeneklerine sahip veri setinden bağımsız bir Streamlit web uygulaması geliştirdi.',
        'Yıl, Ay, Yılın Haftası, Çeyrek ve gecikme özellikleri (Target Lag 1, Target Lag 52) üretti; test setinde gecikme özelliklerinin sıfırdan başlamasını önlemek için eğitim ve test setlerini birleştirerek işledi.',
        'Sıfır değerli hedeflerdeki MAPE hesaplama hatasını (scikit-learn epsilon bölünmesi) teşhis etti ve sıfır gerçek değerleri atlayıp modelleri MAE ile sıralayarak çözdü.',
      ],
    },
    tags: ['XGBoost', 'Scikit-Learn', 'Scikit-Optimize', 'MRMR / RFE / SFS', 'Streamlit', 'Pandas', 'Time Series Forecasting'],
  },
  {
    id: 'pitwall-fs',
    role: {
      en: 'Software Developer (Pitwall)',
      tr: 'Yazılım Geliştirici (Pitwall)',
    },
    company: '1.5 Adana Formula Student Team',
    period: {
      en: 'Feb 2026 – Oct 2026',
      tr: 'Şubat 2026 – Ekim 2026',
    },
    location: {
      en: 'Adana, Türkiye · Hybrid',
      tr: 'Adana, Türkiye · Hibrit',
    },
    type: {
      en: 'Part-time',
      tr: 'Yarı Zamanlı',
    },
    bullets: {
      en: [
        'Engineered backend services and API integrations for Pitwall, the team’s internal project and task management platform (Django 5 + DRF backend, React + Vite + TypeScript frontend, Supabase Postgres).',
        'Added a token refresh route, a 401 unauthorized interceptor, and email-based authentication login to the Pitwall application.',
        'Connected the calendar, projects, and search views to the backend API; resolved issues in the members endpoint, user serializer, and seed data.',
        'Implemented a real-time active user presence indicator in the application sidebar and updated the API contract and backend documentation.',
      ],
      tr: [
        'Takımın iç görev ve proje yönetim platformu Pitwall için backend servisleri ve API entegrasyonları geliştirdi (Django 5 + DRF backend, React + Vite + TypeScript frontend, Supabase Postgres).',
        'Pitwall uygulamasına token yenileme rotası (refresh route), 401 interceptor ve e-posta tabanlı giriş sistemini ekledi.',
        'Takvim, projeler ve arama görünümlerini backend API’sine bağladı; üye (members) uç noktasını, kullanıcı serializer yapısını ve başlangıç verilerini (seed data) düzeltti.',
        'Kenar çubuğuna gerçek zamanlı aktif kullanıcı göstergesi (presence) ekledi; API kontratını ve backend dokümantasyonunu güncelledi.',
      ],
    },
    tags: ['Django 5', 'Django REST Framework', 'React', 'TypeScript', 'Supabase Postgres', 'REST API', 'GitHub Actions'],
  },
  {
    id: 'merci-insurance',
    role: {
      en: 'Web Developer',
      tr: 'Web Geliştirici',
    },
    company: 'Merci Insurance',
    period: {
      en: 'Mar 2026 – Apr 2026',
      tr: 'Mart 2026 – Nisan 2026',
    },
    location: {
      en: 'Mersin, Erdemli · Remote',
      tr: 'Mersin, Erdemli · Uzaktan',
    },
    type: {
      en: 'Freelance',
      tr: 'Freelance',
    },
    liveUrl: 'https://www.mercisigorta.com',
    repoUrl: 'https://github.com/suleyman-kara/merci-sigorta-web',
    bullets: {
      en: [
        'Built a multilingual corporate website for an insurance consultancy business using Eleventy v3, Nunjucks, and JavaScript.',
        'Shipped English, Turkish, and Russian versions with automatic browser language detection and a comprehensive technical SEO setup.',
        'Optimized site performance using AVIF/WebP next-gen image formats and minified assets.',
        'Configured build-time static fetching of Google Business reviews and automated weekly site rebuilds via GitHub Actions on GitHub Pages.',
      ],
      tr: [
        'Eleventy v3, Nunjucks ve JavaScript kullanarak bir sigorta danışmanlık şirketi için çok dilli kurumsal web sitesi geliştirdi.',
        'Otomatik dil algılama ve kapsamlı SEO yapılandırması ile Türkçe, İngilizce ve Rusça sürümlerini yayına aldı.',
        'AVIF/WebP görüntü formatları ve küçültülmüş (minified) kod çıktılarıyla sayfa performansını optimize etti.',
        'Derleme (build) anında Google İşletme yorumlarını statik olarak çeken ve GitHub Actions ile her hafta otomatik yeniden derlenen GitHub Pages mimarisi kurdu.',
      ],
    },
    tags: ['Eleventy v3', 'Nunjucks', 'JavaScript', 'Technical SEO', 'AVIF/WebP', 'GitHub Actions'],
  },
  {
    id: 'cenga-club',
    role: {
      en: 'Social Events Coordinator',
      tr: 'Sosyal Etkinlikler Koordinatörü',
    },
    company: 'CENGA (Çukurova Computer Engineering Club)',
    period: {
      en: 'Aug 2026 – Present',
      tr: 'Ağustos 2026 – Günümüz',
    },
    location: {
      en: 'Adana, Türkiye · Hybrid',
      tr: 'Adana, Türkiye · Hibrit',
    },
    type: {
      en: 'Part-time · Community',
      tr: 'Yarı Zamanlı · Topluluk',
    },
    bullets: {
      en: [
        'Designed informal networking activities to strengthen peer connections and boost active student participation across the computer engineering community.',
        'Organizing department-wide technical networking and social events to foster peer collaboration and engineering culture.',
      ],
      tr: [
        'Bilgisayar mühendisliği topluluğunda akran iletişimini güçlendirmek ve aktif katılımı artırmak için sosyal etkileşim etkinlikleri tasarladı.',
        'Bölüm genelinde iş birliğini ve topluluk kültürünü geliştirmek amacıyla tanışma ve sosyal etkinlikler organize ediyor.',
      ],
    },
    tags: ['Team Leadership', 'Community Building', 'Event Coordination'],
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'pathguard',
    name: 'PathGuard',
    badge: {
      en: 'TEKNOFEST 2026 AI in Healthcare · Semi-Finalist',
      tr: 'TEKNOFEST 2026 Sağlıkta Yapay Zeka · Yarı Finalist',
    },
    category: 'ml',
    period: { en: 'Apr 2026 – Jun 2026', tr: 'Nisan 2026 – Haziran 2026' },
    repoUrl: 'https://github.com/MEN-INA/pathGuard',
    tech: ['Python', 'LightGBM', 'XGBoost', 'Optuna', 'Scikit-Learn', 'SHAP', 'Isotonic Calibration'],
    summary: {
      en: 'Machine learning pipeline classifying missense genetic variants as Pathogenic or Benign across four independent clinical panel models (Master, Cancer, PAH, CFTR).',
      tr: 'Missense genetik varyantları Patojenik veya Benign olarak sınıflandıran, dört bağımsız klinik panel modeli (Master, Cancer, PAH, CFTR) üreten makine öğrenmesi hattı.',
    },
    metrics: [
      { label: { en: 'Prelim Evaluation', tr: 'Ön Değerlendirme' }, value: '92 / 100' },
      { label: { en: 'CFTR Panel Test F1', tr: 'CFTR Paneli Test F1' }, value: '0.7671' },
      { label: { en: 'Cancer Panel Test F1', tr: 'Kanser Paneli Test F1' }, value: '0.7138' },
      { label: { en: 'Avg F1 Gain vs Baseline', tr: 'Baz Modele Göre F1 Artışı' }, value: '+2.07 pp' },
    ],
    bullets: {
      en: [
        'Built the training pipeline (LightGBM + XGBoost tuned with Optuna, 5-fold stratified CV, isotonic probability calibration, and soft-voting vs stacking ensemble selection) and engineered most of the modeling pipeline.',
        'Implemented custom variant feature encoding, missingness indicator flags, IterativeImputer/median imputation by missing rate, RobustScaler, deduplication, and label-conflict removal with strict data leakage checks.',
        'Decoupled panel models (Master, Cancer, PAH, CFTR) and calibrated decision thresholds specifically for the 20% pathogenic test prior, achieving deterministic reproducible runs (seed 42).',
      ],
      tr: [
        'Optuna ile optimize edilmiş LightGBM + XGBoost, 5-katlı katmanlı çapraz doğrulama, izotonik olasılık kalibrasyonu ve soft-voting/stacking topluluk (ensemble) seçimini içeren eğitim ve modelleme hattını kurdu.',
        'Özel varyant özellik kodlayıcı, eksiklik bayrakları (missingness flags), eksiklik oranına göre IterativeImputer/medyan atama, RobustScaler ve veri sızıntısı (data leakage) kontrolüyle tekilleştirme adımlarını geliştirdi.',
        'Panel modellerini (Master, Cancer, PAH, CFTR) ayrıştırdı ve %20 patojenik test öncülüne (prior) göre eşik seçimi yaparak tekrarlanabilir (seed 42) sonuçlar elde etti.',
      ],
    },
    agentNote: {
      en: 'Maintained structured agent rules (CLAUDE.md) enforcing document hierarchy, target metric constraints, and changelog standards across sessions.',
      tr: 'Oturumlar arası doküman önceliği, hedef metrik ve değişiklik kaydı kurallarını koruyan CLAUDE.md ajan hafıza mimarisiyle yönetildi.',
    },
  },
  {
    id: 'servis-agi',
    name: 'Servis Ağı',
    badge: {
      en: 'Full-Stack Marketplace · Web & Android Live Test',
      tr: 'Full-Stack Pazaryeri · Web & Android Test Yayını',
    },
    category: 'web',
    period: { en: 'Oct 2026', tr: 'Ekim 2026' },
    repoUrl: 'https://github.com/suleyman-kara/servis-agi-app',
    tech: ['Expo / React Native', 'React', 'Vite', 'Tailwind CSS', 'Supabase', 'PostgreSQL RLS', 'Cloudflare Pages', 'GitHub Actions'],
    summary: {
      en: 'Shuttle service marketplace in Istanbul connecting passengers looking for school, staff, and one-time transport with drivers submitting sealed monthly price offers.',
      tr: 'İstanbul’da okul, personel ve tek seferlik servis arayanlarla kapalı zarf aylık fiyat teklifi veren sürücüleri buluşturan pazaryeri uygulaması.',
    },
    metrics: [
      { label: { en: 'Platforms', tr: 'Platformlar' }, value: 'Android APK + Web' },
      { label: { en: 'Business Logic', tr: 'İş Kuralları' }, value: 'DB Triggers & RLS' },
      { label: { en: 'Deployment', tr: 'Dağıtım' }, value: 'Cloudflare Pages' },
    ],
    bullets: {
      en: [
        'Enforced core business rules directly inside the database (PostgreSQL constraints, triggers, atomic functions, and Row-Level Security) with client apps acting as thin callers; expired driver documents automatically remove vehicles from bidding.',
        'Added real-time bid and status updates via Supabase Realtime, an admin document review dashboard, and KVKK-compliant consent and account deletion flows.',
        'Automated testing and delivery with GitHub Actions: database rule tests, E2E scenarios, Vitest and Jest suites, automatic Cloudflare Pages deployment, DB migrations, and signed APK builds.',
      ],
      tr: [
        'İş kurallarını doğrudan veritabanına (kısıtlar, tetikleyiciler, atomik fonksiyonlar, satır düzeyi güvenlik / RLS) taşıdı; süresi dolan belgeler aracı otomatik olarak teklif vermekten düşürür.',
        'Supabase Realtime ile gerçek zamanlı güncellemeler, belge inceleme ve yönetici paneli ile KVKK uyumlu açık rıza ve hesap silme akışlarını ekledi.',
        'GitHub Actions ile veritabanı kural testleri, uçtan uca (E2E) senaryolar, Vitest/Jest testleri, otomatik Cloudflare Pages yayını, DB migration ve imzalı APK derlemelerini otomatikleştirdi.',
      ],
    },
  },
  {
    id: 'shock-convert',
    name: 'Shock Convert',
    badge: {
      en: 'Windows Native Utility · Rust Workspace',
      tr: 'Windows Masaüstü Aracı · Rust Workspace',
    },
    category: 'systems',
    period: { en: 'Oct 2026', tr: 'Ekim 2026' },
    repoUrl: 'https://github.com/suleyman-kara/shock-convert',
    liveUrl: 'https://shockconvert.suleymankara.com',
    liveLabel: 'shockconvert.suleymankara.com',
    tech: ['Rust', 'Windows Shell Integration', 'Parallel Processing', 'GitHub Actions', 'Semantic Release'],
    summary: {
      en: 'Fast, lightweight Windows image conversion tool (PNG, JPG, WebP, BMP, GIF, TIFF, ICO) integrated directly into the File Explorer right-click context menu.',
      tr: 'Dosya Gezgini sağ tık menüsünden görüntüleri (PNG, JPG, WebP, BMP, GIF, TIFF, ICO) hızla dönüştüren küçük ve hızlı Windows aracı.',
    },
    metrics: [
      { label: { en: 'Formats', tr: 'Format Desteği' }, value: '7 Image Formats' },
      { label: { en: 'Architecture', tr: 'Mimari' }, value: 'Core Lib + CLI Crates' },
      { label: { en: 'CI Workflows', tr: 'CI İş Akışları' }, value: '4 Automated Pipelines' },
    ],
    bullets: {
      en: [
        'Engineered custom conversion presets, parallel batch conversion, a no-admin installer, and an extensible plugin system structured as a Rust workspace (core library and CLI crates) with unit tests.',
        'Automated release engineering with 4 GitHub Actions workflows: every pull request publishes a pre-release installer artifact for testing, merging to main triggers a label-driven semantic-versioned release, and updates the download site on GitHub Pages.',
        'Developed with AI coding assistance (Claude Code) while leading system architecture, crate boundaries, and code review.',
      ],
      tr: [
        'Özel dönüştürme ön ayarları (presets), paralel toplu dönüştürme, yönetici izni gerektirmeyen kurulum (no-admin installer) ve eklenti sistemini Rust workspace (çekirdek kütüphane ve CLI crate’leri) olarak birim testleriyle geliştirdi.',
        'GitHub Actions ile sürüm süreçlerini otomatikleştirdi: her PR test için bir ön-sürüm kurulum dosyası yayınlar, main dalına birleştirme PR etiketlerine göre semantik sürüm oluşturur ve indirme sitesini günceller.',
        'Mimari kararları, crate sınırlarını ve kod incelemesini yürüterek AI destekli geliştirme (Claude Code) ile tamamlandı.',
      ],
    },
  },
  {
    id: 'dersim-hazir',
    name: 'DersimHazır',
    badge: {
      en: '3rd Place · GenAI Idea-to-Product Hackathon',
      tr: '3.’lük Ödülü · GenAI Fikirden Ürüne Maratonu',
    },
    category: 'web',
    period: { en: 'Dec 2025', tr: 'Aralık 2025' },
    repoUrl: 'https://github.com/suleyman-kara/dersimHazir',
    tech: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'Google GenAI SDK (Gemini)'],
    summary: {
      en: 'AI-powered study material generation web application built with Astra Team using React 19 and Google Gemini.',
      tr: 'Astra Takımı ile React 19 ve Google Gemini (GenAI SDK) kullanılarak geliştirilen yapay zeka destekli çalışma materyali üretme uygulaması.',
    },
    metrics: [
      { label: { en: 'Hackathon Rank', tr: 'Yarışma Derecesi' }, value: '3rd Place' },
      { label: { en: 'AI Engine', tr: 'Yapay Zeka' }, value: 'Google Gemini SDK' },
    ],
    bullets: {
      en: [
        'Built an interactive study workspace featuring adjustable note length and narrative tone, automatic concept image generation, podcast audio mode, and interactive quizzes.',
        'Awarded 3rd place at the Çukurova University "Fikirden Ürüne" (GenAI Idea-to-Product) Hackathon in December 2025.',
      ],
      tr: [
        'Ayarlanabilir not uzunluğu ve anlatım tonu, otomatik görsel üretimi, podcast modu ve interaktif sınav (quiz) özelliklerine sahip çalışma platformu geliştirdi.',
        'Aralık 2025’te Çukurova Üniversitesi "Fikirden Ürüne" (GenAI Idea-to-Product) Maratonu’nda 3.’lük derecesi kazandı.',
      ],
    },
  },
  {
    id: 'retail-sales-forecasting',
    name: 'Retail Sales Forecasting App',
    badge: {
      en: 'Dataset-Agnostic ML Web App',
      tr: 'Veri Setinden Bağımsız ML Uygulaması',
    },
    category: 'ml',
    period: { en: 'Jun 2026 – Jul 2026', tr: 'Haziran 2026 – Temmuz 2026' },
    repoUrl: 'https://github.com/suleyman-kara/retail-sales-forecasting',
    tech: ['Python', 'Streamlit', 'XGBoost', 'Scikit-Optimize', 'Pandas', 'NumPy'],
    summary: {
      en: 'Interactive Streamlit forecasting platform executing automated lag engineering, feature selection (MRMR/RFE/SFS), and Bayesian hyperparameter tuning on any uploaded time-series dataset.',
      tr: 'Yüklenen herhangi bir zaman serisi veri seti üzerinde otomatik gecikme (lag) üretimi, özellik seçimi (MRMR/RFE/SFS) ve Bayesian hiperparametre optimizasyonu çalıştıran Streamlit uygulaması.',
    },
    bullets: {
      en: [
        'Engineered calendar and lag features (Lag 1, Lag 52) with leakage-safe train/test concatenation and visual RMSE, MAE, and MAPE comparison charts.',
        'Documented architectural trade-offs and resolved zero-target MAPE distortion by ranking candidate models via MAE.',
      ],
      tr: [
        'Veri sızıntısını önleyen train/test birleştirme mimarisiyle takvim ve gecikme özellikleri (Lag 1, Lag 52) üretti; gerçek değerlere karşı RMSE, MAE ve MAPE grafiklerini raporladı.',
        'Sıfır değerli hedeflerdeki MAPE sapmasını çözerek modelleri MAE bazlı sıraladı ve tasarım kararlarını dokümante etti.',
      ],
    },
  },
  {
    id: 'sks-bot',
    name: 'Çukurova SKS Notification Bot',
    badge: {
      en: 'Serverless Automation · GitHub Actions',
      tr: 'Sunucusuz Otomasyon · GitHub Actions',
    },
    category: 'systems',
    period: { en: 'Aug 2026 – Oct 2026', tr: 'Ağustos 2026 – Ekim 2026' },
    repoUrl: 'https://github.com/suleyman-kara/cu-sks-takip',
    tech: ['Python', 'GitHub Actions Cron', 'HTML Email Automation', 'Diff Detection'],
    summary: {
      en: 'Serverless monitoring bot that checks Çukurova University part-time student job and exam announcements every morning and dispatches HTML alerts only on state changes.',
      tr: 'Çukurova Üniversitesi kısmi zamanlı öğrenci iş ve sınav duyurularını her sabah GitHub Actions üzerinde kontrol eden ve yalnızca değişiklik olduğunda HTML bildirim e-postası gönderen sunucusuz bot.',
    },
    bullets: {
      en: [
        'Configured daily scheduled GitHub Actions workflows with state diffing so subscribers receive formatted HTML notifications only when announcements are added, removed, or updated.',
      ],
      tr: [
        'Yalnızca yeni duyuru eklendiğinde, kaldırıldığında veya güncellendiğinde e-posta gönderen durum karşılaştırmalı (diff) günlük GitHub Actions iş akışı kurdu.',
      ],
    },
  },
  {
    id: 'ras-template',
    name: 'RAS Template',
    badge: {
      en: 'Residential Management Web App',
      tr: 'Site ve Apartman Yönetim Uygulaması',
    },
    category: 'web',
    period: { en: '2026', tr: '2026' },
    repoUrl: 'https://github.com/suleyman-kara/ras-template',
    liveUrl: 'https://ras-template.web.app',
    liveLabel: 'ras-template.web.app',
    tech: ['Vanilla JavaScript', 'Tailwind CSS', 'Firebase Auth', 'Cloud Firestore', 'Firebase Hosting'],
    summary: {
      en: 'Web-based apartment and residential complex management application for dues tracking, income/expense management, Excel reporting, and resident communication.',
      tr: 'Aidat takibi, gelir-gider yönetimi, Excel raporlama ve sakin iletişimi için web tabanlı apartman ve site yönetim uygulaması.',
    },
    bullets: {
      en: [
        'Implemented apartment and resident management, debt tracking, Excel export, and a mobile-responsive interface backed by Firebase Authentication and Firestore.',
        'Authored an architectural retrospective analyzing the limitations of unframeworked DOM manipulation and client-side Firebase rules, establishing schema-first modern framework standards for subsequent projects.',
      ],
      tr: [
        'Firebase Authentication ve Firestore altyapısıyla daire/sakin yönetimi, borç takibi, Excel raporlama ve mobil uyumlu arayüz geliştirdi.',
        'Framework kullanmadan DOM yönetiminin ve istemci taraflı kuralların sınırlarını analiz eden kapsamlı bir mimari retrospektif hazırladı.',
      ],
    },
  },
  {
    id: 'cli-template',
    name: 'CLI Template (C++17)',
    badge: {
      en: 'Modular Command-Line Framework',
      tr: 'Modüler Komut Satırı Şablonu',
    },
    category: 'systems',
    period: { en: '2026', tr: '2026' },
    repoUrl: 'https://github.com/suleyman-kara/cli-template',
    tech: ['C++17', 'CMake', 'OpenSSL'],
    summary: {
      en: 'Extensible command-line application template in C++17 featuring OpenSSL-based password hashing and role-based interactive command execution.',
      tr: 'OpenSSL tabanlı parola doğrulama ve modüler mimariye sahip genişletilebilir C++17 komut satırı uygulaması şablonu.',
    },
    bullets: {
      en: [
        'Designed user and admin privilege modes with OpenSSL hashed passwords and an interactive shell command set (help, enable, disable, password, clear, exit).',
      ],
      tr: [
        'OpenSSL ile hashlenmiş parolalar, kullanıcı ve yönetici modları ve etkileşimli komut seti (help, enable, disable, password, clear, exit) tasarladı.',
      ],
    },
  },
];

export const MINI_PROJECTS = [
  {
    name: 'Album (FotoAlbüm Studio)',
    tech: 'Canvas API · WebP · Static Web',
    desc: {
      en: 'Client-side digital A4 photo album builder with 4 themes and a collage engine; resizes images to 1080p WebP in-browser with zero server uploads and exports to PDF/print.',
      tr: 'Fotoğrafları sunucuya yüklemeden tarayıcı içinde (Canvas API) 1080p WebP formatına dönüştürüp 4 tema ve kolaj motoruyla A4 dijital albüme çeviren, PDF/baskı çıktısı veren statik web uygulaması.',
    },
  },
  {
    name: 'Block Blast Clone & Underwater Dream',
    tech: 'C · Raylib · CMake',
    desc: {
      en: '2D desktop games written in C with Raylib featuring single-file game logic, match-three level progression, audio effects, and CMake build configuration.',
      tr: 'C ve Raylib ile geliştirilen, seviye ilerlemeli eşleştirme mekaniği, ses efektleri ve CMake derleme yapısına sahip masaüstü oyunları.',
    },
  },
  {
    name: 'Library System',
    tech: 'C++17 · Console Architecture',
    desc: {
      en: 'C++17 console application supporting member tier policies, borrowing limits, and a timestamped operational logger.',
      tr: 'Üye tipleri, ödünç alma limitleri ve zaman damgalı kayıt (logger) sistemine sahip C++17 konsol uygulaması.',
    },
  },
  {
    name: 'Birlik Bahçesi',
    tech: 'HTML · Tailwind CSS · Vanilla JS',
    desc: {
      en: 'Lightweight static appreciation web project deployed on GitHub Pages.',
      tr: 'HTML, Tailwind CSS ve Vanilla JS ile geliştirilip GitHub Pages üzerinde yayınlanan statik web projesi.',
    },
  },
];

export const SKILL_GROUPS = [
  {
    code: 'SEC-01',
    title: { en: 'Data Science & Machine Learning', tr: 'Veri Bilimi ve Makine Öğrenmesi' },
    skills: [
      'XGBoost',
      'LightGBM',
      'Scikit-Learn',
      'Pandas',
      'NumPy',
      'Optuna',
      'Scikit-Optimize',
      'SHAP (Explainability)',
      'Time Series Forecasting',
      'Feature Selection (MRMR, RFE, SFS)',
      'Isotonic Calibration',
      'Ensembles (Soft-Voting, Stacking)',
    ],
  },
  {
    code: 'SEC-02',
    title: { en: 'Web, Mobile & Generative AI', tr: 'Web, Mobil ve Üretken Yapay Zeka' },
    skills: [
      'React 19',
      'TypeScript',
      'JavaScript (ES6+)',
      'Tailwind CSS',
      'Vite',
      'Expo / React Native',
      'Eleventy v3 & Nunjucks',
      'Google GenAI SDK (Gemini)',
      'Streamlit',
      'Technical SEO & AVIF/WebP',
    ],
  },
  {
    code: 'SEC-03',
    title: { en: 'Backend, Cloud & DevOps', tr: 'Backend, Bulut ve DevOps' },
    skills: [
      'Supabase (Postgres, RLS, Realtime)',
      'Django 5 & DRF (REST API)',
      'Firebase (Auth, Firestore, Hosting)',
      'GitHub Actions (CI/CD, Cron, Releases)',
      'Cloudflare Pages',
      'Vercel & Render',
      'Git & PR Workflows',
    ],
  },
  {
    code: 'SEC-04',
    title: { en: 'Programming Languages & Systems', tr: 'Programlama Dilleri ve Sistem' },
    skills: [
      'Python',
      'TypeScript / JavaScript',
      'C++ (C++17)',
      'C',
      'Rust (Workspace / CLI)',
      'CMake & OpenSSL',
      'AI-Assisted Engineering (Claude Code)',
    ],
  },
];

export const COMPETITIONS = [
  {
    date: '2026',
    title: {
      en: 'TEKNOFEST 2026 AI in Healthcare (Team MEN-INA · PathGuard)',
      tr: 'TEKNOFEST 2026 Sağlıkta Yapay Zeka (MEN-INA Takımı · PathGuard)',
    },
    result: {
      en: '92/100 Preliminary Score · Advanced to Semi-Finals · 78/100 Technical Score',
      tr: '92/100 Ön Değerlendirme · Yarı Finale Yükseldi · 78/100 Teknik Skor',
    },
    highlight: true,
  },
  {
    date: { en: 'Dec 13–14, 2025', tr: '13–14 Aralık 2025' },
    title: {
      en: 'GenAI Idea-to-Product Marathon, Çukurova GİK (Astra Team · DersimHazır)',
      tr: 'GenAI Fikirden Ürüne Maratonu, Çukurova GİK (Astra Takımı · DersimHazır)',
    },
    result: {
      en: '3rd Place Winner',
      tr: '3.’lük Ödülü',
    },
    highlight: true,
  },
  {
    date: { en: 'Nov 29, 2025', tr: '29 Kasım 2025' },
    title: {
      en: 'GDG Adana — DevFest Adana 2025',
      tr: 'GDG Adana — DevFest Adana 2025',
    },
    result: {
      en: 'Participant',
      tr: 'Katılımcı',
    },
    highlight: false,
  },
  {
    date: { en: 'Oct 2025', tr: 'Ekim 2025' },
    title: {
      en: 'Paribu University Code Prix — Gaziantep Stage (Astra Team)',
      tr: 'Paribu University Code Prix — Gaziantep Etabı (Astra Takımı)',
    },
    result: {
      en: 'Algorithmic problem solving & team competition experience',
      tr: 'Algoritma geliştirme ve takım çalışması deneyimi',
    },
    highlight: false,
  },
];
