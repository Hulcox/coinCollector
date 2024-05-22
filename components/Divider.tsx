import React from "react";
import { View, StyleSheet, useColorScheme } from "react-native";

const Divider = () => {
  const colorScheme = useColorScheme() ?? "light";

  const color = { light: "black", dark: "white" };

  return (
    <View style={{ ...styles.divider, backgroundColor: color[colorScheme] }} />
  );
};

const styles = StyleSheet.create({
  divider: {
    width: 1,
    height: "80%",
  },
});

export default Divider;
