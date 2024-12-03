import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";

const db = getFirestore();

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateFields = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setValidationMessage("Please enter a valid email address.");
      return false;
    }
    if (!password || password.length < 6) {
      setValidationMessage("Password must be at least 6 characters.");
      return false;
    }
    if (!username || username.length < 3) {
      setValidationMessage("Username must be at least 3 characters.");
      return false;
    }

    // Check username uniqueness
    const q = query(
      collection(db, "users"),
      where("username", "==", username.trim())
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      setValidationMessage("Username is already taken. Please choose another.");
      return false;
    }

    setValidationMessage(""); // Clear validation message
    return true;
  };

  const handleSignup = async () => {
    setValidationMessage(""); // Clear previous messages
    setLoading(true);

    try {
      const isValid = await validateFields();
      if (!isValid) {
        setLoading(false);
        return;
      }

      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;

      // Add user to Firestore
      const userDoc = doc(db, "users", user.uid); // Use UID as document ID for easy lookups
      await setDoc(userDoc, {
        userId: user.uid,
        username: username.trim(),
        email: email.trim(),
        createdAt: new Date(), // Optional: Store account creation timestamp
      });

      setLoading(false);
      Alert.alert("Success", "Your account has been created!");
      navigation.replace("Main"); // Navigate to Main screen
    } catch (error) {
      setLoading(false);
      switch (error.code) {
        case "auth/email-already-in-use":
          setValidationMessage("This email is already in use.");
          break;
        case "auth/invalid-email":
          setValidationMessage("The email address is badly formatted.");
          break;
        case "auth/weak-password":
          setValidationMessage("Password should be at least 6 characters.");
          break;
        default:
          setValidationMessage(error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
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
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      {validationMessage ? (
        <Text style={styles.validationMessage}>{validationMessage}</Text>
      ) : null}
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <View style={styles.buttonContainer}>
          <Button title="Sign Up" onPress={handleSignup} color="#007BFF" />
        </View>
      )}
      <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
        Already have an account? Log in
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
