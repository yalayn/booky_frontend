import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Timer } from "lucide-react-native";
import { LineChart } from "react-native-chart-kit";
import { getBooks } from "../api/bookService";
import { useNavigation } from '@react-navigation/native';
import { CardStyles } from "../styles/AppStyles";

const screenWidth = Dimensions.get("window").width;

// Progress Component
const Progress = ({ value }) => {
  return (
    <View style={CardStyles.progressContainer}>
      <View style={[CardStyles.progressBar, { width: `${value}%` }]} />
    </View>
  );
};

// Card Component
const Card = ({ children, style }) => {
  return <View style={[CardStyles.card, style]}>{children}</View>;
};

const CardContent = ({ children }) => {
  return <View style={CardStyles.cardContent}>{children}</View>;
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

  const handleBookPress = (book) => {
    navigation.navigate('BookDetail', { book });
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
      {/* Resumen de progreso */}
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

      {/* Libros en lectura */}
      <Card style={CardStyles.cardSpacing}>
        <CardContent>
          <Text style={CardStyles.title}>En lectura</Text>
          {booksReading.map((book, index) => (
            <TouchableOpacity key={index} onPress={() => handleBookPress(book)}>
              <Text style={CardStyles.item}>{book.title} - {book.author}</Text>
            </TouchableOpacity>
          ))}
        </CardContent>
      </Card>

      {/* Lista de deseos */}
      <Card style={CardStyles.cardSpacing}>
        <CardContent>
          <Text style={CardStyles.title}>Por leer</Text>
          {wishlist.map((book, index) => (
            <TouchableOpacity key={index} onPress={() => handleBookPress(book)}>
              <Text style={CardStyles.item}>{book.title} - {book.author}</Text>
            </TouchableOpacity>
          ))}
        </CardContent>
      </Card>

      {/* Historial de lectura */}
      <Card style={CardStyles.cardSpacing}>
        <CardContent>
          <Text style={CardStyles.title}>Leidos</Text>
          {booksRead.map((book, index) => (
            <TouchableOpacity key={index} onPress={() => handleBookPress(book)}>
              <Text style={CardStyles.item}>{book.title} - {book.author}</Text>
            </TouchableOpacity>
          ))}
        </CardContent>
      </Card>

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
