import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
  Button,
  StyleSheet,
  Alert,
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
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              value={tweet}
              onChangeText={setTweet}
              placeholder="Write your tweet..."
              placeholderTextColor="#AAAAAA"
            />
            <Button title="Post Tweet" onPress={handleTweet} />
            <Button
              title="Cancel"
              onPress={() => setModalVisible(false)}
              color="#FF4D4F"
            />
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
    backgroundColor: "#31263E",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#FFFFFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#007BFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: "#007BFF",
    fontSize: 30,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#AAAAAA",
    marginBottom: 10,
    borderRadius: 5,
    padding: 10,
  },
});
