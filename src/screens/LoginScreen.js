import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const db = getFirestore();

export default function LoginScreen({ navigation }) {
  const [input, setInput] = useState(""); // Can be email or username
  const [password, setPassword] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  const validateFields = () => {
    if (!input || !password || password.length < 6) {
      setValidationMessage(
        "Please enter a valid username/email and a password of at least 6 characters."
      );
      return false;
    }
    setValidationMessage(""); // Clear validation message
    return true;
  };

  const fetchEmailFromUsername = async (username) => {
    const q = query(
      collection(db, "users"),
      where("username", "==", username.trim())
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      throw new Error("No account found with this username.");
    }
    const userData = querySnapshot.docs[0].data();
    return userData.email; // Return the email associated with the username
  };

  const handleLogin = async () => {
    if (!validateFields()) return;

    let email = input.trim(); // Default to email

    // Check if input is a username (not an email)
    if (!/\S+@\S+\.\S+/.test(input)) {
      try {
        email = await fetchEmailFromUsername(input); // Convert username to email
      } catch (error) {
        setValidationMessage(error.message);
        return;
      }
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace("Main"); // Navigate to Main screen
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          setValidationMessage("The email address is badly formatted.");
          break;
        case "auth/user-not-found":
          setValidationMessage("No account found with this email/username.");
          break;
        case "auth/wrong-password":
          setValidationMessage("Incorrect password. Please try again.");
          break;
        default:
          setValidationMessage(error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Username or Email"
        value={input}
        onChangeText={setInput}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {validationMessage ? (
        <Text style={styles.validationMessage}>{validationMessage}</Text>
      ) : null}
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} color="#007BFF" />
      </View>
      <Text style={styles.link} onPress={() => navigation.navigate("Signup")}>
        Don't have an account? Sign up
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#31263E",
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "#FFFFFF",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#44355B",
    borderRadius: 5,
    color: "#FFFFFF",
  },
  validationMessage: {
    color: "#FF4D4F", // Error message in red
    marginVertical: 10,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 10,
  },
  link: {
    color: "#44355B",
    marginTop: 20,
    textAlign: "center",
  },
});
