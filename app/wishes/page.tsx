'use client';

import { useEffect, useState } from 'react';

interface ApiImage {
  _id: string;
  title: string;
  message: string;
  template: string; // Hex color code for tape
  imageUrl: string;
}

interface ApiResponse {
  message: string;
  cards: ApiImage[];
  count: number;
}

export default function WishesPage() {
  const [cards, setCards] = useState<ApiImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<ApiImage | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/cards');
        const data: ApiResponse = await response.json();

        setCards(data.cards);
      } catch {
        // Error fetching images - silent fail
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedCard(null);
      }
    };

    if (selectedCard) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [selectedCard]);

  // Template-based tape styles using hex colors with random variations
  const getTapeStyle = (hexColor: string) => {
    // Generate random rotation and width variations
    const rotations = [-7, -5, -3, 3, 4, 6, 8];
    const widths = ['w-16', 'w-18', 'w-20'];

    const randomRotation =
      rotations[Math.floor(Math.random() * rotations.length)];
    const randomWidth = widths[Math.floor(Math.random() * widths.length)];

    return {
      backgroundColor: hexColor,
      rotation: randomRotation,
      width: randomWidth,
    };
  };

  // Pagination logic
  const totalPages = Math.ceil(cards.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, cards.length);
  const currentCards = cards.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

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
              value='/wishes'
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

          {/* Mobile Selector Button */}
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

      {/* Polaroid Cards Gallery */}
      <div className='relative z-10 min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-800'>
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-10'>
          <div
            className='w-full h-full'
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                               radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <div className='relative z-10 pt-20 pb-10 px-6'>
          {/* Main Heading */}
          <div className='text-center mb-12'>
            <h2
              className='text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-wider drop-shadow-2xl font-kanit'
              style={{ fontFamily: 'var(--font-kanit), sans-serif' }}
            >
              รูปจากคำอวยพร
            </h2>
            <p
              className='text-white/70 text-lg md:text-xl font-kanit'
              style={{ fontFamily: 'var(--font-kanit), sans-serif' }}
            >
              ความทรงจำดีๆ จากคำอวยพรของเพื่อนและครอบครัว
            </p>
          </div>

          {loading ? (
            // Loading Cards Placeholder
            <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div
                  key={i}
                  className='bg-white rounded-lg shadow-2xl p-4 animate-pulse'
                  style={{
                    transform: `rotate(${((i % 3) - 1) * 2}deg)`,
                  }}
                >
                  <div className='bg-gray-300 aspect-4/5 rounded mb-4'></div>
                  <div className='h-4 bg-gray-300 rounded mb-2'></div>
                  <div className='h-3 bg-gray-300 rounded w-2/3'></div>
                </div>
              ))}
            </div>
          ) : (
            // Polaroid Cards Horizontal Scroll
            <div className='max-w-7xl mx-auto'>
              {cards && cards.length > 0 ? (
                <>
                  {/* Cards Grid - 8 per page */}
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8 place-items-center min-h-[600px]'>
                    {currentCards.map((card, _index) => {
                      // Generate consistent rotation based on card ID
                      const cardHash = card._id
                        .split('')
                        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
                      const cardRotation = ((cardHash % 16) - 8) * 0.5; // -4 to +4 degrees

                      return (
                        <div
                          key={card._id}
                          className='group cursor-pointer'
                          style={{
                            transform: `rotate(${cardRotation}deg)`,
                            transformOrigin: 'center center',
                          }}
                          onClick={() => setSelectedCard(card)}
                        >
                          {/* Polaroid Card */}
                          <div className='bg-white rounded-lg shadow-2xl p-4 hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:-rotate-1 relative'>
                            {/* Image Container */}
                            <div className='relative mb-4 overflow-hidden rounded'>
                              <div
                                className='aspect-4/5 bg-cover bg-center group-hover:scale-110 transition-transform duration-500'
                                style={{
                                  backgroundImage: `url(${card.imageUrl || 'https://storage.googleapis.com/wedding-day-5a5a1.firebasestorage.app/photo-all-wishes/3dba1dea-983a-45a5-a998-009d86e1a924.webp'})`,
                                }}
                              />
                              {/* Image Overlay */}
                              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />
                            </div>

                            {/* Card Content */}
                            <div className='text-center space-y-2'>
                              <h3
                                className='font-semibold text-gray-800 text-lg font-kanit line-clamp-2'
                                style={{
                                  fontFamily: 'var(--font-kanit), sans-serif',
                                }}
                              >
                                {card.title}
                              </h3>
                              <p
                                className='text-gray-600 text-sm font-kanit line-clamp-3'
                                style={{
                                  fontFamily: 'var(--font-kanit), sans-serif',
                                }}
                              >
                                {card.message ||
                                  'Congratulations on the marriage.'}
                              </p>
                            </div>

                            {/* Tape Effect */}
                            {(() => {
                              const tapeStyle = getTapeStyle(card.template);
                              return (
                                <div
                                  className={`absolute -top-2 left-1/2 opacity-70 transform -translate-x-1/2 ${tapeStyle.width} h-8 border border-black/20`}
                                  style={{
                                    backgroundColor: tapeStyle.backgroundColor,
                                    transform: `translateX(-50%) rotate(${tapeStyle.rotation}deg)`,
                                    boxShadow:
                                      'inset 0 1px 3px rgba(0,0,0,0.1)',
                                  }}
                                />
                              );
                            })()}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Page Info */}
                  <div className='text-center mt-8'>
                    <p
                      className='text-white/60 text-sm font-kanit'
                      style={{ fontFamily: 'var(--font-kanit), sans-serif' }}
                    >
                      หน้าที่ {currentPage + 1} จาก {totalPages} ({cards.length}{' '}
                      การ์ดทั้งหมด)
                    </p>
                  </div>

                  {/* Navigation Controls */}
                  <div className='flex justify-between items-center mb-8'>
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 0}
                      className={`p-3 rounded-full transition-all duration-300 ${
                        currentPage === 0
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-white/10 text-white hover:bg-white/20 hover:scale-110'
                      }`}
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

                    {/* Page Indicator */}
                    <div className='flex items-center space-x-2'>
                      {Array.from({ length: totalPages }, (_, index) => (
                        <button
                          key={index}
                          onClick={() => goToPage(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentPage
                              ? 'bg-white scale-125'
                              : 'bg-white/30 hover:bg-white/60'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages - 1}
                      className={`p-3 rounded-full transition-all duration-300 ${
                        currentPage === totalPages - 1
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-white/10 text-white hover:bg-white/20 hover:scale-110'
                      }`}
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
                  </div>
                </>
              ) : (
                // No Cards Message
                <div className='text-center py-20'>
                  <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto'>
                    <h3
                      className='text-2xl font-bold text-white mb-4 font-kanit'
                      style={{ fontFamily: 'var(--font-kanit), sans-serif' }}
                    >
                      ยังไม่มีการ์ดอวยพร
                    </h3>
                    <p
                      className='text-white/70 font-kanit'
                      style={{ fontFamily: 'var(--font-kanit), sans-serif' }}
                    >
                      การ์ดอวยพรจะแสดงที่นี่เมื่อมีการเพิ่มข้อมูล
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal for expanded card */}
      {selectedCard && (
        <div className='fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4'>
          <div className='relative max-w-4xl max-h-[90vh] w-full'>
            {/* Close button */}
            <button
              onClick={() => setSelectedCard(null)}
              className='absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors'
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

            {/* Expanded polaroid card */}
            <div className='bg-white rounded-lg shadow-2xl p-6 mx-auto max-w-2xl'>
              {/* Large image */}
              <div className='relative mb-6 overflow-hidden rounded'>
                <img
                  src={
                    selectedCard.imageUrl ??
                    'https://storage.googleapis.com/wedding-day-5a5a1.firebasestorage.app/photo-all-wishes/3dba1dea-983a-45a5-a998-009d86e1a924.webp'
                  }
                  alt={selectedCard.title}
                  className='w-full h-auto max-h-[60vh] object-cover'
                />
              </div>

              {/* Card content */}
              <div className='text-center space-y-4'>
                <h3
                  className='font-bold text-gray-800 text-2xl font-kanit'
                  style={{
                    fontFamily: 'var(--font-kanit), sans-serif',
                  }}
                >
                  {selectedCard.title}
                </h3>
                <p
                  className='text-gray-600 text-lg font-kanit leading-relaxed'
                  style={{
                    fontFamily: 'var(--font-kanit), sans-serif',
                  }}
                >
                  {selectedCard.message}
                </p>
              </div>

              {/* Tape effect for modal */}
              {(() => {
                const tapeStyle = getTapeStyle(selectedCard.template);
                return (
                  <div
                    className={`absolute -top-3 left-1/2 opacity-70 transform -translate-x-1/2 ${tapeStyle.width} h-10 border border-black/20`}
                    style={{
                      backgroundColor: tapeStyle.backgroundColor,
                      transform: `translateX(-50%) rotate(${tapeStyle.rotation}deg)`,
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                    }}
                  />
                );
              })()}
            </div>

            {/* Click outside to close */}
            <div
              className='absolute inset-0 -z-10'
              onClick={() => setSelectedCard(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
