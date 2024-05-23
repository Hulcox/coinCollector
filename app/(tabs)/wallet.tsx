import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Wallet } from "@/components/icons/WalletIcon";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { auth, db } from "@/firebaseConfig";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Link, router } from "expo-router";
import Divider from "@/components/Divider";
import { useEffect, useState } from "react";
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { CoinType } from "@/constants/Coin";
import Coin from "@/components/Coin";
import WalletProvider from "@/components/WalletProvider";

const WalletPage = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const authenticated = getAuth();

  const onSubmit = async (data: any) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      Alert.alert("Connexion authorisé !");
      router.replace("/wallet");
    } catch (err) {
      Alert.alert("Erreur !");
    }
  };

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
        <ThemedText type="title">Connexion</ThemedText>
        <ThemedView>
          <ThemedText>Email</ThemedText>
          <Controller
            control={control}
            name={"email"}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                placeholder="email"
                style={styles.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <ThemedText>Password</ThemedText>
          <Controller
            control={control}
            name={"password"}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                placeholder="password"
                style={styles.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                //secureTextEntry
              />
            )}
          />
          <Button title="Connexion" onPress={handleSubmit(onSubmit)} />
        </ThemedView>
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
        <Button title="Déconnexion" onPress={logOut} />
        <ThemedText type="title">
          Mon Portefeuille <Wallet />
        </ThemedText>
        <WalletProvider authenticated={authenticated} />
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
