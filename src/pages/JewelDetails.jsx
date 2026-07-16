import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { jewelService } from "../services/jewel.service.js";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js";
import { Loader } from "../cmps/Loader.jsx";
import { ADD_JEWEL_TO_CART, REMOVE_JEWEL_FROM_CART } from "../store/reducers/jewel.reducer";
import { utilService } from "../services/util.service.js";
import Title from "../cmps/Title.jsx";

export function JewelDetails() {
    const [jewel, setJewel] = useState(null);
    const [mainImage, setMainImage] = useState("");
    const magnifierRef = useRef(null);
    const { jewelId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;
    const shoppingCart = useSelector(state => state.jewelModule.shoppingCart);
    const [isAdded, setIsAdded] = useState(false);
    const currency = useSelector(storeState => storeState.systemModule.currency);
    const exchangeRate = useSelector(storeState => storeState.systemModule.exchangeRate);

    useEffect(() => {
        loadJewel();
    }, [jewelId]);

    useEffect(() => {
        if (jewel) {
            setMainImage(jewel.img);
            const inCart = shoppingCart.some(item => item._id === jewel._id);
            setIsAdded(inCart);
        }
    }, [jewel, shoppingCart]);

    function loadJewel() {
        jewelService
            .getById(jewelId)
            .then((jewel) => setJewel(jewel))
            .catch(() => {
                showErrorMsg("Cannot load jewel");
                navigate("/jewel");
            });
    }

    function toggleCart(jewel) {
        if (isAdded) {
            dispatch({ type: REMOVE_JEWEL_FROM_CART, jewelId: jewel._id });
            showSuccessMsg(t("Removed from Cart"));
        } else {
            dispatch({ type: ADD_JEWEL_TO_CART, jewel });
            showSuccessMsg(t("Added to Cart"));
        }
        setIsAdded(!isAdded);
    }

    function handleMouseMove(event) {
        const magnifier = magnifierRef.current;
        const image = event.target;
        const { left, top, width, height } = image.getBoundingClientRect();

        const x = event.clientX - left;
        const y = event.clientY - top;

        const xPercent = (x / width) * 100;
        const yPercent = (y / height) * 100;

        magnifier.style.backgroundImage = `url(${mainImage})`;
        magnifier.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
        magnifier.style.left = `${x}px`;
        magnifier.style.top = `${y}px`;
        magnifier.style.display = "block";
    }

    function handleMouseLeave() {
        magnifierRef.current.style.display = "none";
    }
    if (!jewel) return <Loader />;

    return (
        <section>
            <div className="animate__animated animate__fadeIn animate__delay-1s">
                <Title title={t("Details")} orientation="horizontal" />
            </div>
            <div className="details-container">
                <div className="details-imgs">
                    {/* <div className="magnifier" ref={magnifierRef}></div> */}
                    <img
                        src={mainImage || jewel.img}
                        alt="main photo"
                        className="main-image"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    />
                    <div className="thumbnails">
                        <img
                            src={jewel.img}
                            alt="photo 1"
                            onClick={() => setMainImage(jewel.img)}
                        />
                        <img
                            src={jewel.imghover}
                            alt="photo 2"
                            onClick={() => setMainImage(jewel.imghover)}
                        />
                        <img
                            src={jewel.imgthird}
                            alt="photo 3"
                            onClick={() => setMainImage(jewel.imgthird)}
                        />
                    </div>
                </div>

                <div className="details-text">
                    <h1 className="details-title">{jewel.vendor}</h1>
                    <p className="details-price">
                        {utilService.getFormattedPrice(jewel.price, currency, exchangeRate)}
                    </p>                    <p>{currentLang === "en" ? jewel.descriptionENG : jewel.descriptionHEB}</p>

                    <p><b>{t("Quantity in stock:")} {jewel.quantity}</b></p>

                    <details
                        style={{
                            direction: currentLang === "he" ? "rtl" : "ltr",
                            textAlign: currentLang === "he" ? "right" : "left",
                        }}
                    >
                        <summary>{t("How to take care of your jewellery and what to avoid")}</summary>
                        <ul>
                            <li className="details-li">{t("Avoid direct contact with detergents and cosmetics products.")}</li>
                            <li className="details-li">{t("Not recommended to enter to thermal hot water and swimming pool with silver jewellery.")}</li>
                        </ul>
                    </details>

                    <button
                        className={`add-to-cart-btn ${jewel.isSoldOut ? 'sold-out' : isAdded ? 'added' : ''}`}
                        onClick={() => toggleCart(jewel)}
                        disabled={jewel.isSoldOut}
                    >
                        {jewel.isSoldOut ? t("Sold Out") : isAdded ? t("Added") : t("Add To Cart")}
                    </button>
                </div>
            </div>
        </section>
    );
}