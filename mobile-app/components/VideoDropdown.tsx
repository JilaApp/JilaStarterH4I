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
  const [contentHeight, setContentHeight] = useState(0);
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    setOpen((prev) => !prev);
    Animated.timing(anim, {
      toValue: open ? 0 : 1,
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
    outputRange: [0, contentHeight + 2],
  });

  return (
    <View>
      <TouchableOpacity
        onPress={toggle}
        activeOpacity={0.7}
        style={[
          styles.parentRow,
          {
            backgroundColor:
              type === "cream" ? colors.cream[300] : colors.white[400],
          },
        ]}
      >
        <Text className={`text-[18px] font-[600] text-black`}>{text}</Text>
        <Text
          className={`text-[12px] font-[400] text-black`}
        >{`(${parts.length} parts)`}</Text>
        {ttsUrl ? <AudioButton audioSource={{ uri: ttsUrl }} /> : null}
        <View style={styles.iconWrap}>
          <Animated.View style={{ transform: [{ rotate: arrowRotation }] }}>
            <ChevronRight color="#000" size={20} />
          </Animated.View>
        </View>
      </TouchableOpacity>
      <Animated.View style={{ height: animatedHeight, overflow: "hidden" }}>
        <View
          style={styles.dropdownContent}
          onLayout={(e) => {
            const height = e.nativeEvent.layout.height;
            setContentHeight(height);
          }}
        >
          {parts.map((part, idx) => (
            <View
              key={idx}
              style={[
                styles.dropdownItem,
                {
                  backgroundColor:
                    type === "cream" ? colors.cream[300] : colors.white[400],
                },
              ]}
            >
              <Text className="text-[18px] flex-1 font-[600]">{part.name}</Text>
              <View style={styles.timer}>
                <Text className="font-[300] text-black text-[14px]">
                  {formatDuration(part.duration)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Animated.View>
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
  iconWrap: {
    marginHorizontal: 8,
    marginLeft: "auto",
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownContent: {
    paddingVertical: 8,
    marginTop: 10,
    width: "95%",
    gap: 20,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cream[300],
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: colors.gray[300],
    borderBottomColor: colors.gray[300],
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
});
