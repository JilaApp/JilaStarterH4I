import React, { ReactNode, useMemo } from "react";
import { View } from "react-native";
import Text from "./JilaText";
import { CircleDollarSign, MapPin } from "lucide-react-native";
import { colors } from "@/colors";

interface JobProps {
  title: string;
  company: string;
  location: string;
  salary: string;
}

export default function JobCard({
  title,
  company,
  location,
  salary,
}: JobProps) {
  return (
    <View
      style={{
        borderColor: colors.gray[200],
        borderRadius: 18,
        borderWidth: 1,
        padding: 15,
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: "600" }}>{title}</Text>
      <Text
        style={{
          color: colors.jila[400],
          fontWeight: "700",
          marginBottom: 4,
          fontSize: 16,
        }}
      >
        {company}
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 3,
        }}
      >
        <MapPin color={colors.gray[400]} />
        <Text style={{ color: colors.gray[400], fontSize: 16 }}>
          {location}
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 3,
        }}
      >
        <CircleDollarSign color={colors.gray[400]} />
        <Text style={{ color: colors.gray[400], fontSize: 16 }}>{salary}</Text>
      </View>
    </View>
  );
}
