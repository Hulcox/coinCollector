import { ThemedView } from "./ThemedView";
import { View, StyleSheet, useColorScheme } from "react-native";

const Avatar = ({ children }: { children: React.ReactNode }) => {
  return <View style={styles.avatar}>{children}</View>;
};

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: "#F5CB5C",
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Avatar;
