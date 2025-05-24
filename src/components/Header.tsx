import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "../styles/AppStyles";


const LogoutButton = ({ onLogout }) => {
    console.log("onLogout", onLogout);
    if (typeof onLogout === 'function') {
        return (
            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                <Text style={styles.logoutButtonText}>Salir</Text>
            </TouchableOpacity>
        );
    }
    return null;
};

/**
 * Encabezado de la aplicacion
 * @param param0 
 * @returns 
 */
const Header = ({title, subtitle, onLogout}) => {
    return (
        <View style={styles.header}>
            <View style={styles.subHeader}>
                <Text style={styles.headerTitle}>{title}</Text>
                <LogoutButton onLogout={onLogout} />
            </View>
            <Text style={styles.headerSubtitle}>{subtitle}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
  header: {
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  subHeader:{
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    marginTop: 26,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  headerSubtitle: {
    color: "#666",
    marginBottom: 8,
  },
  logoutButton: {
    marginTop: 0,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  logoutButtonText: {
    color: Colors.darker,
  },
});

{/* const styles = StyleSheet.create({
    header: {
    marginTop: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  subHeader:{
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  headerSubtitle: {
    color: "#666",
    marginBottom: 8,
  },
}); */}

export default Header;