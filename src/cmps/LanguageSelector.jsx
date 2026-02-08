import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  // בטעינה ראשונה
  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");

    if (consent === "accepted") {
      const savedLanguage = localStorage.getItem("language") || "en";
      i18n.changeLanguage(savedLanguage);
      document.documentElement.setAttribute("dir", savedLanguage === "he" ? "rtl" : "ltr");
      document.documentElement.lang = savedLanguage;
    } else {
      // ברירת מחדל אם המשתמש לא אישר
      i18n.changeLanguage("en");
      document.documentElement.setAttribute("dir", "ltr");
      document.documentElement.lang = "en";
    }
  }, [i18n]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;

    i18n.changeLanguage(newLang);
    document.documentElement.setAttribute("dir", newLang === "he" ? "rtl" : "ltr");
    document.documentElement.lang = newLang;

    const consent = localStorage.getItem("cookie-consent");
    if (consent === "accepted") {
      localStorage.setItem("language", newLang);
    }
  };

  return (
    <select onChange={handleLanguageChange} value={i18n.language}>
      <option value="en">EN</option>
      <option value="he">HE</option>
    </select>
  );
}