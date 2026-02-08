import { UserMsg } from './UserMsg.jsx'
import { SET_CART_IS_SHOWN } from '../store/reducers/jewel.reducer.js'
import { useTranslation, Trans  } from "react-i18next";

import LogoSVG from './../../public/logo.svg';
import instagramSVG from './../../public/icons/instagram.svg';
import facebookSVG from './../../public/icons/facebook.svg';
import { Link, NavLink } from 'react-router-dom';



export function AppFooter() {
    const { t, ready } = useTranslation();

    // מחכה שהתרגומים ייטענו לפני הרינדור
    if (!ready) return null;


    return (
        <>
            <footer className='footer'>
                <div className='footer-logo'>
                    <img src={LogoSVG} alt="logo" />
                </div>

                <div className='footer-links'>
                    <h3>{t("Links")}</h3>
                    <ul>
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) => isActive ? "active-link" : ""}
                            >
                                {t("Home")}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/jewel"
                                className={({ isActive }) => isActive ? "active-link" : ""}
                            >
                                {t("Jewellry")}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/about"
                                className={({ isActive }) => isActive ? "active-link" : ""}
                            >
                                {t("About")}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/contact"
                                className={({ isActive }) => isActive ? "active-link" : ""}
                            >
                                {t("Contact")}
                            </NavLink>
                        </li>
                    </ul>
                    <div className="footer-acces">
                        <a href='./../../public/accessibility-edeng_jewellry.pdf' download>{t("Accessibility Statement")}</a>
                        <p>|</p>
                        <a href='./../../public/תקנון אתר - edeng_jewellry.pdf' download>{t("Terms and Conditions & Privacy Policy")}</a>
                    </div>
                </div>


                <div className='footer-socials'>
                    <div className='socials'>
                        <h3>{t("Follow me")}</h3>
                        <div className='icons'>
                            <a href="https://www.facebook.com/eden.gedj" target="_blank" rel="noopener noreferrer">
                                <img src={facebookSVG} alt="facebook icon" className="footer-icon" />
                            </a>
                            <a href="https://www.instagram.com/edeng_jewellry?igsh=MTB4bTRsaHZzbXkyMQ==" target="_blank" rel="noopener noreferrer">
                                <img src={instagramSVG} alt="instagram icon" className="footer-icon" />
                            </a>
                        </div>
                    </div>
                </div>

            </footer>
            <div className="create-by">
                <Trans i18nKey="footer.designedBy">
                    © 2025 All rights reserved | Designed & developed by
                    <a className="footer-credit-link" href="https://gal-code.com/" target="_blank" rel="noopener noreferrer">
                        Gal-Code
                    </a>
                </Trans>
            </div>

            <UserMsg />
        </>
    )
}
