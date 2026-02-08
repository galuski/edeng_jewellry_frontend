import { useTranslation } from "react-i18next";
import Title from "../cmps/Title"
import aboutIMG from './../../public/images/about.jpeg'
import { utilService } from "../services/util.service"

export function About() {
    const { t, ready } = useTranslation();

    return (
        <section className="About">
            <img className="about-img animate__animated animate__fadeIn animate__delay-1s" src={aboutIMG} alt={t("About us image")} />

            <div className="animate__animated animate__fadeIn animate__delay-2s">
            <Title title={t("About")} orientation="horizontal" aria-label={t("About page title")} />
            </div>

            <pre className="animate__animated animate__fadeIn animate__delay-3s">
                {t(`About-Text`)}
            </pre>

        </section>
    )
}



