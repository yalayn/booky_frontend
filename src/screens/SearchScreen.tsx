import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal, Alert, Image } from 'react-native';
import StylesModal from '../styles/StylesModal';
import  Icon  from 'react-native-vector-icons/FontAwesome';
import { Colors } from '../styles/AppStyles';

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const books = [
    {
        "key": "OL2630071W",
        "title": "Los 7 Habitos de la Gente Altamente Efectiva",
        "genre": "Desconocido",
        "publication_year": 1992,
        "isbn": "000-705705978",
        "descriptions_short": "",
        "descriptions_long": "",
        "cover_i": 1051915,
        "cover_url": "https://covers.openlibrary.org/b/id/1051915.jpg",
        "editorial": {
            "name": "Desconocida",
            "country": "Desconocido",
            "founding_date": "0000-00-00",
            "key": "XN1RDAUU0Q"
        },
        "author": {
            "name": "Stephen R. Covey",
            "country": "Desconocido",
            "birthday": "0000-00-00",
            "key": "OL383159A"
        }
    },
    {
        "key": "OL37767407W",
        "title": "Hábitos atómicos / Atomic Habits",
        "genre": "Desconocido",
        "publication_year": 2016,
        "isbn": "000-499097006",
        "descriptions_short": "",
        "descriptions_long": "",
        "cover_i": 14591837,
        "cover_url": "https://covers.openlibrary.org/b/id/14591837.jpg",
        "editorial": {
            "name": "Desconocida",
            "country": "Desconocido",
            "founding_date": "0000-00-00",
            "key": "BMZHLFDG7B"
        },
        "author": {
            "name": "James Clear",
            "country": "Desconocido",
            "birthday": "0000-00-00",
            "key": "OL7422948A"
        }
    },
    {
        "key": "OL33100278W",
        "title": "O Poder do Hábito",
        "genre": "Desconocido",
        "publication_year": "Desconocido",
        "isbn": "000-565966932",
        "descriptions_short": "",
        "descriptions_long": "",
        "cover_i": 13117959,
        "cover_url": "https://covers.openlibrary.org/b/id/13117959.jpg",
        "editorial": {
            "name": "Desconocida",
            "country": "Desconocido",
            "founding_date": "0000-00-00",
            "key": "GXESQLP8G4"
        },
        "author": {
            "name": "Desconocido",
            "country": "Desconocido",
            "birthday": "0000-00-00",
            "key": "O72BB9L1SU"
        }
    },
    {
        "key": "OL27034409W",
        "title": "Tiende tu cama y otros pequeños hábitos que cambia",
        "genre": "Desconocido",
        "publication_year": 2017,
        "isbn": "000-494810303",
        "descriptions_short": "",
        "descriptions_long": "",
        "cover_i": 12542206,
        "cover_url": "https://covers.openlibrary.org/b/id/12542206.jpg",
        "editorial": {
            "name": "Desconocida",
            "country": "Desconocido",
            "founding_date": "0000-00-00",
            "key": "PXF1VXSLFF"
        },
        "author": {
            "name": "McRaven",
            "country": "Desconocido",
            "birthday": "0000-00-00",
            "key": "OL10137296A"
        }
    },
    {
        "key": "OL22161074W",
        "title": "Buenos Habitos, Malos Habitos",
        "genre": "Desconocido",
        "publication_year": 2020,
        "isbn": "000-260693373",
        "descriptions_short": "",
        "descriptions_long": "",
        "cover_i": 12021210,
        "cover_url": "https://covers.openlibrary.org/b/id/12021210.jpg",
        "editorial": {
            "name": "Desconocida",
            "country": "Desconocido",
            "founding_date": "0000-00-00",
            "key": "RRZYZ5UQPY"
        },
        "author": {
            "name": "Wendy Wood",
            "country": "Desconocido",
            "birthday": "0000-00-00",
            "key": "OL7952399A"
        }
    },
    {
        "key": "OL34448170W",
        "title": "Construyendo Hábitos Atomicos",
        "genre": "Desconocido",
        "publication_year": 2021,
        "isbn": "000-939632352",
        "descriptions_short": "",
        "descriptions_long": "",
        "cover_i": null,
        "cover_url": null,
        "editorial": {
            "name": "Desconocida",
            "country": "Desconocido",
            "founding_date": "0000-00-00",
            "key": "RGNYCP2W1U"
        },
        "author": {
            "name": "Oum motivación",
            "country": "Desconocido",
            "birthday": "0000-00-00",
            "key": "OL10030238A"
        }
    },
    {
        "key": "OL33261506W",
        "title": "Os 7 Hábitos das Pessoas Altamente Eficazes",
        "genre": "Desconocido",
        "publication_year": 2014,
        "isbn": "000-420300524",
        "descriptions_short": "",
        "descriptions_long": "",
        "cover_i": 13122863,
        "cover_url": "https://covers.openlibrary.org/b/id/13122863.jpg",
        "editorial": {
            "name": "Desconocida",
            "country": "Desconocido",
            "founding_date": "0000-00-00",
            "key": "4CL10XH8OT"
        },
        "author": {
            "name": "Vários Autores",
            "country": "Desconocido",
            "birthday": "0000-00-00",
            "key": "OL7167492A"
        }
    },
    {
        "key": "OL26579474W",
        "title": "Hábitos para Ser Millonario",
        "genre": "Desconocido",
        "publication_year": 2019,
        "isbn": "000-755222642",
        "descriptions_short": "",
        "descriptions_long": "",
        "cover_i": 13850974,
        "cover_url": "https://covers.openlibrary.org/b/id/13850974.jpg",
        "editorial": {
            "name": "Desconocida",
            "country": "Desconocido",
            "founding_date": "0000-00-00",
            "key": "C2JCVU0IC1"
        },
        "author": {
            "name": "Brian Tracy",
            "country": "Desconocido",
            "birthday": "0000-00-00",
            "key": "OL327356A"
        }
    },
    {
        "key": "OL26392627W",
        "title": "Los hábitos de un cerebro feliz",
        "genre": "Desconocido",
        "publication_year": 2016,
        "isbn": "000-422480937",
        "descriptions_short": "",
        "descriptions_long": "",
        "cover_i": 12340019,
        "cover_url": "https://covers.openlibrary.org/b/id/12340019.jpg",
        "editorial": {
            "name": "Desconocida",
            "country": "Desconocido",
            "founding_date": "0000-00-00",
            "key": "0NA4A129UG"
        },
        "author": {
            "name": "LORETTA GRAZIANO BREUNING",
            "country": "Desconocido",
            "birthday": "0000-00-00",
            "key": "OL9948627A"
        }
    },
    {
        "key": "OL26417449W",
        "title": "7 Habitos das Pessoas Altamente Eficazes",
        "genre": "Desconocido",
        "publication_year": 2009,
        "isbn": "000-548829065",
        "descriptions_short": "",
        "descriptions_long": "",
        "cover_i": 12372707,
        "cover_url": "https://covers.openlibrary.org/b/id/12372707.jpg",
        "editorial": {
            "name": "Desconocida",
            "country": "Desconocido",
            "founding_date": "0000-00-00",
            "key": "65Y3CR41PH"
        },
        "author": {
            "name": "Stephen R Covery",
            "country": "Desconocido",
            "birthday": "0000-00-00",
            "key": "OL9956795A"
        }
    }
  ];

  const handleSearch = (text) => {
    setSearchText(text);

    if (text.trim() === '') {
      setFilteredBooks([]);
      return;
    }

  const results = books.filter((book) =>
      book.title.toLowerCase().includes(text.toLowerCase()) ||
      book.author.name.toLowerCase().includes(text.toLowerCase())
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
      <Text style={styles.bookAuthor}>{item.author.name}</Text>
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
        keyExtractor={(item) => item.key}
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
                  <Text style={styles.modalSubtitle}>{selectedBook.author.name}</Text>
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