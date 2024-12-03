import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
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
      {/* Twitter Icon */}
      <Ionicons
        name="logo-twitter"
        size={100}
        color="#FFFFFF"
        style={styles.icon}
      />
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Username or Email"
        placeholderTextColor="#AAAAAA"
        value={input}
        onChangeText={setInput}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#AAAAAA"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {validationMessage ? (
        <Text style={styles.validationMessage}>{validationMessage}</Text>
      ) : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000", // Black background
    padding: 20,
  },
  icon: {
    marginBottom: 20, // Add spacing below the icon
  },
  title: {
    fontSize: 28,
    color: "#FFFFFF", // White title
    marginBottom: 30,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#1A1A1A", // Dark grey input background
    borderRadius: 8,
    color: "#FFFFFF", // White text
    fontSize: 16,
  },
  validationMessage: {
    color: "#FF4D4F", // Red for error messages
    marginVertical: 10,
    textAlign: "center",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#FFFFFF", // White button
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 20,
  },
  buttonText: {
    color: "#000000", // Black text for the button
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    color: "#AAAAAA", // Grey text for link
    fontSize: 14,
    marginTop: 10,
  },
});
