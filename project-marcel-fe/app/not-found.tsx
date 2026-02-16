'use client';
import Link from 'next/link';
import localFont from 'next/font/local';
import { t } from '@/lib/translate';
const franklinGothic = localFont({
  src: '../public/fonts/Franklin Gothic Heavy Regular.ttf',
});
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className={`text-5xl text-gray-800 ${franklinGothic.className}`}>
        404
      </h1>
      <p className={`text-lg font-bold text-gray-600 my-5 uppercase`}>
        {t('notfoundPage')}
      </p>
      <Link href="/" className="btn-lg">
        {t('goBackHome')}
      </Link>
    </div>
  );
}
