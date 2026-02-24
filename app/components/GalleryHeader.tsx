/// <reference lib="dom" />
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const menuItems = [
  { value: '/', label: 'หน้าหลัก' },
  { value: '/wishes', label: 'รูปจากคำอวยพร' },
  { value: '/photographer', label: 'รูปจากช่างภาพ' },
  { value: '/album', label: 'รูปจากอัลบัม' },
];

export default function GalleryHeader() {
  const pathname = usePathname();
  const [showMobileSelector, setShowMobileSelector] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const desktopValue =
    menuItems.find(item => item.value === pathname) || menuItems[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  const handleSelectItem = (value: string) => {
    window.location.href = value;
    setShowDropdown(false);
  };

  return (
    <header className='relative z-50 px-6 py-4 border-b border-white/10'>
      <div className='max-w-7xl mx-auto flex justify-between items-center'>
        <div className='text-center'>
          <a
            href='/'
            className='text-white text-3xl drop-shadow-2xl text-shadow-2xl font-bold tracking-wider hover:text-[#BFC6B4] transition-colors font-kanit '
            style={{ fontFamily: 'var(--font-kanit), sans-serif' }}
          >
            Our Gallery
          </a>
        </div>

        <div className='hidden md:flex relative' ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className='bg-[#BFC6B4]/20 hover:bg-[#BFC6B4]/30 text-white border border-[#BFC6B4]/50 rounded-lg px-6 py-2 focus:outline-none backdrop-blur-sm font-kanit flex items-center gap-2 transition-all'
            style={{ fontFamily: 'var(--font-kanit), sans-serif' }}
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
            <div
              className='fixed bg-white rounded-xl shadow-2xl p-3 space-y-2 z-50 w-72'
              style={{ top: '70px', right: '24px' }}
            >
              {menuItems.map(item => (
                <button
                  key={item.value}
                  onClick={() => handleSelectItem(item.value)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    pathname === item.value
                      ? 'border-[#BFC6B4] bg-[#BFC6B4]/15 shadow-md'
                      : 'border-gray-200 hover:border-[#BFC6B4]/50 hover:bg-[#BFC6B4]/5 hover:shadow-sm'
                  }`}
                >
                  <div className='flex justify-between items-center'>
                    <h3
                      className={`font-medium font-kanit ${
                        pathname === item.value
                          ? 'text-gray-900 font-semibold'
                          : 'text-gray-700'
                      }`}
                      style={{ fontFamily: 'var(--font-kanit), sans-serif' }}
                    >
                      {item.label}
                    </h3>
                    {pathname === item.value && (
                      <svg
                        className='w-5 h-5 text-[#BFC6B4]'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-8-8a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          className='md:hidden text-white'
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
              <a
                key={item.value}
                href={item.value}
                className={`block w-full text-left text-white hover:text-blue-300 transition-colors py-2 font-kanit ${
                  pathname === item.value ? 'text-blue-300 font-semibold' : ''
                }`}
                style={{ fontFamily: 'var(--font-kanit), sans-serif' }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
