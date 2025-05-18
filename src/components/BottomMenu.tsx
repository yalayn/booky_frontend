
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Colors } from "../styles/AppStyles";

const BottomMenu = ({navigation, currentView}) => {
  const listViews_old = {
    "home":{
      "Library":{
        icon: "book",
        label: "Biblioteca",
        navigateTo: "Library"
      }, 
      "Search":{
        icon: "search",
        label: "Agregar",
        navigateTo: "Search"
      }
    },
    "library":{
      "Home":{
        icon: "home",
        label: "Inicio",
        navigateTo: "Home"
      },
      "Search":{
        icon: "search",
        label: "Agregar",
        navigateTo: "Search"
      }
    },
    "search":{
      "Home":{
        icon: "home",
        label: "Inicio",
        navigateTo: "Home"
      },
      "Library":{
        icon: "book",
        label: "Biblioteca",
        navigateTo: "Library"
      }
    },
  };

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
            {/* <Icon name={icon} size={24} color={Colors.lighter} /> */}
            <Text style={StyleBottomMenu.menuButtonText} > {label} </Text>
          </TouchableOpacity>
        ))}
      </View>
  )
}

const StyleBottomMenu = StyleSheet.create({
  bottomMenu: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.darker,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingVertical: 12,
  },
  menuButton: {
    alignItems: "center",
    backgroundColor: Colors.darker,
    borderRadius: 8,
    padding: 8,
  },
  menuButtonText: {
    color: Colors.lighter,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 4,
  }
});

export default BottomMenu;