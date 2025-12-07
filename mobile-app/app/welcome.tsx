import { LinearGradient } from "expo-linear-gradient";
import Text from "@/components/JilaText";
import { colors } from "@/colors";
import { View, StyleSheet } from "react-native";
import { sizes } from "@/constants/sizes";
import { Button } from "@/components/Button";
import { useRouter } from "expo-router";
import VideoEmbed, { VideoType } from "@/components/VideoEmbed";

export default function WelcomePage() {
    const router = useRouter();

    return (
        <View style={{ flex: 1 }}>
            <LinearGradient
                colors={[colors.orange[400], colors.jila[400]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.container}
            >
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>Welcome!</Text>
                    <View style={styles.subtitleContainer}>
                        <Text style={styles.subtitle}>
                            Watch this video to learn how to use the app!
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
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    contentContainer: {
        width: "100%",
        alignItems: "center",
        paddingHorizontal: sizes.spacing.md,
        gap: sizes.spacing.lg,
    },
    title: {
        fontSize: 48,
        fontWeight: "700",
        color: colors.white[400],
        textAlign: "center",
    },
    subtitleContainer: {
        backgroundColor: "transparent",
        paddingHorizontal: sizes.spacing.md,
    },
    subtitle: {
        fontSize: 24,
        color: colors.white[400],
        textAlign: "center",
        lineHeight: 32,
    },
    videoWrapper: {
        width: "100%",
        borderRadius: sizes.borderRadius.md,
        overflow: "hidden",
        backgroundColor: colors.white[400], // Placeholder background
        padding: 10, // Add some padding like a card frame if needed, or remove
    },
    buttonContainer: {
        marginTop: sizes.spacing.md,
    },
    continueLink: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.white[400],
        textDecorationLine: "underline",
    },
});
