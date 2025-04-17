import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { AppStyles } from '../styles/AppStyles';

const SearchScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar</Text>
      <Text style={styles.subtitle}>Buscar libro</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Escribe el título o autor del libro"
      />
      <TouchableOpacity style={AppStyles.logButton}>
        <Text style={styles.searchButtonText}>Buscar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    paddingBottom: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  searchButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SearchScreen;