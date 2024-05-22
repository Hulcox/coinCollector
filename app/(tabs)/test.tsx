import ParallaxScrollView from "@/components/ParallaxScrollView";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { ThemedText } from "@/components/ThemedText";
import { Money } from "@/components/Money";
import { ThemedView } from "@/components/ThemedView";
import { FontAwesome } from "@expo/vector-icons";
import Divider from "@/components/Divider";

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
      headerBackgroundColor={{ light: "#CFDBD5", dark: "#333533" }}
      headerImage={
        <FontAwesome5 size={180} name="coins" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Liste des Coins</ThemedText>
        <Money />
      </ThemedView>
      {coins?.map((coin: { name: string; shortName: string }, key: any) => (
        <ThemedView style={styles.coinList} key={key}>
          <FontAwesome name="circle" size={10} color={"#F5CB5C"} />
          <ThemedText type="defaultSemiBold">{coin.shortName}</ThemedText>
          <Divider />
          <ThemedText type="defaultSemiBold">{coin.name}</ThemedText>
        </ThemedView>
      ))}
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    color: "#F5CB5C",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  coinList: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    color: "white",
  },
});

export default TestPage;
