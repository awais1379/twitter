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
          backgroundColor: "#FFFFFF",
        },
        drawerActiveTintColor: "#000000",
        drawerInactiveTintColor: "#AAAAAA",
        headerTitle: () => <CustomHeader />,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#FFFFFF",
          shadowOpacity: 0,
          elevation: 0,
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
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
