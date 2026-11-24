"use client";

import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface SlideData {
  image: string;
  title: string;
  subtitle: string;
  primaryBtn: string;
  secondaryBtn: string;
}

interface SliderProps {
  spaceBetween?: number;
  slidesPerView?: number;
  slides: SlideData[];
}

export default function Slider({
  spaceBetween = 0,
  slidesPerView = 1,
  slides,
}: SliderProps) {
  const router = useRouter();

  const goToFeatured = () => {
    const el = document.getElementById("featured");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push("/#featured");
    }
  };

  return (
    <div className="w-full h-100 overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        navigation
        pagination={{
          clickable: true,
          renderBullet(index, className) {
            return `<span class="${className} w-4! h-4! bg-white!"></span>`;
          },
        }}
        className="w-full h-full [&_.swiper-button-next]:bg-white [&_.swiper-button-next]:text-[#0F9F46] [&_.swiper-button-next]:rounded-full [&_.swiper-button-next]:w-10 [&_.swiper-button-next]:h-10 [&_.swiper-button-next]:after:text-lg [&_.swiper-button-next]:after:font-bold [&_.swiper-button-prev]:bg-white [&_.swiper-button-prev]:text-[#0F9F46] [&_.swiper-button-prev]:rounded-full [&_.swiper-button-prev]:w-10 [&_.swiper-button-prev]:h-10 [&_.swiper-button-prev]:after:text-lg [&_.swiper-button-prev]:after:font-bold"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative w-full h-full">
      
            <img
              src={slide.image}
              className="w-full h-full object-cover"
              alt={`Slide ${index + 1}`}
            />

          
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, rgba(15,159,70,0.95) 0%, rgba(15,159,70,0.85) 45%, rgba(15,159,70,0.75) 100%)",
              }}
            />

            <div className="absolute inset-0 flex flex-col justify-center px-12 md:px-24">
              <div className="max-w-md text-white">
                <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-snug">
                  {slide.title}
                </h2>
                <p className="text-sm md:text-base mb-6">{slide.subtitle}</p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={goToFeatured}
                    className="cursor-pointer bg-white text-[#0F9F46] px-5 py-2 text-sm rounded-md font-semibold hover:bg-gray-100 transition duration-300"
                  >
                    {slide.primaryBtn}
                  </button>
                  <button
                    type="button"
                    onClick={goToFeatured}
                    className="cursor-pointer border border-white/60 text-white px-5 py-2 text-sm rounded-md font-semibold hover:bg-white/20 transition duration-300"
                  >
                    {slide.secondaryBtn}
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}