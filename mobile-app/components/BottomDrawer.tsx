import React, { useState } from 'react';
import { Button, Animated, View, Modal, StyleSheet, Text } from "react-native";
import { colors } from "@/colors";
import { sizes } from "@/constants/sizes";

type BottomDrawerProps = {
  company: string;
  role: string;
  companyLocation: string;
  salary: number;
  workLocation: string;
  jobType: string;
  jobDescription: string;
}

export default function BottomDrawer({
  company,
  role,
  companyLocation,
  salary,
  workLocation,
  jobType,
  jobDescription
}: BottomDrawerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Button title="Open Job Bottom Drawer" onPress={() => setModalVisible(true)} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}

        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>

        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{company}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 35,
    alignItems: 'center',
    elevation: 15,
    width: '100%', 
    height: '70%'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
