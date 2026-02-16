import { IArticle } from '@/types/types';
import { getEmbedLink, getYoutubeVideoId } from '@/utils/get-embed-link';
import { getInnerBody } from '@/utils/get-inner-body';
import dayjs from '../utils/dayjs-config';
import DOMPurify from 'dompurify';
import localFont from 'next/font/local';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Loading from './Loading';
import WatchNext from './WatchNext';
import WarningMsg from './WarningMsg';
import YoutubePlayer from './YoutubePlayer';

const franklinGothic = localFont({
  src: '../public/fonts/Franklin Gothic Heavy Regular.ttf',
});
const VideoCard = ({ id }: { id: string | undefined }) => {
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

  return (
    <div className="flex flex-col relative w-full border-t py-10 gap-10">
      <div>
        <h3 className="font-bold text-orange uppercase text-sm">{article?.type}</h3>
        <h1 className={`text-[36px] ${franklinGothic.className} mb-2`}>
          {article?.title}
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
      <div className="w-full bg-gray">
        <div className="relative h-[400px]">
          {article?.url && getEmbedLink(article.url) ? (
            // <iframe
            //   className="w-full h-full"
            //   src={getEmbedLink(article.url)}
            //   title="YouTube video player"
            //   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            //   referrerPolicy="strict-origin-when-cross-origin"
            //   allowFullScreen
            // ></iframe>
            <YoutubePlayer
              youtubeLink={`https://www.youtube.com/watch?v=${getYoutubeVideoId(
                article.url
              )}`}
            />
          ) : (
            <Image
              className="border-20 border-white shadow object-contain"
              src={`/video-placeholder-0.jpg`}
              alt="Example"
              fill
            />
          )}
        </div>
      </div>
      <div className="content text-justify">
        {article?.generatedContent && (
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                getInnerBody(article.generatedContent)
              ),
            }}
          />
        )}
      </div>
      <WatchNext />
    </div>
  );
};
export default VideoCard;
