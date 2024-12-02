import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "../components/BottomTabNavigator";

const Stack = createStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
