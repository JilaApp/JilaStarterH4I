import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeft } from "lucide-react-native";
import Text from "@/components/JilaText";
import VideoEmbed, { VideoType } from "@/components/VideoEmbed";
import BottomBackground from "@/components/BottomBackground";
import { colors } from "@/colors";
import { sizes } from "@/constants/sizes";
import { hp, wp } from "@/utils/responsive";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from 'react-i18next';

export default function HelpPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.orange[400], colors.jila[400]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.headerGradient, { paddingTop: insets.top }]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={sizes.icon.sm} color={colors.white[400]} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.title}>Need Help?</Text>
          <Text style={styles.subtitle}>
          {t('OnboardPage.tutorial')}
          </Text>
        </View>
      </LinearGradient>

      <BottomBackground contentStyle={styles.bottomContent}>
        <View style={styles.videoContainer}>
          <VideoEmbed
            uri="https://youtu.be/tXlPRgp1zhY"
            type={VideoType.YouTube}
            height={hp(25)}
          />
        </View>
      </BottomBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream[300],
  },
  headerGradient: {
    paddingHorizontal: sizes.spacing.xl,
    paddingBottom: hp(5),
    borderBottomLeftRadius: sizes.borderRadius.xxl,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: sizes.spacing.xs,
    marginTop: sizes.spacing.md,
  },
  backText: {
    color: colors.white[400],
    fontSize: sizes.fontSize.md,
    fontWeight: "700",
  },
  headerContent: {
    marginTop: hp(5),
    alignItems: "center",
    gap: sizes.spacing.sm,
  },
  title: {
    color: colors.white[400],
    fontSize: 42,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: colors.white[400],
    fontSize: sizes.fontSize.lg,
    textAlign: "center",
    lineHeight: 30,
    paddingHorizontal: wp(5),
  },
  bottomContent: {
    flex: 1,
    paddingTop: hp(3),
    paddingHorizontal: wp(4),
  },
  videoContainer: {
    width: "100%",
  },
});
