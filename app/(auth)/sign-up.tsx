import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  View,
  Alert,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "@/includes/FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { Feather } from "@expo/vector-icons";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: user.email,
        createdAt: new Date().toISOString(),
      });

      router.push("../(root)/(tabs)/index");
    } catch (error: any) {
      let errorMessage = "Registration failed";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email is already in use.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.topSpace} />
        <View style={styles.content}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Create Account</Text>
          </View>
          <View style={styles.spacing} />

          <InputField
            label="Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            labelStyle={styles.label}
            placeholderStyle={styles.placeholder}
          />

          <InputField
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            style={styles.input}
            labelStyle={styles.label}
            placeholderStyle={styles.placeholder}
          />

          <InputField
            label="Password"
            secureTextEntry={true}
            textContentType="password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            labelStyle={styles.label}
            placeholderStyle={styles.placeholder}
          />

          <View style={styles.spacing} />

          <CustomButton
            title="Sign Up"
            onPress={handleSignup}
            disabled={loading}
            style={styles.signupButton}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </CustomButton>

          <Link href="/sign-in" style={styles.loginLink}>
            Already have an account?{" "}
            <Text style={styles.loginLinkText}>Log In</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: "#1779AE",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  topSpace: {
    height: 60,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  titleContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 30,
    color: "black",
    fontWeight: "bold",
    fontFamily: "JakartaSemiBold",
    textAlign: "left",
  },
  spacing: {
    paddingVertical: 16,
  },
  label: {
    textAlign: "left",
    marginBottom: 8,
    color: "black",
  },
  input: {
    textAlign: "left",
  },
  placeholder: {
    textAlign: "left",
  },
  signupButton: {
    marginTop: 24,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
  },
  loginLink: {
    fontSize: 16,
    textAlign: "center",
    color: "#777",
    marginTop: 40,
  },
  loginLinkText: {
    color: "#1779AE",
  },
});

export default SignUp;
