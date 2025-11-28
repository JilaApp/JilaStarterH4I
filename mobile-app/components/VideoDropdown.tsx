import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors } from "@/colors";
import { useRouter } from "expo-router";
import Accordion from "@/components/Accordion";
import { sizes } from "@/constants/sizes";

type VideoDropdownPart = {
  videoUrl: string;
  name: string;
  duration: number;
};

type VideoDropdownProps = {
  text: string;
  parts: VideoDropdownPart[];
  ttsUrl: string;
  type?: "default" | "cream";
};

export default function VideoDropdown({
  text,
  parts,
  ttsUrl,
  type = "default",
}: VideoDropdownProps) {
  const router = useRouter();

  const isSingleVideo = parts.length === 1;
  const bgColor = type === "cream" ? colors.cream[300] : colors.white[400];

  const handlePress = () => {
    if (isSingleVideo) {
      // Navigate directly to video page with the single video URL
      router.push(`/video?url=${encodeURIComponent(parts[0].videoUrl)}`);
    }
  };

  const handlePartPress = (videoUrl: string) => {
    router.push(`/video?url=${encodeURIComponent(videoUrl)}`);
  };

  const headerContent = !isSingleVideo && (
    <Text style={styles.partCountText}>{`(${parts.length} parts)`}</Text>
  );

  const dropdownContent = (
    <View style={styles.dropdownContent}>
      {parts.map((part, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={() => handlePartPress(part.videoUrl)}
          activeOpacity={0.7}
          style={styles.dropdownItemWrapper}
        >
          <View
            style={[
              styles.dropdownItem,
              {
                backgroundColor: bgColor,
              },
            ]}
          >
            <Text style={styles.dropdownItemText}>{part.name}</Text>
            <View style={styles.timer}>
              <Text style={styles.timerText}>
                {formatDuration(part.duration)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={{ backgroundColor: colors.cream[300], width: "100%" }}>
      <Accordion
        text={text}
        ttsUrl={ttsUrl}
        backgroundColor={bgColor}
        headerContent={headerContent}
        onPress={isSingleVideo ? handlePress : undefined}
        disabled={isSingleVideo}
      >
        {dropdownContent}
      </Accordion>
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
  partCountText: {
    fontSize: sizes.fontSize.xs,
    fontWeight: "400",
    color: colors.black,
  },
  dropdownContent: {
    gap: 0,
    paddingHorizontal: sizes.spacing.lg,
    marginTop: -1,
  },
  dropdownItemWrapper: {
    width: "100%",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: sizes.spacing.lg,
    paddingVertical: sizes.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  dropdownItemText: {
    fontSize: sizes.fontSize.base,
    fontWeight: "600",
    color: colors.black,
    flex: 1,
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
});
