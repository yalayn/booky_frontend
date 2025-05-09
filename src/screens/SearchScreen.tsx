import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal, Alert, Image } from 'react-native';
import StylesModal from '../styles/StylesModal';
import  Icon  from 'react-native-vector-icons/FontAwesome';
import { Colors } from '../styles/AppStyles';
import { Italic } from 'lucide-react-native';

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const books = [
    {
      "id": "OL2630071W",
      "title": "Los 7 Habitos de la Gente Altamente Efectiva",
      "author": "Stephen R. Covey",
      "publisher": "Desconocida",
      "year": 1992,
      "isbn": "000-698431085",
      "cover_url": "https://covers.openlibrary.org/b/id/1051915-M.jpg"
    },
    {
      "id": "OL37767407W",
      "title": "Hábitos atómicos / Atomic Habits",
      "author": "James Clear",
      "publisher": "Desconocida",
      "year": 2016,
      "isbn": "000-530806413",
      "cover_url": "https://covers.openlibrary.org/b/id/14591837-M.jpg"
    },
    {
      "id": "OL33100278W",
      "title": "O Poder do Hábito",
      "author": "Desconocido",
      "publisher": "Desconocida",
      "year": "Desconocido",
      "isbn": "000-644712872",
      "cover_url": "https://covers.openlibrary.org/b/id/13117959-M.jpg"
    },
    {
      "id": "OL27034409W",
      "title": "Tiende tu cama y otros pequeños hábitos que cambia",
      "author": "McRaven",
      "publisher": "Desconocida",
      "year": 2017,
      "isbn": "000-386757404",
      "cover_url": "https://covers.openlibrary.org/b/id/12542206-M.jpg"
    },
    {
      "id": "OL22161074W",
      "title": "Buenos Habitos, Malos Habitos",
      "author": "Wendy Wood",
      "publisher": "Desconocida",
      "year": 2020,
      "isbn": "000-788701064",
      "cover_url": "https://covers.openlibrary.org/b/id/12021210-M.jpg"
    },
    {
      "id": "OL34448170W",
      "title": "Construyendo Hábitos Atomicos",
      "author": "Oum motivación",
      "publisher": "Desconocida",
      "year": 2021,
      "isbn": "000-876945411",
      "cover_url": null
    },
    {
      "id": "OL33261506W",
      "title": "Os 7 Hábitos das Pessoas Altamente Eficazes",
      "author": "Vários Autores",
      "publisher": "Desconocida",
      "year": 2014,
      "isbn": "000-148596055",
      "cover_url": "https://covers.openlibrary.org/b/id/13122863-M.jpg"
    },
    {
      "id": "OL26579474W",
      "title": "Hábitos para Ser Millonario",
      "author": "Brian Tracy, Harvard Business Review Staff",
      "publisher": "Desconocida",
      "year": 2019,
      "isbn": "000-917411228",
      "cover_url": "https://covers.openlibrary.org/b/id/13850974-M.jpg"
    },
    {
      "id": "OL26392627W",
      "title": "Los hábitos de un cerebro feliz",
      "author": "LORETTA GRAZIANO BREUNING, JOANA DELGADO SÁNCHEZ",
      "publisher": "Desconocida",
      "year": 2016,
      "isbn": "000-926484004",
      "cover_url": "https://covers.openlibrary.org/b/id/12340019-M.jpg"
    },
    {
      "id": "OL26417449W",
      "title": "7 Habitos das Pessoas Altamente Eficazes",
      "author": "Stephen R Covery",
      "publisher": "Desconocida",
      "year": 2009,
      "isbn": "000-746150579",
      "cover_url": "https://covers.openlibrary.org/b/id/12372707-M.jpg"
    }
  ]

  const handleSearch = (text) => {
    setSearchText(text);

    if (text.trim() === '') {
      setFilteredBooks([]);
      return;
    }

    const results = books.filter((book) =>
      book.title.toLowerCase().includes(text.toLowerCase()) ||
      book.author.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredBooks(results);
  };

  const handleAddToLibrary = () => {
    Alert.alert('Listo', `${selectedBook.title}.\n Ha sido agregado a tu biblioteca.`);
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
      <Text style={styles.bookAuthor}>{item.author}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar</Text>
      <Text style={styles.subtitle}>Buscar libro</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Escribe el título del libro o el autor"
        value={searchText}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        renderItem={renderBookItem}
        ListEmptyComponent={
          searchText.trim() !== '' && (
            <Text style={styles.noResultsText}>No se encontraron resultados</Text>
          )
        }
      />

      {/* Modal para mostrar detalles del libro */}
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
                <TouchableOpacity style={StylesModal.modalCloseButtonIcon} onPress={() => setModalVisible(false)} >
                  <Icon name="close" size={16} color="#fff" />
                </TouchableOpacity>
                <View style={[styles.bookDetailsContainer]}>
                  <Image
                    source={ selectedBook.cover_url ? { uri: selectedBook.cover_url } :  require('../assets/img/default_cover.jpg') }
                    style={styles.bookCover}
                  />
                  <Text style={[styles.modalSubtitle, {fontStyle:'italic',fontSize:14,marginBottom: 10}]}>ISBN: {selectedBook.isbn}</Text>
                  <Text style={styles.modalTitle}>{selectedBook.title}</Text>
                  <Text style={styles.modalSubtitle}>{selectedBook.author}</Text>
                </View>
                <TouchableOpacity style={StylesModal.modalOption} onPress={handleAddToLibrary} >
                  <Text style={StylesModal.modalOptionText}>Agregar a biblioteca</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.lighter,
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
    marginTop:0,
    marginBottom:0,
    alignContent: 'center',
    textAlign: 'center',
    color: Colors.lighter,
  },
  modalSubtitle: {
    fontSize: 16,
    paddingVertical: 6,
    textAlign:'center',
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