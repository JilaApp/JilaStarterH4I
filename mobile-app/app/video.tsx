import { View, TouchableOpacity } from "react-native";
import { ArrowDownToLine, ChevronLeft } from "lucide-react-native";
import { Linking } from "react-native";
import { colors } from "@/colors";
import { VideoData } from "@/types/api";
import { useLocalSearchParams, useRouter } from "expo-router";

import Header from "@/components/Header";
import VideoEmbed, { VideoType } from "@/components/VideoEmbed";
import JilaText from "@/components/JilaText";
import AudioButton from "@/components/AudioButton";
import VideoUpNext from "@/components/VideoUpNext";
import { useTTS } from "@/context/TTSContext";

interface VideoPageProps {
  clickIndex?: number;
  videos?: VideoData;
}

export default function VideoPage({
  clickIndex: propIndex,
  videos: propVideos,
}: VideoPageProps) {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { ttsEnabled } = useTTS();

  let videos: VideoData | null = null;

  if (propVideos) {
    videos = propVideos;
  } else if (params.videos) {
    try {
      videos =
        typeof params.videos === "string" ? JSON.parse(params.videos) : null;
    } catch (e) {
      console.error("Error parsing video data:", e);
    }
  }
  const clickIndex =
    propIndex !== undefined
      ? propIndex
      : params.clickIndex
        ? Number(params.clickIndex)
        : 0;

  const category = params.category;

  if (!videos || !videos.urls) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <JilaText>Loading or Error...</JilaText>
      </View>
    );
  }

  const video_urls = videos.urls;
  const total_urls = video_urls.length;
  const title = videos.titleEnglish;
  const uri = video_urls[clickIndex];

  const isYoutube = uri.includes("youtube.com") || uri.includes("youtu.be");

  const type = isYoutube ? VideoType.YouTube : VideoType.GoogleDrive;
  const showNext = clickIndex < total_urls - 1;

  const handlePressDownload = async () => {
    const supported = await Linking.canOpenURL(uri);
    if (supported) await Linking.openURL(uri);
  };

  const handleNextVideo = () => {
    router.push({
      pathname: "/video",
      params: {
        clickIndex: clickIndex + 1,
        videos: JSON.stringify(videos),
        category: category,
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
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/video-router",
              params: { category: category },
            })
          }
        >
          <ChevronLeft
            style={{ marginLeft: 15, marginRight: 15 }}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          />
        </TouchableOpacity>

        <JilaText style={{ fontSize: 24, fontWeight: "600", marginRight: 10 }}>
          {title}
        </JilaText>
        {ttsEnabled && (
          <AudioButton audioSource={{ uri: "https://mysite.com/audio.mp3" }} />
        )}
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
              duration={videos.durations[clickIndex + 1] || 0}
              videoUrl="sigma.com"
              onPress={handleNextVideo}
            />
          </View>
        </View>
      )}
    </View>
  );
}
