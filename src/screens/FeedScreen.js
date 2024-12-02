import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function FeedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Feed Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#31263E",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 18,
  },
});
