import Image from 'next/image';
import localFont from 'next/font/local';
import { IArticle } from '@/types/types';
import { extractTextFromHtml } from '@/utils/get-inner-text';
import Link from 'next/link';
import dayjs from '../utils/dayjs-config';
import FramedImage from './FramedImage';
import { t } from '@/lib/translate';

const franklinGothic = localFont({
  src: '../public/fonts/Franklin Gothic Heavy Regular.ttf',
});
const LinkedInPostItem = ({ article }: { article: IArticle }) => {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || '';
  const coverImage =
    article.imageLocal && article.imageLocal !== 'N/A'
      ? `${serverUrl}/articles/show/${article.imageLocal}`
      : article.image && article.image !== 'N/A'
        ? article.image
        : undefined;

  return (
    <div className="flex flex-col shadow-md border-b-5 border-orange">
      <div className="relative w-full h-[200px]">
        {coverImage ? (
          <div className="shadow flex w-full h-full items-center justify-center">
            <Image
              className="shadow object-cover"
              src={coverImage}
              alt="Linkedin Image Post"
              fill
            />
          </div>
        ) : (
          article.metadata?.icon && (
            <FramedImage
              src={article.metadata?.icon}
              alt="Linkedin Image Post"
            />
          )
        )}
      </div>
      <div className="flex flex-col p-5 relative">
        <h3 className={`${franklinGothic.className} capitalize mb-2`}>
          {article.metadata?.source}
        </h3>
        <div className="flex items-center italic gap-2 text-sm text-gray-500">
          {/* <span className="capitalize">{article.metadata?.source}</span>
          <span>•</span> */}
          <span>{dayjs(article?.date).format('DD.MM.YYYY')}</span>
          {article.baseUrl && (
            <>
              <span className="text-orange">•</span>
              <span className="text-gray-400 text-xs truncate max-w-[180px]">{article.baseUrl.replace(/^https?:\/\//, '')}</span>
            </>
          )}
        </div>
        <p className="my-6 line-clamp-5">
          {article?.originalContent &&
            extractTextFromHtml(article?.originalContent)}
        </p>
        <div>
          <div>
            <Link href={`/linkedin/${article._id}`} className="flex">
              <span className="btn-md">{t('readMore')}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LinkedInPostItem;
