import React, { useState, useRef, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Modal, ActivityIndicator } from "react-native";
import Toast from 'react-native-toast-message';
import { getListBooks } from "../api/bookService";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Colors, CardStyles, SectionListStyles} from "../styles/AppStyles";
import StylesModal from "../styles/StylesModal";
import { SectionList, SectionListContent } from "../components/SectionList";
import { Card, CardContent } from "../components/Card";
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from "../components/Header";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReadingSessionsToday, registerReadingSessions} from "../api/readingSessionService";
import { initLogout } from "../api/loginService";
import { GOAL } from "../constants/appConstants";
import { getUserGoal } from "../api/goalService";
import Loading from "../components/Loading";
import { BOOK_STATE, LIMIT_PAGE } from "../constants/appConstants";

/**
 * Componente principal del rastreador de libros
 * @returns 
 */
const HomeScreenMain = ({onLogout}) => {

  const navigation = useNavigation();
  const [readingTime, setReadingTime] = useState(0);
  const [goalTime, setGoalTime]       = useState(0);
  const [booksReading, setBooksReading] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [timerModalVisible, setTimerModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [userGoalModalVisible, setUserGoalModalVisible] = useState(false);
  const [progressValue, setProgressValue]   = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [listBooks, setListBooks] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const handleRegisterTime = (book:any) => {
    setSelectedBook(book);
    setTimerModalVisible(true);
  };

  /**
   * Acción que se ejecuta cuando el temporizador finaliza
   * Registra la sesión de lectura y actualiza el tiempo de lectura
   * @param seconds
   * @returns 
   */
  const handleTimerFinish = async(seconds:any) => {
    if (!selectedBook ) {
      console.error("No se ha seleccionado un libro.");
      return;
    }
    setLoading(true);
    try {
      const response = await registerReadingSessions({ book_id: selectedBook.book_id, seconds: seconds });
      if (!response?.success) {
        console.error("Error al registrar la sesión de lectura:", response?.message);
        Toast.show({ type: 'error', text1: 'Error', text2: 'Ha ocurrido un error al registrar la sesión de lectura.', });
        setLoading(false);
        return;
      }
      const goalSeconds = await AsyncStorage.getItem('goalSeconds') || '0';
      setReadingTime((prev) => prev + seconds);
      setProgressValue((seconds * 100) / parseInt(goalSeconds));
    } catch (error) {
      console.error("Error al registrar la sesión de lectura:", error);
    } finally {
      setTimerModalVisible(false);
      setLoading(false);
    }
  };

  /**
   * Función para manejar el cierre de sesión del usuario
   * Limpia el estado de los libros en curso, tiempo de lectura y libro seleccionado
   * También cierra la sesión del usuario llamando a la función initLogout
   * @returns {void}
   * @throws {Error} Si ocurre un error al cerrar sesión
   * @example
   * handleLogout();
   */
  const handleLogout = async () => {
    try {
      const response = await initLogout();
      if (!response?.success) {
        console.error("Error al cerrar sesión:", response?.message);
      }
      onLogout();
      setBooksReading([]);
      setReadingTime(0);
      setSelectedBook(null);
      setTimerModalVisible(false);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      onLogout();
    }
  };

  /**
   * Efecto para obtener el nombre del usuario
   * y actualizar el estado del nombre del usuario
   * Este efecto se ejecuta una sola vez cuando el componente se monta.
   * @returns {void}
   */
  useEffect(() => {
    const checkUserInfo = async () => {
      const userInfo = await AsyncStorage.getItem('authUserInfo');
      const userName = userInfo ? JSON.parse(userInfo).name : '';
      setUserName(userName);
    };
    const fetchUserGoal = async () => {
        const userGoal = await getUserGoal(GOAL.TYPE_TIME);
        if (!userGoal) return;
        const seconds = userGoal.target_value || 0;
        await AsyncStorage.setItem('goalSeconds', JSON.stringify(seconds));
    };
    checkUserInfo();
    fetchUserGoal();
  }, []);

  /**
   * Función para obtener la lista de libros del usuario
   * y actualizar el estado de los libros en curso
   * @param pageNumber Número de página para la paginación (por defecto es 1)
   * @returns {void}
   */
  const fetchBooks = async (pageNumber = 1) => {
    try {
      const response = await getListBooks({ page: pageNumber, limit: LIMIT_PAGE, state: BOOK_STATE.READING });
      if (!response.success) {
        console.error("Error al obtener libros:", response.message);
        return;
      }
      const newBooks = response.data;
      setHasMore(newBooks.length === LIMIT_PAGE); // si recibes menos de LIMIT_PAGE, no hay más
      setListBooks(prev => (pageNumber === 1 ? newBooks : [...prev, ...newBooks]));
      setPage(pageNumber);
    } catch (error) {
      console.error('Error al obtener libros:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCountDay = async () => {
    try {
        const dataUserCountDay = await getReadingSessionsToday();
        if (!dataUserCountDay || !dataUserCountDay.data) {
          setReadingTime(0);
          return;
        }
        const seconds     = dataUserCountDay?.data?.seconds || 0;
        const goalSeconds = await AsyncStorage.getItem('user_goal_seconds') || '0';
        setGoalTime(parseInt(goalSeconds));
        setProgressValue((seconds * 100) / parseInt(goalSeconds));
        setReadingTime(parseInt(seconds));
    } catch (error) {
      console.error('Error al obtener el conteo diario del usuario:', error);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchBooks(page + 1);
    }
  };

  /**
   * Efecto para obtener la lista de libros del usuario
   * y actualizar la lista de libros en curso
   * Este efecto se ejecuta cada vez que la pantalla gana el foco.
   * Esto es útil para actualizar la lista de libros cada vez que el usuario regresa a la pantalla.
   * @returns {void}
   */
  useFocusEffect(
    React.useCallback(() => {
      fetchBooks();
      fetchUserCountDay();
    }, [])
  );

  const subtitle = `Hola ${userName}, te damos la bienvenida.`;
  return (
    <View style={styles.container}>
      {/* Bloqueo de pantalla con spinner */}
      {loading && (<Loading />)}
      {/* Botón para regresar */}
      <Header title="Inicio" subtitle={subtitle} onLogout={handleLogout} />
      <ProgressSummary navigation={navigation} readingTime={readingTime} goalTime={goalTime} progressValue={progressValue} handleModalGoal={() => setUserGoalModalVisible(true)}/>
      <ReadingTimerModal
        visible={timerModalVisible}
        onClose={() => setTimerModalVisible(false)}
        onFinish={handleTimerFinish}
        book={selectedBook}
      />
      <FlatList
        data={listBooks}
        keyExtractor={(item, index) => `${item.id || index}`}
        renderItem={({ item }) => <BookCard key={item.id} book={item} onRegisterTime={handleRegisterTime} navigation={navigation} />}
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

/**
 * Componente para mostrar el progreso de lectura
 * @param param0 
 * @returns 
 */
const Progress = ({ value }) => {
  return (
    <View style={CardStyles.progressContainer}>
      <View style={[CardStyles.progressBar, { width: `${value}%` }]} />
    </View>
  );
};

/**
 * Componente para mostrar el resumen de progreso
 * @param param0
 * @returns
 */
const ProgressSummary = ({navigation, readingTime, goalTime, progressValue, handleModalGoal}) => {
  const readingTimeFormatted = formatReadingTime(readingTime);
  const goalTimeFormatted    = formatReadingTime(goalTime);

  let readingLabelToday = '';
  if (readingTimeFormatted != "" && goalTimeFormatted != "") {
    readingLabelToday = `${readingTimeFormatted} de ${goalTimeFormatted}`;
  } else if (readingTimeFormatted != "") {
    readingLabelToday = `${readingTimeFormatted}`;
  } else if (goalTimeFormatted != "") {
    readingLabelToday = `Meta: ${goalTimeFormatted}`;
  } else {
    readingLabelToday = 'Es hora de leer un libro!';
  }

  if(progressValue >= 100) {
    readingLabelToday = '¡Felicidades! Has alcanzado tu meta de lectura.';
  }
  
  return (
      <Card style={CardStyles.cardSpacing}>
      <CardContent>
        <TouchableOpacity style={styles.goalConfigButton} onPress={() => {
            if (typeof navigation?.navigate === "function") {
              navigation.navigate('UserGoalScreen');
            }
        }}>
          <Icon name="trophy" size={18} style={styles.goalConfigButtonIcon} />
        </TouchableOpacity>
        <Text style={CardStyles.title}>Progreso de lectura</Text>
        <Progress value={progressValue} />
        {progressValue < 100 && (
          <>
            <Text style={[CardStyles.subtitle,{textAlign:'center'}]}>  Lectura hoy</Text>
            <Text style={[CardStyles.subtitle,{textAlign:'center'}]}> {readingLabelToday}</Text>
          </>
        )}
        {progressValue >= 100 && (
          <>
            <Text style={[CardStyles.subtitle,{textAlign:'center'}]}>¡Felicidades! Has alcanzado tu meta de lectura.</Text>
            <Icon name="smile-o" size={24} color="#403E3B" style={{ alignSelf: 'center', marginVertical: 10 }} />
            <Text style={[CardStyles.subtitle,{textAlign:'center'}]}>{readingTimeFormatted}.</Text>
          </>
        )}

        <TouchableOpacity
          style={CardStyles.logButton}
          onPress={() => {
            if (typeof navigation?.navigate === "function") {
              navigation.navigate('ReadingLogs');
            }
          }}
        >
          <Text style={CardStyles.logButtonText}>Ver registros de lectura</Text>
        </TouchableOpacity>
        {/* <Progress value={progressValue} /> */}
      </CardContent>
    </Card>
  );
}

/**
 * Formatea el tiempo de lectura en horas, minutos y segundos
 * @param readingTime 
 * @returns 
 */
const formatReadingTime = (readingTimeSeconds: number) => {
  if (readingTimeSeconds <= 0 || isNaN(readingTimeSeconds)) {
    return "";
  }
  const hours   = Math.floor(readingTimeSeconds / 3600);
  const minutes = Math.floor((readingTimeSeconds % 3600) / 60);
  const seconds = Math.round((readingTimeSeconds % 60));

  const hours_label   = (hours > 0) ? `${hours.toString().padStart(2, "0")} hrs` : '';
  const minutes_label = (minutes > 0) ? `${minutes.toString().padStart(2, "0")} min` : '';
  const seconds_label = (minutes <= 0 && seconds > 0) ? `${seconds.toString().padStart(2, "0")} seg` : '';

  return `${hours_label} ${minutes_label} ${seconds_label}`.trim();
}

/**
 * Componente para mostrar la lista de libros
 * @param param0 
 * @returns 
 */
const SectionBookList = ({ title, bookList, onRegisterTime, navigation }) => {
  return (

    <SectionList style={SectionListStyles.cardSpacing}>
      <SectionListContent>
        <Text style={SectionListStyles.title}>{title}</Text>
        {bookList.map((book, index) => (
          <BookCard key={index} book={book} onRegisterTime={onRegisterTime} navigation={navigation} />
        ))}
      </SectionListContent>
    </SectionList>
  );
}

/**
 * Componente para mostrar el estado del libro
 * @param param0 
 * @returns 
 */
const CardHome = ({ children, style }) => {
    return <View style={[CardHomeStyles.card, style]}>{children}</View>;
};
  
/**
 * Componente para mostrar el contenido de la tarjeta
 * @param param0 
 * @returns 
 */ 
const CardHomeContent = ({ children }) => {
    return <View style={CardHomeStyles.cardContent}>{children}</View>;
};

/**
 * Componente para mostrar la tarjeta de un libro
 * @param param0 
 * @returns 
 */
const BookCard = ({ index, book, onRegisterTime, navigation }) => {
  const handleBookPress = (book) => {
    navigation.navigate('BookDetail', { book });
  };

  return (
    <CardHome style={CardHomeStyles.cardSpacing}>
      <CardHomeContent>
        {/* Book Cover */}
        <View style={stylesBookCard.bookCardContainer}>
          <View style={stylesBookCard.bookCoverContainer}>
            <TouchableOpacity key={index} onPress={() => handleBookPress(book)}>
              <Image
                source={{ uri: book?.cover_url || 'https://via.placeholder.com/150' }} // Fallback image
                style={stylesBookCard.bookCover}
              />
            </TouchableOpacity>
          </View>

          {/* Book Details */}
          <View style={stylesBookCard.bookDetailsContainer}>
            <TouchableOpacity key={index} onPress={() => handleBookPress(book)}>
              <Text style={stylesBookCard.bookTitle}>{book.title}</Text>
            </TouchableOpacity>
            <Text style={stylesBookCard.bookSubtitle}>{book.author}</Text>

            {/* Register Time Button */}
            <TouchableOpacity
              style={CardStyles.logButton}
              onPress={() => onRegisterTime(book)}
            >
              <Text style={CardStyles.logButtonText}>Iniciar lectura</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CardHomeContent>
    </CardHome>
  );
};

/**
 * Modal para el temporizador de lectura
 * @param param0 
 * @returns 
 */
const ReadingTimerModal = ({ visible, onClose, onFinish, book }) => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const handlePause = () => setRunning(false);
  const handleStart = () => setRunning(true);
  const handleFinish = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    onFinish(seconds);
    setSeconds(0);
    onClose();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={StylesModal.modalOverlay}>
        <View style={StylesModal.modalContent}>
          <TouchableOpacity style={StylesModal.modalCloseButtonIcon} onPress={onClose} >
            <Icon name="close" style={StylesModal.modalCloseButtonIconText}/>
          </TouchableOpacity>
          <View style={{marginTop: 40, alignItems: 'center'}}>
            <Image
              source={{ uri: book?.cover_url || 'https://via.placeholder.com/150' }} // Fallback image
              style={stylesBookCard.bookCoverCurve}
            />
            <Text style={StylesModal.modalTitle}>Lectura: {book?.title}</Text>
            <Text style={StylesModal.modalTitleXL}>{formatTime(seconds)}</Text>
            <View style={StylesModal.modalButtonContainer}>
              <TouchableOpacity style={StylesModal.modalButton} onPress={running ? handlePause : handleStart}>
                <Text style={StylesModal.modalOptionText}>{running ? <Icon name="pause"/> : <Icon name="play"/>}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={StylesModal.modalButton} onPress={handleFinish}>
                <Text style={StylesModal.modalOptionText}><Icon name="stop"/></Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.lighter,
    marginTop: 40,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#403E3B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  goalConfigButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#fff',
    marginTop: 0,
    borderRadius: 8,
    borderColor: "#ccc",
    width: 36,
    height: 36,
    borderWidth: 1,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  goalConfigButtonIcon: {
    color: '#666',
  },
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
  bookCoverCurve: {
    width: 100,
    height: 150,
    borderRadius:12,
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

export default HomeScreenMain;
