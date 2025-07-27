import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, Image } from 'react-native';
import { CardStyles, Colors } from "../styles/AppStyles";
import StylesModal from "../styles/StylesModal";
import { Card, CardContent } from "../components/Card";
import Icon from "react-native-vector-icons/FontAwesome";
import { updateStateBook, deleteBook } from '../api/bookService';
import { registerReviewBook } from '../api/reviewService';
import Toast from 'react-native-toast-message';
import ReviewModal from '../components/ReviewModal';
import { useNavigation } from '@react-navigation/native';

const TextDescriptionShort = ({text}) => {
  return (
    text ? (
      <Text style={styles.bookDescription}>{text}</Text>
    ) : null
  )
}

const LabelGenre = ({listGenre}) => {
    if (!listGenre || listGenre.length === 0) {
        return null; // No genres to display
    }
    return (
      <View>
      {listGenre.map((genre, index) => (
        <View key={index} style={styles.stateLabelContainer}>
            <Text key={index} style={styles.stateLabel}>{genre}</Text>
        </View>
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
  const stateName       = STATES_NAME[bookState] || 'Estado desconocido';

  const handleStateChange = (newState) => {
    setModalVisible(false);
    onStateChange(newState); // Llama a la función para cambiar el estado
  };

  return (
    <>
      {/* Label */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={[styles.bottonStateLabelContainer, stateStyle]}>
          <Text style={styles.bottoonStateLabel}>
            {stateName} <Icon name="caret-down" size={14} color={Colors.white} />
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
              <Icon name="close" size={16} color={Colors.white} />
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

const BottonDeleteUserBook = ({onDeleteBook}) => {

  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity onPress={() => setConfirmDeleteVisible(true)}>
        <View style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}><Icon name="trash" size={12} color={Colors.white}/> Quitar libro</Text>
        </View>
      </TouchableOpacity>

      <Modal
      animationType="slide"
      transparent={true}
      visible={confirmDeleteVisible}
      onRequestClose={() => setConfirmDeleteVisible(false)}
      >
      <View style={StylesModal.modalOverlay}>
        <View style={StylesModal.modalContent}>
          <Text style={StylesModal.modalTitle}>Confirmar accion.</Text>
          <Text style={StylesModal.modalMessage}>¿Estás seguro de que deseas eliminar este libro?</Text>
          <Text style={StylesModal.modalMessage}>Esta acción no se puede deshacer.</Text>
          <View style={StylesModal.modalButtonContainer}>
            <TouchableOpacity
              style={[StylesModal.modalButton, StylesModal.modalCancelButton]}
              onPress={() => setConfirmDeleteVisible(false)}
            >
              <Text style={StylesModal.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[StylesModal.modalButton, StylesModal.modalConfirmButton]}
              onPress={() => {
                setConfirmDeleteVisible(false);
                onDeleteBook();
              }}
            >
              <Text style={StylesModal.modalButtonText}>Quitar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </Modal>
    </View>
  )
}


const BookDetail = ({ route }) => {
  const { book } = route.params;

  const [bookState, setBookState] = useState(book.state);
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(book.rating || 1);
  const [review, setReview] = useState(book.review || '');

  const navigation = useNavigation();

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

  const handleDeleteBook = () => {
    console.log('Eliminando libro con ID:', book.book_id);
    deleteBook({ book_id: book.book_id })
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Libro eliminado',
          text2: 'El libro se eliminó correctamente.',
        });
        navigation.navigate('Library'); // Redirige a LibraryScreen
      })
      .catch((error) => {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No se pudo eliminar el libro.',
        });
        console.error('Error al eliminar el libro:', error);
      });
  }

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
      {/* Botón para regresar */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="close" size={20} color={Colors.white} />
      </TouchableOpacity>

      {/* Label de estado */}
      <LabelState bookState={bookState} onStateChange={handleStateChange} />

      {/* Card principal */}
      <View style={styles.bookSetionMain}>
        <View style={styles.bookSetionMainContainer}>
          <View style={styles.bookCoverContainer}>
            <Image
              source={{ uri: book.cover_url || 'https://via.placeholder.com/150' }} // Fallback image
              style={styles.bookCover}
            />
          </View>
          <View style={styles.bookDetailsContainer}>
              <Text style={styles.bookTitle}>{book.title}</Text>
              <Text style={styles.bookSubtitle}>{book.author}</Text>
              <LabelGenre listGenre={book.genre}></LabelGenre>
              <TextDescriptionShort text={book.descriptions_short}></TextDescriptionShort> 
          </View>
        </View>
      </View>

      {/* Card reseña */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Card style={CardStyles.cardSpacing}>
          <Text style={styles.iconEditReview}> <Icon name="edit" size={20} color={Colors.white} /> </Text>
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
      
      {/* Card detalles */}
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
      
      {/* Botón para eliminar el libro */}
      <BottonDeleteUserBook onDeleteBook={handleDeleteBook}/>

    </View>


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.darker,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.white,
  },
  bookSetionMain: {
    marginBottom: 16,
    backgroundColor: Colors.darker,
    borderRadius: 12,
    padding: 16,
  },
  bookSetionMainContainer: {
    alignItems: 'center',
  },
  bookDetailsContainer: {
    flex: 1,
    textAlign: 'center',
  },
  bookDetail: {
    fontSize: 14,
    marginBottom: 8,
    color: Colors.white,
  },
  bookReview: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    color: Colors.white,
  },
  subtitles: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.white,
  },
  italics: {
    fontSize: 16,
    marginBottom: 8,
    fontStyle: 'italic',
    color: Colors.white,
  },
  bottonStateLabelContainer: {
    marginVertical: 8,
    alignSelf: 'center',
    backgroundColor: Colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  bottoonStateLabel: {
    color: Colors.lighter,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stateLabelContainer: {
    marginVertical: 2,
    alignSelf: 'center',
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  stateLabel: {
    color: Colors.lighter,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
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
  },
  bookCoverContainer: {
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
  },
  bookCover: {
      width: 240,
      height: 360,
      borderRadius: 12,
      borderColor: '#ccc',
      shadowColor: '#000',
      backgroundColor: '#e0e0e0',
      marginBottom: 20,
  },
  bookTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 4,
      color: Colors.white,
      textAlign: 'center',
  },
  bookSubtitle: {
      fontSize: 14,
      marginBottom: 1,
      color: Colors.white,
      textAlign: 'center',
  },
  bookDescription: {
      fontSize: 13,
      marginBottom: 8,
      color: Colors.white,
      textAlign: 'center',
  },
  deleteButton: {
      marginVertical: 8,
      alignSelf: 'center',
      backgroundColor: Colors.red,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: 'center',
  },
  deleteButtonText: {
      color: Colors.lighter,
      fontSize: 12,
      fontWeight: 'bold',
  },
  backButton: {
    flexDirection: 'row',
    marginBottom: 4,
    marginTop: 50,
    marginEnd: 16,
    // alignSelf: 'flex-end',

    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 16,
    marginLeft: 8,
  },
});

export default BookDetail;