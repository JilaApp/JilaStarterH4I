import Text from "@/components/JilaText";
import { colors } from "@/colors";
import { View, StyleSheet } from "react-native";
import { sizes } from "@/constants/sizes";
import { useRouter } from "expo-router";
import VideoEmbed, { VideoType } from "@/components/VideoEmbed";
import Background from "@/components/Background";
import { useTranslation } from 'react-i18next';

export default function WelcomePage() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Background showLogo={false}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{t('CommonWords.welcome')}</Text>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>
           {t('OnboardPage.tutorial')}
          </Text>
        </View>

        <View style={styles.videoWrapper}>
          <VideoEmbed
            uri="https://youtu.be/tXlPRgp1zhY"
            type={VideoType.YouTube}
            height={250}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Text style={styles.continueLink} onPress={() => router.replace("/")}>
            Continue
          </Text>
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: sizes.spacing.md,
    gap: sizes.spacing.lg,
    // marginTop: sizes.spacing.xl,
  },
  title: {
    fontSize: 48,
    fontWeight: "600",
    color: colors.white[400],
    textAlign: "center",
  },
  subtitleContainer: {
    backgroundColor: "transparent",
    paddingHorizontal: sizes.spacing.md,
  },
  subtitle: {
    fontSize: 20,
    color: colors.white[400],
    textAlign: "center",
    lineHeight: 32,
  },
  videoWrapper: {
    width: "100%",
    borderRadius: sizes.borderRadius.md,
    overflow: "hidden",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: -67,
    paddingRight: sizes.spacing.md,
  },
  continueLink: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.jila[400],
    textDecorationLine: "underline",
  },
});
