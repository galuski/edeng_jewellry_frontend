import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { Loader } from '../cmps/Loader.jsx';

import LogoSVG from './../../public/logo.svg';
import cartSVG from './../../public/icons/shopping-cart.svg';

import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js';
import { logout } from '../store/actions/user.actions.js';

import { SET_CART_IS_SHOWN } from '../store/reducers/jewel.reducer.js';
import { SET_USER } from '../store/reducers/user.reducer.js';
import { LoginSignup } from './LoginSignup.jsx';
import { useEffect, useState } from "react";

// קומפוננטת בחירת שפה מחוץ ל-Narbar כדי למנוע בעיות עם Hooks
export function LanguageSelector() {
    const { i18n } = useTranslation();

    useEffect(() => {
        const savedLanguage = localStorage.getItem("language") || "en";
        i18n.changeLanguage(savedLanguage);
        document.documentElement.setAttribute("dir", savedLanguage === "he" ? "rtl" : "ltr");
        document.documentElement.lang = savedLanguage; // <<< כאן
    }, [i18n]);
    
    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        i18n.changeLanguage(newLang);
        localStorage.setItem("language", newLang);
        document.documentElement.setAttribute("dir", newLang === "he" ? "rtl" : "ltr");
        document.documentElement.lang = newLang; // <<< וכאן
    };
    
    

    return (
        <select className="select-lang" onChange={handleLanguageChange} value={i18n.language}>
            <option value="en">EN</option>
            <option value="he">HE</option>
        </select>
    );
}

export function Navbar() {
    const { t, ready } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const isCartShown = useSelector(storeState => storeState.jewelModule.isCartShown);
    const user = useSelector(storeState => storeState.userModule.loggedinUser);
    const shoppingCart = useSelector(storeState => storeState.jewelModule.shoppingCart)

    // מחכה שהתרגום ייטען לפני רינדור
    if (!ready) return null;

    const onLogout = () => {
        logout()
            .then(() => {
                showSuccessMsg('Logout successfully');
            })
            .catch(err => {
                console.log('err:', err);
                showErrorMsg('Cannot logout');
            });
    };

    return (
        <nav className='navbar'>
            <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
                <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) => isActive ? "active-link" : ""}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {t("Home")}
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/jewel"
                        className={({ isActive }) => isActive ? "active-link" : ""}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {t("Jewellry")}
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/about"
                        className={({ isActive }) => isActive ? "active-link" : ""}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {t("About")}
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/contact"
                        className={({ isActive }) => isActive ? "active-link" : ""}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {t("Contact")}
                    </NavLink>
                </li>
            </ul>

            <img className='logo' src={LogoSVG} alt="logo" />

            <div className="icons-area">
                <LanguageSelector />
                <button className="cart-icon-btn">
                    <Link to="/cart">
                        <img className="cart-icon" src={cartSVG} alt="cart" />
                    </Link>
                    {shoppingCart.length > 0 && (
                        <span className="notification-badge">{shoppingCart.length}</span>
                    )}
                </button>
            </div>

            <button className={`button ${menuOpen ? "is-closed" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
                <span className="burger burger-2"></span>
            </button>

            {/* {user ? (
                <section className="user-info">
                    <p>{user.fullname}</p>
                    <button onClick={onLogout}>Logout</button>
                </section>
            ) : (
                <section className="user-info">
                    <LoginSignup />
                </section>
            )} */}
        </nav>
    );
}