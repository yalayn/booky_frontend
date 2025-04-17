import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CardStyles } from "../styles/AppStyles";
import { Card, CardContent } from "./Card";

// Define the type for the props
type CardBookListProps = {
  title: string;
  bookList: { title: string; author: string }[]; // Array of books with title and author
};

const CardBookList: React.FC<CardBookListProps> = ({ title, bookList }) => {
  const navigation = useNavigation();

  const handleBookPress = (book: { title: string; author: string }) => {
    navigation.navigate("BookDetail", { book });
  };

  return (
    <Card style={CardStyles.cardSpacing}>
      <CardContent>
        <Text style={CardStyles.title}>{title}</Text>
        {bookList.map((book, index) => (
          <TouchableOpacity key={index} onPress={() => handleBookPress(book)}>
            <Text style={CardStyles.item}>
              {book.title} - {book.author}
            </Text>
          </TouchableOpacity>
        ))}
      </CardContent>
    </Card>
  );
};

export default CardBookList;