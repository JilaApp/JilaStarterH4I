import { Dimensions } from "react-native";
import {
  scaleSize,
  scaleFontSize,
  moderateScale,
  wp,
  hp,
} from "@/utils/responsive";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const sizes = {
  screen: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  icon: {
    xs: scaleSize(12),
    sm: scaleSize(16),
    md: scaleSize(24),
    lg: scaleSize(32),
    xl: scaleSize(40),
  },
  spacing: {
    xxs: scaleSize(2),
    xs: scaleSize(4),
    sm: scaleSize(8),
    md: scaleSize(16),
    lg: scaleSize(24),
    xl: scaleSize(32),
    xxl: scaleSize(48),
  },
  borderRadius: {
    xs: scaleSize(4),
    sm: scaleSize(8),
    md: scaleSize(12),
    lg: scaleSize(16),
    xl: scaleSize(24),
    xxl: scaleSize(32),
    curved: scaleSize(70),
    full: 9999,
  },
  fontSize: {
    xs: scaleFontSize(12),
    sm: scaleFontSize(14),
    md: scaleFontSize(16),
    base: scaleFontSize(18),
    lg: scaleFontSize(20),
    xl: scaleFontSize(24),
    xxl: scaleFontSize(28),
    xxxl: scaleFontSize(32),
  },
  touch: {
    minTarget: scaleSize(44),
  },
  borderWidth: {
    thin: 1,
    medium: 2.5,
  },
};

// Component-specific sizes that build on base sizes
export const componentSizes = {
  displayBox: {
    minHeight: sizes.screen.height * 0.4,
    maxHeight: sizes.screen.height * 0.75,
    tailSize: sizes.spacing.xl * 5, // 160
  },
  logo: {
    header: {
      width: sizes.screen.width * 0.3,
      height: sizes.screen.width * 0.15,
    },
    background: {
      width: sizes.screen.width * 0.4,
      height: sizes.screen.width * 0.4,
    },
  },
  gradientButton: {
    size: sizes.screen.height * 0.175,
  },
  video: {
    defaultHeight: sizes.screen.height * 0.25,
    aspectRatio: 16 / 9,
  },
};
