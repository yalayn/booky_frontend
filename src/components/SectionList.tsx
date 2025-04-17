import React from "react";
import { View } from 'react-native';
import { SectionListStyles } from "../styles/AppStyles";

// Card Component
const SectionList = ({ children, style }) => {
    return <View style={[SectionListStyles.card, style]}>{children}</View>;
};
  
  
const SectionListContent = ({ children }) => {
    return <View style={SectionListStyles.cardContent}>{children}</View>;
};

export { SectionList, SectionListContent };