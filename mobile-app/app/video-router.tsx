import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Text from "@/components/JilaText";
import Header from "@/components/Header";
import { colors } from "@/colors";
import { trpc } from "@/lib/trpc";
import VideoDropdown from "@/components/VideoDropdown";
import { VideoData } from "@/types/api";

export default function VideoRouter() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const onSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const {
    data: videos,
    isLoading,
    error,
  } = trpc.videos.getAllVideos.useQuery();

  const filteredVideos =
    videos?.filter((video: VideoData) => {
      const matchesCategory = category === null || video.topic === category;

      const matchesSearch =
        !searchQuery ||
        video.titleEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.titleQanjobal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.descriptionEnglish
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        video.descriptionQanjobal
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    }) || [];

  return (
    <>
      <Header
        toggleSearch={true}
        searchValue={searchQuery}
        onSearchChange={onSearchChange}
      />
      <View style={styles.container}>
        {filteredVideos &&
          filteredVideos.map((vid: VideoData) => (
            <VideoDropdown
              key={vid.titleEnglish}
              text={vid.titleEnglish}
              ttsUrl={vid.audioFilename}
              parts={vid.urls.map((url, i) => {
                return { videoUrl: url, duration: 0, name: `Part ${i + 1}` };
              })}
            />
          ))}
        <Text style={styles.categoryText}>{category}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.cream[300],
    padding: 24,
  },
  categoryText: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.type[400],
  },
});
