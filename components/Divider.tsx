import React from "react";
import { View, StyleSheet, useColorScheme } from "react-native";

const Divider = ({ type }: { type: "horizontal" | "vertical" }) => {
  const colorScheme = useColorScheme() ?? "light";

  const color = { light: "black", dark: "white" };

  return (
    <View
      style={[
        type === "horizontal" ? styles.horizontal : undefined,
        type === "vertical" ? styles.vertical : undefined,
        { backgroundColor: color[colorScheme] },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  vertical: {
    width: 1,
    height: "100%",
  },
  horizontal: {
    height: 1,
    width: "100%",
  },
});

export default Divider;
