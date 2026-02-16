'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import Duration from './Duration';

const YoutubePlayer = ({ youtubeLink }: { youtubeLink: string }) => {
  const playerRef = useRef<ReactPlayer | null>(null);

  const initialState = {
    src: undefined,
    pip: false,
    playing: false,
    controls: false,
    light: false,
    volume: 1,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
    seeking: false,
    loadedSeconds: 0,
    playedSeconds: 0,
  };

  const [state, setState] = useState<PlayerState>(initialState);

  type PlayerState = Omit<typeof initialState, 'src'> & {
    src?: string;
  };
  const [showControls, setShowControls] = useState(true);
  const load = (src?: string) => {
    setState((prevState) => ({
      ...prevState,
      src,
      played: 0,
      loaded: 0,
      pip: false,
    }));
  };

  useEffect(() => {
    load(youtubeLink);
  }, [youtubeLink]);

  const handlePlayPause = () => {
    setState((prevState) => ({ ...prevState, playing: !prevState.playing }));
  };

  // const handleStop = () => {
  //   setState((prevState) => ({ ...prevState, src: undefined, playing: false }));
  // };

  // const handleToggleControls = () => {
  //   setState((prevState) => ({ ...prevState, controls: !prevState.controls }));
  // };

  // const handleToggleLoop = () => {
  //   setState((prevState) => ({ ...prevState, loop: !prevState.loop }));
  // };

  //   const handleSetPlaybackRate = (
  //   event: React.SyntheticEvent<HTMLButtonElement>
  // ) => {
  //   const buttonTarget = event.target as HTMLButtonElement;
  //   setState((prevState) => ({
  //     ...prevState,
  //     playbackRate: Number.parseFloat(`${buttonTarget.dataset.value}`),
  //   }));
  // };
  // const handleRateChange = () => {
  //   const player = playerRef.current;
  //   if (!player) return;

  //   setState((prevState) => ({
  //     ...prevState,
  //     playbackRate: player.playbackRate,
  //   }));
  // };

  const handleVolumeChange = (
    event: React.SyntheticEvent<HTMLInputElement>
  ) => {
    const inputTarget = event.target as HTMLInputElement;
    setState((prevState) => ({
      ...prevState,
      volume: Number.parseFloat(inputTarget.value),
    }));
  };

  const handleToggleMuted = () => {
    setState((prevState) => ({ ...prevState, muted: !prevState.muted }));
  };

  const handlePlay = () => {
    console.log('onPlay');
    setState((prevState) => ({ ...prevState, playing: true }));
  };

  const handlePause = () => {
    console.log('onPause');
    setState((prevState) => ({ ...prevState, playing: false }));
  };

  const handleSeekMouseDown = () => {
    setState((prevState) => ({ ...prevState, seeking: true }));
  };

  const handleSeekChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const inputTarget = event.target as HTMLInputElement;
    setState((prevState) => ({
      ...prevState,
      played: Number.parseFloat(inputTarget.value),
    }));
  };

  const handleSeekMouseUp = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const inputTarget = event.target as HTMLInputElement;
    setState((prevState) => ({ ...prevState, seeking: false }));

    if (playerRef.current) {
      playerRef.current?.seekTo(Number.parseFloat(inputTarget.value));
    }
  };

  const onProgress = ({
    played,
    playedSeconds,
    loaded,
    loadedSeconds,
  }: {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
  }) => {
    if (!state.seeking && playerRef.current) {
      const duration = playerRef.current.getDuration?.();
      setState((prev) => ({
        ...prev,
        played,
        playedSeconds,
        loaded,
        loadedSeconds,
        duration,
      }));
    }
  };

  const handleEnded = () => {
    console.log('onEnded');
    setState((prevState) => ({ ...prevState, playing: prevState.loop }));
  };

  const handleDurationChange = () => {
    const duration = playerRef.current?.getDuration?.();
    if (duration) {
      setState((prev) => ({ ...prev, duration }));
    }
    console.log('onReady');
  };

  const setPlayerRef = useCallback((player: ReactPlayer | null) => {
    playerRef.current = player;
  }, []);

  const {
    src,
    playing,
    controls,
    light,
    volume,
    muted,
    loop,
    played,
    playbackRate,
    pip,
  } = state;

  return (
    <div className="w-full h-full relative">
      <ReactPlayer
        ref={setPlayerRef}
        width="100%"
        height="100%"
        url={src}
        pip={pip}
        playing={playing}
        controls={controls}
        light={light}
        loop={loop}
        playbackRate={playbackRate}
        volume={volume}
        muted={muted}
        config={{
          youtube: {
            playerVars: {
              modestbranding: 1,
              rel: 0,
              enablejsapi: 1,
              origin: window.location.origin,
            },
          },
        }}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onProgress={onProgress}
        onReady={handleDurationChange}
      />
      <div
        onClick={handlePlayPause}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          cursor: 'default',
        }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      />
      <div
        // className="video-controls-container flex"
        className={`video-controls-container flex ${
          showControls ? '' : 'video-controls-hidden'
        }`}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
        }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <div className="controls">
          <button className="play-pause-btn" onClick={handlePlayPause}>
            {playing ? (
              <svg className="pause-icon" viewBox="0 0 24 24">
                <path fill="white" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
              </svg>
            ) : (
              <svg className="play-icon" viewBox="0 0 24 24">
                <path fill="white" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
              </svg>
            )}
          </button>
          <div className="volume-container">
            <button className="mute-btn" onClick={handleToggleMuted}>
              {!muted && volume > 0.9 && (
                <svg className="volume-high-icon" viewBox="0 0 24 24">
                  <path
                    fill="white"
                    d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"
                  />
                </svg>
              )}
              {!muted && volume > 0 && volume < 0.9 && (
                <svg className="volume-low-icon" viewBox="0 0 24 24">
                  <path
                    fill="white"
                    d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z"
                  />
                </svg>
              )}
              {(volume === 0 || muted) && (
                <svg className="volume-muted-icon" viewBox="0 0 24 24">
                  <path
                    fill="white"
                    d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"
                  />
                </svg>
              )}
            </button>
            <input
              type="range"
              className="volume-slider"
              min={0}
              max={1}
              step="any"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
          <div className="duration-container">
            <div className="current-time">
              <Duration seconds={state.playedSeconds} />
            </div>
            /
            <div className="total-time">
              <Duration seconds={state.duration} />
            </div>
          </div>
        </div>
        <div className="timeline-container" style={{ width: '100%' }}>
          <input
            className="timeline"
            type="range"
            min={0}
            max={0.999999}
            step="any"
            value={played}
            onMouseDown={handleSeekMouseDown}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
          />
        </div>
      </div>
    </div>
  );
};
export default YoutubePlayer;
