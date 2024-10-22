import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Slider = () => {
  const sliderRef = useRef(null);
  const slidesRef = useRef([]);
  const { contextSafe } = useGSAP();
  const viewportCenter = window.innerWidth / 2;

  const views = [];

  useGSAP(() => {
    const slides = gsap.utils.toArray(slidesRef.current);
    gsap.fromTo(
      sliderRef.current,
      { xPercent: -200 },
      {
        xPercent: 100,
        duration: 7,
        onComplete: () => {
          gsap.to(sliderRef.current, { xPercent: 0, duration: 6 });
        },
        onUpdate: () => {
          slides.forEach((slide, index) => {
            const slideRect = slide.getBoundingClientRect();
            const slideCenter = slideRect.left + slideRect.width / 2;
            
            if ( !isNaN(slideCenter) && slideCenter <= viewportCenter && slideCenter >= viewportCenter - slideRect.width / 2 ) {
              if (!views[index]) {
                console.log("here", index)
                views[index] = true;
                console.log(views[index]);
                console.log(slideCenter);
                onCenterPosition(slide).callback();
              }
            }
          });
        },
      }
    );
  });

  const onCenterPosition = (element) => ({
    trigged: false,
    callback: () => {
      gsap.to(element, {
        scale: 1.2,
        duration: 0.5,
        onComplete: () => {
          gsap.to(element, {
            scale: 1,
            duration: 0.5,
          });
        },
      });
    },
  });

  return (
    <div className="slider-container w-screen h-screen flex-center overflow-hidden">
      <div className="slider flex w-full h-[450px] relative" ref={sliderRef}>
        {[
          "/assets/images/case.webp",
          "/assets/images/case.webp",
          "/assets/images/case.webp",
          "/assets/images/case.webp",
          "/assets/images/case.webp",
          "/assets/images/case.webp",
          "/assets/images/case.webp",
          "/assets/images/case.webp",
          "/assets/images/case.webp",
        ].map((imgSrc, index) => (
          <div
            className="slide min-w[200px] mx-20px"
            key={index}
            ref={(el) => (slidesRef.current[index] = el)}
          >
            <img src={imgSrc} alt={`Slide ${index + 1}`} className="w-full min-w-[200px]" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
