import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { colors } from "@/colors";
import { useRouter } from "expo-router";
import { CirclePlay } from "lucide-react-native";
import { sizes } from "@/constants/sizes";

type VideoUpNextProps = {
  videoUrl: string;
  title: string;
  duration: number;
};

export default function VideoUpNext({
  videoUrl,
  title,
  duration,
}: VideoUpNextProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/video?url=${encodeURIComponent(videoUrl)}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: "cream" }]}>
      <TouchableOpacity activeOpacity={0.7} style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.timer}>
            <Text style={styles.timerText}>{formatDuration(duration)}</Text>
          </View>
        </View>
        <Pressable style={styles.playButtonContainer} onPress={handlePress}>
          <CirclePlay size={24} color={colors.jila[400]} />
        </Pressable>
      </TouchableOpacity>
    </View>
  );
}

function formatDuration(duration: number) {
  const mins = Math.floor(duration / 60)
    .toString()
    .padStart(2, "0");
  const secs = (duration % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: sizes.spacing.lg,
    paddingVertical: sizes.spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: sizes.fontSize.base,
    fontWeight: "600",
    color: colors.black,
    marginRight: 10,
  },
  timer: {
    backgroundColor: colors.jila[300],
    borderRadius: sizes.borderRadius.md,
    paddingHorizontal: sizes.spacing.sm,
    paddingVertical: sizes.spacing.xxs,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 58,
  },
  timerText: {
    fontSize: sizes.fontSize.sm,
    fontWeight: "300",
    color: colors.black,
  },
  playButtonContainer: {
    marginLeft: sizes.spacing.md,
    padding: sizes.spacing.sm,
  },
});
