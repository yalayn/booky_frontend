import React from "react";
import { View } from 'react-native';
import { CardStyles } from "../styles/AppStyles";

// Card Component
const Card = ({ children, style }) => {
    return <View style={[CardStyles.card, style]}>{children}</View>;
};
  
  
const CardContent = ({ children }) => {
    return <View style={CardStyles.cardContent}>{children}</View>;
};

export { Card, CardContent };