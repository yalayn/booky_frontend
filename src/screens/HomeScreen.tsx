import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Image } from "react-native";
import { getBooks } from "../api/bookService";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Colors, CardStyles, SectionListStyles} from "../styles/AppStyles";
import { SectionList, SectionListContent } from "../components/SectionList";
import { Card, CardContent } from "../components/Card";

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
      </CardContent>
    </Card>
  );
}

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

const CardHome = ({ children, style }) => {
    return <View style={[CardHomeStyles.card, style]}>{children}</View>;
};
  
  
const CardHomeContent = ({ children }) => {
    return <View style={CardHomeStyles.cardContent}>{children}</View>;
};

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
                source={{ uri: book.cover_url || 'https://via.placeholder.com/150' }} // Fallback image
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

const BookTrackerMain = () => {

  const navigation = useNavigation();
  const [readingTime, setReadingTime]   = useState(0);
  const [booksReading, setBooksReading] = useState([]);
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

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={CardStyles.cardSpacing}>
          <Text style={CardStyles.title}>Home</Text>
          <Text style={CardStyles.subtitle}>Bienvenido a tu tracker de libros</Text>
        </View>
        <ProgressSummary readingTime={readingTime} readingStats={readingStats} />
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

export default BookTrackerMain;
