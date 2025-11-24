import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { icons } from "lucide-react-native";
import { colors } from "@/colors";

const Icons = icons;

interface GradientButtonProps {
  icon: keyof typeof Icons;
  bottomColor: string;
  topColor: string;
  text: string;
  iconColor?: string;
  onPress?: () => void;
}

export function EducationButton({ onPress }: { onPress?: () => void }) {
  return (
    <GradientButton
      icon="GraduationCap"
      bottomColor={colors.purple[500]}
      topColor={colors.purple[400]}
      text="Education"
      iconColor={colors.purple[300]}
      onPress={onPress}
    />
  );
}

export function MedicalButton({ onPress }: { onPress?: () => void }) {
  return (
    <GradientButton
      icon="HeartPulse"
      bottomColor={colors.yellow[400]}
      topColor={colors.orange[400]}
      text="Medical"
      iconColor={colors.orange[300]}
      onPress={onPress}
    />
  );
}

export function TransportButton({ onPress }: { onPress?: () => void }) {
  return (
    <GradientButton
      icon="Bus"
      bottomColor={colors.teal[400]}
      topColor={colors.green[300]}
      text="Transport"
      iconColor={colors.teal[300]}
      onPress={onPress}
    />
  );
}

export function OtherButton({ onPress }: { onPress?: () => void }) {
  return (
    <GradientButton
      icon="CircleEllipsis"
      bottomColor={colors.gray[300]}
      topColor={colors.gray[300]}
      text="Other"
      iconColor={colors.gray[200]}
      onPress={onPress}
    />
  );
}

export function LegalButton({ onPress }: { onPress?: () => void }) {
  return (
    <GradientButton
      icon="Scale"
      bottomColor={colors.jila[400]}
      topColor={colors.orange[400]}
      text="Legal"
      iconColor={colors.jila[300]}
      onPress={onPress}
    />
  );
}

export function CareerButton({ onPress }: { onPress?: () => void }) {
  return (
    <GradientButton
      icon="BriefcaseBusiness"
      bottomColor={colors.green[400]}
      topColor={colors.yellow[400]}
      text="Career"
      iconColor={colors.green[300]}
      onPress={onPress}
    />
  );
}

function GradientButton({
  icon,
  bottomColor,
  topColor,
  text,
  iconColor,
  onPress,
}: GradientButtonProps) {
  const LucideIcon = Icons[icon];
  const screenWidth = Dimensions.get("window").width;
  const buttonSize = screenWidth * 0.41; // I know this is a magic number :wilted:

  return (
    <Pressable
      style={({ pressed }) => [
        styles.pressable,
        pressed && styles.pressablePressed,
      ]}
      onPress={onPress}
    >
      <LinearGradient
        colors={[bottomColor, topColor]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, { width: buttonSize, height: buttonSize }]}
      >
        <View style={styles.content}>
          <LucideIcon color={iconColor} strokeWidth={2.5} size={40} />
          <Text style={styles.text}>{text}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 8,
  },
  pressablePressed: {
    opacity: 0.7,
  },
  gradient: {
    borderRadius: 20,
    justifyContent: "flex-end",
  },
  content: {
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 12,
    gap: 12,
  },
  text: {
    fontSize: 22,
    color: colors.white[400],
  },
});
