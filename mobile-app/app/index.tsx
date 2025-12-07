import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { colors } from "@/colors";
import { hp, wp } from "@/utils/responsive";
import Header from "@/components/Header";
import BottomBackground from "@/components/BottomBackground";
import {
  CareerButton,
  LegalButton,
  MedicalButton,
  TransportButton,
  EducationButton,
  OtherButton,
} from "@/components/GradientButton";
import { trpc } from "@/lib/trpc";
import VideoDropdown from "@/components/VideoDropdown";
import { VideoData } from "@/types/api";
import Text from "@/components/JilaText";
import { sizes } from "@/constants/sizes";

export default function App() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all videos for search
  const {
    data: videos,
    isLoading: videosLoading,
    error: videosError,
  } = trpc.videos.getAllVideos.useQuery();

  const onSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Filter videos based on search query
  const filteredVideos =
    videos?.filter((video: VideoData) => {
      if (!searchQuery) return false;

      const matchesSearch =
        video.titleEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.titleQanjobal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.descriptionEnglish
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        video.descriptionQanjobal
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      return matchesSearch;
    }) || [];

  const isSearchActive = searchQuery.length > 0;

  // Handle redirect in useEffect to avoid render-time navigation
  useEffect(() => {
    if (isLoaded && !user) {
      router.replace("/landing");
    }
  }, [isLoaded, user, router]);

  // Show loading state
  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.jila[400]} />
      </View>
    );
  }

  // If not signed in, show loading while redirecting
  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.jila[400]} />
      </View>
    );
  }

  const navigateToCategory = (category: string) => {
    router.push({
      pathname: "/video-router",
      params: { category },
    });
  };

  return (
    <>
      <Header
        text={`Hi ${user.username}, what would you like to learn today?`}
        toggleSearch={true}
        searchValue={searchQuery}
        onSearchChange={onSearchChange}
      />
      <BottomBackground contentStyle={styles.container}>
        {isSearchActive ? (
          <ScrollView
            style={styles.searchResultsContainer}
            contentContainerStyle={styles.searchResultsContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.searchHeader}>
              <Text style={styles.searchHeaderText}>Video Resources</Text>
              <Text style={styles.searchResultCount}>
                {filteredVideos.length}{" "}
                {filteredVideos.length === 1 ? "result" : "results"}
              </Text>
            </View>

            {filteredVideos.length === 0 ? (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>No search results.</Text>
              </View>
            ) : (
              filteredVideos.map((vid: VideoData, i: number) => {
                const hasMultipleParts = vid.urls.length > 1;
                const maxLength = hasMultipleParts ? 18 : 28;
                return (
                  <VideoDropdown
                    key={i}
                    text={
                      vid.titleEnglish.substring(0, maxLength) +
                      (vid.titleEnglish.length > maxLength ? "..." : "")
                    }
                    ttsUrl={vid.audioFilename || "url"}
                    type="cream"
                    category={vid.topic}
                    parts={vid.urls.map((url, i) => {
                      return {
                        videoUrl: url,
                        duration: vid.durations[i],
                        name: `Part ${i + 1}`,
                      };
                    })}
                    onVideoSelect={(index) => {
                      router.push({
                        pathname: "/video",
                        params: {
                          clickIndex: index,
                          videos: JSON.stringify(vid),
                          category: vid.topic,
                        },
                      });
                    }}
                  />
                );
              })
            )}
          </ScrollView>
        ) : (
          <View style={styles.buttonGridWrapper}>
            <View style={styles.buttonGrid}>
              <View style={styles.buttonRow}>
                <CareerButton onPress={() => navigateToCategory("Career")} />
                <LegalButton onPress={() => navigateToCategory("Legal")} />
              </View>
              <View style={styles.buttonRow}>
                <MedicalButton onPress={() => navigateToCategory("Medical")} />
                <TransportButton
                  onPress={() => navigateToCategory("Transport")}
                />
              </View>
              <View style={styles.buttonRow}>
                <EducationButton
                  onPress={() => navigateToCategory("Education")}
                />
                <OtherButton onPress={() => navigateToCategory("Other")} />
              </View>
            </View>
          </View>
        )}
      </BottomBackground>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.cream[300],
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(4),
  },
  buttonGridWrapper: {
    marginTop: hp(3),
  },
  buttonGrid: {
    gap: hp(2),
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: wp(4),
  },
  searchResultsContainer: {
    flex: 1,
    width: "100%",
  },
  searchResultsContent: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    paddingBottom: hp(4),
  },
  searchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp(2),
    marginBottom: hp(2),
    paddingHorizontal: wp(2),
  },
  searchHeaderText: {
    fontSize: sizes.fontSize.xl,
    fontWeight: "700",
    color: colors.black,
  },
  searchResultCount: {
    fontSize: sizes.fontSize.base,
    fontWeight: "400",
    color: colors.jila[400],
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp(10),
  },
  noResultsText: {
    fontSize: sizes.fontSize.base,
    fontWeight: "400",
    color: colors.gray[400],
    textAlign: "center",
  },
});
