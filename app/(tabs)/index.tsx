import Avatar from "@/components/Avatar";
import Coin from "@/components/Coin";
import Divider from "@/components/Divider";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Money } from "@/components/icons/Money";
import { CoinType } from "@/constants/Coin";
import { Value } from "@/constants/Value";
import { db } from "@/firebaseConfig";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link } from "expo-router";
import { DocumentData, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";

const ListPage = () => {
  const [coins, setCoins] = useState<CoinType[]>([]);
  const [reload, setReload] = useState(true);
  const colorScheme = useColorScheme() ?? "light";

  const color = { light: "black", dark: "white" };

  const reloadPage = () => {
    setReload(true);
  };

  useEffect(() => {
    const request = async () => {
      const coinsSnapshot = await getDocs(collection(db, "coin"));
      const data = await Promise.all(
        coinsSnapshot.docs.map(async (coin) => {
          const values = await valueRequest(coin);
          return { id: coin.id, ...coin.data(), values };
        })
      );
      setCoins(data);
      setReload(false);
    };

    if (reload) {
      request();
    }
  }, [reload]);

  const valueRequest = async (coin: DocumentData): Promise<Value[]> => {
    const valuesSnapshot = await getDocs(collection(coin.ref, "value"));
    const values = valuesSnapshot.docs.map((value) => ({
      id: value.id,
      ...value.data(),
    }));

    return values.sort((a: any, b: any) => b.date.seconds - a.date.seconds);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#CFDBD5", dark: "#333533" }}
      headerImage={
        <FontAwesome5 size={180} name="coins" style={styles.headerImage} />
      }
    >
      <ThemedView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 40,
        }}
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Liste des Coins</ThemedText>
          <Money />
        </ThemedView>
        <Ionicons
          size={20}
          name="reload"
          color={color[colorScheme]}
          onPress={reloadPage}
        />
      </ThemedView>
      {coins?.map((coin, key: any) => (
        <ThemedView
          key={key}
          style={{
            flexDirection: "column",
            gap: 20,
          }}
        >
          <Coin coin={coin} isInWallet={false} />
          <Divider type="horizontal" />
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
    justifyContent: "space-between",
    color: "white",
    width: "100%",
  },
  coinStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  coinNameStyle: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
});

export default ListPage;
