import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebase/firebaseConfig";

export default function SettingsScreen({ navigation }) {
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => {
        console.error("Sign-out error:", error);
      });
  };

  const settingsOptions = [
    { id: 1, title: "Account", icon: "person-outline" },
    { id: 2, title: "Notifications", icon: "notifications-outline" },
    { id: 3, title: "Privacy", icon: "lock-closed-outline" },
    { id: 4, title: "Help & Support", icon: "help-circle-outline" },
    { id: 5, title: "Sign Out", icon: "exit-outline", onPress: handleSignOut },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.listContainer}>
        {settingsOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionContainer,
              option.title === "Sign Out" && styles.signOutOption,
            ]}
            onPress={option.onPress}
          >
            <Ionicons
              name={option.icon}
              size={24}
              color={option.title === "Sign Out" ? "#FF4D4F" : "#AAAAAA"}
              style={styles.icon}
            />
            <Text
              style={[
                styles.optionText,
                option.title === "Sign Out" && styles.signOutText,
              ]}
            >
              {option.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  listContainer: {
    marginTop: 20,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  icon: {
    marginRight: 15,
  },
  optionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  signOutOption: {
    backgroundColor: "#2A2A2A",
  },
  signOutText: {
    color: "#FF4D4F",
    fontWeight: "bold",
  },
});
