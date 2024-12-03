import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

const db = getFirestore();

export default function SearchScreen({ navigation }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestedUsers([]);
      return;
    }

    const fetchSuggestions = () => {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("username", ">=", searchTerm),
        where("username", "<=", searchTerm + "\uf8ff")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const users = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSuggestedUsers(users);
      });

      return unsubscribe;
    };

    const unsubscribe = fetchSuggestions();
    return () => unsubscribe();
  }, [searchTerm]);

  const renderUser = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() =>
        navigation.navigate("UserProfile", {
          userId: item.id,
          username: item.username,
        })
      }
    >
      <Text style={styles.username}>@{item.username}</Text>
      <Text style={styles.email}>{item.email}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for a username..."
        placeholderTextColor="#AAAAAA"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      {suggestedUsers.length > 0 ? (
        <FlatList
          data={suggestedUsers}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      ) : (
        searchTerm.trim() && (
          <Text style={styles.noResultsText}>No users found.</Text>
        )
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
  searchBar: {
    width: "100%",
    padding: 10,
    backgroundColor: "#44355B",
    borderRadius: 5,
    color: "#FFFFFF",
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  userItem: {
    backgroundColor: "#44355B",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  username: {
    color: "#007BFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  email: {
    color: "#AAAAAA",
    fontSize: 14,
  },
  noResultsText: {
    color: "#AAAAAA",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});
