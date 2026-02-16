'use client';
import { IArticle } from '@/types/types';
import { useEffect, useState } from 'react';
import Loading from './Loading';
import VideoCardItem from './VideoCardItem';
import WarningMsg from './WarningMsg';
import { t } from '@/lib/translate';

const WatchNext = () => {
  const [articles, setArticle] = useState<IArticle[] | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/articles/vrandom`,
          {
            referrerPolicy: 'no-referrer',
          }
        ); // Replace with your API URL
        const data: IArticle[] = await res.json();
        setArticle(data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (isError || !articles) {
    return <WarningMsg returnToHome={false} />;
  }

  return (
    <div className="flex flex-col border-t pt-15">
      <h3 className="font-bold capitalize">{t('watchNext')}</h3>
      <div className="grid md:grid-cols-2 gap-5 lg:grid-cols-4 sm:grid-cols-1">
        {articles.map((article) => (
          <VideoCardItem key={article._id} article={article} />
        ))}
      </div>
    </div>
  );
};
export default WatchNext;
