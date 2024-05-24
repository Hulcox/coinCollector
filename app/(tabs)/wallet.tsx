import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Wallet } from "@/components/icons/WalletIcon";
import { FontAwesome5 } from "@expo/vector-icons";
import { Button, StyleSheet } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { router } from "expo-router";
import WalletProvider from "@/components/WalletProvider";
import { Collapsible } from "@/components/Collapsible";
import AddCoinInWallet from "@/components/addCoinInWallet";
import Login from "@/components/login";
import { useState } from "react";

const WalletPage = () => {
  const authenticated = getAuth();
  const [reload, setReload] = useState(true);

  const logOut = () => {
    signOut(authenticated).then(() => {
      router.replace("/wallet");
    });
  };

  if (!authenticated.currentUser) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#CFDBD5", dark: "#333533" }}
        headerImage={
          <FontAwesome5 size={150} name="wallet" style={styles.headerImage} />
        }
      >
        <Login setReload={setReload} />
      </ParallaxScrollView>
    );
  } else {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#CFDBD5", dark: "#333533" }}
        headerImage={
          <FontAwesome5 size={150} name="wallet" style={styles.headerImage} />
        }
      >
        <Button title="Déconnexion" onPress={logOut} color={"#F5CB5C"} />
        <ThemedText type="title">
          Mon Portefeuille <Wallet />
        </ThemedText>
        <Collapsible
          title={
            <ThemedText style={{ flexDirection: "row", alignItems: "center" }}>
              Ajouter une monnaies <FontAwesome5 size={15} name="plus" />
            </ThemedText>
          }
        >
          <AddCoinInWallet
            authenticated={authenticated}
            setReload={setReload}
          />
        </Collapsible>
        <WalletProvider
          authenticated={authenticated}
          reload={reload}
          setReload={setReload}
        />
      </ParallaxScrollView>
    );
  }
};

const styles = StyleSheet.create({
  headerImage: {
    color: "#F5CB5C",
    bottom: -50,
    left: 20,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    color: "white",
    borderColor: "#F5CB5C",
    borderRadius: 10,
    backgroundColor: "#715E2E",
  },
});

export default WalletPage;
