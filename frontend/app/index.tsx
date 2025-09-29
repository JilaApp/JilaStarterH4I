import { View, Text, StyleSheet, StatusBar } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello Jila!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // A default background color
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});