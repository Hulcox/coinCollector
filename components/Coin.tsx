import { CoinType } from "@/constants/Coin";
import Avatar from "./Avatar";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, useColorScheme } from "react-native";

const Coin = ({ coin, isInWallet }: { coin: CoinType; isInWallet: any }) => {
  const colorScheme = useColorScheme() ?? "light";

  const color = { light: "black", dark: "white" };

  return (
    <ThemedView style={styles.coinList}>
      <ThemedView style={styles.coinStyle}>
        {isInWallet && <ThemedText type="subtitle">{coin.amount} X</ThemedText>}
        <Avatar>
          <ThemedText type="defaultBold" style={{ color: "black" }}>
            {coin.shortName}
          </ThemedText>
        </Avatar>
        <ThemedView style={styles.coinNameStyle}>
          <ThemedText type="defaultBold">{coin.shortName}</ThemedText>
          <ThemedText style={{ fontStyle: "italic" }} darkColor="#333533">
            {coin.name}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={{ flexDirection: "column", alignItems: "flex-end" }}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText>{coin.values ? coin.values[0]?.price : "0"}</ThemedText>
          <FontAwesome size={15} name="dollar" color={color[colorScheme]} />
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
  );
};

const styles = StyleSheet.create({
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

export default Coin;
