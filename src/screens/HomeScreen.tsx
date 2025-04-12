import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Timer } from "lucide-react-native";
import { LineChart } from "react-native-chart-kit";
import { getBooks } from "../api/bookService";

const screenWidth = Dimensions.get("window").width;

// Progress Component
const Progress = ({ value }) => {
  return (
    <View style={styles.progressContainer}>
      <View style={[styles.progressBar, { width: `${value}%` }]} />
    </View>
  );
};

// Card Component
const Card = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const CardContent = ({ children }) => {
  return <View style={styles.cardContent}>{children}</View>;
};

/*
const fetchBooks = async () => {
  try {
    const listBooks = {};
    const data = await getBooks();
    Object.entries(data).forEach(([state, books]) => {
      listBooks[state] = [];
      books.forEach((book: any) => {
        const title = `${book.title} - ${book.author}`;
        listBooks[state].push(title);
      });
    });
    console.log("1 **** listBooks", listBooks);
    return listBooks;
  } catch (error) {
    console.error('Error al obtener libros:', error);
  }
};*/

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
            const title = `${book.title} - ${book.author}`;
            listBooks[state].push(title);
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
      <Card style={styles.cardSpacing}>
        <CardContent>
          <Text style={styles.title}>Progreso de lectura</Text>
          <Text style={styles.subtitle}>Horas leídas esta semana: {readingTime}h</Text>
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
      <Card style={styles.cardSpacing}>
        <CardContent>
          <Text style={styles.title}>En lectura</Text>
          {booksReading.map((book, index) => (
            <Text key={index} style={styles.item}>{book}</Text>
          ))}
        </CardContent>
      </Card>

      {/* Lista de deseos */}
      <Card style={styles.cardSpacing}>
        <CardContent>
          <Text style={styles.title}>Por leer</Text>
          {wishlist.map((book, index) => (
            <Text key={index} style={styles.item}>{book}</Text>
          ))}
        </CardContent>
      </Card>

      {/* Historial de lectura */}
      <Card style={styles.cardSpacing}>
        <CardContent>
          <Text style={styles.title}>Leidos</Text>
          {booksRead.map((book, index) => (
            <Text key={index} style={styles.item}>{book}</Text>
          ))}
        </CardContent>
      </Card>

      {/* Registro de tiempo de lectura */}
      <TouchableOpacity
        style={styles.logButton}
        onPress={() => setReadingTime(readingTime + 0.5)}
      >
        <Timer color="white" />
        <Text style={styles.logButtonText}>Registrar 30 minutos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 16,
  },
  cardSpacing: {
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: "column",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
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
    backgroundColor: "#007bff",
  },
  logButton: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 12,
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

export default BookTrackerMain;
