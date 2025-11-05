import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex gap-4">
      
      {/* Thumbnails */}
      <div className="flex flex-col gap-4">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelectedImage(i)}
            className={`w-20 h-20 p-2 rounded-lg border flex items-center justify-center cursor-pointer
              ${
                selectedImage === i
                  ? "border-purple-600 shadow-md"
                  : "border-gray-300 hover:border-purple-400"
              }`}
          >
            <img src={img} alt="" className="object-contain w-full h-full" />
          </button>
        ))}
      </div>

      {/* Main Image Box */}
      <div className="relative flex-1 bg-white border rounded-xl shadow-sm flex items-center justify-center p-6">

        {/* Prev Arrow */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white border shadow-md rounded-full p-2 hover:bg-purple-600 hover:text-white transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <img
          src={images[selectedImage]}
          className="w-full max-h-[480px] object-contain"
          alt="product"
        />

        {/* Next Arrow */}
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white border shadow-md rounded-full p-2 hover:bg-purple-600 hover:text-white transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`h-2 rounded-full transition-all
              ${
                selectedImage === i
                  ? "bg-gray-900 w-5"
                  : "bg-gray-400 w-2 hover:bg-gray-600"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
