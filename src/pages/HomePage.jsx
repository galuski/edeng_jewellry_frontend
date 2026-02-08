import { useEffect, useState } from "react";
import Carousal from "../cmps/Carousal";
import { JewelIndex } from "./JewelIndex"
import Video from "../cmps/Video";
import carouselData from "./../data/carousel.json";
import { CategoryList } from "../cmps/CategoryList";

export function HomePage() {
  const [slides, setSlides] = useState(
    window.innerWidth <= 768 ? carouselData["slides-mobile"] : carouselData.slides
  );

  useEffect(() => {
    const handleResize = () => {
      setSlides(window.innerWidth <= 768 ? carouselData["slides-mobile"] : carouselData.slides);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section>
      {/* <Video /> */}
      {/* <HeroSection /> */}
      <Carousal data={slides} />
      <CategoryList />
      {/* <JewelIndex /> */}
    </section>
  );
}