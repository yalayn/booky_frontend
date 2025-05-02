import { StyleSheet } from 'react-native';
import { Colors as DefaultColors } from 'react-native/Libraries/NewAppScreen';

// Define and export the Colors object
export const Colors = {
  ...DefaultColors, // Include default colors from React Native
  
  red   : '#D9533D',
  green : '#00FF00',
  blue  : '#0000FF',
  yellow: '#FFFF00',
  orange: '#FFA500',

  
  // BG COLORS UI
  lighter  : '#f5f5f5',
  darker   : '#403E3B',
  primary  : '#595959',
  secondary: '#0D0D0D',
  tertiary : '#D9D6D2',
  container: '#f5f5f5',
  
  // BG STATES USER BOOK
  state_toread : '#A6A6A6',
  state_reading: '#595959',
  state_read   : '#0D0D0D',
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
  }
});

const CardStyles = StyleSheet.create({
  container: {
    paddingBlock:70,
    padding:16,
  },
  card: {
    // backgroundColor: "white",
    borderBlockColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    borderColor: "#ccc",
    shadowColor: "transparent",
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

const SectionListStyles = StyleSheet.create({
  container: {
    paddingBlock:70,
    padding:16,
  },
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 0,
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
    backgroundColor: "#403E3B",
  },
  logButton: {
    backgroundColor: "#403E3B",
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

const stylesBookCard = StyleSheet.create({
  bookCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookCoverContainer: {
    marginRight: 16,
  },
  bookCover: {
    width: 80,
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
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

export { AppStyles, CardStyles, SectionListStyles, stylesBookCard };