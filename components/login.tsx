import { Alert, Button, StyleSheet, TextInput } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Controller, useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { router } from "expo-router";

const Login = ({ setReload }: { setReload: any }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      Alert.alert("Connexion réussie !");
      router.replace("/wallet");
      setReload(true);
    } catch (err) {
      Alert.alert("Erreur !");
    }
  };
  return (
    <>
      <ThemedText type="title">Connexion</ThemedText>
      <ThemedView>
        <ThemedText>Email</ThemedText>
        <Controller
          control={control}
          name={"email"}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
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
              style={styles.input}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              //secureTextEntry
            />
          )}
        />
        <Button
          title="Connexion"
          onPress={handleSubmit(onSubmit)}
          color={"#F5CB5C"}
        />
      </ThemedView>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    padding: 10,
    color: "white",
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
});

export default Login;
