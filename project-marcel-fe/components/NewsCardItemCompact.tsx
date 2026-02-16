import localFont from 'next/font/local';
import { IArticle } from '@/types/types';
import Link from 'next/link';
import dayjs from '../utils/dayjs-config';
import { Icon } from '@iconify/react/dist/iconify.js';

const franklinGothic = localFont({
  src: '../public/fonts/Franklin Gothic Heavy Regular.ttf',
});

const NewsCardItemCompact = ({ article }: { article: IArticle }) => {
  const linkPrefix =
    article.type === 'LinkedIn'
      ? '/linkedin'
      : article.type === 'Video'
        ? '/video'
        : '/article';

  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray group">
      <span className="mt-1 text-orange flex-shrink-0">
        <Icon icon="mdi:circle-small" width="20" height="20" />
      </span>
      <div className="flex flex-col gap-1 min-w-0">
        <Link
          href={`${linkPrefix}/${article._id}`}
          className="transition-all duration-200 group-hover:text-[#134074]"
        >
          <h4 className={`${franklinGothic.className} text-sm leading-snug line-clamp-2`}>
            {article.title || article.metadata?.source || 'Beitrag'}
          </h4>
        </Link>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          {article.date && (
            <span>{dayjs(article.date).format('DD.MM.YYYY')}</span>
          )}
          {article.baseUrl && (
            <>
              <span className="text-orange">•</span>
              <span className="truncate max-w-[150px]">
                {article.baseUrl.replace(/^https?:\/\//, '')}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default NewsCardItemCompact;
