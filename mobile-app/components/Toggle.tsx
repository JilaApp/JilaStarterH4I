import React from "react";
import { Pressable, View, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Text from "./JilaText";
import AudioButton from "./AudioButton";
import { sizes } from "@/constants/sizes";

// Toggle-specific constants
const SWITCH_BORDER_WIDTH = 2.5;
const SWITCH_TRACK_WIDTH = 50;

// Toggle colors (rgba doesn't work with reanimated...)
const SWITCH_COLORS = {
  trackOn: "#D4928F",
  trackOff: "#E8E8E8",
  border: "#7E0601",
  thumb: "#FFFFFF",
};

const Switch = ({
  value,
  onPress,
  style,
  duration = 400,
  trackColors = { on: SWITCH_COLORS.trackOn, off: SWITCH_COLORS.trackOff },
}: {
  value: SharedValue<number>;
  onPress: () => void;
  style?: any;
  duration?: number;
  trackColors?: { on: string; off: string };
}) => {
  const height = useSharedValue(0);
  const width = useSharedValue(0);

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      value.value,
      [0, 1],
      [trackColors.off, trackColors.on],
    );
    const colorValue = withTiming(color, { duration });

    return {
      backgroundColor: colorValue,
      borderRadius: height.value / 2,
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const moveValue = interpolate(
      Number(value.value),
      [0, 1],
      [0, width.value - height.value],
    );
    const translateValue = withTiming(moveValue, { duration });

    return {
      transform: [{ translateX: translateValue }],
      borderRadius: height.value / 2,
    };
  });

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
          width.value = e.nativeEvent.layout.width;
        }}
        style={[switchStyles.track, style, trackAnimatedStyle]}
      >
        <Animated.View
          style={[switchStyles.thumb, thumbAnimatedStyle]}
        ></Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const switchStyles = StyleSheet.create({
  track: {
    alignItems: "flex-start",
    width: SWITCH_TRACK_WIDTH,
    height: sizes.icon.md,
    padding: sizes.spacing.xxs,
    borderWidth: SWITCH_BORDER_WIDTH,
    borderColor: SWITCH_COLORS.border,
  },
  thumb: {
    height: "100%",
    aspectRatio: 1,
    backgroundColor: SWITCH_COLORS.thumb,
    borderWidth: SWITCH_BORDER_WIDTH,
    borderColor: SWITCH_COLORS.border,
  },
});

export function Toggle({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}) {
  const isOn = useSharedValue(checked ? 1 : 0);

  React.useEffect(() => {
    isOn.value = withTiming(checked ? 1 : 0);
  }, [checked, isOn]);

  const handlePress = () => {
    onCheckedChange(!checked);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.toggleRow}>
          <Switch value={isOn} onPress={handlePress} style={styles.switch} />
          <Text style={styles.titleText}>Enable Text-to-speech?</Text>
          <AudioButton audioSource={null} variant={"default"} />
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            When enabled, you may click the speaker icons to read words out loud
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  switch: {
    // width: SWITCH_WIDTH,
    width: sizes.spacing.xxl,
    height: sizes.spacing.xl,
    padding: sizes.spacing.xxs,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: sizes.spacing.lg,
  },
  content: {
    alignItems: "flex-start",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: sizes.spacing.sm,
    width: "100%",
  },
  titleText: {
    fontSize: sizes.fontSize.md,
    fontWeight: "bold",
  },
  descriptionContainer: {
    alignSelf: "stretch",
  },
  descriptionText: {
    textAlign: "center",
    fontSize: sizes.fontSize.xs,
    marginTop: 10,
  },
});
