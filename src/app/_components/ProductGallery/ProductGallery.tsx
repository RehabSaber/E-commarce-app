"use client";
import React, { useState } from "react";

interface ProductGalleryProps {
  imageCover: string;
  images: string[];
  title: string;
}

export default function ProductGallery({ imageCover, images, title }: ProductGalleryProps) {
 
  const defaultImage = images && images.length > 0 ? images[0] : imageCover;
  
  const [mainImage, setMainImage] = useState(defaultImage);

  return (
    <div className="w-full lg:w-1/3">
  
      <div className="border border-gray-200 rounded-lg p-6 mb-4 flex justify-center items-center h-112.5 bg-gray-50">
        <img
          src={mainImage}
          alt={title}
          className="max-h-full object-contain mix-blend-multiply transition-all duration-300"
        />
      </div>


      <div className="grid grid-cols-4 gap-3">
        {images?.slice(0, 4).map((img, index) => (
          <div
            key={index}
            onClick={() => setMainImage(img)}
            className={`border rounded-lg p-2 h-24 flex justify-center items-center cursor-pointer transition-colors bg-gray-50 ${
              mainImage === img ? "border-[#10b981]" : "border-gray-200 hover:border-[#10b981]"
            }`}
          >
            <img
              src={img}
              alt={`${title} thumbnail ${index + 1}`}
              className="max-h-full object-contain mix-blend-multiply"
            />
          </div>
        ))}
      </div>
    </div>
  );
}