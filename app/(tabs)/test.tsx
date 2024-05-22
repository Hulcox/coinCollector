import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, Platform, StyleSheet } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { ThemedText } from "@/components/ThemedText";

const TestPage = () => {
  const [coins, setCoins] = useState<any>([]);

  useEffect(() => {
    const test = async () => {
      const querySnapshot = await getDocs(collection(db, "coin"));

      setCoins(
        querySnapshot.docs.map((coin) => {
          return { id: coin.id, ...coin.data() };
        })
      );
    };

    test();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons size={310} name="code-slash" style={styles.headerImage} />
      }
    >
      {coins?.map((coin: { name: string }, key: any) => (
        <ThemedText key={key}>{coin.name}</ThemedText>
      ))}
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});

export default TestPage;
