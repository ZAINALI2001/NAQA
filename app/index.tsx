import { Redirect } from "expo-router";
// import { SafeAreaView } from "react-native";
// import { Text } from "react-native";
// import { useAuth } from "@clerk/clerk-expo";
const Home = () => {
    return <Redirect href={"/(auth)/welcome"} />;
    // return <Redirect href={"/(auth)/sign-in"} />;
    // return <Redirect href={"/(root)/(tabs)/calc"} />;
    // return <Redirect href={"/(root)/(tabs)/home"} />;
};

export default Home;