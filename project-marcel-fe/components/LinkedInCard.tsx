import { IArticle } from '@/types/types';
import dayjs from '../utils/dayjs-config';
import localFont from 'next/font/local';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import FramedImage from './FramedImage';
import Loading from './Loading';
import ReadNext from './ReadNext';
import WarningMsg from './WarningMsg';

const franklinGothic = localFont({
  src: '../public/fonts/Franklin Gothic Heavy Regular.ttf',
});

const LinkedInCard = ({ id }: { id: string | undefined }) => {
  const [article, setArticle] = useState<IArticle | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/articles/${id}`,
          {
            referrerPolicy: 'no-referrer',
          }
        ); // Replace with your API URL
        const data: IArticle = await res.json();
        setArticle(data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [id]);

  if (loading) {
    return <Loading />; // Show the loading spinner while fetching
  }
  if (isError || !article) {
    return <WarningMsg returnToHome={true} />;
  }
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || '';
  const coverImage =
    article.imageLocal && article.imageLocal !== 'N/A'
      ? `${serverUrl}/articles/show/${article.imageLocal}`
      : article.image && article.image !== 'N/A'
        ? article.image
        : undefined;
  return (
    <div className="flex flex-col relative w-full border-t py-10 gap-10">
      <div>
        <h3 className="font-bold text-orange uppercase text-sm">{article?.type}</h3>
        <h1
          className={`text-[36px] capitalize ${franklinGothic.className} mb-2`}
        >
          {article?.metadata?.source}
        </h1>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{dayjs(article?.date).format('DD.MM.YYYY')}</span>
          {article?.baseUrl && (
            <>
              <span className="text-orange">&bull;</span>
              <span className="text-gray-400">{article.baseUrl.replace(/^https?:\/\//, '')}</span>
            </>
          )}
        </div>
      </div>
      {(article.imageLocal || article.googleImage) && (
        <div className="w-full">
          <div className="relative h-[400px]">
            {coverImage ? (
              <Image
                className="shadow object-cover"
                src={coverImage}
                alt="Example"
                fill
              />
            ) : (
              article.metadata?.icon && (
                <FramedImage
                  src={article.metadata?.icon}
                  alt="Linkedin Image Post"
                />
              )
            )}
          </div>
        </div>
      )}
      <div className="content text-justify">
        {article?.originalContent && (
          <div
            dangerouslySetInnerHTML={{
              __html: article.originalContent,
            }}
          />
        )}
      </div>
      <ReadNext />
    </div>
  );
};
export default LinkedInCard;
