/* eslint-disable prefer-const */
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Figtree } from 'next/font/google';
import { t } from '@/lib/translate';

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-figtree',
});

const Pagination = ({
  totalPages,
  currentPage,
  query,
  pageUrl = '/',
}: {
  totalPages: number;
  currentPage: number;
  query?: string | undefined;
  pageUrl: string;
}) => {
  const getPageNumbers = () => {
    // If only one page, return just that page
    if (totalPages <= 1) return [1];
    
    let pages: (string | number)[] = [1];
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('...');
    
    // Only add totalPages if it's greater than 1 and not already at the end
    if (totalPages > 1 && pages[pages.length - 1] !== totalPages) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      className={`flex w-full items-center justify-center space-x-2 text-blue ${figtree.variable}`}
    >
      {/* Previous Button */}
      {currentPage > 1 && (
        <Link
          href={
            query
              ? `/search?query=${encodeURIComponent(query)}&page=${
                  currentPage - 1
                }`
              : `${pageUrl}?page=${currentPage - 1}`
          }
          className="flex items-center justify-center gap-2 px-3 py-1 text-gray-500 hover:text-blue hover:bg-gray-100 rounded-md"
        >
          <Icon icon="oui:arrow-left" width="16" height="16" />
          <span>{t('previous')}</span>
        </Link>
      )}

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) =>
        typeof page === 'number' ? (
          <Link
            key={index}
            href={
              query
                ? `/search?query=${encodeURIComponent(query)}&page=${page}`
                : `${pageUrl}?page=${page}`
            }
            className={`px-3 py-1 text-blue font-bold rounded-md hidden sm:block ${
              currentPage === page
                ? 'border border-gray-400 '
                : 'hover:bg-gray-100'
            }`}
          >
            {page}
          </Link>
        ) : (
          <span key={index} className="px-3 py-1 text-blue hidden sm:block">
            {page}
          </span>
        )
      )}

      {/* Next Button */}
      {currentPage < totalPages && (
        <Link
          href={
            query
              ? `/search?query=${encodeURIComponent(query)}&page=${
                  currentPage + 1
                }`
              : `${pageUrl}?page=${currentPage + 1}`
          }
          className="flex items-center justify-center gap-2 px-3 py-1 text-gray-500 hover:text-blue hover:bg-gray-100 rounded-md"
        >
          <span>{t('next')}</span>
          <Icon icon="oui:arrow-right" width="16" height="16" />
        </Link>
      )}
    </div>
  );
};

export default Pagination;
