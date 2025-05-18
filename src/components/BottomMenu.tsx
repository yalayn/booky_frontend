
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Colors } from "../styles/AppStyles";

const BottomMenu = ({navigation, currentView}) => {
  
  const listViews = {
    "home":{
      icon      : "home",
      label     : "Inicio",
      navigateTo: "Home"
    },
    "library":{
      icon      : "book",
      label     : "Biblioteca",
      navigateTo: "Library"
    }, 
    "search":{
      icon      : "search",
      label     : "Agregar",
      navigateTo: "Search"
    }
  };
  return (
    <View style={StyleBottomMenu.bottomMenu}>
        {Object.entries(listViews).map(([key, { icon, label, navigateTo }]) => (
          <TouchableOpacity
            key={key}
            style={[StyleBottomMenu.menuButton, currentView === key && { backgroundColor: Colors.primary}]}
            onPress={() => navigation.navigate(navigateTo)}
          >
            <Text style={StyleBottomMenu.menuButtonText} > {label} </Text>
          </TouchableOpacity>
        ))}
      </View>
  )
}

const StyleBottomMenu = StyleSheet.create({
  bottomMenu: {
    position: "absolute",
    bottom: 24,
    left: 56,
    right: 56,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.darker,
    paddingVertical: 6,
    borderRadius: 20,
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