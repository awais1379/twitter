import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";
import TweetCard from "../components/TweetCard";
import { auth } from "../firebase/firebaseConfig";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

const db = getFirestore();

export default function FeedScreen() {
  const [tweets, setTweets] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [tweet, setTweet] = useState("");

  useEffect(() => {
    const fetchTweets = () => {
      const q = query(collection(db, "tweets"), orderBy("timestamp", "desc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedTweets = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTweets(fetchedTweets);
      });

      return unsubscribe;
    };

    const unsubscribe = fetchTweets();
    return () => unsubscribe();
  }, []);

  const handleTweet = async () => {
    if (!tweet.trim()) {
      Alert.alert("Error", "Tweet cannot be empty.");
      return;
    }

    try {
      await addDoc(collection(db, "tweets"), {
        userId: auth.currentUser.uid,
        username: auth.currentUser.email,
        content: tweet.trim(),
        timestamp: serverTimestamp(),
      });
      setTweet("");
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to post tweet.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Tweets List */}
      <FlatList
        data={tweets}
        renderItem={({ item }) => (
          <TweetCard
            tweet={item}
            onTweetUpdated={() => {}}
            onTweetDeleted={() => {}}
          />
        )}
        keyExtractor={(item) => item.id}
      />

      {/* Add Tweet Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Add Tweet Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Write a Tweet</Text>
            <TextInput
              style={styles.input}
              value={tweet}
              onChangeText={setTweet}
              placeholder="What's happening?"
              placeholderTextColor="#AAAAAA"
              maxLength={160}
              multiline
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleTweet}>
              <Text style={styles.modalButtonText}>Post</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#1A1A1A", // Match dark grey theme
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#444444", // Dark grey button
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Semi-transparent background
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#000000",
    borderRadius: 5,
    padding: 10,
    color: "#FFFFFF",
    marginBottom: 10,
    textAlignVertical: "top",
    height: 100,
  },
  modalButton: {
    width: "100%",
    backgroundColor: "#444444",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#FF4D4F",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
