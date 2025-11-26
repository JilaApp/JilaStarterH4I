import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

export const wp = (percentage: number): number => {
  return (SCREEN_WIDTH * percentage) / 100;
};

export const hp = (percentage: number): number => {
  return (SCREEN_HEIGHT * percentage) / 100;
};

export const scaleSize = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

export const scaleFontSize = (size: number): number => {
  const newSize = scaleSize(size);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (scaleSize(size) - size) * factor;
};

export const getScreenDimensions = () => ({
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 375,
  isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
  isLargeDevice: SCREEN_WIDTH >= 414,
});
