import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
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

    const q = query(
      collection(db, "users"),
      where("username", "==", username.trim())
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      setValidationMessage("Username is already taken. Please choose another.");
      return false;
    }

    setValidationMessage("");
    return true;
  };

  const handleSignup = async () => {
    setValidationMessage("");
    setLoading(true);

    try {
      const isValid = await validateFields();
      if (!isValid) {
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;

      const userDoc = doc(db, "users", user.uid);
      await setDoc(userDoc, {
        userId: user.uid,
        username: username.trim(),
        email: email.trim(),
        createdAt: new Date(),
      });

      setLoading(false);
      Alert.alert("Success", "Your account has been created!");
      navigation.replace("Main");
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
      <Ionicons
        name="logo-twitter"
        size={100}
        color="#FFFFFF"
        style={styles.icon}
      />
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#AAAAAA"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
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
      <TextInput
        placeholder="Username"
        placeholderTextColor="#AAAAAA"
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
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.linkText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: "#FFFFFF",
    marginBottom: 30,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    color: "#FFFFFF",
    fontSize: 16,
  },
  validationMessage: {
    color: "#FF4D4F",
    marginVertical: 10,
    textAlign: "center",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 20,
  },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    color: "#AAAAAA",
    fontSize: 14,
    marginTop: 10,
  },
});
