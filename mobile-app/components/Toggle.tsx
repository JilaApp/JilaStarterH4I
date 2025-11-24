import React from "react";
import { Pressable, View, StyleSheet, Button } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "./JilaText";
import AudioButton from "./AudioButton";

const Switch = ({
  value,
  onPress,
  style,
  duration = 400,
  trackColors = { on: "#D4928F", off: "#E8E8E8" },
}: {
  value: SharedValue<number>;
  onPress: () => void;
  style;
  duration: number;
  trackColors: { on: string; off: string };
}) => {
  const height = useSharedValue(0);
  const width = useSharedValue(0);

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      value.value,
      [0, 1],
      [trackColors.off, trackColors.on]
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
      [0, width.value - height.value]
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
    width: 50,
    height: 20,
    padding: 1,
    borderWidth: 2.5,
    borderColor: "#7E0601",
  },
  thumb: {
    height: "100%",
    aspectRatio: 1,
    backgroundColor: "white",
    borderWidth: 2.5,
    borderColor: "#7E0601",
  },
});

export function Toggle() {
  const isOn = useSharedValue(false);

  const handlePress = () => {
    isOn.value = !isOn.value;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
        }}
      >
        <Switch value={isOn} onPress={handlePress} style={styles.switch} />
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>
          Enable Text-to-speech?
        </Text>
        <AudioButton
          audioSource={require("../assets/audio/sample.mp3")}
          variant={"default"}
        />
      </View>
      <Text style={{ textAlign: "center" }}>
        When enabled, you may click the speaker icons to read words out loud
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  switch: {
    width: 55,
    height: 40,
    padding: 5,
  },
  container: {
    flex: 1,
    height: 300,
    width: 250,
    margin: "auto",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    paddingTop: "10px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
