import { IArticle } from '@/types/types';
import { getInnerBody } from '@/utils/get-inner-body';
import dayjs from '../utils/dayjs-config';
import DOMPurify from 'dompurify';
import localFont from 'next/font/local';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Loading from './Loading';
import ReadNext from './ReadNext';
import WarningMsg from './WarningMsg';
import Link from 'next/link';

const franklinGothic = localFont({
  src: '../public/fonts/Franklin Gothic Heavy Regular.ttf',
});
const ArticleCard = ({ id }: { id: string | undefined }) => {
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
        src={`/image-placeholder.jpg`}
        alt="Example"
        fill
      />
    );
  };

  return (
    <div className="flex flex-col relative w-full border-t py-10 gap-10">
      <div>
        <Link href={'/'}>
          <h3 className="font-bold text-orange uppercase text-sm">{article?.type}</h3>
        </Link>
        <h1 className={`text-[36px] ${franklinGothic.className} mb-2`}>
          {article?.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{dayjs(article?.date).format('DD.MM.YYYY')}</span>
          {article?.baseUrl && (
            <>
              <span className="text-orange">•</span>
              <span className="text-gray-400">{article.baseUrl.replace(/^https?:\/\//, '')}</span>
            </>
          )}
        </div>
      </div>
      {(article.imageLocal || article.googleImage) && (
        <div className="w-full">
          <div className="relative h-[400px]">
            {cardImage(article.imageLocal, article.googleImage)}
          </div>
        </div>
      )}

      <div className="content text-justify">
        {(article?.generatedContent || article?.originalContent) && (
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                getInnerBody(article.generatedContent || article.originalContent || '')
              ),
            }}
          />
        )}
      </div>
      <ReadNext />
    </div>
  );
};
export default ArticleCard;
