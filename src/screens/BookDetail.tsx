import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BookDetail = ({ route }) => {
  const { book } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle del Libro</Text>
      <Text style={styles.bookDetail}>Título: {book.title}</Text>
      <Text style={styles.bookDetail}>Autor: {book.author}</Text>
      <Text style={styles.bookDetail}>Descripción: {book.description || 'No disponible'}</Text>
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
  bookDetail: {
    fontSize: 18,
    marginBottom: 8,
  },
});

export default BookDetail;