import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import {
  firestore,
  auth,
  doc,
  getDoc,
  updateDoc,
} from "@/includes/FirebaseConfig";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { LinearGradient } from "expo-linear-gradient";

export default function EditProfile({ onback }: { onback: () => void }) {
  const [name, setName] = useState("");
  const [initialName, setInitialName] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.name || "");
          setInitialName(data.name || "");
        }
      } catch (error) {
        Alert.alert("Error", "Could not load profile info.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const reauthenticate = async () => {
    if (!user || !user.email) return;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
  };

  const handleSave = async () => {
    if (!user) return;

    if (!name.trim()) {
      Alert.alert("Invalid name", "Name cannot be empty.");
      return;
    }

    const wantsToChangePassword = password.length > 0;

    if (wantsToChangePassword && currentPassword.length < 6) {
      Alert.alert("Authentication Required", "Please enter your current password.");
      return;
    }

    setSaving(true);
    try {
      // Reauthenticate if password change is requested
      if (wantsToChangePassword) {
        try {
          await reauthenticate();
        } catch (err: any) {
          console.error("Reauthentication failed:", err);
          setSaving(false);
          Alert.alert("Authentication Failed", "Your current password is incorrect.");
          return;
        }
      }

      // Update name if changed
      if (name !== initialName) {
        await updateDoc(doc(firestore, "users", user.uid), { name });
      }

      // Update password
      if (wantsToChangePassword) {
        if (password.length < 6) {
          Alert.alert("Weak password", "Password must be at least 6 characters.");
          setSaving(false);
          return;
        }
        await updatePassword(user, password);
      }

      Alert.alert("✅ Success", "Profile updated successfully.");
      onback();
    } catch (error: any) {
      console.error("Update error:", error);
      Alert.alert("Error", error.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const showCurrentPassword = password.length > 0;

  return (
    <LinearGradient
      style={styles.container}
      colors={["#E5F4FC", "#B3DCF0", "#7FBDDE"]}
    >
      <SafeAreaView>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={onback}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Edit Profile</Text>

        {/* Name */}
        <Text style={styles.label}>Your Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

        {/* New Password */}
        <Text style={styles.label}>New Password (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Current Password (only if updating password) */}
        {showCurrentPassword && (
          <>
            <Text style={styles.label}>Current Password (required)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter current password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
            />
          </>
        )}

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="#fff" />
              <Text style={styles.saveText}>Save</Text>
            </>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    width: "100%",
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
    color: "#2A608F",
    marginBottom: 30,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    color: "#2A608F",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#1779AE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 30,
    gap: 8,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
