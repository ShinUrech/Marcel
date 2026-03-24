import Pagination from '@/components/Pagination';
import ReadNext from '@/components/ReadNext';
import SearchBar from '@/components/SearchBar';
import VideoCardItem from '@/components/VideoCardItem';
import { t } from '@/lib/translate';
import { GetAllArticlesAPI } from '@/types/types';
import { notFound } from 'next/navigation';

interface Props {
  searchParams: Promise<{
    page: string;
  }>;
}

const VideosPage = async ({ searchParams }: Props) => {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const apiUrl = process.env.BACKEND_URL
    ? `${process.env.BACKEND_URL}/api`
    : process.env.NEXT_PUBLIC_SERVER_URL;

  const res = await fetch(
    `${apiUrl}/articles/videos?page=${currentPage}`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    return notFound();
  }

  // Assuming `GetAllArticlesAPI` is the type for articles
  const articles: GetAllArticlesAPI = await res.json();
  return (
    <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[80px] md:pt-[100px] sm:pt-[80px] lg:pt-[120px] flex-grow">
      <SearchBar />
      <div className="flex flex-col relative w-full border-t py-10 gap-10">
        <h3 className="font-bold text-blue uppercase">{t('videos')}</h3>
        <div className="grid md:grid-cols-2 gap-y-14 gap-x-8 lg:grid-cols-3 sm:grid-cols-1">
          {articles.data.map((article) => (
            <VideoCardItem key={article._id} article={article} />
          ))}
        </div>
        <div>
          <Pagination
            totalPages={articles.totalPages}
            currentPage={currentPage}
            pageUrl={'/video'}
          />
        </div>
        <ReadNext />
      </div>
    </main>
  );
};
export default VideosPage;
