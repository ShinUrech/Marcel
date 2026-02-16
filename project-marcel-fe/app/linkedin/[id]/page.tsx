'use client';
import LinkedInCard from '@/components/LinkedInCard';
import SearchBar from '@/components/SearchBar';
import { useParams } from 'next/navigation';

interface IParams {
  [key: string]: string | undefined;
}

const LinkedIn = () => {
  const { id } = useParams<IParams>();
  return (
    <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[80px] md:pt-[100px] sm:pt-[80px] lg:pt-[120px] flex-grow">
      <SearchBar />
      <LinkedInCard id={id} />
    </main>
  );
};
export default LinkedIn;
