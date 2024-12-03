import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { auth } from "../firebase/firebaseConfig";
import {
  getFirestore,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

const db = getFirestore();

export default function TweetCard({ tweet, onTweetUpdated, onTweetDeleted }) {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(tweet.content);
  const [username, setUsername] = useState("Anonymous");

  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", tweet.userId));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username || "Anonymous");
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    fetchUsername();
  }, [tweet.userId]);

  const handleUpdateTweet = async () => {
    if (!newContent.trim()) {
      Alert.alert("Error", "Tweet content cannot be empty.");
      return;
    }

    try {
      const tweetRef = doc(db, "tweets", tweet.id);
      await updateDoc(tweetRef, { content: newContent.trim() });

      // Pass the updated tweet data back to the parent
      onTweetUpdated({ ...tweet, content: newContent.trim() });

      setIsEditing(false);
      setMenuVisible(false);
      Alert.alert("Success", "Tweet updated.");
    } catch (error) {
      console.error("Error updating tweet:", error);
      Alert.alert("Error", "Failed to update tweet.");
    }
  };

  const handleDeleteTweet = async () => {
    try {
      const tweetRef = doc(db, "tweets", tweet.id);
      await deleteDoc(tweetRef);
      onTweetDeleted(tweet.id);
      Alert.alert("Success", "Tweet deleted.");
    } catch (error) {
      console.error("Error deleting tweet:", error);
      Alert.alert("Error", "Failed to delete tweet.");
    }
  };

  const isUserTweet = tweet.userId === currentUser.uid;

  return (
    <View style={styles.tweetContainer}>
      <View style={styles.header}>
        <Text style={styles.tweetUsername}>@{username}</Text>
        {isUserTweet && (
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Ionicons name="ellipsis-vertical" size={20} color="#AAAAAA" />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.tweetContent}>{tweet.content}</Text>
      <Text style={styles.tweetTimestamp}>
        {new Date(tweet.timestamp?.toDate()).toLocaleString()}
      </Text>

      <Modal
        transparent
        animationType="fade"
        visible={isMenuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {!isEditing ? (
              <>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setIsEditing(true)}
                >
                  <Text style={styles.modalButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.deleteButton]}
                  onPress={handleDeleteTweet}
                >
                  <Text style={styles.modalButtonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setMenuVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TextInput
                  style={styles.input}
                  value={newContent}
                  onChangeText={setNewContent}
                  maxLength={160}
                  placeholder="Edit your tweet"
                  placeholderTextColor="#AAAAAA"
                />
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleUpdateTweet}
                >
                  <Text style={styles.modalButtonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.deleteButton]}
                  onPress={() => {
                    setIsEditing(false);
                    setMenuVisible(false);
                  }}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  tweetContainer: {
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tweetUsername: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  tweetContent: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 10,
  },
  tweetTimestamp: {
    color: "#AAAAAA",
    fontSize: 12,
    marginTop: 5,
    textAlign: "right",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalButton: {
    backgroundColor: "#444444",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#FF4D4F",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#000000",
    borderRadius: 5,
    padding: 10,
    color: "#FFFFFF",
    marginBottom: 10,
  },
});
