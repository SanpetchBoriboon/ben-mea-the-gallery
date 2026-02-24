'use client';

import { useEffect, useState } from 'react';

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

export default function AlbumPage() {
  const [images, setImages] = useState<ApiImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          'http://localhost:3000/api/images?prefix=album'
        );
        const data: ApiResponse = await response.json();
        setImages(data.images);
      } catch {
        // Error fetching images - silent fail
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

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
      {/* Header Navigation */}
      <header className='relative z-10 px-6 py-4'>
        <div className='max-w-7xl mx-auto flex justify-between items-center'>
          {/* Logo */}
          <div className='text-center'>
            <a
              href='/'
              className='text-white text-2xl font-bold tracking-wider hover:text-orange-300 transition-colors font-kanit'
              style={{ fontFamily: 'var(--font-kanit), sans-serif' }}
            >
              Our Gallery
            </a>
          </div>

          {/* Gallery Selector */}
          <div className='hidden md:flex'>
            <select
              className='bg-black/50 text-white border border-white/30 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-300 backdrop-blur-sm font-kanit'
              onChange={e => {
                const value = e.target.value;
                if (value) {
                  window.location.href = value;
                }
              }}
              value='/album'
              style={{ fontFamily: 'var(--font-kanit), sans-serif' }}
            >
              <option
                value='/'
                style={{ fontFamily: 'var(--font-kanit), sans-serif' }}
              >
                หน้าแรก
              </option>
              <option
                value='/wishes'
                style={{ fontFamily: 'var(--font-kanit), sans-serif' }}
              >
                รูปจากคำอวยพร
              </option>
              <option
                value='/photographer'
                style={{ fontFamily: 'var(--font-kanit), sans-serif' }}
              >
                รูปจากช่างภาพ
              </option>
              <option
                value='/album'
                style={{ fontFamily: 'var(--font-kanit), sans-serif' }}
              >
                รูปจากอัลบัม
              </option>
            </select>
          </div>

          {/* Mobile Back Button */}
          <button
            className='md:hidden text-white'
            onClick={() => (window.location.href = '/')}
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 19l-7-7m0 0l7-7m-7 7h18'
              />
            </svg>
          </button>
        </div>
      </header>

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
          <h2 className='text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-wider drop-shadow-2xl shadow-black'>
            รูปจากอัลบัม
          </h2>

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
    </div>
  );
}
