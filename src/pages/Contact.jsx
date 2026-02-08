import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Swal from 'sweetalert2';
import Title from "../cmps/Title";
import contactIMG from './../../public/images/contact.jpeg';

export function Contact() {
    const { t } = useTranslation();
    const [messageCount, setMessageCount] = useState(0);
    const [orientation, setOrientation] = useState("vertical");
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);

    useEffect(() => {
        const updateOrientation = () => {
            if (window.innerWidth < 1024) {
                setOrientation("horizontal");
            } else {
                setOrientation("vertical");
            }
        };

        updateOrientation();
        window.addEventListener("resize", updateOrientation);
        return () => window.removeEventListener("resize", updateOrientation);
    }, []);

    useEffect(() => {
        const savedCount = localStorage.getItem("messageCount");
        const lastSent = localStorage.getItem("lastSentDate");
        const today = new Date().toLocaleDateString();

        if (savedCount && lastSent === today) {
            setMessageCount(parseInt(savedCount));
        } else {
            localStorage.setItem("messageCount", "0");
            localStorage.setItem("lastSentDate", today);
        }
    }, []);

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPhone(phone) {
        const cleanPhone = phone.replace(/[\s\-]/g, "");
        return /^(\+9725\d{8}|05\d{8}|9725\d{8})$/.test(cleanPhone);
    }

    const onSubmit = async (event) => {
        event.preventDefault();

        // בדיקת מגבלת הודעות
        if (messageCount >= 5) {
            Swal.fire({
                icon: "error",
                title: t("You've reached your message limit for today."),
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        const formData = new FormData(event.target);
        const object = Object.fromEntries(formData);

        // ✅ ולידציה לפני שליחה
        if (!object.name || !object.email || !object.phone || !object.message) {
            Swal.fire({
                icon: "error",
                title: t("Please fill in all required fields."),
            });
            return;
        }

        if (!isValidEmail(object.email)) {
            Swal.fire({
                icon: "error",
                title: t("Invalid email format"),
            });
            return;
        }

        if (!isValidPhone(object.phone)) {
            Swal.fire({
                icon: "error",
                title: t("Invalid phone number"),
            });
            return;
        }

        if (!isTermsAccepted) {
            Swal.fire({
                icon: "error",
                title: t("You must accept the Terms and Conditions before sending."),
            });
            return;
        }

        const json = JSON.stringify(object);

        // ✅ התיקון הקריטי: הגדרת כתובת דינמית
        // אם אנחנו בפיתוח (localhost) נשתמש בכתובת המלאה עם הפורט
        // אם אנחנו בפרודקשן (האתר האמיתי) נשתמש בנתיב יחסי
        const apiUrl = window.location.hostname === "localhost" 
            ? "http://localhost:3030/api/contact" 
            : "/api/contact";

        console.log("Sending to:", apiUrl, json); 

        try {
            const res = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: json,
            }).then((res) => res.json());

            if (res.success) {
                Swal.fire({
                    icon: "success",
                    title: t("Message sent successfully!"),
                    timer: 2000,
                    showConfirmButton: false,
                });

                event.target.reset();
                setIsTermsAccepted(false);

                const newCount = messageCount + 1;
                setMessageCount(newCount);
                localStorage.setItem("messageCount", newCount.toString());
            } else {
                Swal.fire({
                    icon: "error",
                    title: t("There was a problem sending your message."),
                    text: res.message || "Server Error"
                });
            }
        } catch (err) {
            console.error("❌ Error sending message:", err);
            Swal.fire({
                icon: "error",
                title: t("An unexpected error occurred."),
                text: t("Please try again later.")
            });
        }
    };

    return (
        <section id="contact" className="contact">
            <img
                className="contact-img animate__animated animate__fadeIn animate__delay-1s"
                src={contactIMG}
                alt={t("Contact us image")}
            />
            <div className="animate__animated animate__fadeIn animate__delay-2s">
                <Title id="contact-title" title={t("Contact")} orientation={orientation} />
            </div>
            <form
                className="animate__animated animate__fadeIn animate__delay-3s container"
                onSubmit={onSubmit}
                aria-labelledby="contact-title"
            >
                <div className="form-row">
                    <div className="input-data">
                        <input type="text" name="name" id="name" required />
                        <div className="underline"></div>
                        <label htmlFor="name">{t("Full name")}</label>
                    </div>
                    <div className="input-data">
                        <input type="email" name="email" id="email" required />
                        <div className="underline"></div>
                        <label htmlFor="email">{t("Email address")}</label>
                    </div>
                </div>

                <div className="form-row">
                    <div className="input-data">
                        <input type="tel" name="phone" id="phone" required />
                        <div className="underline"></div>
                        <label htmlFor="phone">{t("Phone number")}</label>
                    </div>
                </div>

                <div className="form-row">
                    <div className="input-data textarea">
                        <textarea name="message" id="message" required></textarea>
                        <div className="underline"></div>
                        <label htmlFor="message">{t("Your message")}</label>
                    </div>
                </div>

                <div className="form-row">
                    <label className="terms-row">
                        <input
                            className="input-cheakbox"
                            type="checkbox"
                            checked={isTermsAccepted}
                            onChange={(e) => setIsTermsAccepted(e.target.checked)}
                        />
                        {t("I have read and agree to the Terms and Conditions and Privacy Policy")}{" "}
                        <a
                            href="./../../public/תקנון אתר - edeng_jewellry.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {t("Terms and Conditions & Privacy Policy")}
                        </a>
                    </label>
                </div>

                <button className="contact-submit" type="submit">
                    {t("Send Message")}
                </button>
            </form>
        </section>
    );
}