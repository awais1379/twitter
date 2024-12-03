import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
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
      <Text style={styles.title}>@{username}'s Tweets</Text>
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
    backgroundColor: "#31263E",
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "#FFFFFF",
    marginBottom: 20,
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
