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
import { LinearGradient } from "expo-linear-gradient";

export default function EditProfile({ onback }: { onback: () => void }) {
  const [name, setName] = useState("");
  const [initialName, setInitialName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserName = async () => {
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
    fetchUserName();
  }, []);

  const handleSave = async () => {
    if (!user) return;

    if (!name.trim()) {
      Alert.alert("Invalid name", "Name cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      if (name !== initialName) {
        await updateDoc(doc(firestore, "users", user.uid), { name });
      }

      Alert.alert("Success", "Profile updated successfully.");
      onback();
    } catch (error: any) {
      Alert.alert("Error", "Failed to update profile.");
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

        <Text style={styles.label}>Your Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

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
