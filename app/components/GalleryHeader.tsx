/// <reference lib="dom" />
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

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

const menuItems = [
  { value: '/', label: 'หน้าหลัก' },
  {
    value: '/album',
    label: 'อัลบัม',
    submenu: ALBUMS.map(album => ({
      value: `/album?selected=${encodeURIComponent(album.id)}`,
      label: album.name,
      description: album.description,
    })),
  },
  { value: '/wishes', label: 'รูปและคำอวยพร' },
  // { value: '/moment', label: 'moment' },
];

export default function GalleryHeader({
  titleColor = '#ffffff',
}: {
  titleColor?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedAlbum = searchParams.get('selected');
  const [showMobileSelector, setShowMobileSelector] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [expandedAlbums, setExpandedAlbums] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const desktopValue = pathname.startsWith('/album')
    ? menuItems.find(item => item.value === '/album') || menuItems[0]
    : menuItems.find(item => item.value === pathname) || menuItems[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setExpandedAlbums(false); // Reset expanded state when dropdown closes
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  // Reset expanded albums when dropdown closes
  useEffect(() => {
    if (!showDropdown) {
      setExpandedAlbums(false);
    }
  }, [showDropdown]);

  // Reset expanded albums when mobile menu closes
  useEffect(() => {
    if (!showMobileSelector) {
      setExpandedAlbums(false);
    }
  }, [showMobileSelector]);

  const handleSelectItem = (value: string) => {
    window.location.href = value;
    setShowDropdown(false);
    setExpandedAlbums(false);
  };

  return (
    <header className='relative z-50 px-6 py-4 border-b border-white/10'>
      <div className='max-w-7xl mx-auto flex justify-between items-center'>
        <div className='text-center'>
          <a
            href='/'
            className='text-3xl drop-shadow-2xl font-bold tracking-wider transition-colors font-kanit'
            style={{
              fontFamily: 'var(--font-kanit), sans-serif',
              color: titleColor,
            }}
          >
            Our Gallery
          </a>
        </div>

        <div className='hidden md:flex relative' ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className='bg-[#BFC6B4]/20 hover:bg-[#BFC6B4]/30 font-semibold border border-[#BFC6B4]/50 rounded-lg px-6 py-2 focus:outline-none backdrop-blur-sm font-kanit flex items-center gap-2 transition-all'
            style={{
              fontFamily: 'var(--font-kanit), sans-serif',
              color: titleColor,
            }}
          >
            {desktopValue.label}
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
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </button>

          {showDropdown && (
            <div className='absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl p-3 space-y-2 z-50 w-72'>
              {menuItems.map(item => (
                <div key={item.value}>
                  <button
                    onClick={() => {
                      if (!item.submenu) {
                        handleSelectItem(item.value);
                      } else {
                        // Toggle album submenu
                        setExpandedAlbums(!expandedAlbums);
                      }
                    }}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                      pathname === item.value ||
                      (item.submenu && pathname.startsWith('/album'))
                        ? 'border-[#BFC6B4] bg-[#BFC6B4]/15 shadow-md'
                        : 'border-gray-200 hover:border-[#BFC6B4]/50 hover:bg-[#BFC6B4]/5 hover:shadow-sm'
                    }`}
                  >
                    <div className='flex justify-between items-center'>
                      <h3
                        className={`font-medium font-kanit ${
                          pathname === item.value ||
                          (item.submenu && pathname.startsWith('/album'))
                            ? 'text-gray-900 font-semibold'
                            : 'text-gray-700'
                        }`}
                        style={{ fontFamily: 'var(--font-kanit), sans-serif' }}
                      >
                        {item.label}
                      </h3>
                      <div className='flex items-center gap-2'>
                        {/* Show chevron for submenu items */}
                        {item.submenu && (
                          <svg
                            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                              expandedAlbums ? 'rotate-180' : ''
                            }`}
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M19 9l-7 7-7-7'
                            />
                          </svg>
                        )}
                        {/* Show active indicator */}
                        {(pathname === item.value ||
                          (item.submenu && pathname.startsWith('/album'))) && (
                          <svg
                            className='w-5 h-5 text-[#BFC6B4]'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                          ></svg>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Submenu for albums - only show when expanded */}
                  {item.submenu && expandedAlbums && (
                    <div className='ml-4 mt-2 space-y-2'>
                      {item.submenu.map(subItem => {
                        const albumId = ALBUMS.find(album =>
                          subItem.value.includes(encodeURIComponent(album.id))
                        )?.id;
                        const isSelected = selectedAlbum === albumId;

                        return (
                          <button
                            key={subItem.value}
                            onClick={() => handleSelectItem(subItem.value)}
                            className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${
                              isSelected
                                ? 'border-[#BFC6B4] bg-[#BFC6B4]/10 shadow-md'
                                : 'border-gray-100 hover:border-[#BFC6B4]/30 hover:bg-[#BFC6B4]/5'
                            }`}
                          >
                            <div className='flex justify-between items-center'>
                              <div>
                                <h4
                                  className={`font-medium font-kanit text-sm ${
                                    isSelected
                                      ? 'text-gray-900 font-semibold'
                                      : 'text-gray-700'
                                  }`}
                                  style={{
                                    fontFamily: 'var(--font-kanit), sans-serif',
                                  }}
                                >
                                  {subItem.label}
                                </h4>
                                <p
                                  className={`text-xs mt-1 font-kanit ${
                                    isSelected
                                      ? 'text-gray-600'
                                      : 'text-gray-500'
                                  }`}
                                  style={{
                                    fontFamily: 'var(--font-kanit), sans-serif',
                                  }}
                                >
                                  {subItem.description}
                                </p>
                              </div>
                              {isSelected && (
                                <svg
                                  className='w-4 h-4 text-[#BFC6B4] shrink-0 ml-2'
                                  fill='currentColor'
                                  viewBox='0 0 20 20'
                                ></svg>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          className='md:hidden'
          style={{ color: titleColor }}
          onClick={() => setShowMobileSelector(!showMobileSelector)}
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
              d='M4 6h16M4 12h16M4 18h16'
            />
          </svg>
        </button>
      </div>

      {showMobileSelector && (
        <div className='md:hidden bg-black/90 backdrop-blur-sm mt-4 rounded-lg mx-6'>
          <div className='px-4 py-4 space-y-3'>
            {menuItems.map(item => (
              <div key={item.value}>
                <a
                  href={item.submenu ? undefined : item.value}
                  onClick={e => {
                    if (item.submenu) {
                      e.preventDefault();
                      setExpandedAlbums(!expandedAlbums);
                    }
                  }}
                  className={`flex justify-between items-center w-full text-left text-white hover:text-blue-300 transition-colors py-2 font-kanit ${
                    pathname === item.value ||
                    (item.submenu && pathname.startsWith('/album'))
                      ? 'text-blue-300 font-semibold'
                      : ''
                  }`}
                  style={{ fontFamily: 'var(--font-kanit), sans-serif' }}
                >
                  <span>{item.label}</span>
                  {item.submenu && (
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        expandedAlbums ? 'rotate-180' : ''
                      }`}
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 9l-7 7-7-7'
                      />
                    </svg>
                  )}
                </a>

                {/* Mobile Submenu - only show when expanded */}
                {item.submenu && expandedAlbums && (
                  <div className='ml-4 mt-2 space-y-2'>
                    {item.submenu.map(subItem => {
                      const albumId = ALBUMS.find(album =>
                        subItem.value.includes(encodeURIComponent(album.id))
                      )?.id;
                      const isSelected = selectedAlbum === albumId;

                      return (
                        <a
                          key={subItem.value}
                          href={subItem.value}
                          onClick={() => {
                            setShowMobileSelector(false);
                            setExpandedAlbums(false);
                          }}
                          className={`block py-2 px-3 rounded-lg text-sm font-kanit transition-all duration-200 ${
                            isSelected
                              ? 'bg-blue-600/20 border-l-4 border-blue-400 text-blue-300 font-semibold'
                              : 'text-white/80 hover:text-blue-300 hover:bg-white/5'
                          }`}
                          style={{
                            fontFamily: 'var(--font-kanit), sans-serif',
                          }}
                        >
                          <div className='flex justify-between items-center'>
                            <div>
                              {subItem.label}
                              <span
                                className={`block text-xs mt-1 ${
                                  isSelected ? 'text-blue-200' : 'text-white/60'
                                }`}
                              >
                                {subItem.description}
                              </span>
                            </div>
                            {isSelected && (
                              <svg
                                className='w-4 h-4 text-blue-400 shrink-0'
                                fill='currentColor'
                                viewBox='0 0 20 20'
                              ></svg>
                            )}
                          </div>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
