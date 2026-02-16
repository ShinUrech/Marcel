'use client';
import SearchBar from '@/components/SearchBar';
import VideoCard from '@/components/VideoCard';
import { useParams } from 'next/navigation';

interface IParams {
  [key: string]: string | undefined;
}
const Video = () => {
  const { id } = useParams<IParams>();
  return (
    <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[80px] md:pt-[100px] sm:pt-[80px] lg:pt-[120px] flex-grow">
      <SearchBar />
      <VideoCard id={id} />
    </main>
  );
};
export default Video;
