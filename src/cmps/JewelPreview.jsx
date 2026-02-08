import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function JewelPreview({ jewel }) {
    const { t, ready } = useTranslation();

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
                        <p className="fake-line-price">₪ {jewel.fakeprice}</p>
                    </del>

                    <ins>
                        <p className="card-price">₪ {jewel.price}</p>
                    </ins>
                </div>
            </div>
        </article>
    );
}