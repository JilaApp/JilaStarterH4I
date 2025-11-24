import { useState, useRef, ReactNode, useEffect } from "react";
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

type JobDropdownProps = {
  text: string;
  ttsUrl?: string;
  children: ReactNode;
};

export default function JobDropdown({
  text,
  ttsUrl,
  children,
}: JobDropdownProps) {
  const [contentHeight, setContentHeight] = useState(0);
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    Animated.timing(anim, {
      toValue: open ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [open, anim]);

  const arrowRotation = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  const animatedHeight = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
  });

  return (
    <View>
      <TouchableOpacity
        onPress={toggle}
        activeOpacity={0.7}
        style={styles.parentRow}
      >
        <Text style={styles.parentText}>{text}</Text>

        {ttsUrl ? <AudioButton audioSource={{ uri: ttsUrl }} /> : null}
        <View style={styles.iconWrap}>
          <Animated.View style={{ transform: [{ rotate: arrowRotation }] }}>
            <ChevronRight color="#000" size={20} />
          </Animated.View>
        </View>
      </TouchableOpacity>
      <Animated.View style={[{ height: animatedHeight, overflow: "hidden" }]}>
        <View
          style={{ position: "absolute", opacity: 0 }}
          onLayout={(e) => {
            const height = e.nativeEvent.layout.height;
            if (contentHeight !== height && height > 0) {
              setContentHeight(height);
            }
          }}
        >
          <View style={styles.contentWrapper}>{children}</View>
        </View>
        {open && <View style={styles.contentWrapper}>{children}</View>}
      </Animated.View>
    </View>
  );
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
    backgroundColor: colors.white[400],
    gap: 10,
  },
  parentText: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
  },
  contentWrapper: {
    width: "100%",
  },
  iconWrap: {
    marginHorizontal: 8,
    marginLeft: "auto",
    alignItems: "center",
    justifyContent: "center",
  },
});
