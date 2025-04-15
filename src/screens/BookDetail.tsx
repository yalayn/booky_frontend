import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CardStyles } from "../styles/AppStyles";

// Card Component
const Card = ({ children, style }) => {
  return <View style={[CardStyles.card, style]}>{children}</View>;
};

const CardContent = ({ children }) => {
  return <View style={CardStyles.cardContent}>{children}</View>;
};

const BookDetail = ({ route }) => {
  const { book } = route.params;

  return (
    <View style={styles.container}>
      <Card style={CardStyles.cardSpacing}>
        <CardContent>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.bookDetail}>Autor: {book.author}</Text>
          <Text style={styles.bookDetail}>Descripción: {book.description || 'No disponible'}</Text>
        </CardContent>
      </Card>
      <Card style={CardStyles.cardSpacing}>
        <CardContent>
          <View style={styles.stateLabelContainer}>
            <Text style={styles.stateLabel}>{book.state || 'Estado desconocido'}</Text>
          </View>
          <Text style={styles.bookDetail}>Puntuación: {book.rating || 'No disponible'}</Text>
          <Text style={styles.bookDetail}>Reseña: {book.review || 'No disponible'}</Text>
        </CardContent>
      </Card>
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
  stateLabelContainer: {
    marginVertical: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#6200ee', // Primary color for the label
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stateLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default BookDetail;