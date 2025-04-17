import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Image } from "react-native";
import { Timer } from "lucide-react-native";
import { LineChart } from "react-native-chart-kit";
import { getBooks } from "../api/bookService";
import { useNavigation } from '@react-navigation/native';
import { CardStyles, SectionListStyles, stylesBookCard } from "../styles/AppStyles";
import { Card, CardContent } from "../components/Card";
import { SectionList, SectionListContent } from "../components/SectionList";

const screenWidth = Dimensions.get("window").width;

// Progress Component
const Progress = ({ value }) => {
  return (
    <View style={CardStyles.progressContainer}>
      <View style={[CardStyles.progressBar, { width: `${value}%` }]} />
    </View>
  );
};

const ProgressSummary = ({ readingTime,readingStats }) => {
  return (
      <Card style={CardStyles.cardSpacing}>
      <CardContent>
        <Text style={CardStyles.title}>Progreso de lectura</Text>
        <Text style={CardStyles.subtitle}>Horas leídas esta semana: {readingTime}h</Text>
        <Progress value={(readingTime / 10) * 100} />
        <LineChart
          data={{
            labels: readingStats.map((d) => d.day),
            datasets: [{ data: readingStats.map((d) => d.hours) }],
          }}
          width={screenWidth - 48}
          height={120}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#f0f0f0",
            backgroundGradientTo: "#f0f0f0",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
            labelColor: () => `#333`,
          }}
          bezier
          style={{ marginTop: 10, borderRadius: 8 }}
        />
      </CardContent>
    </Card>
  );
}

const SectionBookList = ({ title, bookList, onRegisterTime }) => {
  return (
    <SectionList style={SectionListStyles.cardSpacing}>
      <SectionListContent>
        <Text style={SectionListStyles.title}>{title}</Text>
        {bookList.map((book, index) => (
          <BookCard key={index} book={book} onRegisterTime={onRegisterTime} />
        ))}
      </SectionListContent>
    </SectionList>
  );
}

const BookCard = ({ index, book, onRegisterTime }) => {


  const navigation = useNavigation();

  const handleBookPress = (book) => {
    navigation.navigate('BookDetail', { book });
  };

  return (
    <Card style={CardStyles.cardSpacing}>
      <CardContent>
        {/* Book Cover */}
        <View style={stylesBookCard.bookCardContainer}>
          <View style={stylesBookCard.bookCoverContainer}>
            <TouchableOpacity key={index} onPress={() => handleBookPress(book)}>
              <Image
                source={{ uri: book.coverUrl || 'https://via.placeholder.com/150' }} // Fallback image
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
              <Text style={CardStyles.logButtonText}>Registrar 30 min</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CardContent>
    </Card>
  );
};

const BookTrackerMain = () => {
  const navigation = useNavigation();
  const [readingTime, setReadingTime]   = useState(0);
  const [booksReading, setBooksReading] = useState([]);
  const [wishlist, setWishlist]         = useState([]);
  const [booksRead, setBooksRead]       = useState([]);
  const readingStats = [
    { day: "Lun", hours: 1 },
    { day: "Mar", hours: 2 },
    { day: "Mié", hours: 1.5 },
    { day: "Jue", hours: 2 },
    { day: "Vie", hours: 3 },
  ];

  const handleRegisterTime = (book) => {
    console.log(`Tiempo registrado para el libro: ${book.title}`);
    setReadingTime((prevTime) => prevTime + 0.5); // Add 30 minutes
  };

  // Fetch books and update booksReading
  useEffect(() => {

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
        setWishlist(listBooks["to_read"]);
        setBooksReading(listBooks["reading"]);
        setBooksRead(listBooks["read"]);
      } catch (error) {
        console.error('Error al obtener libros:', error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={CardStyles.cardSpacing}>
        <Text style={CardStyles.title}>Home</Text>
        <Text style={CardStyles.subtitle}>Bienvenido a tu tracker de libros</Text>
      </View>

      {/* Botones de Navegación */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Library')}
        >
          <Text style={styles.navButtonText}>Biblioteca</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Text style={styles.navButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Resumen de progreso */}
      <ProgressSummary readingTime={readingTime} readingStats={readingStats} />
      
      {/* Libros en lectura */}
      <SectionBookList title="Leyendo" bookList={booksReading} onRegisterTime={handleRegisterTime} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBlock: 70,
    padding: 16,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default BookTrackerMain;
