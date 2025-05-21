import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Toast, { BaseToast } from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import SearchScreen from './src/screens/SearchScreen';
import BottomMenu from './src/components/BottomMenu';
import BookDetail from './src/screens/BookDetail';

const Tab          = createBottomTabNavigator();
const LibraryStack = createNativeStackNavigator();
const HomeStack    = createNativeStackNavigator();

const configToast = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'green' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: 'bold',
      }}
      text2Style={{
        fontSize: 13,
        color: 'gray',
      }}
    />
  ),
};

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="BookDetail" component={BookDetail} />
    </HomeStack.Navigator>
  );
}

const LibraryStackScreen = () => {
  return (
    <LibraryStack.Navigator screenOptions={{ headerShown: false }}>
      <LibraryStack.Screen name="Library" component={LibraryScreen} />
      <LibraryStack.Screen name="BookDetail" component={BookDetail} />
    </LibraryStack.Navigator>
  );
}

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          tabBar={props => <BottomMenu {...props} />} // corregido aquí
          screenOptions={{ headerShown: false, }}
        >
          <Tab.Screen name="Home" component={HomeStackScreen} options={{ title: 'Inicio' }} />
          <Tab.Screen name="Library" component={LibraryStackScreen} options={{ title: 'Biblioteca' }} />
          <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Buscar' }} />
        </Tab.Navigator>
        <Toast config={configToast} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;