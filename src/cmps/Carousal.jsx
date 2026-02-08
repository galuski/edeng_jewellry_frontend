import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { ShopButton } from "./ShopButton";

export default function Carousel({ data }) {
  const { t, ready } = useTranslation();

  const [slide, setSlide] = useState(0);

  const nextSlide = () => {
    setSlide(slide === data.length - 1 ? 0 : slide + 1);
  };

  const prevSlide = () => {
    setSlide(slide === 0 ? data.length - 1 : slide - 1);
  };

  // מעבר אוטומטי כל 3 שניות
  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval); // ניקוי ה-interval כשמרנדרים מחדש
  }, [slide]); // מאזין ל-slide כדי שהאפקט ירוץ מחדש בכל שינוי

  return (
    <div className="carousel">
      <BsArrowLeftCircleFill onClick={prevSlide} className="arrow arrow-left" />
      {data.map((item, idx) => {
        return (
          <img
            src={item.src}
            alt={item.alt}
            key={idx}
            className={slide === idx ? "slide" : "slide slide-hidden"}
          />
        );
      })}
      <BsArrowRightCircleFill
        onClick={nextSlide}
        className="arrow arrow-right"
      />
      <span className="indicators">
        {data.map((_, idx) => {
          return (
            <button
              key={idx}
              className={
                slide === idx ? "indicator" : "indicator indicator-inactive"
              }
              onClick={() => setSlide(idx)}
            ></button>
          );
        })}
      </span>

      <div className="carousel-content">
        <h1 className="animate__animated animate__fadeIn animate__delay-1s">
          {t('Handmade jewellery design')}
        </h1>
        <div className="animate__animated animate__fadeIn animate__delay-2s">
          <Link to="/jewel" ><ShopButton /></Link>
        </div>
      </div>
    </div>
  );
};