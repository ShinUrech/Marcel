import { GetAllArticlesAPI } from '@/types/types';
// import AdvertisementSection from '../components/AdvertisementSection';
import NewsCardItem from '../components/NewsCardItem';
import NewsCardItemCompact from '../components/NewsCardItemCompact';
import Pagination from '../components/Pagination';
import ReadNext from '../components/ReadNext';
import SearchBar from '../components/SearchBar';
import VideoCardItem from '../components/VideoCardItem';
import { notFound } from 'next/navigation';
import WarningMsg from '@/components/WarningMsg';
import { t } from '@/lib/translate';

interface Props {
  searchParams: Promise<{
    page: string;
  }>;
}

export default async function Home({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  try {
    // Use an internal docker network URL if defined (for SSR), otherwise fallback to the public URL
    const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_SERVER_URL;
    
    const [res, resVids] = await Promise.all([
      fetch(
        `${apiUrl}/articles?page=${currentPage}`,
        {
          cache: 'no-store',
        }
      ),
      fetch(`${apiUrl}/articles/videos`, {
        cache: 'no-store',
      }),
    ]);

    if (!res.ok || !resVids.ok) {
      return notFound(); // Show a 404 error page
    }

    const articles: GetAllArticlesAPI = await res.json();
    const videos: GetAllArticlesAPI = await resVids.json();

    // Separate compact sources (Bahnblogstelle, Eisenbahn/Baublatt, SOB)
    const compactSources = ['bahnblogstelle.com', 'baublatt.ch', 'direkt.sob.ch'];
    const isCompactSource = (baseUrl: string) =>
      compactSources.some((s) => baseUrl?.toLowerCase().includes(s));

    const mainArticles = articles.data.filter((a) => !isCompactSource(a.baseUrl));
    const compactArticles = articles.data.filter((a) => isCompactSource(a.baseUrl));

    return (
      <>
        <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[80px] md:pt-[100px] sm:pt-[80px] lg:pt-[120px] flex-grow">
          <SearchBar />
          <div className="w-full flex flex-col sm:flex-row justify-between gap-10 py-5">
            <div className="w-full sm:w-3/4">
              <div className="flex flex-col">
                {mainArticles.map((article) => (
                  <NewsCardItem
                    key={article._id}
                    article={article}
                    isSearch={false}
                  />
                ))}
              </div>

              {/* Compact section for Bahnblogstelle / Eisenbahn / SOB */}
              {compactArticles.length > 0 && (
                <div className="mt-6 mb-4">
                  <div className="flex items-center gap-2 mb-3 border-t pt-6">
                    <span className="w-6 h-0.5 bg-orange rounded-full"></span>
                    <h3 className="text-sm font-bold text-blue uppercase">
                      Weitere Meldungen
                    </h3>
                  </div>
                  <div className="bg-orange-light rounded-lg px-4 py-2">
                    {compactArticles.map((article) => (
                      <NewsCardItemCompact key={article._id} article={article} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="w-full sm:w-1/4 border-t py-10">
              <h2 className="text-xl font-semibold uppercase">
                {t('latestVideos')}
              </h2>
              <div className="flex flex-col">
                {videos.data.map((article) => (
                  <VideoCardItem key={article._id} article={article} />
                ))}
              </div>
            </div>
          </div>
        </main>
        {/* <AdvertisementSection /> */}
        <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="my-20">
            <Pagination
              totalPages={articles.totalPages}
              currentPage={currentPage}
              pageUrl={'/'}
            />
          </div>
          <div className="my-5">
            <ReadNext />
          </div>
        </main>
      </>
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return <WarningMsg returnToHome={false} />;
  }
}
