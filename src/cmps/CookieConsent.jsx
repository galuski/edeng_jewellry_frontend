import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import CookiesSVG from "./../../public/icons/cookie.svg";

export function CookieConsent() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true); // הצג אחרי 8 שניות
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
    window.location.reload();
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
    window.location.reload();
  };

  if (!isVisible) return null;

return (
  <div className={`cookie-consent ${isVisible ? "cookie-show" : ""}`}>
    <img className="cookie-svg" src={CookiesSVG} alt="cookie" />
    <p className="cookieHeading">{t("We use cookies.")}</p>
    <p className="cookieDescription">
      {t("This website uses cookies to ensure you get the best experience on our site.")}
    </p>
    <div className="cookie-container-btn">
      <button className="acceptButton" onClick={handleAccept}>{t("Allow")}</button>
      <button className="declineButton" onClick={handleDecline}>{t("Decline")}</button>
    </div>
  </div>
);
}