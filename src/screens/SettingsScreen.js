import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { auth } from "../firebase/firebaseConfig";

export default function SettingsScreen({ navigation }) {
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login"); // Navigate back to login screen
      })
      .catch((error) => {
        console.error("Sign-out error:", error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.buttonContainer}>
        <Button title="Sign Out" onPress={handleSignOut} color="#FF4D4F" />
      </View>
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
  title: {
    fontSize: 24,
    color: "#FFFFFF",
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
