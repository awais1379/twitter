import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeedScreen from "../screens/FeedScreen";
import SearchScreen from "../screens/SearchScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: "#31263E" },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#AAAAAA",
      }}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
