import { useTranslation } from "react-i18next";
import 'animate.css';

import { ShopButton } from "./ShopButton";
import sunriseMP4 from './../../public/videos/Eden.mp4';
import { Link } from "react-router-dom";

export default function Video() {
    const { t, ready } = useTranslation();

    // מחכה שהתרגומים ייטענו לפני הרינדור
    if (!ready) return null;

    return (
        <section className="video-container">
            <div className="video">
                <div className="video-overlay"></div>
                <video src={sunriseMP4} autoPlay loop muted />
                <div className="video-content">
                    <h1 className="animate__animated animate__fadeIn animate__delay-1s">
                        {t('Everyone has their own special light')}
                    </h1>
                    <h2 className="animate__animated animate__fadeIn animate__delay-2s">
                        {t("Don't stop shining")}<span className="video-content-marker">.</span>
                    </h2>
                    <div className="animate__animated animate__fadeIn animate__delay-3s">
                    <Link to="/jewel" ><ShopButton /></Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
