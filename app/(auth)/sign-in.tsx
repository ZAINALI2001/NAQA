import { Link, useRouter } from "expo-router";
import {
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  I18nManager,
  SafeAreaView,
} from "react-native";
import InputField from "@/components/InputField";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/includes/FirebaseConfig";
import { useState, useEffect } from "react";
import CustomButton from "@/components/CustomButton";
import { Feather } from "@expo/vector-icons";

// Enforce LTR layout
I18nManager.forceRTL(false);

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/(root)/(tabs)/profile");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      let errorMessage = "Login failed";
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        errorMessage = "Incorrect email or password.";
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FCFF" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Sign in to your account</Text>

        <InputField
          label="Email"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          textAlign="left"
        />

        <InputField
          label="Password"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textAlign="left"
        />

        <TouchableOpacity
          onPress={() => router.push("/(auth)/forgetPass")}
          style={{ alignSelf: "flex-start", marginTop: 10 }}
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <CustomButton
          title="Sign In"
          onPress={handleLogin}
          disabled={loading}
          className="w-full mt-10"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </CustomButton>

        <Link href="/(auth)/sign-up" style={styles.signupLink}>
          <Text>
            Don't have an account?{" "}
            <Text style={styles.signupText}>Create a new account</Text>
          </Text>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 40,
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
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 30,
  },
  forgotText: {
    fontSize: 14,
    color: "#1779AE",
    textAlign: "left",
    marginBottom: 20,
    fontWeight: "bold",
  },
  buttonText: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 16,
  },
  signupLink: {
    marginTop: 40,
    alignSelf: "center",
  },
  signupText: {
    color: "#1779AE",
    fontWeight: "bold",
  },
});
