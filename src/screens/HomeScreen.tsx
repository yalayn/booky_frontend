import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Timer } from "lucide-react-native";
import { LineChart } from "react-native-chart-kit";
import { getBooks } from "../api/bookService";
import { useNavigation } from '@react-navigation/native';
import { CardStyles } from "../styles/AppStyles";
import { Card, CardContent } from "../components/Card";

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

const CardBookList = ({ title,bookList }) => {

  const navigation = useNavigation();

  const handleBookPress = (book) => {
    navigation.navigate('BookDetail', { book });
  };

  return (
    <Card style={CardStyles.cardSpacing}>
      <CardContent>
        <Text style={CardStyles.title}>{title}</Text>
        {bookList.map((book, index) => (
          <TouchableOpacity key={index} onPress={() => handleBookPress(book)}>
            <Text style={CardStyles.item}>{book.title} - {book.author}</Text>
          </TouchableOpacity>
        ))}
      </CardContent>
    </Card>
  );
}

const BookCard = ({ book, onRegisterTime }) => {
  return (
    <Card style={CardStyles.cardSpacing}>
      <CardContent>
        {/* Book Cover */}
        <View style={styles.bookCardContainer}>
          <View style={styles.bookCoverContainer}>
            <Image
              source={{ uri: book.coverUrl || 'https://via.placeholder.com/150' }} // Fallback image
              style={styles.bookCover}
            />
          </View>

          {/* Book Details */}
          <View style={styles.bookDetailsContainer}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookAuthor}>Autor: {book.author}</Text>

            {/* Register Time Button */}
            <TouchableOpacity
              style={CardStyles.logButton}
              onPress={() => onRegisterTime(book)}
            >
              <Text style={CardStyles.logButtonText}>Registrar tiempo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CardContent>
    </Card>
  );
};

const BookTrackerMain = () => {
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
      {/* Resumen de progreso */}
      <ProgressSummary readingTime={readingTime} readingStats={readingStats} />
      
      {/* Libros en lectura */}
      <CardBookList title="Leyendo" bookList={booksReading} />

      {/* Lista de deseos */}
      <CardBookList title="Por leer" bookList={wishlist} />
      
      {/* Historial de lectura */}
      <CardBookList title="Leído" bookList={booksRead} />

      {/* Registro de tiempo de lectura */}
      <TouchableOpacity
        style={CardStyles.logButton}
        onPress={() => setReadingTime(readingTime + 0.5)}
      >
        <Timer color="white" />
        <Text style={CardStyles.logButtonText}>Registrar 30 minutos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBlock:70,
    padding:16,
  }
});

export default BookTrackerMain;
