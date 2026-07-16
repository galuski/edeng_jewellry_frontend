import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gearSVG from './../../public/icons/gear.svg';

// 1. ייבוא של Redux והאקשן שיצרנו
import { useSelector } from "react-redux";
import { setCurrency } from "../store/actions/system.actions.js"; // ודא שהנתיב תואם למיקום הקובץ אצלך

export function SettingsDropdown() {
    const { i18n, t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    // 2. שאיבת המטבע הנוכחי ישירות מ-Redux במקום סטייט מקומי
    const currency = useSelector(storeState => storeState.systemModule.currency); 

    // סגירת התפריט בלחיצה בחוץ (Click Outside)
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    // הגדרת שפה ראשונית
    useEffect(() => {
        const savedLanguage = localStorage.getItem("language") || "en";
        if (i18n.language !== savedLanguage) {
            i18n.changeLanguage(savedLanguage);
            document.documentElement.setAttribute("dir", savedLanguage === "he" ? "rtl" : "ltr");
            document.documentElement.lang = savedLanguage;
        }
    }, [i18n]);

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("language", lang);
        document.documentElement.setAttribute("dir", lang === "he" ? "rtl" : "ltr");
        document.documentElement.lang = lang;
    };

    // 3. עדכון הפונקציה כך שתפעיל את ה-Action של Redux
    const handleChangeCurrency = (curr) => {
        setCurrency(curr); // זה מעדכן גם את ה-localStorage וגם את ה-Store הגלובלי
    };

    return (
        <div className="settings-dropdown" ref={dropdownRef}>
            <button 
                className={`gear-btn ${isOpen ? 'active' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Settings"
            >
                <img className="gear-icon" src={gearSVG} alt="settings" />
            </button>

            {isOpen && (
                <div className="settings-menu-content">
                    {/* אזור בחירת שפה */}
                    <div className="settings-section">
                        <span className="settings-title">{t("Language")}</span>
                        <div className="segmented-control">
                            <button 
                                className={i18n.language === 'en' ? 'active' : ''} 
                                onClick={() => changeLanguage('en')}
                            >
                                {t("English")}
                            </button>
                            <button 
                                className={i18n.language === 'he' ? 'active' : ''} 
                                onClick={() => changeLanguage('he')}
                            >
                                {t("Hebrew")}
                            </button>
                        </div>
                    </div>

                    <hr className="settings-divider" />

                    {/* אזור בחירת מטבע */}
                    <div className="settings-section">
                        <span className="settings-title">{t("Currency")}</span>
                        <div className="segmented-control">
                            <button 
                                className={currency === 'USD' ? 'active' : ''} 
                                onClick={() => handleChangeCurrency('USD')}
                            >
                                $ {t("USD")}
                            </button>
                            <button 
                                className={currency === 'ILS' ? 'active' : ''} 
                                onClick={() => handleChangeCurrency('ILS')}
                            >
                                ₪ {t("ILS")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}