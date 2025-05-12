import { useRouter } from "expo-router";
import {
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  I18nManager,
} from "react-native";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/includes/FirebaseConfig";
import { Feather } from "@expo/vector-icons";

// Optional: LTR mode
I18nManager.forceRTL(false);

const ForgetPass = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Success",
        "Password reset email has been sent. Please check your inbox."
      );
      router.back(); // Go back to login
    } catch (error: any) {
      let errorMessage = "Failed to send reset email.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with that email.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1 }}>
        <View style={{ height: 60 }} />
        <View style={{ paddingHorizontal: 24, paddingTop: 40 }}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
          <Text style={styles.title}>Reset your password</Text>

          <InputField
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            textAlign="left"
          />

          <CustomButton
            title="Reset Password"
            onPress={handleResetPassword}
            disabled={loading}
            className="mt-12"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send Reset Link</Text>
            )}
          </CustomButton>

          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backToLogin}
          >
            <Text style={styles.signupText}>← Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ForgetPass;

const styles = StyleSheet.create({
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
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 30,
    color: "#000",
    // marginTop: 60,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 16,
  },
  signupText: {
    color: "#1779AE",
    fontWeight: "bold",
    fontSize: 16,
  },
  backToLogin: {
    marginTop: 30,
    alignSelf: "center",
  },
});
