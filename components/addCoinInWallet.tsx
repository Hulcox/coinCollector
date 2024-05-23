import { Controller, useForm } from "react-hook-form";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Alert, Button, StyleSheet, TextInput } from "react-native";
import Divider from "./Divider";
import { router } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";

const AddCoinInWallet = ({
  authenticated,
  setReload,
}: {
  authenticated: any;
  setReload: any;
}) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      coinName: "",
      amount: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const q = query(
        collection(db, "wallet"),
        where("userId", "==", authenticated.currentUser?.uid)
      );
      const walletDocRef = await getDocs(q);
      const myCoinsCollectionRef = collection(
        walletDocRef.docs[0].ref,
        "myCoins"
      );

      await setDoc(doc(myCoinsCollectionRef), {
        coinId: data.coinName,
        amount: Number(data.amount),
      });

      setReload(true);

      Alert.alert("Monnaies ajouter !");
    } catch (err) {
      Alert.alert("Erreur !");
    }
  };

  return (
    <>
      <ThemedView style={{ marginVertical: 10 }}>
        <ThemedText>Nom de la monnaies</ThemedText>
        <Controller
          control={control}
          name={"coinName"}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              placeholder="Nom"
              style={styles.input}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        <ThemedText>Nom de la monnaies</ThemedText>
        <Controller
          control={control}
          name={"amount"}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              placeholder="montant"
              style={styles.input}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        <Button
          title="Ajouter"
          onPress={handleSubmit(onSubmit)}
          color={"#F5CB5C"}
        />
      </ThemedView>
      <Divider type="horizontal" />
    </>
  );
};
const styles = StyleSheet.create({
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

export default AddCoinInWallet;
