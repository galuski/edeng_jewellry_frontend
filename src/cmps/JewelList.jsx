import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { JewelPreview } from "./JewelPreview";
import { useSelector, useDispatch } from "react-redux";
import { REMOVE_JEWEL_FROM_CART, ADD_JEWEL_TO_CART } from "../store/reducers/jewel.reducer";

export function JewelList({ jewelry }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const shoppingCart = useSelector(state => state.jewelModule.shoppingCart);
    const [cartState, setCartState] = useState({});
    const [visibleItems, setVisibleItems] = useState({});

    useEffect(() => {
        const initialCartState = jewelry.reduce((acc, jewel) => {
            acc[jewel._id] = shoppingCart.some(item => item._id === jewel._id);
            return acc;
        }, {});
        setCartState(initialCartState);
    }, [jewelry, shoppingCart]);

    function toggleCart(jewel) {
        if (cartState[jewel._id]) {
            dispatch({ type: REMOVE_JEWEL_FROM_CART, jewelId: jewel._id });
        } else {
            dispatch({ type: ADD_JEWEL_TO_CART, jewel });
        }
    }

    // שימוש ב-IntersectionObserver לאנימציה כשהכרטיסייה נכנסת למסך
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setVisibleItems(prev => ({
                            ...prev,
                            [entry.target.dataset.id]: true
                        }));
                    }
                });
            },
            { threshold: 0.01 } // האנימציה תתבצע כאשר רק 10% מהכרטיסייה נכנסת למסך
        );

        const items = document.querySelectorAll(".jewel-item");
        items.forEach(item => observer.observe(item));

        return () => {
            items.forEach(item => observer.unobserve(item));
        };
    }, [jewelry]);

    return (
        <ul className="jewel-list">
            {jewelry.slice().reverse().map((jewel, index) => {
                const isAdded = cartState[jewel._id];
                const isVisible = visibleItems[jewel._id];

                return (
                    <li
                        key={jewel._id}
                        data-id={jewel._id}
                        className={`jewel-item ${isVisible ? "animate__animated animate__fadeInUp" : "opacity-0"}`}
                        style={{
                            animationDelay: `${index * 0.01}s`,  // כל כרטיס מקבל עיכוב לפי המיקום שלו
                            visibility: isVisible ? "visible" : "hidden",  // הכרטיסייה תהיה מוסתרת עד שהיא תיכנס למסך
                        }}
                    >
                        <JewelPreview jewel={jewel} />
                        <button
                            className={`add-to-cart-btn ${jewel.isSoldOut ? 'sold-out' : isAdded ? 'added' : ''}`}
                            onClick={() => toggleCart(jewel)}
                            disabled={jewel.isSoldOut}
                        >
                            {jewel.isSoldOut ? t("Sold Out") : isAdded ? t("Added") : t("Add To Cart")}
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}