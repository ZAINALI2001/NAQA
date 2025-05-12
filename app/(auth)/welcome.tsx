import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "@/components/CustomButton";

const Onboarding = () => {
//   const [activeIndex, setActiveIndex] = useState(0);

  return (
    <LinearGradient
      style={styles.container}
      colors={['#E5F4FC', '#7FBDDE', '#1779AE']}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Skip button */}
        {/* <TouchableOpacity
          onPress={() => router.replace("/(auth)/sign-up")}
          style={styles.skipButton}
        >
          <Text style={styles.skipText}>skip</Text>
        </TouchableOpacity> */}

        {/* Image */}
        <Image
          source={require("@/assets/images/onBoarding.png")} // Replace with your image path
          style={styles.image}
          resizeMode="contain"
        />

        {/* App title */}
        {/* <Text style={styles.title}>Naqa</Text> */}

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Tracks your air quality and carbon footprint - for a cleaner, smarter life.
        </Text>

        {/* Get Started button
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => router.replace("/(auth)/sign-up")}
        >
            <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity> */}
        
        <CustomButton style={styles.getStartedButton}
            title="Get Started"
            onPress={() => router.replace("/(root)/(tabs)/calc")}
            textVariant={"black"}
            // style={styles.signupButton}
            bgVariant={"white"}
            className="w-7/12 mt-10 mb-5"
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    marginBottom: 60,
  },
  skipButton: {
    width: "100%",
    alignItems: "flex-end",
    paddingTop: 10,
    paddingRight: 10,
  },
  skipText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
  },
  image: {
    width: 250,
    height: 250,
    marginTop: 100,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    paddingHorizontal: 10,
    marginBottom: 50,
  },
  getStartedButton: {
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 12,
    // marginBottom: 20,
    // width: 200,
  },
});
