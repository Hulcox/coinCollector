import ParallaxScrollView from "@/components/ParallaxScrollView";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useEffect, useState } from "react";
import { Button, StyleSheet, useColorScheme } from "react-native";
import { collection, getDocs, DocumentData } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { ThemedText } from "@/components/ThemedText";
import { Money } from "@/components/Money";
import { ThemedView } from "@/components/ThemedView";
import Divider from "@/components/Divider";
import Avatar from "@/components/Avatar";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

type Coin = {
  id: string;
  [key: string]: any;
  values?: Value[];
};

type Value = {
  id: string;
  [key: string]: any;
};

const ListPage = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [reload, setReload] = useState(true);
  const colorScheme = useColorScheme() ?? "light";

  const color = { light: "black", dark: "white" };

  const reloadPage = () => {
    setReload(true);
  };

  const valueRequest = async (coin: DocumentData): Promise<Value[]> => {
    const valuesSnapshot = await getDocs(collection(coin.ref, "value"));
    const values = valuesSnapshot.docs.map((value) => ({
      id: value.id,
      ...value.data(),
    }));

    return values.sort((a: any, b: any) => b.date.seconds - a.date.seconds);
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

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#CFDBD5", dark: "#333533" }}
      headerImage={
        <FontAwesome5 size={180} name="coins" style={styles.headerImage} />
      }
    >
      <ThemedView
        style={{ flexDirection: "row", justifyContent: "space-between" }}
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
        <ThemedView key={key} style={{ flexDirection: "column", gap: 10 }}>
          <ThemedView style={styles.coinList}>
            <Link href={"/"}>
              <ThemedView style={styles.coinStyle}>
                <Avatar>
                  <ThemedText type="defaultBold" style={{ color: "black" }}>
                    {coin.shortName}
                  </ThemedText>
                </Avatar>
                <ThemedView style={styles.coinNameStyle}>
                  <ThemedText type="defaultBold">{coin.shortName}</ThemedText>
                  <ThemedText
                    style={{ fontStyle: "italic" }}
                    darkColor="#333533"
                  >
                    {coin.name}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </Link>
            <ThemedView
              style={{ flexDirection: "column", alignItems: "flex-end" }}
            >
              <ThemedView style={styles.titleContainer}>
                <ThemedText>
                  {coin.values ? coin.values[0]?.price : "0"}
                </ThemedText>
                <FontAwesome
                  size={15}
                  name="dollar"
                  color={color[colorScheme]}
                />
              </ThemedView>

              <ThemedText style={{ fontSize: 12 }}>
                {coin.values
                  ? new Date(
                      coin.values[0]?.date?.seconds * 1000
                    ).toLocaleDateString()
                  : "0"}
              </ThemedText>
            </ThemedView>
          </ThemedView>
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
