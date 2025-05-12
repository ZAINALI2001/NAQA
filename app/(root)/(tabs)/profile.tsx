import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, firestore, doc, getDoc } from '@/includes/FirebaseConfig';
import { router } from 'expo-router';
import History from '@/components/History';
import Insights from '@/components/Insights';
import EditProfile from '@/components/edit-profile';
import AboutUs from '@/components/AboutUs';

const ProfilePage = () => {
  const user = auth.currentUser;
  const [showHistory, setShowHistory] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUserName = async () => {
    if (!user) return;
    try {
      const docRef = doc(firestore, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setName(userData.name || 'User');
      } else {
        setName('User');
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
      setName('User');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserName();
  }, []);

  if (showHistory) return <History onback={() => setShowHistory(false)} />;
  if (showInsights) return <Insights onback={() => setShowInsights(false)} />;
  if (showAboutUs) return <AboutUs onback={() => setShowAboutUs(false)}/>;
  if (showEditProfile) {
    return (
      <EditProfile
        onback={() => {
          setShowEditProfile(false);
          setLoading(true);
          setTimeout(() => {
            auth.currentUser?.reload();
            fetchUserName();
          }, 500);
        }}
      />
    );
  }

  if (!user) {
    return (
      <LinearGradient style={styles.container} colors={['#E5F4FC', '#B3DCF0', '#7FBDDE']}>
        <SafeAreaView style={styles.authContainer}>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => router.push('/(auth)/sign-in')}
          >
            <Ionicons name="log-in-outline" size={22} color="#2A608F" />
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient style={styles.container} colors={['#E5F4FC', '#B3DCF0', '#7FBDDE']}>
      <SafeAreaView style={styles.content}>
        <View style={styles.profileCard}>
          <Ionicons name="person-circle-outline" size={64} color="#1A73E8" />
          <Text style={styles.profileName}>
            {loading ? <ActivityIndicator color="#1A73E8" /> : name}
          </Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
        </View>

        <View style={styles.optionsCard}>
          {[
            { title: 'History', action: () => setShowHistory(true) },
            // { title: 'Insights', action: () => setShowInsights(true) },
            { title: 'Edit Profile', action: () => setShowEditProfile(true) },
            // { title: 'Settings', action: () => {} },
            { title: 'About Us', action: () => {setShowAboutUs(true)} },
          ].map((item, index, array) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionItem,
                index === array.length - 1 && { borderBottomWidth: 0 },
              ]}
              onPress={item.action}
            >
              <Text style={styles.optionText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#1A73E8" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            auth.signOut()
              .then(() => router.replace('/(root)/(tabs)/profile'))
              .catch((error) => console.error('Sign-out error:', error));
          }}
        >
          <Ionicons name="exit-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  content: { marginTop: 100, paddingHorizontal: 20 },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    borderRadius: 20,
    alignItems: 'center',
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  profileName: { fontSize: 22, fontWeight: 'bold', marginTop: 10, color: '#1A73E8' },
  profileEmail: { fontSize: 14, color: '#666', marginTop: 4 },
  optionsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 10,
  },
  optionItem: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    color: '#1A73E8',
  },
  logoutButton: {
    backgroundColor: '#B22222',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    flexDirection: 'row',
    gap: 10,
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  signInButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    elevation: 4,
    alignItems: 'center',
  },
  signInText: {
    color: '#2A608F',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});
