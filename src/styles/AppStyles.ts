import { StyleSheet } from 'react-native';
import { Colors as DefaultColors } from 'react-native/Libraries/NewAppScreen';

// Define and export the Colors object
export const Colors = {
  ...DefaultColors, // Include default colors from React Native
  
  // BG COLORS UI
  lighter  : '#F0E8DF',
  darker   : '#5A8B9E',
  primary  : '#F2D582',
  secondary: '#83C3CC',
  tertiary : '#D9D6D2',
  container: '#f5f5f5',
  
  // BG STATES USER BOOK
  state_toread : '#F2B95D',
  state_read   : '#F2798F',
  state_reading: '#9A9DD9',
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

const CardStyles = StyleSheet.create({
  container: {
    paddingBlock:70,
    padding:16,
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

export { AppStyles, CardStyles };