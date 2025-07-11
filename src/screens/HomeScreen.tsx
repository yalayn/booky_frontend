import React, { useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Image, Modal } from "react-native";
import { getBooks } from "../api/bookService";
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
const ProgressSummary = ({readingTime,readingStats,navigation}) => {
  const redingTimeFormatted = formatTime(readingTime);
  return (
      <Card style={CardStyles.cardSpacing}>
      <CardContent>
        <Text style={CardStyles.title}>Progreso de lectura</Text>
        <Text style={CardStyles.subtitle}>Lectura del dia: {redingTimeFormatted}</Text>
        <TouchableOpacity
          style={CardStyles.logButton}
          onPress={() => {
            // Navegar a la pantalla de registros de lectura
            // Asegúrate de tener la ruta 'ReadingLogs' en tu navegación
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
const formatTime = (readingTime: number) => {
  if (readingTime < 0 || isNaN(readingTime)) {
    return "00:00:00";
  }
  const hours   = Math.floor(readingTime).toString().padStart(2, "0");
  const minutes = Math.floor((readingTime % 1) * 60).toString().padStart(2, "0");
  const seconds = Math.round((((readingTime % 1) * 60) % 1) * 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
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

/**
 * Componente principal del rastreador de libros
 * @returns 
 */
const HomeScreenMain = ({onLogout}) => {

  const navigation = useNavigation();
  const [readingTime, setReadingTime]   = useState(0);
  const [booksReading, setBooksReading] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [timerModalVisible, setTimerModalVisible] = useState(false);
  const [userName, setUserName] = useState('');

  const readingStats = [
    { day: "Lun", hours: 1 },
    { day: "Mar", hours: 2 },
    { day: "Mié", hours: 1.5 },
    { day: "Jue", hours: 2 },
    { day: "Vie", hours: 3 },
  ];

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
  const handleTimerFinish = (seconds:any) => {
    if (!selectedBook ) {
      console.error("No se ha seleccionado un libro.");
      return;
    }
    registerReadingSessions({
      book_id: selectedBook.book_id,
      seconds: seconds,
    }).then(() => {
      const hours = seconds / 3600;
      setReadingTime((prev) => prev + hours);
    }).catch((error) => {
      console.error("Error al registrar el tiempo de lectura:", error);
    });
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
      console.log("Cierre de sesión:", response.message);
      onLogout();
      setBooksReading([]);
      setReadingTime(0);
      setSelectedBook(null);
      setTimerModalVisible(false);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
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
    checkUserInfo();
  }, []);

  /**
   * Efecto para obtener la lista de libros del usuario
   * y actualizar la lista de libros en curso
   * Este efecto se ejecuta cada vez que la pantalla gana el foco.
   * Esto es útil para actualizar la lista de libros cada vez que el usuario regresa a la pantalla.
   * @returns {void}
   */
  useFocusEffect(
    React.useCallback(() => {
      const fetchBooks = async () => {
        try {
          const listBooks = {};
          const data = await getBooks();
          Object.entries(data).forEach(([state, books]) => {
            listBooks[state] = [];
            books.forEach((book: any) => {
              listBooks[state].push(book);
            });
          });
          setBooksReading(listBooks["reading"]);
        } catch (error) {
          console.error('Error al obtener libros:', error);
        }
      };
    
      fetchBooks();
    }, [])
  );

  /**
   * Efecto para obtener el conteo diario de lectura del usuario
   * y actualizar el tiempo de lectura
   * Este efecto se ejecuta cada vez que la pantalla gana el foco.
   * Esto es útil para actualizar el tiempo de lectura cada vez que el usuario regresa a la pantalla.
   * @returns {void}
   */
  useFocusEffect(
    React.useCallback(() => {
      const fetchUserCountDay = async () => {
        try {
            const dataUserCountDay = await getReadingSessionsToday();
            if (!dataUserCountDay || !dataUserCountDay.data) {
              setReadingTime(0);
              return;
            }
            const seconds = dataUserCountDay?.data?.seconds;
            const hours = seconds / 3600 || 0; // Convertir segundos a horas
            setReadingTime(hours);
        } catch (error) {
          console.error('Error al obtener el conteo diario del usuario:', error);
        }
      };
      fetchUserCountDay();
    }, [])
  );

  const subtitle = `Hola ${userName}, te damos la bienvenida.`;
  return (
    <View style={styles.container}>
      <ScrollView>
        <Header title="Inicio" subtitle={subtitle} onLogout={handleLogout} />
        <ProgressSummary readingTime={readingTime} readingStats={readingStats} navigation={navigation}/>
        <ReadingTimerModal
          visible={timerModalVisible}
          onClose={() => setTimerModalVisible(false)}
          onFinish={handleTimerFinish}
          book={selectedBook}
        />
        <SectionBookList title="En curso" bookList={booksReading} onRegisterTime={handleRegisterTime} navigation={navigation}/>
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

const timerStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    width: "80%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  timer: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  button: {
    backgroundColor: Colors.darker,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 8,
    padding: 8,
  },
  closeButtonText: {
    color: Colors.darker,
    fontWeight: "bold",
  },
});

export default HomeScreenMain;
