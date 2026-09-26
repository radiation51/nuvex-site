import type { OfferText, ProjectText, Translations } from "@/lib/types";

// Traductions de départ des offres et réalisations (modifiables ensuite dans l'admin).
// Les lignes « features » suivent l'ordre des lignes françaises de lib/defaults.ts.

export const offerTranslations: Record<string, Translations<OfferText>> = {
  eco: {
    en: {
      name: "Eco",
      description: "The essentials to be visible online.",
      delivery: "Delivered in 7 days",
      features: ["One-page website", "Domain name included", "Mobile-friendly", "WhatsApp button", "Contact form", "Google search optimisation"],
    },
    ar: {
      name: "Éco",
      description: "الأساسيات لتكون مرئيًا على الإنترنت.",
      delivery: "التسليم في 7 أيام",
      features: ["موقع من صفحة واحدة", "اسم النطاق مشمول", "متوافق مع الهاتف", "زر واتساب", "استمارة اتصال", "الظهور في نتائج Google"],
    },
  },
  pro: {
    en: {
      name: "Pro",
      description: "The ideal choice for businesses.",
      delivery: "Delivered in 7 days",
      features: [
        "Up to 5 pages",
        "Domain name included",
        "Mobile-friendly",
        "WhatsApp button",
        "Basic Google search optimisation",
        "Small admin area (texts, photos, opening hours)",
      ],
    },
    ar: {
      name: "Pro",
      description: "الخيار الأمثل للمؤسسات.",
      delivery: "التسليم في 7 أيام",
      features: [
        "حتى 5 صفحات",
        "اسم النطاق مشمول",
        "متوافق مع الهاتف",
        "زر واتساب",
        "تحسين أساسي للظهور في Google",
        "مساحة إدارة صغيرة (النصوص، الصور، مواقيت العمل)",
      ],
    },
  },
  premium: {
    en: {
      name: "Premium",
      description: "A complete website you manage yourself.",
      delivery: "Delivered in 7 days",
      features: [
        "Unlimited pages",
        "Domain name included",
        "100% custom design",
        "Full admin area",
        "Advanced Google search optimisation",
        "Priority support",
      ],
    },
    ar: {
      name: "Premium",
      description: "موقع متكامل تسيّره بنفسك.",
      delivery: "التسليم في 7 أيام",
      features: ["صفحات غير محدودة", "اسم النطاق مشمول", "تصميم خاص 100 %", "مساحة إدارة كاملة", "تحسين متقدّم للظهور في Google", "دعم ذو أولوية"],
    },
  },
  "sur-mesure": {
    en: {
      name: "Custom",
      description: "E-commerce, booking, apps… we adapt to you.",
      delivery: "Timeline agreed together based on the project",
      features: ["Needs analysis", "Domain name included", "Custom features", "Online shop available", "Dedicated support"],
    },
    ar: {
      name: "حسب الطلب",
      description: "تجارة إلكترونية، حجز، تطبيقات… نتأقلم مع احتياجك.",
      delivery: "تُحدَّد المدة معًا حسب المشروع",
      features: ["دراسة احتياجك", "اسم النطاق مشمول", "وظائف حسب الطلب", "متجر إلكتروني ممكن", "مرافقة خاصة"],
    },
  },
  "logiciel-essentiel": {
    en: {
      name: "Essential Software",
      description: "Simple software to run your business day to day.",
      delivery: "Delivered in 7 days · free delivery",
      features: [
        "Works without internet",
        "1 workstation (1 PC)",
        "Checkout, receipts and invoices",
        "Products, stock and customers",
        "Daily and monthly reports",
        "Automatic backup",
        "USB drive delivered free, with installation video",
        "Full video: how to use the software",
        "Employee accounts",
      ],
    },
    ar: {
      name: "برنامج Essentiel",
      description: "برنامج بسيط لتسيير نشاطك يوميًا.",
      delivery: "التسليم في 7 أيام · توصيل مجاني",
      features: [
        "يعمل دون إنترنت",
        "جهاز واحد (حاسوب واحد)",
        "التحصيل، التذاكر والفواتير",
        "المنتجات، المخزون والزبائن",
        "تقارير يومية وشهرية",
        "نسخ احتياطي تلقائي",
        "مفتاح USB يُوصَل مجانًا مع فيديو التثبيت",
        "فيديو كامل: كيفية استعمال البرنامج",
        "حسابات الموظفين",
      ],
    },
  },
  "logiciel-pro": {
    en: {
      name: "Pro Software",
      description: "For shops that work with employees.",
      delivery: "Delivered in 7 days · free delivery",
      features: [
        "Everything in Essential Software",
        "Up to 2 workstations (2 PCs)",
        "Owner and employee accounts",
        "Customer and supplier credit",
        "Trade modules (expiry dates, sizes, scales…)",
        "Profits and best sellers",
        "USB drive delivered free, with installation video",
        "Full video: how to use the software",
      ],
    },
    ar: {
      name: "برنامج Pro",
      description: "للمحلات التي تعمل مع موظفين.",
      delivery: "التسليم في 7 أيام · توصيل مجاني",
      features: [
        "كل مزايا برنامج Essentiel",
        "حتى جهازين (حاسوبان)",
        "حساب المالك وحسابات الموظفين",
        "ديون الزبائن والموردين",
        "وحدات حسب النشاط (تاريخ الصلاحية، المقاسات، الميزان…)",
        "الأرباح والمنتجات الأكثر مبيعًا",
        "مفتاح USB يُوصَل مجانًا مع فيديو التثبيت",
        "فيديو كامل: كيفية استعمال البرنامج",
      ],
    },
  },
  "logiciel-sur-mesure": {
    en: {
      name: "Custom Software",
      description: "Software designed entirely around your business.",
      delivery: "Timeline agreed together · free delivery",
      features: [
        "Needs analysis",
        "Custom features",
        "Number of workstations of your choice",
        "Online sync available",
        "USB drive delivered free, with installation video",
        "Full video: how to use the software",
        "Dedicated support",
      ],
    },
    ar: {
      name: "برنامج حسب الطلب",
      description: "برنامج مصمَّم بالكامل لنشاطك.",
      delivery: "تُحدَّد المدة معًا · توصيل مجاني",
      features: [
        "دراسة احتياجك",
        "وظائف حسب الطلب",
        "عدد الأجهزة حسب اختيارك",
        "مزامنة عبر الإنترنت ممكنة",
        "مفتاح USB يُوصَل مجانًا مع فيديو التثبيت",
        "فيديو كامل: كيفية استعمال البرنامج",
        "مرافقة خاصة",
      ],
    },
  },
};

