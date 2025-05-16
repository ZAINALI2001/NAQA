import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { auth } from "@/includes/FirebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { View, ActivityIndicator } from "react-native";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up on unmount
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1779AE" />
      </View>
    );
  }

  return user ? (
    <Redirect href="/(root)/(tabs)/calc" />
  ) : (
    <Redirect href="/(auth)/welcome" />
  );
};

export default Home;
