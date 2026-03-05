'use client';

import { useRouter } from 'next/navigation';
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

const ALBUMS = [
  {
    id: 'journey-of-us-images',
    name: 'Journey of us',
    description: 'ภาพความทรงจำของเรา',
  },
  {
    id: 'moment-of-photos/personal-digital-camera',
    name: 'Personal Digital Camera',
    description: 'ช่วงเวลาส่วนตัว',
  },
  {
    id: 'moment-of-photos/mobile-photo',
    name: 'Mobile Photo',
    description: 'ช่วงเวลาส่วนตัว',
  },
];

export default function Home() {
  const router = useRouter();
  const [images, setImages] = useState<ApiImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [albumPreviews, setAlbumPreviews] = useState<{
    [key: string]: ApiImage[];
  }>({});

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

  // Fetch album previews
  useEffect(() => {
    const fetchAlbumPreviews = async () => {
      const previews: { [key: string]: ApiImage[] } = {};

      for (const album of ALBUMS) {
        try {
          const cacheKey = `album-preview-${album.id.replace(/[\/\s]/g, '_')}`;
          const cachedRaw = window.sessionStorage.getItem(cacheKey);

          if (cachedRaw) {
            const cached = JSON.parse(cachedRaw) as {
              images: ApiImage[];
              timestamp: number;
            };
            if (Date.now() - cached.timestamp < CACHE_TTL) {
              previews[album.id] = cached.images.slice(0, 4); // Get first 4 images
              continue;
            }
          }

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/images?prefix=${album.id}`
          );
          const data: ApiResponse = await response.json();

          if (data.images) {
            previews[album.id] = data.images.slice(0, 4); // Get first 4 images
            window.sessionStorage.setItem(
              cacheKey,
              JSON.stringify({ images: data.images, timestamp: Date.now() })
            );
          }
        } catch {
          // Silent fail for preview fetch errors
          previews[album.id] = [];
        }
      }

      setAlbumPreviews(previews);
    };

    fetchAlbumPreviews();
  }, []);

  const navigateToAlbum = (albumId: string) => {
    router.push(`/album?selected=${encodeURIComponent(albumId)}`);
  };

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
            Albums Collection
          </h2>

          {/* Subtitle */}
          {/* <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
            IS A BRAND NEW VISUAL ARTS INSTITUTION BUILDING UPON A SOLID FOUNDATION
            <br />
            OF SCHOLARSHIP AND EXPERIENCE
          </p> */}
          {/* Album Previews Section */}
          <div className='relative z-10 px-6 pb-16'>
            <div className='max-w-6xl mx-auto'>
              <div className='flex flex-col sm:flex-row gap-6 sm:gap-8 overflow-x-auto pb-4'>
                {ALBUMS.map(album => (
                  <div
                    key={album.id}
                    onClick={() => navigateToAlbum(album.id)}
                    className='group cursor-pointer flex-shrink-0 w-full sm:w-80 md:w-96'
                  >
                    <div className='bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300 border border-white/20 h-full'>
                      <div className='mb-6'>
                        <h4
                          className='text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-gray-200 transition-colors font-kanit'
                          style={{
                            fontFamily: 'var(--font-kanit), sans-serif',
                          }}
                        >
                          {album.name}
                        </h4>
                        <p
                          className='text-white/80 font-kanit text-sm md:text-base'
                          style={{
                            fontFamily: 'var(--font-kanit), sans-serif',
                          }}
                        >
                          {album.description}
                        </p>
                      </div>

                      <div className='grid grid-cols-2 gap-2 mb-4'>
                        {albumPreviews[album.id]
                          ? albumPreviews[album.id].map((image, _index) => (
                              <div
                                key={image.name}
                                className='aspect-square bg-cover bg-center rounded group-hover:scale-105 transition-transform duration-300'
                                style={{
                                  backgroundImage: `url(${image.signedUrl})`,
                                }}
                              />
                            ))
                          : // Loading placeholders
                            Array.from({ length: 4 }).map((_, index) => (
                              <div
                                key={index}
                                className='aspect-square bg-gray-500/30 rounded animate-pulse'
                              />
                            ))}
                      </div>

                      <div className='flex items-center justify-between'>
                        <span className='text-white/60 text-sm font-kanit'>
                          {albumPreviews[album.id]?.length || 0} photos
                        </span>
                        <div className='text-white group-hover:translate-x-1 transition-transform duration-300'>
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
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements
      <div className="absolute bottom-0 left-0 w-full h-32 bg-black/20"></div> */}
    </div>
  );
}
