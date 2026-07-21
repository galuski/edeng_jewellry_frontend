import React from 'react';
import { useTranslation } from "react-i18next";

export function CouponPopup({ isOpen, onClose, discountAmount, currency }) {
    const { t } = useTranslation();

    if (!isOpen) return null;

    // יצירת 50 חתיכות קונפטי רנדומליות עם צבעים, מיקומים ומהירויות שונות
    const confettiPieces = Array.from({ length: 50 }).map((_, i) => {
        const style = {
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
            backgroundColor: ['#d4af37', '#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6'][Math.floor(Math.random() * 6)],
            transform: `rotate(${Math.random() * 360}deg)`
        };
        return <div key={i} className="confetti-piece" style={style}></div>;
    });

    const currencySymbol = currency === 'USD' ? '$' : '₪';

    return (
        <div className="coupon-popup-overlay" onClick={onClose}>
            <div className="coupon-popup-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-popup-btn" onClick={onClose}>&times;</button>
                
                {/* מיכל הקונפטי */}
                <div className="confetti-container">
                    {confettiPieces}
                </div>

                <div className="popup-text-content">
                    <h2>{t("Congratulations!")} 🎉</h2>
                    <p>
                        {t("You received")} <strong>{currencySymbol}{discountAmount}</strong> {t("to use on the site!")}
                    </p>
                    <button className="awesome-btn" onClick={onClose}>
                        {t("Awesome, thanks!")}
                    </button>
                </div>
            </div>
        </div>
    );
}