import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { utilService } from "../services/util.service.js";

export function JewelPreview({ jewel }) {
    const { t, ready } = useTranslation();

    // מושכים את המטבע והשער מה-Store של Redux
    const currency = useSelector(storeState => storeState.systemModule.currency);
    const exchangeRate = useSelector(storeState => storeState.systemModule.exchangeRate);

    return (
        <article className="jewel-preview">
            <Link to={`/jewel/${jewel._id}`}>
                <div className="image-container">
                    {jewel.isSoldOut && <span className="sold-out-stiker">{t("Sold Out")}</span>}
                    <img className="image" src={jewel.img} alt={jewel.vendor} />
                    <img className="image-hover" src={jewel.imghover} alt={jewel.vendor} />
                </div>
            </Link>
            <div className="card-preview-data">
                <p className="card-title">{jewel.vendor}</p>
                <div className="price-container">
                    <del className={!jewel.fakeprice || jewel.fakeprice <= 0 ? 'invisible-placeholder' : ''}>
                        {/* כאן שינינו: במקום מחיר קשיח, אנחנו קוראים לפונקציה */}
                        <p className="fake-line-price">
                            {utilService.getFormattedPrice(jewel.fakeprice, currency, exchangeRate)}
                        </p>
                    </del>

                    <ins>
                        {/* וכאן שינינו את המחיר הרגיל */}
                        <p className="card-price">
                            {utilService.getFormattedPrice(jewel.price, currency, exchangeRate)}
                        </p>
                    </ins>
                </div>
            </div>
        </article>
    );
}