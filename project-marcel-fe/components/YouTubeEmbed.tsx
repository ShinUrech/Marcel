/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';

const YouTubeEmbed = ({ videoId }: { videoId: string }) => {
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    (window as any).onYouTubeIframeAPIReady = () => {
      new (window as any).YT.Player(playerRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
          modestbranding: 0,
          rel: 0,
          showinfo: 1,
          disablekb: 1,
        },
        events: {
          onReady: (event: any) => event.target.playVideo(),
        },
      });
    };

    return () => {
      delete (window as any).onYouTubeIframeAPIReady;
    };
  }, [videoId]);
  return (
    <div className="w-full h-full" style={{ position: 'relative' }}>
      <div ref={playerRef} style={{ width: '100%', height: '100%' }} />
      {/* <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          cursor: 'default',
        }}
      /> */}
    </div>
  );
};
export default YouTubeEmbed;
