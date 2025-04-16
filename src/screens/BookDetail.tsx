import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CardStyles, Colors } from "../styles/AppStyles";
import { Card, CardContent } from "../components/Card";
import { Subtitles } from 'lucide-react-native';

const LabelGenre = ({listGenre}) => {
    if (!listGenre || listGenre.length === 0) {
        return null; // No genres to display
    }
    return (
        <View style={styles.stateLabelContainer}>
            {listGenre.map((genre, index) => (
                <Text key={index} style={styles.stateLabel}>{genre}</Text>
            ))}
        </View>
    );
};

const LabelState = ({bookState}) => {
    const STATES_NAME = {
        'read'   : 'Leído',
        'to_read': 'Por leer',
        'reading': 'Leyendo'
    }
    const STATE_BG_COLOR = {
        'read'   : styles.bgReadLabel,
        'to_read': styles.bgToReadLabel,
        'reading': styles.bgReadingLabel
    }
    const stateStyle      = STATE_BG_COLOR[bookState] || styles.bgReadLabel;
    const stateLabelStyle = [styles.stateLabelContainer, stateStyle];
    const stateName       = STATES_NAME[bookState] || 'Estado desconocido';
    return (
      <View style={stateLabelStyle}>
        <Text style={styles.stateLabel}>{stateName}</Text>
      </View>
    );
};

const BookDetail = ({ route }) => {
  const { book } = route.params;
  console.log(book);
  return (
    <View style={styles.container}>
      <LabelState bookState={book.state}></LabelState>
      <Card style={CardStyles.cardSpacing}>
        <CardContent>
          <Text style={styles.title}>{book.title}</Text>
          <LabelGenre listGenre={book.genre}></LabelGenre>
          <Text style={[styles.bookDetail, styles.subtitles]}>{book.author}</Text>
          {book.descriptions_short ? (
          <Text style={styles.bookDetail}>{book.descriptions_short}</Text>
          ) : null}
        </CardContent>
      </Card>
      <Card style={CardStyles.cardSpacing}>
        <CardContent>
          <Text style={styles.bookDetail}>Puntuación: {book.rating}</Text>
          <Text style={styles.bookDetail}>Reseña: {book.review || 'No disponible'}</Text>
        </CardContent>
      </Card>
      <Card style={CardStyles.cardSpacing}>
        <CardContent>
          <Text style={styles.title}>Detalles</Text>
          <Text style={styles.bookDetail}>Autor: {book.author}</Text>
          <Text style={styles.bookDetail}>Editorial: {book.editorial}</Text>
          <Text style={styles.bookDetail}>Fecha de publicación: {book.publication_year}</Text>
          <Text style={[styles.bookDetail]}>ISBN: {book.isbn}</Text>
          {book.descriptions_long ? (
          <Text style={styles.bookDetail}>{book.descriptions_long}</Text>
          ) : null}
        </CardContent>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.container,
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
  subtitles: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  italics: {
    fontSize: 16,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  stateLabelContainer: {
    marginVertical: 8,
    alignSelf: 'flex-start',
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stateLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  descriptionLong: {
    marginTop: 8,
    fontSize: 16,
    marginBottom: 8,
    maxHeight: 100,
    overflow: 'hidden',
  },
  bgToReadLabel:{
    backgroundColor: Colors.state_toread,
  },
  bgReadLabel:{
    backgroundColor: Colors.state_read,
  },
  bgReadingLabel:{
    backgroundColor: Colors.state_reading,
  }
});

export default BookDetail;