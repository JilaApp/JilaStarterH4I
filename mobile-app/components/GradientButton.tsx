import { View, Text, Pressable, StyleSheet } from "react-native";
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
}

export function EducationButton() {
  return (
    <GradientButton
      icon="GraduationCap"
      bottomColor={colors.purple[500]}
      topColor={colors.purple[400]}
      text="Education"
      iconColor={colors.purple[300]}
    />
  );
}

export function MedicalButton() {
  return (
    <GradientButton
      icon="HeartPulse"
      bottomColor={colors.yellow[400]}
      topColor={colors.orange[400]}
      text="Medical"
      iconColor={colors.orange[300]}
    />
  );
}

export function TransportButton() {
  return (
    <GradientButton
      icon="Bus"
      bottomColor={colors.teal[400]}
      topColor={colors.green[300]}
      text="Transport"
      iconColor={colors.teal[300]}
    />
  );
}

export function OtherButton() {
  return (
    <GradientButton
      icon="CircleEllipsis"
      bottomColor={colors.gray[300]}
      topColor={colors.gray[300]}
      text="Other"
      iconColor={colors.gray[200]}
    />
  );
}

export function LegalButton() {
  return (
    <GradientButton
      icon="Scale"
      bottomColor={colors.jila[400]}
      topColor={colors.orange[400]}
      text="Legal"
      iconColor={colors.jila[300]}
    />
  );
}

export function CareerButton() {
  return (
    <GradientButton
      icon="BriefcaseBusiness"
      bottomColor={colors.green[400]}
      topColor={colors.yellow[400]}
      text="Career"
      iconColor={colors.green[300]}
    />
  );
}

function GradientButton({
  icon,
  bottomColor,
  topColor,
  text,
  iconColor,
}: GradientButtonProps) {
  const LucideIcon = Icons[icon];
  return (
    <Pressable style={styles.pressable}>
      <LinearGradient
        colors={[bottomColor, topColor]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
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
  gradient: {
    flex: 1,
    width: 180,
    height: 180,
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
