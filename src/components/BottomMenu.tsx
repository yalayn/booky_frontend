
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../styles/AppStyles";

const BottomMenu = ({ state, descriptors, navigation }) => (
  <View style={StyleBottomMenu.bottomMenu}>
    {state.routes.map((route, index) => {
      const { options } = descriptors[route.key];
      const label = options.tabBarLabel ?? options.title ?? route.name;
      const isFocused = state.index === index;

      return (
        <TouchableOpacity
          key={route.key}
          style={[StyleBottomMenu.menuButton, isFocused && { backgroundColor: Colors.darker }]}
          onPress={() => navigation.navigate(route.name)}
        >
          <Text style={StyleBottomMenu.menuButtonText}>{label}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const StyleBottomMenu = StyleSheet.create({
  bottomMenu: {
    position: "absolute",
    bottom: 24,
    left: 56,
    right: 56,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowRadius: 2,
    shadowOpacity: 0.4,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  menuButton: {
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  menuButtonText: {
    color: Colors.lighter,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 4,
  }
});

export default BottomMenu;