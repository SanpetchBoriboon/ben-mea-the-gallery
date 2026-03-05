'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ALBUMS } from '../../src/constants';
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

const CACHE_TTL = 1000 * 60 * 60; // 60 minutes

export default function AlbumPage() {
  const searchParams = useSearchParams();

  const selectedParam = searchParams.get('selected');

  // Initialize with URL parameter or default to first album
  const initialAlbum =
    selectedParam && ALBUMS.some(album => album.id === selectedParam)
      ? selectedParam
      : ALBUMS[0].id;

  const [selectedAlbum] = useState(initialAlbum);
  const [images, setImages] = useState<ApiImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedImage, setSelectedImage] = useState<ApiImage | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  useEffect(() => {
    const update = () => setItemsPerPage(window.innerWidth < 768 ? 4 : 9);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        // Sanitize cache key to handle special characters
        const cacheKey = `album-images-cache-${selectedAlbum.replace(/[\/\s]/g, '_')}`;
        const cachedRaw = window.sessionStorage.getItem(cacheKey);

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
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/images?prefix=${selectedAlbum}`
        );
        const data: ApiResponse = await response.json();

        if (data.images) {
          setImages(data.images);
          window.sessionStorage.setItem(
            cacheKey,
            JSON.stringify({ images: data.images, timestamp: Date.now() })
          );
        }
      } catch {
        // Error fetching images - silent fail
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [selectedAlbum]);

  // Reset page when album changes
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedAlbum]);

  // Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;

      if (e.key === 'Escape') {
        setSelectedImage(null);
      } else if (e.key === 'ArrowLeft') {
        navigateToPrevious();
      } else if (e.key === 'ArrowRight') {
        navigateToNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, images, currentPage, itemsPerPage]);

  const getCurrentImageIndex = () => {
    return images.findIndex(img => img.name === selectedImage?.name);
  };

  const getCurrentImagePageIndex = (globalIndex: number) => {
    return Math.floor(globalIndex / itemsPerPage);
  };

  const navigateToNext = () => {
    const currentIndex = getCurrentImageIndex();
    if (currentIndex < images.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextPageIndex = getCurrentImagePageIndex(nextIndex);

      // If moving to a new page, update current page
      if (nextPageIndex !== currentPage) {
        setCurrentPage(nextPageIndex);
      }

      setSelectedImage(images[nextIndex]);
    }
  };

  const navigateToPrevious = () => {
    const currentIndex = getCurrentImageIndex();
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const prevPageIndex = getCurrentImagePageIndex(prevIndex);

      // If moving to a new page, update current page
      if (prevPageIndex !== currentPage) {
        setCurrentPage(prevPageIndex);
      }

      setSelectedImage(images[prevIndex]);
    }
  };

  const totalPages = Math.ceil(images.length / itemsPerPage);
  const currentImages = images.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const currentAlbum =
    ALBUMS.find(album => album.id === selectedAlbum) || ALBUMS[0];

  const getRotation = (name: string) => {
    const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return ((hash % 10) - 5) * 0.4;
  };

  // Get first image for background
  const backgroundImage = images.length > 0 ? images[0].signedUrl : null;

  return (
    <div className='min-h-screen relative'>
      {/* Background Image with Overlay */}
      {backgroundImage && (
        <>
          <div
            className='fixed inset-0 bg-cover bg-center bg-no-repeat'
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className='fixed inset-0 bg-black/50' />
        </>
      )}
      {!backgroundImage && <div className='fixed inset-0 bg-[#F5F0EB]' />}

      <div className='relative z-10 h-screen flex flex-col'>
        <GalleryHeader titleColor='#ffffff' />

        {/* Fixed Heading */}
        <div className=' px-4 sm:px-6 py-6'>
          <div className='text-center'>
            <h2
              className='text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-3 tracking-wider font-kanit drop-shadow-lg'
              style={{ fontFamily: 'var(--font-kanit), sans-serif' }}
            >
              {currentAlbum.name}
            </h2>
            <p
              className='text-white/90 text-lg font-kanit drop-shadow-md'
              style={{ fontFamily: 'var(--font-kanit), sans-serif' }}
            >
              {currentAlbum.description}
            </p>
          </div>
        </div>

        {/* Fixed Pagination */}
        {totalPages > 1 && (
          <div className='px-4 py-3'>
            <div className='flex justify-center items-center gap-4'>
              {currentPage > 0 && (
                <button
                  onClick={() => setCurrentPage(p => p - 1)}
                  className='p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all text-white'
                >
                  <svg
                    className='w-4 h-4'
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
                        ? 'bg-white scale-125'
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
              {currentPage < totalPages - 1 && (
                <button
                  onClick={() => setCurrentPage(p => p + 1)}
                  className='p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all text-white'
                >
                  <svg
                    className='w-4 h-4'
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
          </div>
        )}

        {/* Scrollable Content Area */}
        <div className='flex-1 overflow-y-auto pt-6 pb-16 px-4 sm:px-6'>
          {loading ? (
            <div className='max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
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
              <div className='max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 place-items-center'>
                {currentImages.map(image => {
                  const rotation = getRotation(image.name);
                  // const dateStr = image.name.split('/')[1];

                  return (
                    <div
                      key={image.name}
                      className='group cursor-pointer w-full'
                      style={{
                        transform: `rotate(${rotation}deg)`,
                        transformOrigin: 'center center',
                      }}
                      onClick={() => setSelectedImage(image)}
                    >
                      {/* Postcard */}
                      <div className='bg-white rounded-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 p-3 pb-8 relative w-full'>
                        {/* Image */}
                        <div className='overflow-hidden rounded-sm'>
                          <div
                            className='aspect-4/3 bg-cover bg-center group-hover:scale-105 transition-transform duration-500 w-full'
                            style={{
                              backgroundImage: `url(${image.signedUrl})`,
                            }}
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
                            #เบญจเมแต่งแล้วครับ
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
            </>
          ) : (
            <div className='text-center py-20'>
              <div className='bg-white/80 backdrop-blur-sm rounded-xl p-12 max-w-md mx-auto shadow-xl'>
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
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className='fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4'>
          <div className='relative max-w-5xl w-full h-full flex items-center'>
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className='absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors bg-black/20 rounded-full p-2'
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
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>

            {/* Previous Button */}
            {getCurrentImageIndex() > 0 && (
              <button
                onClick={navigateToPrevious}
                className='absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-all bg-black/20 hover:bg-black/40 rounded-full p-3'
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
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
              </button>
            )}

            {/* Next Button */}
            {getCurrentImageIndex() < images.length - 1 && (
              <button
                onClick={navigateToNext}
                className='absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-all bg-black/20 hover:bg-black/40 rounded-full p-3'
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
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </button>
            )}

            {/* Image Container */}
            <div className='w-full h-full flex items-center justify-center'>
              <div className='relative max-w-full max-h-full'>
                <img
                  src={selectedImage.signedUrl}
                  alt={selectedImage.name}
                  className='max-w-full max-h-[80vh] sm:max-h-[85vh] object-contain rounded-lg shadow-2xl'
                />

                {/* Image Info Overlay */}
                <div className='absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full backdrop-blur-sm'>
                  <p
                    className='text-center text-sm font-kanit'
                    style={{ fontFamily: 'var(--font-kanit), sans-serif' }}
                  >
                    {getCurrentImageIndex() + 1} / {images.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Background click to close */}
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
