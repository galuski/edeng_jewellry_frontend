// frontend/src/App.jsx
import { useEffect } from 'react' // הוספנו את useEffect
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom' // הוספנו useLocation
import { Provider } from 'react-redux'
import ReactGA from "react-ga4"; // הייבוא של אנליטיקס
import './assets/main.css'


import { About } from './pages/About'
import { Navbar } from './cmps/Navbar'
import { HomePage } from './pages/HomePage'
import { store } from './store/store'
import { AppFooter } from './cmps/AppFooter'
import { ShoppingCart } from './pages/ShoppingCart'
import { JewelIndex } from './pages/JewelIndex'
import { JewelDetails } from './pages/JewelDetails'
import { LoginSignup } from './cmps/LoginSignup'
import { AdminSettings } from './pages/AdminSettings'
import { Contact } from './pages/Contact'
import { OrderSuccess } from "./pages/OrderSuccess"
import { OrderFailure } from "./pages/OrderFailure"
import { useTranslation } from "react-i18next";

import { AdminAdd } from './cmps/AdminAdd';
import { WhatsApp } from './cmps/WhatsApp'
import { AdminIndex } from './cmps/AdminIndex'
import EditItem from './pages/EditItem'
import { CookieConsent } from './cmps/CookieConsent'
// import { Information } from './cmps/Information';
import { AdminPush } from './cmps/AdminPush';

// 1. איתחול גוגל אנליטיקס עם המזהה שלך
ReactGA.initialize("G-9J44DC4J3J");

// 2. רכיב עזר למעקב אחרי מעבר עמודים
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // שליחת דיווח בכל פעם שהכתובת (URL) משתנה
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  return null;
};

export default function App() {
  const { t } = useTranslation();

  return (
    <Provider store={store}>
      {/* <Information text={t("information-push")}/> */}
      <Router>
        {/* 3. הפעלת המעקב בתוך ה-Router */}
        <AnalyticsTracker />

        <section className="main-layout">
          <Navbar />
          <main>
            <Routes>
              <Route element={<HomePage />} path="/" />
              <Route element={<JewelIndex />} path="/jewel" />
              <Route element={<About />} path="/about" />
              <Route element={<Contact />} path="/contact" />
              <Route element={<ShoppingCart />} path="/cart" />

              {/* ⚡ נתיבים עם /* כדי לתפוס גם query params */}
              <Route path="/order/success/*" element={<OrderSuccess />} />
              <Route path="/order/failure/*" element={<OrderFailure />} />

              <Route element={<LoginSignup />} path="/login" />
              <Route element={<AdminSettings />} path="/login/admin-settings">
                <Route element={<AdminIndex />} path="list" />
                <Route element={<AdminAdd />} path="add" />
                <Route element={<AdminPush />} path="push" />
              </Route>
              <Route element={<EditItem />} path="/edit/:jewelId" />
              <Route element={<JewelDetails />} path="/jewel/:jewelId" />
            </Routes>
          </main>
          <AppFooter />
          <WhatsApp />
          <CookieConsent />
        </section>
      </Router>
    </Provider>
  )
}