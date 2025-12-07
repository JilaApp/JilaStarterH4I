import {
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { ArrowDownToLine, ChevronLeft } from "lucide-react-native";
import { Linking } from "react-native";
import { colors } from "@/colors";
import { VideoData } from "@/types/api";
import VideoRouter from "@/app/video-router";
import { useLocalSearchParams, useRouter } from "expo-router";

import Header from "@/components/Header";
import VideoEmbed, { VideoType } from "@/components/VideoEmbed";
import JilaText from "@/components/JilaText";
import AudioButton from "@/components/AudioButton";
import VideoUpNext from "@/components/VideoUpNext";

interface VideoPageProps {
  clickIndex?: number;
  videos?: VideoData;
}

// 2. Add props to the function argument
export default function VideoPage({
  clickIndex: propIndex,
  videos: propVideos,
}: VideoPageProps) {
  const router = useRouter();
  const params = useLocalSearchParams();

  let videos: VideoData | null = null;

  if (propVideos) {
    // Case A: Passed manually (Mock Data)
    videos = propVideos;
  } else if (params.videos) {
    try {
      videos =
        typeof params.videos === "string" ? JSON.parse(params.videos) : null;
    } catch (e) {
      console.error("Error parsing video data:", e);
    }
  }
  // Resolve clickIndex (Props > URL > Default 0)
  const clickIndex =
    propIndex !== undefined
      ? propIndex
      : params.clickIndex
        ? Number(params.clickIndex)
        : 0;

  // Safety Check
  if (!videos || !videos.urls) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <JilaText>Loading or Error...</JilaText>
      </View>
    );
  }

  // 4. Extract variables
  const video_urls = videos.urls;
  const video_youtube_list = videos.youtube_url || [];
  const total_urls = video_urls.length;
  const title = videos.titleEnglish;
  const uri = video_urls[clickIndex];

  // Handle youtube type logic safely
  const isYoutube = Array.isArray(video_youtube_list)
    ? video_youtube_list[clickIndex]
    : video_youtube_list;

  const type = isYoutube ? VideoType.YouTube : VideoType.GoogleDrive;
  const showNext = clickIndex < total_urls - 1;

  // Handlers
  const handlePressDownload = async () => {
    const supported = await Linking.canOpenURL(uri);
    if (supported) await Linking.openURL(uri);
  };

  const handleNextVideo = () => {
    // If we are in "Mock Data Mode", router.push might not be what you want,
    // but assuming you want to simulate navigation:
    router.push({
      pathname: "/video",
      params: {
        clickIndex: clickIndex + 1,
        videos: JSON.stringify(videos),
      },
    });
  };

  return (
    <View style={{ height: "100%", backgroundColor: colors.cream[300] }}>
      <View style={{ marginBottom: 30 }}>
        <Header toggleSearch={false} />
      </View>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 45 }}
      >
        <TouchableOpacity onPress={() => router.push("/video-router")}>
          <ChevronLeft
            style={{ marginLeft: 15, marginRight: 15 }}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          />
        </TouchableOpacity>

        <JilaText style={{ fontSize: 24, fontWeight: "600", marginRight: 10 }}>
          {title}
        </JilaText>
        <AudioButton audioSource={{ uri: "https://mysite.com/audio.mp3" }} />
      </View>
      <VideoEmbed uri={uri} type={type} />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 33,
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", marginLeft: 10 }}>
          <TouchableOpacity
            style={{ marginRight: 10 }}
            onPress={handlePressDownload}
          >
            <ArrowDownToLine />
          </TouchableOpacity>

          <JilaText style={{ fontSize: 20 }}>Part {clickIndex + 1}</JilaText>
        </View>
      </View>

      {showNext && (
        <View style={{ marginTop: 60 }}>
          <JilaText style={{ fontSize: 24, fontWeight: "600", marginLeft: 15 }}>
            Up Next
          </JilaText>

          <View
            style={{
              flexDirection: "row",
              backgroundColor: colors.white[400],
              height: 75,
              borderColor: colors.gray[200],
              borderWidth: 1,
              shadowColor: "#6D0F00",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.1,
              shadowRadius: 40,
            }}
          >
            <VideoUpNext
              title={`Part ${clickIndex + 2}`}
              duration={67}
              videoUrl="sigma.com"
              onPress={handleNextVideo}
            />{" "}
            {/*need to figure out duration */}
          </View>
        </View>
      )}
    </View>
  );
}
