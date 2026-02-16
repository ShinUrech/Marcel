'use client';
import Loading from '@/components/Loading';
import NewsCardItem from '@/components/NewsCardItem';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';
import WarningMsg from '@/components/WarningMsg';
import { t } from '@/lib/translate';
import { GetAllArticlesAPI } from '@/types/types';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const SearchPage = () => {
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<GetAllArticlesAPI | null>(null);
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const currentPage = Number(searchParams?.get('page')) || 1;

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const searchQuery = searchParams?.get('query') || '';
    setQuery(searchQuery);
    if (searchQuery.trim() !== '') {
      const fetchArticles = async () => {
        try {
          const res = await fetch(
            `${
              process.env.NEXT_PUBLIC_SERVER_URL
            }/articles/search?query=${encodeURIComponent(
              query
            )}&page=${currentPage}`,

            { cache: 'no-cache' }
          );

          if (!res.ok) {
            throw new Error('Failed to fetch search results');
          }
          const data: GetAllArticlesAPI = await res.json();
          setArticles(data);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          setIsError(true);
        } finally {
          setLoading(false);
        }
      };

      fetchArticles();
    } else {
      setLoading(false); // Stop loading if no query
    }
  }, [searchParams, currentPage, query]);

  if (loading) {
    return <Loading />;
  }

  if (isError || !articles) {
    return <WarningMsg returnToHome={true} />;
  }

  return (
    <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[80px] md:pt-[100px] sm:pt-[80px] lg:pt-[120px] flex-grow">
      <SearchBar />
      <div className="flex items-center gap-2">
        <h1>Search Results for</h1>
        <span className="font-semibold text-blue"> &quot;{query}&quot;</span>
      </div>

      {query && !articles?.data.length ? (
        <p>
          {t('noResult')} &quot;<strong>{query}</strong>&quot;
        </p>
      ) : (
        <>
          <div className="w-full flex justify-between gap-10 py-5">
            <div className="flex flex-col w-full">
              {articles?.data.map((article) => (
                <NewsCardItem key={article._id} article={article} isSearch />
              ))}
            </div>
          </div>
          {articles?.totalPages && articles.totalPages > 1 && (
            <div className="my-20">
              <Pagination
                totalPages={articles.totalPages}
                currentPage={currentPage}
                query={query}
                pageUrl={'/search'}
              />
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default SearchPage;
