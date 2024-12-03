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

const db = getFirestore();

export default function TweetCard({ tweet, onTweetUpdated, onTweetDeleted }) {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(tweet.content);
  const [username, setUsername] = useState("Anonymous");

  const currentUser = auth.currentUser;

  // Fetch username from Firestore
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", tweet.userId));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username || "Anonymous");
        } else {
          console.warn(
            "User document does not exist for userId:",
            tweet.userId
          );
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
      onTweetDeleted(tweet.id); // Pass the tweet ID to the parent
      Alert.alert("Success", "Tweet deleted.");
    } catch (error) {
      console.error("Error deleting tweet:", error);
      Alert.alert("Error", "Failed to delete tweet.");
    }
  };

  const isUserTweet = tweet.userId === currentUser.uid;

  return (
    <View style={styles.tweetContainer}>
      <Text style={styles.tweetUsername}>@{username}</Text>
      <Text style={styles.tweetContent}>{tweet.content}</Text>
      <Text style={styles.tweetTimestamp}>
        {new Date(tweet.timestamp?.toDate()).toLocaleString()}
      </Text>

      {isUserTweet && (
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuVisible(true)}
        >
          <Text style={styles.menuButtonText}>...</Text>
        </TouchableOpacity>
      )}

      {/* Edit/Delete Modal */}
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
                <Button
                  title="Edit"
                  onPress={() => {
                    setIsEditing(true);
                  }}
                  color="#007BFF"
                />
                <Button
                  title="Delete"
                  onPress={handleDeleteTweet}
                  color="#FF4D4F"
                />
                <Button
                  title="Cancel"
                  onPress={() => setMenuVisible(false)}
                  color="#AAAAAA"
                />
              </>
            ) : (
              <>
                <TextInput
                  style={styles.input}
                  value={newContent}
                  onChangeText={setNewContent}
                  maxLength={160}
                  placeholder="Edit your tweet"
                />
                <Button
                  title="Update"
                  onPress={handleUpdateTweet}
                  color="#007BFF"
                />
                <Button
                  title="Cancel"
                  onPress={() => {
                    setIsEditing(false);
                    setMenuVisible(false);
                  }}
                  color="#FF4D4F"
                />
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
    backgroundColor: "#44355B",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    position: "relative",
  },
  tweetUsername: {
    color: "#007BFF",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 5,
  },
  tweetContent: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 10,
  },
  tweetTimestamp: {
    color: "#AAAAAA",
    fontSize: 12,
    textAlign: "right",
  },
  menuButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  menuButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
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
