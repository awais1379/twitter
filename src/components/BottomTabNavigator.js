import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeedScreen from "../screens/FeedScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SearchStack from "../navigation/SearchStack";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: "#FFFFFF", // White background for tab bar
          borderTopWidth: 0,
        },
        tabBarShowLabel: false, // Remove icon names
        tabBarActiveTintColor: "#000000", // Black color for active icons
        tabBarInactiveTintColor: "#000000", // Black color for inactive icons
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Feed") {
            iconName = "home";
          } else if (route.name === "Search") {
            iconName = "search";
          } else if (route.name === "Profile") {
            iconName = "person";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
