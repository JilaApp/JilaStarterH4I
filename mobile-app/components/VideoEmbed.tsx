import YoutubeIframe from "react-native-youtube-iframe";
import { VideoView, useVideoPlayer } from "expo-video";
import { StyleSheet } from "react-native";
import { componentSizes } from "@/constants/sizes";

export enum VideoType {
  YouTube = "youtube",
  GoogleDrive = "google-drive",
}

type VideoEmbedProps = {
  uri: string;
  type: VideoType;
  height?: number;
};

type YoutubeEmbedProps = {
  uri: string;
  height: number;
};

type GoogleDriveEmbedProps = {
  uri: string;
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

function YoutubeEmbed({ uri, height }: YoutubeEmbedProps) {
  const videoId = extractYoutubeId(uri);

  if (!videoId) {
    console.error("Invalid YouTube URL:", uri);
    return null;
  }

  return <YoutubeIframe videoId={videoId} height={height} />;
}

function GoogleDriveEmbed({ uri }: GoogleDriveEmbedProps) {
  const player = useVideoPlayer(getGoogleDriveDirectUrl(uri), (player) => {
    player.loop = false;
  });

  return (
    <VideoView player={player} style={styles.video} allowsPictureInPicture />
  );
}

export default function VideoEmbed({
  uri,
  type,
  height = componentSizes.video.defaultHeight,
}: VideoEmbedProps) {
  if (type === VideoType.YouTube) {
    return <YoutubeEmbed uri={uri} height={height} />;
  }

  if (type === VideoType.GoogleDrive) {
    return <GoogleDriveEmbed uri={uri} />;
  }

  return null;
}

const styles = StyleSheet.create({
  video: {
    width: "100%",
    aspectRatio: componentSizes.video.aspectRatio,
  },
});
