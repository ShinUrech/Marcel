'use client';
import { t } from '@/lib/translate';
import { Icon } from '@iconify/react/dist/iconify.js';
import localFont from 'next/font/local';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
const franklinGothic = localFont({
  src: '../public/fonts/Franklin Gothic Heavy Regular.ttf',
});

const AppHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname(); // Get the current route

  const navLinks = [
    { href: '/', label: `${t('home')}` },
    { href: '/video', label: `${t('videos')}` },
    { href: '/linkedin', label: `${t('linkedInPosts')}` },
    { href: '/contact', label: `${t('contactUs')}` },
  ];

  return (
    <>
      {/* Header */}
      <header className="px-6 py-4 lg:h-[110px] md:h-[80px] sm:h-[80px] bg-white shadow-md fixed top-0 left-0 w-full z-30">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-orange"></div>
        <div className="max-w-7xl relative text-center mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left Icons */}
          <div className="flex items-center gap-4 left-0 m-0">
            <button className="text-2xl" onClick={() => setIsOpen(true)}>
              <Icon
                icon="eva:menu-2-fill"
                className="fill-gray-600 cursor-pointer"
                width="24"
                height="24"
              ></Icon>
            </button>
            {/* <button className="text-lg">
                <Icon
                  icon="ic:round-search"
                  className="fill-gray-600"
                  width="22"
                  height="22"
                ></Icon>
              </button> */}
          </div>

          {/* Title */}
          <Link href={'/'}>
            <h1
              className={`text-center text-[22px] md:text-[34px] sm:text-[30px] ${franklinGothic.className}`}
            >
              {t('siteName')}
            </h1>
          </Link>
          {/* Button */}
          <Link href={'/contact'} className="btn-md hidden sm:block">
            {t('contactUs')}
          </Link>
        </div>
      </header>

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out z-50`}
      >
        {/* Close Button */}
        <button
          className="p-4 text-gray-600 cursor-pointer"
          onClick={() => setIsOpen(false)}
        >
          <Icon icon="ic:round-close" width="28" height="28" />
        </button>

        {/* Menu Items */}
        <nav className="flex flex-col p-6 space-y-4">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-lg font-medium hover:text-gray-900 capitalize  ${
                pathname === href
                  ? 'border-l-5 border-orange pl-5 font-bold text-blue'
                  : 'text-gray-700'
              }`}
              onClick={() => setIsOpen(false)} // Close sidebar when clicking a link
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay (Backdrop) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};
export default AppHeader;
