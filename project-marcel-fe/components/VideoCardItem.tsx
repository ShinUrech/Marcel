import Image from 'next/image';
import localFont from 'next/font/local';
import { IArticle } from '@/types/types';
import Link from 'next/link';
import { getThumbnailYoutubeExt } from '../utils/get-embed-link';
import dayjs from '../utils/dayjs-config';

const franklinGothic = localFont({
  src: '../public/fonts/Franklin Gothic Heavy Regular.ttf',
});

const VideoCardItem = ({ article }: { article: IArticle }) => {
  return (
    <div className="flex flex-col gap-1 w-full border-b border-gray py-4">
      <Link
        href={`/video/${article._id}`}
        className=" transition-all duration-300 hover:text-[#134074]"
      >
        <div className="relative w-full h-[200px] border border-pr-blue rounded-xs">
          {article.imageLocal ? (
            <Image
              className="rounded-xs object-cover"
              src={
                article.imageLocal &&
                `${process.env.NEXT_PUBLIC_SERVER_FILE_HOST}${article.imageLocal}`
              }
              alt="Example"
              fill
            />
          ) : (
            <Image
              className="rounded-xs object-cover"
              src={
                getThumbnailYoutubeExt(article.url) ||
                `/video-placeholder-0.jpg`
              }
              alt="Example"
              fill
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent rounded-xs opacity-40"></div>

          {/* Play Icon & Duration */}
          <div className="absolute bottom-2 left-2 flex items-center space-x-1 text-white bg-black/50 px-2 py-1 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              viewBox="0 0 24 24"
              width="20"
              height="20"
            >
              <path d="M8 5v14l11-7z"></path>
            </svg>
            <span className="text-sm">
              {article.metadata?.duration?.split(' ')[0]}
            </span>
          </div>
        </div>
        <h3 className="font-bold text-orange mt-4 text-xs uppercase">VIDEO</h3>
        <h3 className={`${franklinGothic.className} mb-1`}>{article.title}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          {article.date && (
            <span>{dayjs(article.date).format('DD.MM.YYYY')}</span>
          )}
          {article.baseUrl && (
            <>
              <span className="text-orange">•</span>
              <span className="truncate max-w-[180px]">{article.baseUrl.replace(/^https?:\/\//, '')}</span>
            </>
          )}
        </div>
      </Link>
    </div>
  );
};
export default VideoCardItem;
