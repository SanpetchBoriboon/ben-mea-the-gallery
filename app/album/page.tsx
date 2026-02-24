'use client';

import { useEffect, useState } from 'react';
import GalleryHeader from '../components/GalleryHeader';

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

const ITEMS_PER_PAGE = 9;
const CACHE_KEY = 'album-images-cache';
const CACHE_TTL = 1000 * 60 * 60; // 60 minutes

export default function AlbumPage() {
  const [images, setImages] = useState<ApiImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedImage, setSelectedImage] = useState<ApiImage | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const cachedRaw = window.sessionStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw) as {
            images: ApiImage[];
            timestamp: number;
          };
          if (Date.now() - cached.timestamp < CACHE_TTL) {
            setImages(cached.images);
            setLoading(false);
            return;
          }
        }

        const response = await fetch(
          'http://localhost:3000/api/images?prefix=journey-of-us-images'
        );
        const data: ApiResponse = await response.json();
        setImages(data.images);
        window.sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ images: data.images, timestamp: Date.now() })
        );
      } catch {
        // Error fetching images - silent fail
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    if (selectedImage) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [selectedImage]);

  const totalPages = Math.ceil(images.length / ITEMS_PER_PAGE);
  const currentImages = images.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const getRotation = (name: string) => {
    const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return ((hash % 10) - 5) * 0.4;
  };

  return (
    <div className='min-h-screen bg-[#F5F0EB] relative'>
      <GalleryHeader titleColor='text-gray-800' />

      <div className='relative z-10 pt-8 pb-16 px-6'>
        {/* Heading */}
        <div className='text-center mb-10'>
          <h2
            className='text-5xl md:text-6xl font-bold text-gray-800 mb-3 tracking-wider font-kanit'
            style={{ fontFamily: 'var(--font-kanit), sans-serif' }}
          >
            Journey of us
          </h2>
          <p
            className='text-gray-500 text-lg font-kanit'
            style={{ fontFamily: 'var(--font-kanit), sans-serif' }}
          >
            ภาพความทรงจำของเรา
          </p>
        </div>

        {loading ? (
          <div className='max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8'>
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className='bg-white rounded-sm shadow-lg p-3 animate-pulse'
                style={{ transform: `rotate(${((i % 5) - 2) * 0.6}deg)` }}
              >
                <div className='bg-gray-200 aspect-4/3 w-full rounded-sm mb-3' />
                <div className='h-3 bg-gray-200 rounded w-2/3 mx-auto' />
              </div>
            ))}
          </div>
        ) : images.length > 0 ? (
          <>
            {/* Postcard Grid */}
            <div className='max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-10 place-items-center'>
              {currentImages.map(image => {
                const rotation = getRotation(image.name);
                const dateStr = image.name.split('/')[1];

                return (
                  <div
                    key={image.name}
                    className='group cursor-pointer'
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      transformOrigin: 'center center',
                    }}
                    onClick={() => setSelectedImage(image)}
                  >
                    {/* Postcard */}
                    <div className='bg-white rounded-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 p-3 pb-8 relative w-75'>
                      {/* Image */}
                      <div className='overflow-hidden rounded-sm'>
                        <div
                          className='aspect-4/3 bg-cover bg-center group-hover:scale-105 transition-transform duration-500 w-full'
                          style={{ backgroundImage: `url(${image.signedUrl})` }}
                        />
                      </div>
                      {/* Bottom area like a postcard */}
                      <div className='mt-3 flex justify-between items-center px-1'>
                        <p
                          className='text-gray-400 text-xs font-kanit'
                          style={{
                            fontFamily: 'var(--font-kanit), sans-serif',
                          }}
                        >
                          {dateStr}
                        </p>
                        <div className='w-6 h-6 border border-gray-300 rounded-sm opacity-40' />
                      </div>
                      {/* Postcard line divider */}

                      <div className='absolute bottom-4 left-1/2 -translate-x-1/2 w-1/2 border-t border-dashed border-gray-200' />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className='flex justify-center items-center gap-4 mt-12'>
                {currentPage > 0 && (
                  <button
                    onClick={() => setCurrentPage(p => p - 1)}
                    className='p-3 rounded-full bg-white shadow hover:shadow-md transition-all text-gray-600 hover:text-gray-900'
                  >
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 19l-7-7 7-7'
                      />
                    </svg>
                  </button>
                )}
                <div className='flex gap-2'>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        i === currentPage
                          ? 'bg-gray-700 scale-125'
                          : 'bg-gray-300 hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
                {currentPage < totalPages - 1 && (
                  <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    className='p-3 rounded-full bg-white shadow hover:shadow-md transition-all text-gray-600 hover:text-gray-900'
                  >
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className='text-center py-20'>
            <div className='bg-white/80 rounded-xl p-12 max-w-md mx-auto shadow'>
              <h3
                className='text-2xl font-bold text-gray-700 mb-3 font-kanit'
                style={{ fontFamily: 'var(--font-kanit), sans-serif' }}
              >
                ยังไม่มีรูปภาพ
              </h3>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className='fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4'>
          <div className='relative max-w-3xl w-full'>
            <button
              onClick={() => setSelectedImage(null)}
              className='absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors'
            >
              <svg
                className='w-8 h-8'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
            <div className='bg-white rounded-sm shadow-2xl p-4 pb-10'>
              <img
                src={selectedImage.signedUrl}
                alt={selectedImage.name}
                className='w-full h-auto max-h-[75vh] object-contain rounded-sm'
              />
              <p
                className='text-center text-gray-400 text-sm mt-4 font-kanit'
                style={{ fontFamily: 'var(--font-kanit), sans-serif' }}
              >
                {new Date(selectedImage.timeCreated).toLocaleDateString(
                  'th-TH',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                )}
              </p>
            </div>
            <div
              className='absolute inset-0 -z-10'
              onClick={() => setSelectedImage(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
