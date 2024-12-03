import { createStackNavigator } from "@react-navigation/stack";
import SearchScreen from "../screens/SearchScreen";
import UserProfileScreen from "../screens/UserProfileScreen";

const Stack = createStackNavigator();

export default function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}
