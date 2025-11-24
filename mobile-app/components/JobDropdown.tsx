import { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "@/colors";
import Accordion from "@/components/Accordion";

type JobDropdownProps = {
  text: string;
  ttsUrl?: string;
  children: ReactNode;
};

export default function JobDropdown({
  text,
  ttsUrl,
  children,
}: JobDropdownProps) {
  return (
    <Accordion text={text} ttsUrl={ttsUrl} backgroundColor={colors.white[400]}>
      <View style={styles.contentWrapper}>{children}</View>
    </Accordion>
  );
}

const styles = StyleSheet.create({
  contentWrapper: {
    width: "100%",
  },
});
