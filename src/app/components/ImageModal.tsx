'use client'

import { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface MediaItem {
  url: string;
  type: string;
  name: string;
}

interface ImageModalProps {
  images: MediaItem[];
  initialIndex: number;
  onClose: () => void;
}

export default function ImageModal({ images, initialIndex, onClose }: ImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleClose = () => {
  onClose();
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-[1000] flex flex-col items-center justify-center">
      <button 
        onClick={handleClose} 
        className="absolute top-4 right-4 bg-black bg-opacity-50 text-white text-2xl p-2 rounded-full z-[1001] border-2 border-white hover:bg-opacity-70 transition-all"
      >
        X
      </button>
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="overflow-hidden w-full h-full">
          <div 
            className="flex transition-transform duration-300 ease-in-out h-full" 
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((img, index) => (
              <div key={index} className="flex-shrink-0 w-full h-full flex items-center justify-center">
                <TransformWrapper>
                  <TransformComponent>
                    <img 
                      src={img.url} 
                      alt="Enlarged media" 
                      className="max-w-full max-h-full object-contain" 
                    />
                  </TransformComponent>
                </TransformWrapper>
              </div>
            ))}
          </div>
        </div>
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full text-2xl"
            >
              &lt;
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full text-2xl"
            >
              &gt;
            </button>
          </>
        )}
      </div>
    </div>
  );
}