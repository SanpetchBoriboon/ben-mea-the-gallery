'use client';

import { useEffect, useState } from 'react';
import GalleryHeader from './components/GalleryHeader';

interface ApiImage {
  name: string;
  size: number;
  contentType: string;
  timeCreated: string;
  updated: string;
  publicUrl: string;
  signedUrl: string;
  exists: boolean;
  metadata: {
    firebaseStorageDownloadTokens: string;
  };
}

interface ApiResponse {
  message: string;
  images: ApiImage[];
  count: number;
  prefix: string;
}

export default function Home() {
  const [images, setImages] = useState<ApiImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const CACHE_KEY = 'our-gallery-images-cache';
  const CACHE_TTL = 1000 * 60 * 60;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const cachedRaw = window.sessionStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
          const cached: { timestamp: number; images: ApiImage[] } =
            JSON.parse(cachedRaw);
          const isFresh = Date.now() - cached.timestamp < CACHE_TTL;

          if (isFresh && cached.images?.length) {
            setImages(cached.images);
            return;
          }
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/images?prefix=our-gallery`
        );
        const data: ApiResponse = await response.json();
        setImages(data.images);

        window.sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            timestamp: Date.now(),
            images: data.images,
          })
        );
      } catch {
        // Error fetching images - silent fail
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [CACHE_KEY, CACHE_TTL]);

  // Auto-slide images every 4 seconds
  useEffect(() => {
    if (!images || images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images]);
  return (
    <div className='min-h-screen bg-black relative'>
      <GalleryHeader />

      {/* Dynamic Gallery Background with Auto-Sliding */}
      <div className='absolute inset-0 opacity-100'>
        {loading ? (
          // Loading placeholder
          <>
            <div className='absolute inset-0 bg-black/30'></div>
            <div className='absolute top-20 left-10 w-96 h-96 bg-gray-500/30 rounded-full blur-3xl animate-pulse'></div>
            <div className='absolute top-40 right-20 w-80 h-80 bg-gray-500/30 rounded-full blur-3xl animate-pulse'></div>
            <div className='absolute bottom-20 left-1/4 w-72 h-72 bg-gray-500/30 rounded-full blur-3xl animate-pulse'></div>
          </>
        ) : (
          // Dynamic background images with auto-sliding
          <>
            <div className='absolute inset-0 bg-black/50'></div>

            {/* Multi-layered background images */}
            {images.map((image, index) => (
              <div
                key={image.name}
                className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  backgroundImage: `url(${image.signedUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  filter: 'brightness(0.7) contrast(1.1) saturate(1.2)',
                }}
              />
            ))}

            {/* Additional artistic blur effects */}
            <div className='absolute top-1/3 left-1/3 w-96 h-96 bg-white/10 rounded-full blur-3xl'></div>
            <div className='absolute bottom-1/3 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl'></div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className='relative z-10 flex flex-col items-center justify-end min-h-[calc(100vh-120px)] px-6'>
        <div className='text-center max-w-4xl mx-auto'>
          {/* Main Heading */}
          <h2
            className='text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-wider drop-shadow-2xl shadow-black font-kanit'
            style={{ fontFamily: 'var(--font-kanit), sans-serif' }}
          >
            Our gallery
          </h2>

          {/* Subtitle */}
          {/* <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
            IS A BRAND NEW VISUAL ARTS INSTITUTION BUILDING UPON A SOLID FOUNDATION
            <br />
            OF SCHOLARSHIP AND EXPERIENCE
          </p> */}

          {/* Dynamic Pagination Dots */}
          <div className='flex justify-center space-x-3 mb-8'>
            {loading ? (
              // Loading dots
              <>
                <div className='w-3 h-3 rounded-full bg-white animate-pulse'></div>
                <div className='w-3 h-3 rounded-full bg-white/50 animate-pulse'></div>
                <div className='w-3 h-3 rounded-full bg-white/50 animate-pulse'></div>
              </>
            ) : (
              // Dynamic dots based on images
              images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? 'bg-white scale-125'
                      : 'bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Decorative Elements
      <div className="absolute bottom-0 left-0 w-full h-32 bg-black/20"></div> */}
    </div>
  );
}
