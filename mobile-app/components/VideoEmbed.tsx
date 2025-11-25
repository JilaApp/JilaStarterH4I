import YoutubeIframe from "react-native-youtube-iframe";
import { Video } from "expo-av";

type VideoEmbedProps = {
  uri: string;
  type: "youtube" | "google-drive";
  height?: number;
};

function extractYoutubeId(url: string) {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/; // somehow gets the youtube id (http://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url)
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : false;
}

function getGoogleDriveDirectUrl(url: string) {
  // gets the file id ex: /file/d/{FILE_ID}/view or /file/d/{FILE_ID}
  const match = url.match(/[-\w]{25,}/);

  if (match && match[0]) {
    const fileId = match[0];
    return `https://drive.google.com/uc?id=${fileId}`;
  }

  return url;
}

export default function VideoEmbed({
  uri,
  type,
  height = 220,
}: VideoEmbedProps) {
  if (type === "youtube") {
    const videoId = extractYoutubeId(uri);

    if (!videoId) {
      console.error("Invalid YouTube URL:", uri);
      return null;
    }

    return <YoutubeIframe videoId={videoId} height={height} />;
  }

  if (type === "google-drive") {
    return (
      <Video
        source={{ uri: getGoogleDriveDirectUrl(uri) }}
        style={{ width: "100%", aspectRatio: 16 / 9 }}
        useNativeControls
        resizeMode="contain"
      />
    );
  }

  return null;
}
