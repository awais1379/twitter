import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { auth } from "./src/firebase/firebaseConfig";
import AuthStack from "./src/navigation/AuthStack";
import DrawerNavigator from "./src/navigation/DrawerNavigator";

export default function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      {user ? <DrawerNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}
