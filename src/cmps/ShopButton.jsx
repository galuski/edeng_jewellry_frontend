import React from "react";
import { useTranslation } from "react-i18next";

export function ShopButton() {
    const { t, ready } = useTranslation();


    return (
        <button className="shop-btn btn-1">
            <svg>
                <rect x="0" y="0" fill="none" width="100%" height="100%" />
            </svg>
            {t("SHOP NOW")}
        </button>
    )
}