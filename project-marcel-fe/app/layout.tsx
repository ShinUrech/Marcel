import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';

import './globals.css';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import { Suspense } from 'react';

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'], // Choose the font weights you need
  variable: '--font-figtree',
});

export const metadata: Metadata = {
  title: process.env.APP_TITLE || 'Default Title',
  description: process.env.APP_DESCRIPTION || 'Default Description',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${figtree.variable} antialiased `}>
        <div className="flex flex-col min-h-screen w-full">
          <Suspense>
            <AppHeader />
            {children}
            <AppFooter />
          </Suspense>
        </div>
      </body>
    </html>
  );
}
