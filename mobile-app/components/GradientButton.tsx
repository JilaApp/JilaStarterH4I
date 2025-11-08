import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { icons } from "lucide-react-native";
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
      bottomColor="#8F65AC"
      topColor="#EED4FF"
      text="Education"
      iconColor="#F3E0FF"
    />
  );
}

export function MedicalButton() {
  return (
    <GradientButton
      icon="HeartPulse"
      bottomColor="#EFBF6A"
      topColor="#E8965B"
      text="Medical"
      iconColor="#F9E9DD"
    />
  );
}

export function TransportButton() {
  return (
    <GradientButton
      icon="Bus"
      bottomColor="#577590"
      topColor="#CDE6B9"
      text="Transport"
      iconColor="#BDD0E2"
    />
  );
}

export function OtherButton() {
  return (
    <GradientButton
      icon="CircleEllipsis"
      bottomColor="#A1A1A1"
      topColor="#A1A1A1"
      text="Other"
      iconColor="#E8E8E8"
    />
  );
}

export function LegalButton() {
  return (
    <GradientButton
      icon="Scale"
      bottomColor="#7E0601"
      topColor="#E8965B"
      text="Legal"
      iconColor="#D4928F"
    />
  );
}

export function CareerButton() {
  return (
    <GradientButton
      icon="BriefcaseBusiness"
      bottomColor="#90BE6D"
      topColor="#FFE078"
      text="Career"
      iconColor="#CDE6B9"
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
    <Pressable className="rounded-lg">
      <LinearGradient
        colors={[bottomColor, topColor]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={{
          flex: 1,
          width: 150,
          height: 150,
          borderRadius: 8,
          justifyContent: "flex-end",
        }}
      >
        <View className="flex flex-col items-start p-3 gap-3">
          <LucideIcon color={iconColor} strokeWidth={2.5} size={40} />
          <Text style={{ fontSize: 22 }} className="text-white-400">
            {text}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}
