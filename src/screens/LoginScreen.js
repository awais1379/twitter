import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  const validateFields = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setValidationMessage("Please enter a valid email address.");
      return false;
    }
    if (!password || password.length < 6) {
      setValidationMessage("Password must be at least 6 characters.");
      return false;
    }
    setValidationMessage(""); // Clear validation message
    return true;
  };

  const handleLogin = async () => {
    if (!validateFields()) return;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace("Main"); // Navigate to Main screen
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          setValidationMessage("The email address is badly formatted.");
          break;
        case "auth/user-not-found":
          setValidationMessage("No account found with this email.");
          break;
        case "auth/invalid-credential":
          setValidationMessage("No account found with this email.");
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
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
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