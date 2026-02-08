import React from "react";
import Slider from "./Slider";
import { ShopButton } from "./ShopButton";
import images from "./../dataimages";



const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-text">
        <div className="hero-titles">
          <h1>Welcome to Eden Jewellry</h1>
          <h2>
            Everyone has their own special light
          </h2>
          <h3>Don't stop shining<span className="video-content-marker">.</span></h3>
        </div>
        <div className="shop-hero">
          <ShopButton />
        </div>
      </div>
      <div className="hero-slider">
      <Slider images={images ?? []} />
      </div>
    </section>
  );
};

export default HeroSection;
