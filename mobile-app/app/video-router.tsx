import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import Text from "@/components/JilaText";
import Header from "@/components/Header";
import { colors } from "@/colors";
import { trpc } from "@/lib/trpc";
import VideoDropdown from "@/components/VideoDropdown";
import { VideoData } from "@/types/api";
import { sizes } from "@/constants/sizes";
import { wp } from "@/utils/responsive";
import { ChevronLeft } from "lucide-react-native";

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
      const matchesCategory =
        category === null || video.topic === category.toUpperCase();

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

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Error loading services: {error.message}
          </Text>
          <Text style={styles.errorDetails}>Check console for details</Text>
        </View>
      ) : isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.jila[400]} />
          <Text style={styles.loadingText}>Loading resources...</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <View
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Link href="/">
              <ChevronLeft />
            </Link>
            <Text style={styles.categoryText}>{category}</Text>
            <View />
          </View>

          {filteredVideos &&
            filteredVideos.map((vid: VideoData, i: number) => (
              <VideoDropdown
                key={i}
                text={
                  vid.titleEnglish.substring(0, 20) +
                  (vid.titleEnglish.length > 20 ? "..." : "")
                }
                ttsUrl={vid.audioFilename || "url"}
                type="cream"
                parts={vid.urls.map((url, i) => {
                  return {
                    videoUrl: url,
                    duration: 0,
                    name: `Part ${i + 1}`,
                  };
                })}
              />
            ))}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.cream[300],
    padding: wp(6),
    height: "100%",
    width: "100%",
  },
  categoryText: {
    fontSize: sizes.fontSize.xxxl,
    fontWeight: "700",
    color: colors.type[400],
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: sizes.spacing.xxl,
    paddingHorizontal: sizes.spacing.lg,
    gap: sizes.spacing.sm,
    backgroundColor: colors.cream[300],
  },
  errorText: {
    fontSize: sizes.fontSize.md,
    color: colors.error[400],
    textAlign: "center",
    fontWeight: "600",
  },
  errorDetails: {
    fontSize: sizes.fontSize.xs,
    color: colors.gray[400],
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: sizes.spacing.xxl,
    gap: sizes.spacing.md,
    backgroundColor: colors.cream[300],
  },
  loadingText: {
    fontSize: sizes.fontSize.sm,
    color: colors.gray[400],
  },
});
