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

type AccordionProps = {
  text: string;
  ttsUrl?: string;
  backgroundColor: string;
  headerContent?: ReactNode;
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
};

export default function Accordion({
  text,
  ttsUrl,
  backgroundColor,
  headerContent,
  children,
  onPress,
  disabled = false,
}: AccordionProps) {
  const [contentHeight, setContentHeight] = useState(0);
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (!disabled) {
      toggle();
    }
  };

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
        onPress={handlePress}
        activeOpacity={0.7}
        style={[styles.parentRow, { backgroundColor }]}
      >
        <Text style={styles.parentText}>{text}</Text>
        {headerContent}

        {ttsUrl ? <AudioButton audioSource={{ uri: ttsUrl }} /> : null}
        <View style={styles.iconWrap}>
          <Animated.View style={{ transform: [{ rotate: arrowRotation }] }}>
            <ChevronRight color="#000" size={20} />
          </Animated.View>
        </View>
      </TouchableOpacity>
      {!disabled && (
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
            {children}
          </View>
          {open && children}
        </Animated.View>
      )}
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
    borderTopColor: colors.gray[200],
    borderBottomColor: colors.gray[200],
    gap: 10,
  },
  parentText: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
  },
  iconWrap: {
    marginHorizontal: 8,
    marginLeft: "auto",
    alignItems: "center",
    justifyContent: "center",
  },
});
