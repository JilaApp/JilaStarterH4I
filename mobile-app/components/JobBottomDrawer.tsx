import React from 'react';
import { View, StyleSheet, Text } from "react-native";
import { colors } from "@/colors";
import { sizes } from "@/constants/sizes";
import * as Linking from 'expo-linking';
import { Button } from "@/components/Button";
import { CircleDollarSign, SquareArrowOutUpRight, MapPin, Clock } from "lucide-react-native";
import { BaseBottomSheet } from "@/components/BaseBottomSheet";

type JobBottomDrawerProps = {
  applyUrl: string;
  company: string;
  role: string;
  companyLocation: string;
  salary: string;
  workLocation: string;
  jobType: string;
  jobDescription: string;
}

export default function JobBottomDrawer({
  applyUrl,
  company,
  role,
  companyLocation,
  salary,
  workLocation,
  jobType,
  jobDescription
}: JobBottomDrawerProps) {
  const handlePress = () => {
    Linking.openURL(applyUrl);
  }

  return (
    <BaseBottomSheet
      height="70%"
      maxHeight={sizes.screen.height * 0.6}
    >
      <Text style={styles.company}>{company}</Text>
      <Text style={styles.title}>{role}</Text>
      <Text style={styles.location}>{companyLocation}</Text>
      <View style={styles.buttonContainer}>
        <Button
          text="Apply"
          onPress={handlePress}
          icon={SquareArrowOutUpRight}
          iconSize={sizes.icon.sm}
          customStyle={{ fontSize: sizes.fontSize.base }}
        />
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <CircleDollarSign size={sizes.icon.sm} color={colors.type[400]} />
          <Text style={styles.detailText}>{salary}</Text>
        </View>
        <View style={styles.detailRow}>
          <MapPin size={sizes.icon.sm} color={colors.type[400]} />
          <Text style={styles.detailText}>{workLocation}</Text>
        </View>
        <View style={styles.detailRow}>
          <Clock size={sizes.icon.sm} color={colors.type[400]} />
          <Text style={styles.detailText}>{jobType}</Text>
        </View>
      </View>
      <Text style={styles.jobDescription}>Job Description</Text>
      <Text style={styles.description}>{jobDescription}</Text>
    </BaseBottomSheet>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: sizes.fontSize.xl,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 4,
  },
  jobDescription: {
    fontSize: sizes.fontSize.xl,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 10,
  },
  company: {
    fontSize: sizes.fontSize.base,
    fontWeight: '400',
    color: colors.black,
    marginBottom: 4,
  },
  location: {
    fontSize: sizes.fontSize.base,
    fontWeight: '400',
    color: colors.black,
    marginBottom: 16,
  },
  buttonContainer: {
    marginBottom: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    width: 116,
    height: 60
  },
  detailsContainer: {
    marginBottom: 16,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: sizes.fontSize.base,
    color: colors.gray[400],
  },
  description: {
    fontSize: sizes.fontSize.base,
    fontWeight: '400',
    fontStyle: "normal", 
    color: colors.black,
  },
});
