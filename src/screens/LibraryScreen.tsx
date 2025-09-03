import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, ActivityIndicator,TouchableOpacity, Image, TextInput } from 'react-native';
import { getListBooks, getListBooksSearch } from "../api/bookService";
import { Colors } from '../styles/AppStyles';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import StylesModal from "../styles/StylesModal";
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../components/Header';
import { BOOK_STATE, LIMIT_PAGE } from '../constants/appConstants';

const LibraryScreen = () => {
  const [listBooks, setListBooks] = useState([]);
  const [bookState, setBookState] = useState('all'); // Estado inicial del filtro
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState('');

  const getListBookServices = async (pageNumber = 1, state = BOOK_STATE.ALL) => {
    setLoading(true);
    try {
      const response = await getListBooks({ page: pageNumber, limit: LIMIT_PAGE, state: state });
      if (!response.success) {
        console.error("Error al obtener libros:", response.message);
        return;
      }
      const newBooks = response.data;
      setHasMore(newBooks.length === LIMIT_PAGE);
      setListBooks(prev => (pageNumber === 1 ? newBooks : [...prev, ...newBooks]));
      setBookState(state);
      setPage(pageNumber);
    } catch (error) {
      console.error("Error al obtener libros:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async (pageNumber = 1, state = BOOK_STATE.ALL) => {
    if (loading || !hasMore) return;
    getListBookServices(pageNumber, state);
  };

  // Nueva función para buscar libros
  const handleSearch = async (query: string) => {
    setSearchText(query);
    if (query.trim() === '') {
      fetchBooks(1);
      return;
    }
    setLoading(true);
    setBookState(BOOK_STATE.ALL);
    try {
      const response = await getListBooksSearch(query,{ page: 1, limit: LIMIT_PAGE });
      if (!response.success) {
        console.error("Error al buscar libros:", response.message);
        setListBooks([]);
        setHasMore(false);
        return;
      } 
      setListBooks(response.data);
      setHasMore(response.data.length === LIMIT_PAGE);
      setPage(1);
    } catch (error) {
      console.error("Error al buscar libros:", error);
      setListBooks([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleStateChange = async (state: any) => {
    const pageNumber = 1;
    getListBookServices(pageNumber, state);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchBooks(page + 1, bookState);
    }
  };

  useFocusEffect(
      React.useCallback(() => {
        fetchBooks();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Header
        title="Biblioteca"
        subtitle="Aquí puedes ver tus libros."
        onLogout={null}
      />

      {/* Campo de búsqueda */}
      <View style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ccc', paddingHorizontal: 8 }}>
          <Icon name="search" size={18} color="#666" style={{ marginRight: 8 }} />
          <TextInput
            style={{ flex: 1, height: 40 }}
            placeholder="Buscar libros..."
            value={searchText}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
        </View>
      </View>

      <LabelStateFilter
        bookState={bookState}
        onStateChange={handleStateChange}
      />

      <FlatList
        data={listBooks}
        keyExtractor={(item, index) => `${item.id || index}`}
        renderItem={({ item }) => <BookCard book={item} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <View style={{ padding: 20 }}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : null
        }
      />
    </View>
  );
};

const LabelState = ({bookState}) => {

  const STATES_NAME = {
    [BOOK_STATE.TO_READ]: 'Pendiente',
    [BOOK_STATE.READING]: 'En curso',
    [BOOK_STATE.READ]   : 'Terminado'
  };
  
  const STATE_BG_COLOR = {
      [BOOK_STATE.TO_READ]: styles.bgReadLabel,
      [BOOK_STATE.READING]: styles.bgToReadLabel,
      [BOOK_STATE.READ]   : styles.bgReadingLabel
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
    [BOOK_STATE.ALL]    : 'Todos',
    [BOOK_STATE.TO_READ]: 'Pendiente',
    [BOOK_STATE.READING]: 'En curso',
    [BOOK_STATE.READ]   : 'Terminado',
  };

  const STATE_BG_COLOR = {
    [BOOK_STATE.READ]   : styles.bgReadLabel,
    [BOOK_STATE.TO_READ]: styles.bgToReadLabel,
    [BOOK_STATE.READING]: styles.bgReadingLabel,
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
        <View style={[StylesLabelStateFilter.bottonStateLabelContainer, stateStyle]}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={StylesLabelStateFilter.bottoonStateLabel}>
              {stateName} <Icon name="caret-down" size={14} color="#fff" />
            </Text>
          </TouchableOpacity>
        </View>
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
              <Icon name="close" style={StylesModal.modalCloseButtonIconText}/>
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