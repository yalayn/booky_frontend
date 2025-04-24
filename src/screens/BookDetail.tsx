import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, Image } from 'react-native';
import { CardStyles, Colors, stylesBookCard } from "../styles/AppStyles";
import StylesModal from "../styles/StylesModal";
import { Card, CardContent } from "../components/Card";
import Icon from "react-native-vector-icons/FontAwesome";
import { updateStateBook, registerReviewBook } from '../api/bookService';
import Toast from 'react-native-toast-message';
import ReviewModal from '../components/ReviewModal';

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

const LabelState = ({ bookState, onStateChange }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const STATES_NAME = {
    'to_read': 'Pendiente',
    'reading': 'En curso',
    'read'   : 'Terminado',
  };

  const STATE_BG_COLOR = {
    'read': styles.bgReadLabel,
    'to_read': styles.bgToReadLabel,
    'reading': styles.bgReadingLabel,
  };

  const stateStyle      = STATE_BG_COLOR[bookState] || styles.bgReadLabel;
  const stateLabelStyle = [styles.stateLabelContainer, stateStyle];
  const stateName       = STATES_NAME[bookState] || 'Estado desconocido';

  const handleStateChange = (newState) => {
    setModalVisible(false);
    onStateChange(newState); // Llama a la función para cambiar el estado
  };

  return (
    <>
      {/* Label */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={stateLabelStyle}>
          <Text style={styles.stateLabel}>
            {stateName} <Icon name="caret-down" size={14} color="#fff" />
          </Text>
        </View>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={StylesModal.modalOverlay}>
          <View style={StylesModal.modalContent}>
            <TouchableOpacity style={StylesModal.modalCloseButtonIcon} onPress={() => setModalVisible(false)} >
              <Icon name="close" size={16} color="#fff" />
            </TouchableOpacity>
            <Text style={StylesModal.modalTitle}>Cambiar Estado</Text>
            {Object.entries(STATES_NAME).map(([key, label]) => {
              if(bookState !== key) {
                return (
                <TouchableOpacity
                  key={key}
                  style={StylesModal.modalOption}
                  onPress={() => handleStateChange(key)}
                >
                  <Text style={StylesModal.modalOptionText}>{label}</Text>
                </TouchableOpacity>
                );
              }
              return null;
            })}
          </View>
        </View>
      </Modal>
    </>
  );
};

const BookDetail = ({ route }) => {
  const { book } = route.params;

  const [bookState, setBookState] = useState(book.state);
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(book.rating || 1);
  const [review, setReview] = useState(book.review || '');

  const handleStateChange = (newState) => {
    updateStateBook({ book_id: book.book_id, new_state: newState })
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Estado actualizado',
          text2: 'El estado del libro se actualizó correctamente.',
        });
        setBookState(newState);
      })
      .catch((error) => {
        Toast.show({
          type : 'error',
          text1: 'Error',
          text2: 'No se pudo actualizar el estado del libro.',
        });
        console.error('Error al actualizar el estado del libro:', error);
      });
  };

  const handleReviewSubmit = (newRating, newReview) => {
    registerReviewBook({ book_id: book.book_id, rating: newRating, review_text: newReview })
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Reseña actualizada',
          text2: 'La reseña del libro se actualizó correctamente.',
        });
        setRating(newRating);
        setReview(newReview);
      })
      .catch((error) => {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No se pudo actualizar la reseña del libro.',
        });
        console.error('Error al actualizar la reseña del libro:', error);
      });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <LabelState bookState={bookState} onStateChange={handleStateChange}></LabelState>
        <Card style={CardStyles.cardSpacing}>
          <CardContent>
            <Text style={styles.title}>{book.title}</Text>
            <Image
                source={{ uri: book.cover_url || 'https://via.placeholder.com/150' }} // Fallback image
                style={stylesBookCard.bookCover}
              />
            <LabelGenre listGenre={book.genre}></LabelGenre>
            <Text style={[styles.bookMain, styles.subtitles]}>{book.author}</Text>
            {book.descriptions_short ? (
            <Text style={styles.bookMain}>{book.descriptions_short}</Text>
            ) : null}
          </CardContent>
        </Card>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Card style={CardStyles.cardSpacing}>
            <Text style={styles.iconEditReview}> <Icon name="edit" size={20} color={Colors.darker} /> </Text>
            <CardContent>
              <Text style={styles.bookReview}>Mi reseña:</Text>
              <Text style={[styles.bookReview, styles.italics]}>
                {Array.from({ length: rating }, (_, index) => (
                  <Icon key={index} name="star" size={16} color={Colors.star} />
                ))}
              </Text>
              <Text style={[styles.bookReview, styles.italics]}>"{review || 'No disponible'}"</Text>
            </CardContent>
          </Card>
        </TouchableOpacity>
        <ReviewModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={handleReviewSubmit}
          initialRating={rating}
          initialReview={review}
        />
        
        <Card style={CardStyles.cardSpacing}>
          <CardContent>
            <Text style={styles.title}>Detalles</Text>
            <Text style={styles.bookDetail}>
              <Text style={{ fontWeight: 'bold' }}>Autor: </Text> {book.author}
            </Text>
            <Text style={styles.bookDetail}>
              <Text style={{ fontWeight: 'bold' }}>Editorial: </Text> {book.editorial}
            </Text>
            <Text style={styles.bookDetail}>
              <Text style={{ fontWeight: 'bold' }}>Fecha de publicación: </Text> {book.publication_year}
            </Text>
            <Text style={[styles.bookDetail]}>
              <Text style={{ fontWeight: 'bold' }}>ISBN: </Text>{book.isbn}
            </Text>
            {book.descriptions_long ? (
            <Text style={styles.bookDetail}>{book.descriptions_long}</Text>
            ) : null}
          </CardContent>
        </Card>
      </View>
    </ScrollView>
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
  bookMain: {
    fontSize: 18,
    marginBottom: 8,
  },
  bookDetail: {
    fontSize: 14,
    marginBottom: 8,
  },
  bookReview: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
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
  },
  iconEditReview: {
    position: 'absolute',
    top: 8,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    }
});

export default BookDetail;