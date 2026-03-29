import { IArticle } from '@/types/types';
import dayjs from '../utils/dayjs-config';
import localFont from 'next/font/local';
import Image from 'next/image';
import { useEffect, useState } from 'react';
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
  const iconSrc = article.metadata?.icon;
  return (
    <div className="flex flex-col relative w-full py-10 gap-10">
      {/* LinkedIn Post Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-w-3xl mx-auto w-full">
        {/* Post Header */}
        <div className="flex items-center gap-3 p-5 pb-3">
          {iconSrc ? (
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
              <Image
                src={iconSrc}
                alt={article.metadata?.source || 'Company'}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#134074] flex items-center justify-center text-white font-bold text-lg shrink-0">
              {(article.metadata?.source || article.title || 'L').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <h2 className={`text-lg font-bold text-gray-900 ${franklinGothic.className} capitalize truncate`}>
              {article.metadata?.source}
            </h2>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{dayjs(article?.date).format('DD.MM.YYYY')}</span>
              <span>&bull;</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-gray-400">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
          </div>
          {/* LinkedIn badge */}
          <div className="ml-auto shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="#0A66C2">
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
            </svg>
          </div>
        </div>

        {/* Post Content */}
        <div className="px-5 pb-4 text-[15px] leading-relaxed text-gray-800">
          {article?.originalContent && (
            <div
              className="content"
              dangerouslySetInnerHTML={{
                __html: article.originalContent,
              }}
            />
          )}
        </div>

        {/* Post Image */}
        {coverImage && (
          <div className="relative w-full h-[350px] sm:h-[420px]">
            <Image
              className="object-cover"
              src={coverImage}
              alt={article.metadata?.source || 'LinkedIn post'}
              fill
            />
          </div>
        )}

        {/* Post Footer */}
        <div className="px-5 py-3 border-t border-gray-100">
          {article?.baseUrl && (
            <span className="text-xs text-gray-400">{article.baseUrl.replace(/^https?:\/\//, '')}</span>
          )}
        </div>
      </div>

      <ReadNext />
    </div>
  );
};
export default LinkedInCard;
