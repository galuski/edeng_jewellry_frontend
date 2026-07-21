import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  // בטעינה ראשונה - נבדוק רק הסכמה ושפה שמורה
  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (consent === "accepted") {
      const savedLanguage = localStorage.getItem("language") || "en";
      if (i18n.language !== savedLanguage) {
          i18n.changeLanguage(savedLanguage);
      }
    } else {
      if (i18n.language !== "en") {
          i18n.changeLanguage("en");
      }
    }
  }, [i18n]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang); // ה-App.jsx יתפוס את זה ויעדכן את הפונט

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