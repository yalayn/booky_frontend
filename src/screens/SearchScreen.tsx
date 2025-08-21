import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal, Alert, Image, ActivityIndicator } from 'react-native';
import StylesModal from '../styles/StylesModal';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Colors } from '../styles/AppStyles';
import { searchBook, addBook } from '../api/bookService';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';


const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const cancelTokenRef = useRef<any>(null);

  const fetchBooks = async (query: string) => {

    if (query.trim() === '') {
      setFilteredBooks([]);
      return;
    }

    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel('Nueva búsqueda iniciada');
    }
    cancelTokenRef.current = axios.CancelToken.source();

    setLoading(true); // Inicia el indicador de carga
    try {
      console.log('Buscando libros con query:', query);
      const books = await searchBook(query, cancelTokenRef.current.token);
      const formattedBooks = books.filter((book: any) =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBooks(formattedBooks);
    } catch (error: any) {
      if (!axios.isCancel(error)) {
        console.error('Error al buscar libros:', error);
        Alert.alert('Error', 'No se pudo realizar la búsqueda. Inténtalo de nuevo más tarde.');
      }
    } finally {
      setLoading(false); // Detiene el indicador de carga
    }
  };

  const handleAddToLibrary = () => {
    addBook(selectedBook)
    .then(() => {
        Alert.alert('Listo. \n Libro agregado a tu biblioteca.');
      })
      .catch((error) => {
        console.error('Error al agregar el libro a la biblioteca:', error);
        Alert.alert('Error', 'No se pudo agregar el libro a la biblioteca. Inténtalo de nuevo más tarde.');
      });
    setModalVisible(false);
  };

  const renderBookItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => {
        setSelectedBook(item);
        setModalVisible(true);
      }}
    >
      <Text style={styles.bookTitle}>{item.title}</Text>
      <Text style={styles.bookAuthor}>{item.author.name}</Text>
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>
      <Header title="Buscar Libros" subtitle="Encuentra tu próximo libro" onLogout={null}/>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <TextInput
          style={[styles.searchInput, { flex: 1, marginBottom: 0 }]}
          placeholder="Escribe el título del libro o el autor"
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={{
          marginLeft: 8,
          backgroundColor: Colors.primary,
          padding: 10,
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
          }}
          onPress={() => fetchBooks(searchText)}
        >
          <Icon name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
      <ActivityIndicator size="large" color={Colors.primary} style={{ marginVertical: 20 }} />
      ) : (
      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.key}
        renderItem={renderBookItem}
        ListEmptyComponent={
        searchText.trim() !== '' && (
          <Text style={styles.noResultsText}>Presione el botón de búsqueda.</Text>
        )
        }
      />
      )}

      <ModalShowDetails modalVisible={modalVisible}
        selectedBook={selectedBook}
        handleAddToLibrary={handleAddToLibrary}
        setModalVisible={setModalVisible} />
    </View>
  );
};

const ModalShowDetails = ({modalVisible, selectedBook, handleAddToLibrary, setModalVisible}) => {
  const [imageError, setImageError] = React.useState(false);
  React.useEffect(() => { setImageError(false); }, [selectedBook]);
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={StylesModal.modalOverlay}>
          <View style={StylesModal.modalContent}>
            {selectedBook && (
              <>
                <TouchableOpacity
                  style={StylesModal.modalCloseButtonIcon}
                  onPress={() => setModalVisible(false)}
                >
                  <Icon name="close" size={16} color="#fff" />
                </TouchableOpacity>
                <View style={[styles.bookDetailsContainer]}>
                  <Image
                  source={
                    !imageError && selectedBook.cover_url
                    ? { uri: selectedBook.cover_url }
                    : require('../assets/img/default_cover.jpg')
                  }
                  style={styles.bookCover}
                  onError={(e) => {
                    console.log('Error al cargar la imagen:', e.nativeEvent.error);
                    console.log('url', selectedBook.cover_url);
                  }}
                  />
                  <Text style={[styles.modalSubtitle, { fontStyle: 'italic', fontSize: 14, marginBottom: 10 }]}> ISBN: {selectedBook.isbn} </Text>
                  <Text style={styles.modalTitle}>{selectedBook.title}</Text>
                  <Text style={styles.modalSubtitle}>{selectedBook.author.name}</Text>
                </View>
                <TouchableOpacity style={StylesModal.modalOption} onPress={handleAddToLibrary}>
                  <Text style={StylesModal.modalOptionText}>Agregar a biblioteca</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.lighter,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.darker,
    paddingBottom: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  bookItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 0,
    marginBottom: 0,
    alignContent: 'center',
    textAlign: 'center',
    color: Colors.lighter,
  },
  modalSubtitle: {
    fontSize: 16,
    paddingVertical: 6,
    textAlign: 'center',
    color: Colors.lighter,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bookDetailsContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  bookCover: {
    width: 160,
    height: 240,
    borderRadius: 8,
    marginTop: 40,
    marginBottom: 5,
    resizeMode: 'cover',
    borderBlockColor: '#ccc',
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
  },
});

export default SearchScreen;