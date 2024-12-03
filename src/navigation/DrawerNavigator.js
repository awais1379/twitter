import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, StyleSheet } from "react-native";
import BottomTabNavigator from "../components/BottomTabNavigator";
import SettingsScreen from "../screens/SettingsScreen";
import { Ionicons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();

function CustomHeader() {
  return (
    <View style={styles.headerContainer}>
      <Ionicons name="logo-twitter" size={30} color="#000000" />
    </View>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={({ route }) => ({
        drawerStyle: {
          backgroundColor: "#FFFFFF", // White background
        },
        drawerActiveTintColor: "#000000", // Black active text
        drawerInactiveTintColor: "#AAAAAA", // Grey inactive text
        headerTitle: () => <CustomHeader />, // Custom header with the Twitter logo
        headerTitleAlign: "center", // Center the title explicitly
        headerStyle: {
          backgroundColor: "#FFFFFF", // White background for header
          shadowOpacity: 0, // Remove shadow
          elevation: 0, // Remove elevation for Android
        },
        drawerIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Settings") {
            iconName = "settings-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Drawer.Screen name="Home" component={BottomTabNavigator} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center", // Center the logo horizontally
    alignItems: "center", // Center the logo vertically
    flex: 1,
  },
});
