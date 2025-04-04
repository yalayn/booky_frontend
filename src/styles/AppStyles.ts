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

const AppStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  darkBackground: {
    backgroundColor: Colors.black,
  },
  lightBackground: {
    backgroundColor: Colors.white,
  },
});

export default AppStyles;