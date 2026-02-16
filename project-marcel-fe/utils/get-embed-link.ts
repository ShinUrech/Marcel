export function getEmbedLink(youtubeUrl: string) {
  const regex =
    /^https:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(?:&.*)?$/;
  const match = youtubeUrl.match(regex);

  if (match) {
    const videoId = match[2]; // Extracts the video ID from the URL
    return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0`;
  } else {
    return youtubeUrl;
  }
}

export function getEmbedLinkNoCookie(youtubeUrl: string) {
  const regex =
    /^https:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(?:&.*)?$/;
  const match = youtubeUrl.match(regex);

  if (match) {
    const videoId = match[2]; // Extracts the video ID from the URL
    return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`;
  } else {
    return youtubeUrl;
  }
}

export function getYoutubeVideoId(youtubeUrl: string) {
  const regex =
    /^https:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(?:&.*)?$/;
  const match = youtubeUrl.match(regex);

  if (match) {
    const videoId = match[2]; // Extracts the video ID from the URL
    return videoId;
  } else {
    return youtubeUrl;
  }
}

export function getThumbnailYoutubeExt(youtubeUrl: string) {
  const regex =
    /^https:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(?:&.*)?$/;
  const match = youtubeUrl.match(regex);

  if (match) {
    const videoId = match[2];
    return `https://i3.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return null;
}
