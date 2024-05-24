import Avatar from "@/components/Avatar";
import { Collapsible } from "@/components/Collapsible";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CoinType } from "@/constants/Coin";
import { db } from "@/firebaseConfig";
import { FontAwesome } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useLocalSearchParams } from "expo-router";
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function DetailsScreen() {
  const [coin, setCoin] = useState<CoinType>();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    const fetchCoin = async () => {
      const coinDoc = collection(db, "coin");
      const q = query(coinDoc, where(documentId(), "==", id));
      const querySnapshot = await getDocs(q);
      const coin = querySnapshot.docs[0];
      const values = await getDocs(collection(coin.ref, "value"));
      const data = {
        id: coin.id,
        ...coin.data(),
        values: values.docs.map((value) => ({ id: value.id, ...value.data() })),
      };
      data.values.sort((a: any, b: any) => a.date - b.date);
      setCoin(data);
    };

    fetchCoin();
  }, [id]);

  if (!coin) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#CFDBD5", dark: "#333533" }}
        headerImage={
          <FontAwesome5
            size={180}
            name="chart-bar"
            style={styles.headerImage}
          />
        }
      >
        <ThemedView
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <ThemedText>Loading ...</ThemedText>
        </ThemedView>
      </ParallaxScrollView>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#CFDBD5", dark: "#333533" }}
      headerImage={
        <FontAwesome5 size={180} name="chart-bar" style={styles.headerImage} />
      }
    >
      <ThemedView
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <ThemedView
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ThemedView style={{ flexDirection: "column", gap: 10 }}>
            <Text
              style={{
                fontSize: 50,
                fontWeight: "bold",
                color: "#F5CB5C",
                fontFamily: "SpaceMono",
              }}
            >
              {coin.shortName}
            </Text>
            <ThemedText darkColor="#777">{coin.name}</ThemedText>
          </ThemedView>
          <Avatar>
            <ThemedText type="defaultBold" style={{ color: "black" }}>
              {coin.shortName}
            </ThemedText>
          </Avatar>
        </ThemedView>
        <LineChart
          data={{
            labels:
              coin.values?.map((value) =>
                new Date(value.date.seconds * 1000).toLocaleDateString()
              ) ?? [],
            datasets: [
              {
                data: coin.values?.map((value) => value.price) ?? [],
                strokeWidth: 5,
              },
            ],
          }}
          width={Dimensions.get("window").width - 65}
          height={320}
          style={{ marginTop: 10 }}
          yAxisSuffix=" $"
          chartConfig={{
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(245, 203, 92, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            propsForLabels: {
              fontSize: 11,
              fontFamily: "sans-serif",
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          bezier
        />
        <Collapsible
          title={<ThemedText>Tableau des valeurs</ThemedText>}
          showArrow
        >
          <ThemedView
            style={{
              padding: 10,
            }}
          >
            {coin?.values?.map((value) => (
              <ThemedView
                key={value.id}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <ThemedText
                  style={{ opacity: 0.5, marginRight: 50, fontSize: 12 }}
                >
                  {new Date(value.date.seconds * 1000).toLocaleDateString()}
                </ThemedText>
                <ThemedText>
                  {value.price} <FontAwesome size={15} name="dollar" />
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </Collapsible>
        <Collapsible
          title={<ThemedText>Images de la monnaie</ThemedText>}
          showArrow
        ></Collapsible>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleStyle: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  headerImage: {
    color: "#F5CB5C",
    bottom: -50,
    left: -35,
    position: "absolute",
  },
});
