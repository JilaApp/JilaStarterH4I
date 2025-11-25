import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const sizes = {
  screen: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  icon: {
    xs: 12,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 40,
  },
  spacing: {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    curved: 70,
    full: 9999,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    base: 18,
    lg: 20,
    xl: 24,
    xxl: 28,
    xxxl: 32,
  },
  touch: {
    minTarget: 44,
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
    size: sizes.screen.width * 0.41,
  },
  video: {
    defaultHeight: sizes.screen.height * 0.25,
    aspectRatio: 16 / 9,
  },
};
