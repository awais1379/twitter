import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTabNavigator from "../components/BottomTabNavigator";
import SettingsScreen from "../screens/SettingsScreen";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#31263E",
        },
        drawerActiveTintColor: "#FFFFFF",
        drawerInactiveTintColor: "#AAAAAA",
      }}
    >
      <Drawer.Screen name="Twitter" component={BottomTabNavigator} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}
