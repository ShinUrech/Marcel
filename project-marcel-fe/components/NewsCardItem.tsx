import Image from 'next/image';
import localFont from 'next/font/local';
import { Figtree } from 'next/font/google';
import { IArticle } from '@/types/types';
import Link from 'next/link';
import { Icon } from '@iconify/react/dist/iconify.js';
import { t } from '@/lib/translate';
import dayjs from '../utils/dayjs-config';
const franklinGothic = localFont({
  src: '../public/fonts/Franklin Gothic Heavy Regular.ttf',
});

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-figtree',
});

const NewsCardItem = ({
  article,
  isSearch,
}: {
  article: IArticle;
  isSearch: boolean;
}) => {
  const cardImage = (
    imageLocal: string | undefined,
    googleImage: string | undefined
  ) => {
    if (googleImage) {
      return (
        <Image
          className="shadow object-cover"
          src={`${process.env.NEXT_PUBLIC_SERVER_URL}/articles/show/${googleImage}`}
          alt="Example"
          fill
        />
      );
    }
    if (imageLocal) {
      return (
        <Image
          className="shadow object-cover"
          src={`${process.env.NEXT_PUBLIC_SERVER_URL}/articles/show/${imageLocal}`}
          alt="Example"
          fill
        />
      );
    }
    return (
      <Image
        className="border-20 border-white shadow object-contain"
        src={`/article-img-placeholder.webp`}
        alt="Example"
        fill
      />
    );
  };

  return (
    <div className="flex flex-col relative border-t py-10 gap-10">
      {(article.imageLocal || article.googleImage) && (
        <div className="w-full">
          <div className="relative h-[400px] image-frame flex justify-start">
            {cardImage(article.imageLocal, article.googleImage)}
          </div>
        </div>
      )}

      <div
        className={`w-full flex flex-col gap-5`}
      >
        <div
          className={`flex w-full flex-col justify-between flex-1 ${
            article.imageLocal || article.googleImage
              ? 'border-b border-gray'
              : 'gap-5'
          } pb-5`}
        >
          <div>
            <Link href={`/article/${article._id}`}>
              <h3
                className={`${franklinGothic.className} ${
                  !(article.imageLocal || article.googleImage) && 'text-2xl'
                } pb-2 transition-all duration-300 hover:text-[#134074]`}
              >
                {article.title}
              </h3>
            </Link>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
              {article.date && (
                <span>{dayjs(article.date).format('DD.MM.YYYY')}</span>
              )}
              {article.baseUrl && (
                <>
                  <span className="text-orange">•</span>
                  <span className="text-gray-400 truncate max-w-[200px]">{article.baseUrl.replace(/^https?:\/\//, '')}</span>
                </>
              )}
            </div>
            {article.generatedTeaser && (
              <p className={`${figtree.className} text-gray-500 line-clamp-10 `}>
                {article.generatedTeaser}
              </p>
            )}
          </div>
          <Link
            href={`/article/${article._id}`}
            className={`${figtree.className} flex items-center gap-2 hidden sm:flex transition-all duration-300 hover:pl-5 hover:text-[#134074] mt-5 justify-start`}
          >
            {t('seeMore')}
            <Icon icon="oui:arrow-right" width="16" height="16" />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default NewsCardItem;
