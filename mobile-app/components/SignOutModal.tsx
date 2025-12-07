import React from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Text from "@/components/JilaText";
import { colors } from "@/colors";
import { sizes } from "@/constants/sizes";
import { wp } from "@/utils/responsive";

interface SignOutModalProps {
  visible: boolean;
  onCancel: () => void;
  onSignOut: () => void;
}

export default function SignOutModal({
  visible,
  onCancel,
  onSignOut,
}: SignOutModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable
          style={styles.modalContainer}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to sign out?
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.signOutButton}
                onPress={onSignOut}
              >
                <Text style={styles.signOutButtonText}>Sign out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: wp(80),
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: colors.white[400],
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 40,
    alignItems: "center",
    gap: 34,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#361818",
    textAlign: "center",
    lineHeight: 25,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 20,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.jila[400],
    backgroundColor: colors.white[400],
    alignItems: "center",
    justifyContent: "center",
    minHeight: 41,
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: "400",
    color: colors.black,
    lineHeight: 25,
  },
  signOutButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.jila[400],
    backgroundColor: colors.jila[400],
    alignItems: "center",
    justifyContent: "center",
    minHeight: 41,
  },
  signOutButtonText: {
    fontSize: 18,
    fontWeight: "400",
    color: colors.white[400],
    lineHeight: 25,
  },
});
