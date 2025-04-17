import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getBooks } from "../api/bookService";
import { SectionList, SectionListContent } from '../components/SectionList';
import { Card, CardContent } from '../components/Card';
import { Colors, CardStyles, SectionListStyles, stylesBookCard } from '../styles/AppStyles';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, Image } from 'react-native';

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
        'read'   : 'Leído',
        'to_read': 'Por leer',
        'reading': 'Leyendo'
    }
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

const BookCard = ({ index, book }) => {


    const navigation = useNavigation();
  
    const handleBookPress = (book) => {
      navigation.navigate('BookDetail', { book });
    };
  
    return (
      <Card style={CardStyles.cardSpacing}>
        <CardContent>
          {/* Book Cover */}
            <TouchableOpacity key={index} onPress={() => handleBookPress(book)}>
                <View style={stylesBookCard.bookCardContainer}>
                    <View style={stylesBookCard.bookCoverContainer}>
                        <Image
                        source={{ uri: book.coverUrl || 'https://via.placeholder.com/150' }} // Fallback image
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
            </TouchableOpacity>
        </CardContent>
      </Card>
    );
  };

const LibraryScreen = () => {

    const [listBooks, setlistBooks] = useState([]);
    
    useEffect(() => {

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
    }, []);

  return (
    <ScrollView>
        <View style={styles.container}>
        <Text style={styles.title}>Biblioteca</Text>
        <Text style={styles.subtitle}>Aquí puedes ver tus libros.</Text>
        <SectionBookList title="" bookList={listBooks}/>
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
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

export default LibraryScreen;