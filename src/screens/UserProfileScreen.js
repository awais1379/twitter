import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import TweetCard from "../components/TweetCard";

const db = getFirestore();

export default function UserProfileScreen({ route }) {
  const { userId, username } = route.params;
  const [userTweets, setUserTweets] = useState([]);

  useEffect(() => {
    const fetchUserTweets = () => {
      const tweetsRef = collection(db, "tweets");
      const q = query(
        tweetsRef,
        where("userId", "==", userId),
        orderBy("timestamp", "desc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserTweets(tweets);
      });

      return unsubscribe;
    };

    const unsubscribe = fetchUserTweets();
    return () => unsubscribe();
  }, [userId]);

  const renderTweet = ({ item }) => <TweetCard tweet={item} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle" size={50} color="#FFFFFF" />
        <Text style={styles.title}>@{username}'s Tweets</Text>
      </View>
      {userTweets.length > 0 ? (
        <FlatList
          data={userTweets}
          renderItem={renderTweet}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.noTweetsText}>This user has no tweets yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: "#FFFFFF",
    marginTop: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  list: {
    paddingBottom: 20,
  },
  noTweetsText: {
    color: "#AAAAAA",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});
