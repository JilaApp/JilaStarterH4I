import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import Text from "./JilaText";
import { CircleDollarSign, MapPin } from "lucide-react-native";
import { colors } from "@/colors";

interface JobProps {
  title: string;
  company: string;
  location: string;
  salary: string;
  onPress?: () => void;
}

export default function JobCard({
  title,
  company,
  location,
  salary,
  onPress,
}: JobProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.company}>{company}</Text>

      <View style={styles.row}>
        <MapPin color={colors.gray[400]} />
        <Text style={styles.subText}>{location}</Text>
      </View>

      <View style={styles.row}>
        <CircleDollarSign color={colors.gray[400]} />
        <Text style={styles.subText}>{salary}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderColor: colors.gray[200],
    borderRadius: 18,
    borderWidth: 1,
    padding: 15,
    backgroundColor: colors.white[400],
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
  },
  company: {
    color: colors.jila[400],
    fontWeight: "700",
    marginBottom: 4,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  subText: {
    color: colors.gray[400],
    fontSize: 16,
  },
});
