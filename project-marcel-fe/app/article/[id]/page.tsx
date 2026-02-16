'use client';
import ArticleCard from '@/components/ArticleCard';
import SearchBar from '@/components/SearchBar';
import { useParams } from 'next/navigation';

interface IParams {
  [key: string]: string | undefined;
}

const Article = () => {
  const { id } = useParams<IParams>();
  return (
    <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[120px] flex-grow">
      <SearchBar />
      <ArticleCard id={id} />
    </main>
  );
};
export default Article;
