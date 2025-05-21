import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal } from 'react-native';
import { getBooks } from "../api/bookService";
import { SectionList, SectionListContent } from '../components/SectionList';
import { Colors, SectionListStyles } from '../styles/AppStyles';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { TouchableOpacity, Image } from 'react-native';
import StylesModal from "../styles/StylesModal";
import Icon from 'react-native-vector-icons/FontAwesome';

const SectionBookList = ({ title, bookList }) => {
    return (
        <SectionList style={SectionListStyles.cardSpacing}>
        <SectionListContent>
            <Text style={SectionListStyles.title}>{title}</Text>
            {bookList.map((book, index) => (
                <BookCard key={index} book={book}/>
            ))}
        </SectionListContent>
        </SectionList>
    );
}

const LabelState = ({bookState}) => {
    const STATES_NAME = {
      'to_read': 'Pendiente',
      'reading': 'En curso',
      'read'   : 'Terminado',
    };
    
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

const CardHome = ({ children, style }) => {
    return <View style={[CardHomeStyles.card, style]}>{children}</View>;
};
  
  
const CardHomeContent = ({ children }) => {
    return <View style={CardHomeStyles.cardContent}>{children}</View>;
};

const BookCard = ({ index, book }) => {
  const navigation = useNavigation();

  const handleBookPress = (book) => {
    navigation.navigate('BookDetail', { book });
  };

  return (
      <TouchableOpacity key={index} onPress={() => handleBookPress(book)}>
        <CardHome style={CardHomeStyles.cardSpacing}>
          <CardHomeContent>
            {/* Book Cover */}
            <View style={stylesBookCard.bookCardContainer}>
              <View style={stylesBookCard.bookCoverContainer}>
                <Image
                  source={{ uri: book.cover_url || 'https://via.placeholder.com/150' }} // Fallback image
                  style={stylesBookCard.bookCover}
                />
              </View>
    
              {/* Book Details */}
              <View style={stylesBookCard.bookDetailsContainer}>
                <LabelState bookState={book.state}></LabelState>
                <Text style={stylesBookCard.bookTitle}>{book.title}</Text>
                <Text style={stylesBookCard.bookSubtitle}>{book.author}</Text>
                <Text style={stylesBookCard.bookSubtitle}>{book.editorial}</Text>
              </View>
            </View>
          </CardHomeContent>
        </CardHome>
      </TouchableOpacity>
  );
};

const LabelStateFilter = ({ bookState, onStateChange }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const STATES_NAME = {
    'all'    : 'Todos',
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
        <View style={[StylesLabelStateFilter.bottonStateLabelContainer, stateStyle]}>
          <Text style={StylesLabelStateFilter.bottoonStateLabel}>
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

const LibraryScreen = () => {

    const navigation = useNavigation();
    const [listBooks, setlistBooks] = useState([]);
    const [bookState, setBookState] = useState('all'); // Estado inicial del filtro

    const handleStateChange = (newState: any) => {
        setBookState(newState); // Actualiza el estado del filtro
    };
    
    useFocusEffect(
        React.useCallback(() => {
          const fetchBooks = async () => {
              try {
              const listBooks_ = [];
              const data = await getBooks();
              Object.entries(data).forEach(([state, books]) => {
                  books.forEach((book: any) => {
                      listBooks_.push(book);
                  });
              });
              setlistBooks(listBooks_);
              } catch (error) {
              console.error('Error al obtener libros:', error);
              }
          };

          fetchBooks();
      }, [])
    );

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Biblioteca</Text>
        <Text style={styles.subtitle}>Aquí puedes ver tus libros.</Text>
        <LabelStateFilter bookState={bookState} onStateChange={handleStateChange}></LabelStateFilter>
        <SectionBookList title="" bookList={listBooks}/>
      </ScrollView>
    </View>
  );
};

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
    fontSize: 16,
    color: '#666',
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

const stylesBookCard = StyleSheet.create({
  bookCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookCoverContainer: {
    marginRight: 16,
  },
  bookCover: {
    width: 100,
    height: 150,
    borderTopLeftRadius:12,
    borderBottomLeftRadius:12,
    borderColor: '#ccc',
    shadowColor: '#000',
    backgroundColor: '#e0e0e0',
  },
  bookDetailsContainer: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bookSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
});

const CardHomeStyles = StyleSheet.create({
  container: {
    paddingBlock:0,
  },
  card: {
    // backgroundColor: "white",
    borderBlockColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    paddingEnd:16,
    borderColor: "#ccc",
    shadowColor: "transparent",
  },
  cardSpacing: {
    marginBottom: 20,
  },
  cardContent: {
    flexDirection: "column",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: "#666",
    marginBottom: 8,
  },
  item: {
    color: "#444",
    marginVertical: 4,
  },
  progressContainer: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
    marginVertical: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#403E3B",
  },
  logButton: {
    backgroundColor: "#403E3B",
    borderWidth: 1,
    borderColor: "#403E3B",
    padding: 10,
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  logButtonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "bold",
  },
});

const StylesLabelStateFilter = StyleSheet.create({
  bottonStateLabelContainer: {
    marginVertical: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bottoonStateLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});


export default LibraryScreen;