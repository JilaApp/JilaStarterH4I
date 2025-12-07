import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors } from "@/colors";
import { formatDuration } from "@/utils/formatters";
import { sizes } from "@/constants/sizes";
import { useRouter } from "expo-router";
import { CirclePlay } from "lucide-react-native";

type VideoUpNextProps = {
  videoUrl: string;
  title: string;
  duration: number;
  onPress: () => void;
};

export default function VideoUpNext({
  videoUrl,
  title,
  duration,
  onPress,
}: VideoUpNextProps) {
  return (
    <View style={[styles.container, { backgroundColor: "cream" }]}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.content}
        onPress={onPress}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.timer}>
            <Text style={styles.timerText}>{formatDuration(duration)}</Text>
          </View>
        </View>

        <View style={styles.playButtonContainer}>
          <CirclePlay size={24} color={colors.jila[400]} />
        </View>
      </TouchableOpacity>
    </View>
  );
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
