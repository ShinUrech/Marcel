import Image from 'next/image';
import localFont from 'next/font/local';
import { IArticle } from '@/types/types';
import Link from 'next/link';

const franklinGothic = localFont({
  src: '../public/fonts/Franklin Gothic Heavy Regular.ttf',
});

const NewsCardItemSm = ({ article }: { article: IArticle }) => {
  const cardImage = (
    imageLocal: string | undefined,
    googleImage: string | undefined
  ) => {
    if (googleImage) {
      return (
        <Image
          className="border-2 border-white shadow object-cover"
          src={`${process.env.NEXT_PUBLIC_SERVER_FILE_HOST}${googleImage}`}
          alt="Example"
          fill
        />
      );
    }
    if (imageLocal) {
      return (
        <Image
          className="border-2 border-white shadow object-cover"
          src={`${process.env.NEXT_PUBLIC_SERVER_FILE_HOST}${imageLocal}`}
          alt="Example"
          fill
        />
      );
    }
    return (
      <Image
        className="border-2 border-white shadow object-contain"
        src={`/article-img-placeholder.webp`}
        alt="Example"
        fill
      />
    );
  };

  return (
    <div className="flex flex-col gap-1 w-full py-4">
      <Link
        href={`/article/${article._id}`}
        className=" transition-all duration-300 hover:text-[#134074]"
      >
        <div className="relative w-full h-[200px]">
          {(article.imageLocal || article.googleImage) &&
            cardImage(article.imageLocal, article.googleImage)}
        </div>
        <h3 className="font-bold text-blue mt-4 uppercase">{article.type}</h3>
        <h3 className={`${franklinGothic.className} mb-2`}>{article.title}</h3>
      </Link>
    </div>
  );
};
export default NewsCardItemSm;
