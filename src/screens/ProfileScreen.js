import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import TweetCard from "../components/TweetCard";
import { auth } from "../firebase/firebaseConfig";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const db = getFirestore();

export default function ProfileScreen() {
  const [userTweets, setUserTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserTweets = () => {
      const q = query(
        collection(db, "tweets"),
        where("userId", "==", auth.currentUser?.uid),
        orderBy("timestamp", "desc")
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetchedTweets = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserTweets(fetchedTweets);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching tweets:", error);
          setLoading(false);
        }
      );

      return unsubscribe;
    };

    if (auth.currentUser) {
      const unsubscribe = fetchUserTweets();
      return () => unsubscribe();
    }
  }, []);

  const handleTweetUpdated = (updatedTweet) => {
    setUserTweets((prevTweets) =>
      prevTweets.map((tweet) =>
        tweet.id === updatedTweet.id ? { ...tweet, ...updatedTweet } : tweet
      )
    );
  };

  const handleTweetDeleted = (deletedTweetId) => {
    setUserTweets((prevTweets) =>
      prevTweets.filter((tweet) => tweet.id !== deletedTweetId)
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {userTweets.length > 0 ? (
        <FlatList
          data={userTweets}
          renderItem={({ item }) => (
            <TweetCard
              tweet={item}
              onTweetUpdated={handleTweetUpdated}
              onTweetDeleted={() => handleTweetDeleted(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.noTweetsText}>
          You haven't posted any tweets yet.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#31263E",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  noTweetsText: {
    color: "#AAAAAA",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});
