<<<<<<< HEAD
import { Money } from "@/components/icons/Money";
=======
import Avatar from "@/components/Avatar";
>>>>>>> 7005dc14394d1f8f5843e91706a93454c723f13e
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Coin } from "@/constants/Coin";
import { db } from "@/firebaseConfig"; // Assurez-vous que c'est le chemin correct vers votre configuration Firebase
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
import { Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function DetailsScreen() {
  const [coin, setCoin] = useState<Coin>();
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
          <ThemedText>Loading ...</ThemedText>{" "}
          {/* Remplacez 'name' par la propriété appropriée de votre objet 'coin' */}
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
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <ThemedView style={styles.titleStyle}>
            <ThemedText
              style={{
                fontSize: 40,
                fontWeight: "bold",
                color: "#F5CB5C",
                fontFamily: "SpaceMono",
              }}
            >
              {coin.shortName}
            </ThemedText>
            <Avatar>
              <ThemedText type="defaultBold" style={{ color: "black" }}>
                {coin.shortName}
              </ThemedText>
            </Avatar>
          </ThemedView>
        </ThemedView>
        <ThemedText type="defaultBold" style={{ color: "black" }}>
          {coin.name}
        </ThemedText>
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
          width={Dimensions.get("window").width} // from react-native
          height={320}
          style={{ marginTop: 100 }}
          yAxisSuffix=" $"
          chartConfig={{
            decimalPlaces: 1,
            backgroundGradientFrom: "rgba(255, 255, 255, 0)",
            backgroundGradientTo: "rgba(255, 255, 255, 0)",
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
        <ThemedView
          style={{
            padding: 10,
            backgroundColor: "rgba(245, 203, 92, 0.12)",
            borderRadius: 10,
          }}
        >
          {coin?.values?.map((value) => (
            <ThemedText
              style={{
                fontSize: 12,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
              }}
            >
              <span style={{ opacity: 0.5, marginRight: 50 }}>
                {new Date(value.date.seconds * 1000).toLocaleDateString()}
              </span>
              <span>{value.price} $</span>
            </ThemedText>
          ))}
        </ThemedView>
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
    bottom: -90,
    left: -35,
    position: "absolute",
  },
});
