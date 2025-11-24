import { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import { ChevronRight } from "lucide-react-native";
import AudioButton from "@/components/AudioButton";
import { colors } from "@/colors";
import { useRouter } from "expo-router";

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
  const [contentHeight, setContentHeight] = useState(0);
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const isSingleVideo = parts.length === 1;

  const handlePress = () => {
    if (isSingleVideo) {
      // Navigate directly to video page with the single video URL
      router.push(`/video?url=${encodeURIComponent(parts[0].videoUrl)}`);
    } else {
      // Toggle dropdown for multiple videos
      toggle();
    }
  };

  const toggle = () => {
    const newOpen = !open;
    setOpen(newOpen);
    Animated.timing(anim, {
      toValue: newOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const arrowRotation = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  const animatedHeight = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
  });

  const handlePartPress = (videoUrl: string) => {
    router.push(`/video?url=${encodeURIComponent(videoUrl)}`);
  };

  const bgColor = type === "cream" ? colors.cream[300] : colors.white[400];

  return (
    <View style={{ backgroundColor: colors.gray[200] }}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        style={[
          styles.parentRow,
          {
            backgroundColor: bgColor,
          },
        ]}
      >
        <Text style={styles.parentText}>{text}</Text>
        {!isSingleVideo && (
          <Text style={styles.partCountText}>{`(${parts.length} parts)`}</Text>
        )}

        {ttsUrl ? <AudioButton audioSource={{ uri: ttsUrl }} /> : null}
        <View style={styles.iconWrap}>
          <Animated.View style={{ transform: [{ rotate: arrowRotation }] }}>
            <ChevronRight color="#000" size={20} />
          </Animated.View>
        </View>
      </TouchableOpacity>
      {!isSingleVideo && (
        <Animated.View style={{ height: animatedHeight, overflow: "hidden" }}>
          <View
            style={{ position: "absolute", opacity: 0 }}
            onLayout={(e) => {
              const height = e.nativeEvent.layout.height;
              if (contentHeight !== height && height > 0) {
                setContentHeight(height);
              }
            }}
          >
            <View style={styles.dropdownContent}>
              {parts.map((part, idx) => (
                <View key={idx} style={styles.dropdownItemWrapper}>
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
                </View>
              ))}
            </View>
          </View>
          {open && (
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
          )}
        </Animated.View>
      )}
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
  parentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: colors.gray[300],
    borderBottomColor: colors.gray[300],
    gap: 10,
  },
  parentText: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
  },
  partCountText: {
    fontSize: 12,
    fontWeight: "400",
    color: "black",
  },
  dropdownContent: {
    gap: 0,
    paddingHorizontal: 20,
  },
  dropdownItemWrapper: {
    width: "100%",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: colors.gray[300],
    borderBottomColor: colors.gray[300],
  },
  dropdownItemText: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
    flex: 1,
  },
  timer: {
    backgroundColor: colors.jila[300],
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
    width: 58,
    height: 25,
  },
  timerText: {
    fontSize: 14,
    fontWeight: "300",
    color: "black",
  },
  iconWrap: {
    marginHorizontal: 8,
    marginLeft: "auto",
    alignItems: "center",
    justifyContent: "center",
  },
});
