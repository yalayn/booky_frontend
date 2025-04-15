import { StyleSheet } from 'react-native';
import { Colors as DefaultColors } from 'react-native/Libraries/NewAppScreen';

// Define and export the Colors object
export const Colors = {
  ...DefaultColors, // Include default colors from React Native
  lighter: '#f3f3f3',
  darker: '#1c1c1c',
  primary: '#6200ee',
  secondary: '#03dac6',
};

const HomeStyles = StyleSheet.create({
    container: {
      paddingBlock:70,
      padding:16,
    }
  });
  
  export default HomeStyles;