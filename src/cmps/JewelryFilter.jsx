import { useTranslation } from "react-i18next";

import { useEffect, useRef, useState } from "react";
import { utilService } from "../services/util.service.js";

import plusSVG from "./../../public/icons/plus.svg";
import minusSVG from "./../../public/icons/minus.svg";
import magnifyingSVG from "./../../public/icons/magnifying-glass.svg";

export default function JewelryFilter({ filterBy, onSetFilter }) {

  const { t, ready } = useTranslation();

  const [filterByToEdit, setFilterByToEdit] = useState({
    vendor: filterBy.vendor || "",
    maxPrice: filterBy.maxPrice || 20000,
    designed: filterBy.designed || "",
    type: filterBy.type || ""
  });

  useEffect(() => {
    const rangeInput = document.querySelector(".range-input");
    if (rangeInput) {
      handleRangeChange({ target: rangeInput });
    }
  }, []);

  const debouncedOnSetFilter = useRef(utilService.debounce(onSetFilter)).current;

  useEffect(() => {
    debouncedOnSetFilter(filterByToEdit);
  }, [filterByToEdit]);

  function handleChange({ target }) {
    let { value, name: field, type } = target;
    value = type === "number" ? +value || "" : value;
    setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }));

  }

  const handleRangeChange = (e) => {
    const value = e.target.value;
    const max = e.target.max;
    const percentage = (value / max) * 100;

    e.target.style.background = `linear-gradient(to right, red 0%, red ${percentage}%, var(--clr5) ${percentage}%, var(--clr5) 100%)`;

    const priceValueElement = document.querySelector(".price-value");
    const rangeWidth = e.target.offsetWidth;

    priceValueElement.style.left = `${(value / 20000) * rangeWidth}px`;
  };


  return (
    <div className="filter-container">
      <label className="filter-label">{t("Jewellry Filter:")}</label>

      <div className="search-container">

        <input
          type="text"
          name="vendor"
          placeholder={t("By jewel name...")}
          value={filterByToEdit.vendor}
          onChange={handleChange}
          className="filter-input"
        />
        <img className="search-icon" src={magnifyingSVG} alt="magnifying-glass" />
      </div>

      {/* <div className="price-filter-container">

        <label className="filter-label">{t("Max Price:")}</label>
        <div className="price-slider">
          <img
            src={minusSVG}
            alt="Decrease"
            className="price-btn"
            onClick={() =>
              setFilterByToEdit((prev) => ({
                ...prev,
                maxPrice: Math.max(prev.maxPrice - 100, 0),
              }))
            }
          />
          <input
            className="range-input"
            type="range"
            name="maxPrice"
            min="0"
            max="20000"
            step="100"
            value={filterByToEdit.maxPrice}
            onChange={(e) => {
              handleChange(e);
              handleRangeChange(e);
            }}
          />
          <span className="price-value">₪{filterByToEdit.maxPrice}</span>
          <img
            src={plusSVG}
            alt="Increase"
            className="price-btn"
            onClick={() =>
              setFilterByToEdit((prev) => ({
                ...prev,
                maxPrice: Math.min(prev.maxPrice + 100, 20000),
              }))
            }
          />
        </div>
      </div> */}

      <div className="type-container">
        <label className="filter-label">{t("Type")}</label>
        <div className="type-filter">
          <select className="type-select"
            name="type"
            value={filterByToEdit.type}
            onChange={handleChange}
          >
            <option value="">{t("All")}</option>
            <option value="Earrings">{t("Earrings")}</option>
            <option value="Necklaces">{t("Necklaces")}</option>
            <option value="Bracelets">{t("Bracelets")}</option>
            <option value="Rings">{t("Rings")}</option>
            <option value="14k Gold">{t("14k Gold")}</option>
            <option value="925 Silver">{t("925 Silver")}</option>
          </select>
        </div>
      </div>

      <div className="designed-continer">
        <label className="filter-label">{t("Designed for:")}</label>
        <div className="gender-filter">
          <input
            type="radio"
            id="women"
            name="designed"
            value="women"
            checked={filterByToEdit.designed === "women"}
            onChange={handleChange}
          />

          <label htmlFor="women">{t("Women")}</label>
          |
          <input
            type="radio"
            id="men"
            name="designed"
            value="men"
            checked={filterByToEdit.designed === "men"}
            onChange={handleChange}
          />
          <label htmlFor="men">{t("Men")}</label>
        </div>
      </div>
    </div>
  );
}