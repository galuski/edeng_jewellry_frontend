import i18n from 'i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const savedLanguage = localStorage.getItem("language") || "en"; // בדיקת שפה שמורה

i18n
  .use(HttpApi) // טעינת תרגומים מקובצי JSON
  .use(LanguageDetector) // זיהוי שפה אוטומטי
  .use(initReactI18next) // חיבור ל-React
  .init({
    ns: ["translation"],
    supportedLngs: ["en", "he"], // שפות נתמכות
    fallbackLng: "en", // שפה ברירת מחדל
    debug: false, // הצגת לוגים בקונסול
    interpolation: {
      escapeValue: false, // לא להמיר תווים מיוחדים
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json" // נתיב מתוקן לקובצי התרגום
    },
    react: {
      useSuspense: false // מאפשר לטעון את התרגומים גם אם יש טעינה אסינכרונית
    }
  });

// עדכון כיוון הכתיבה
i18n.on("languageChanged", (lng) => {
  document.body.dir = lng === "he" ? "rtl" : "ltr";
});

export default i18n;