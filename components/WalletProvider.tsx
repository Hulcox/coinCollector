import { FontAwesome } from "@expo/vector-icons";
import { ThemedView } from "./ThemedView";
import Divider from "./Divider";
import { ThemedText } from "./ThemedText";
import { Link } from "expo-router";
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useEffect, useState } from "react";
import { Text, useColorScheme } from "react-native";
import Coin from "./Coin";

const WalletProvider = ({
  authenticated,
  reload,
  setReload,
}: {
  authenticated: any;
  reload: any;
  setReload: any;
}) => {
  const [coins, setCoins] = useState<any[]>([]);
  const [amount, setAmount] = useState<number>(0);

  const colorScheme = useColorScheme() ?? "light";

  const color = { light: "black", dark: "white" };

  useEffect(() => {
    if (reload) {
      requestWallet();
    }
  }, [reload]);

  const requestWallet = async () => {
    try {
      const walletCollection = collection(db, "wallet");
      const q = query(
        walletCollection,
        where("userId", "==", authenticated.currentUser?.uid)
      );
      const walletSnapshot = await getDocs(q);
      if (walletSnapshot.empty) {
        console.log("No wallet found");
        return;
      }
      const wallet = walletSnapshot.docs[0].ref;

      const coinInWalletSnapshot = await getDocs(collection(wallet, "myCoins"));
      const coinInWallet = coinInWalletSnapshot.docs;

      const data = await Promise.all(
        coinInWallet.map(async (coin: any) => {
          const coinData = await requestCoins(coin.data());
          return { amount: coin.data().amount, ...coinData };
        })
      );
      setCoins(data);
      setReload(false);

      const totalAmount = data.reduce((acc: number, coin: any) => {
        return acc + coin.amount * coin.values[0].price;
      }, 0);

      setAmount(totalAmount);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    }
  };

  const requestCoins = async (coin: any) => {
    const collec = collection(db, "coin");
    const q = query(collec, where(documentId(), "==", coin.coinId));
    const coinSnapshot = await getDocs(q);
    if (coinSnapshot.empty) {
      console.log("No coin found");
      return;
    }
    const coinRef = coinSnapshot.docs[0];
    const valueSnapshot = await getDocs(collection(coinRef.ref, "value"));
    return {
      id: coinRef.id,
      ...coinRef.data(),
      values: valueSnapshot.docs
        .map((value) => value.data())
        .sort((a: any, b: any) => b.date.seconds - a.date.seconds),
    };
  };

  return (
    <ThemedView>
      <ThemedView
        style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}
      >
        <Text style={{ fontSize: 100, color: color[colorScheme] }}>
          {amount}
        </Text>
        <FontAwesome size={30} name="dollar" color={color[colorScheme]} />
      </ThemedView>
      <Divider type="horizontal" />
      <ThemedView>
        <ThemedText type="subtitle" style={{ marginVertical: 12 }}>
          Mes monnaies :{" "}
        </ThemedText>
        {coins?.map((coin, key: any) => (
          <ThemedView key={key} style={{ flexDirection: "column", gap: 10 }}>
            <Link
              style={{ width: "100%" }}
              href={{
                pathname: "/coinDetail/[coinId]",
                params: { id: coin.id },
              }}
            >
              <Coin coin={coin} isInWallet={true} />
            </Link>
            <Divider type="horizontal" />
          </ThemedView>
        ))}
      </ThemedView>
    </ThemedView>
  );
};

export default WalletProvider;