export const projectTranslations: Record<string, Translations<ProjectText>> = {
  "bourahla-auto": {
    en: {
      category: "VIP transport & private driver",
      description: "High-end showcase website: services, gallery and online trip booking.",
    },
    ar: {
      title: "Bourahla Auto",
      category: "نقل VIP وسائق خاص",
      description: "موقع تعريفي راقٍ: الخدمات، معرض الصور وحجز الرحلات عبر الإنترنت.",
    },
  },
  "qalb-alhaba": {
    en: {
      category: "Online shop · olive oil",
      description: "E-commerce in Arabic, French and English, with a cart and ordering via WhatsApp.",
    },
    ar: {
      title: "قلب الحبة — Qalb Al Haba",
      category: "متجر إلكتروني · زيت الزيتون",
      description: "متجر إلكتروني بالعربية والفرنسية والإنجليزية، مع سلة مشتريات وطلب عبر واتساب.",
    },
  },
  mayfer: {
    en: {
      title: "Mayfer Software",
      category: "Custom software",
      description: "Suit shop with management software: products, stock, orders and made-to-measure.",
    },
    ar: {
      title: "برنامج Mayfer",
      category: "برنامج حسب الطلب",
      description: "محل بدلات مع برنامج تسيير: المنتجات، المخزون، الطلبيات والتفصيل حسب المقاس.",
    },
  },
};
