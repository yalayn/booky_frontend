import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Toast, { BaseToast } from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './src/screens/HomeScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import SearchScreen from './src/screens/SearchScreen';
import BottomMenu from './src/components/BottomMenu';
import BookDetail from './src/screens/BookDetail';
import LoginScreen from './src/screens/LoginScreen';
import { setAccessToken } from './src/api/httpClient';
import { View, Text } from 'react-native';

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

// Dentro de App()
const HomeStackScreen = ({ setIsAuthenticated }) => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen
      name="Home"
      children={navProps => <HomeScreen {...navProps} onLogout={() => setIsAuthenticated(false)} />}
    />
    <HomeStack.Screen name="BookDetail" component={BookDetail} />
  </HomeStack.Navigator>
);

const LibraryStackScreen = () => {
  return (
    <LibraryStack.Navigator screenOptions={{ headerShown: false }}>
      <LibraryStack.Screen name="Library" component={LibraryScreen} />
      <LibraryStack.Screen name="BookDetail" component={BookDetail} />
    </LibraryStack.Navigator>
  );
}

function App(): React.JSX.Element {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) setAccessToken(token);
      setIsAuthenticated(!!token);
      setCheckingAuth(false);
    };
    checkToken();
  }, []);


  const HomeStackScreenWrapper = (props:any) => (
    <HomeStackScreen {...props} setIsAuthenticated={setIsAuthenticated} />
  );

  if (checkingAuth) return (
    <SafeAreaProvider>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando...</Text>
      </View>
    </SafeAreaProvider>
  );

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          tabBar={props => <BottomMenu {...props} />} // corregido aquí
          screenOptions={{ headerShown: false, }}
        >
          <Tab.Screen
            name="HomeTab"
            options={{ title: 'Inicio' }}
          >
            {props => <HomeStackScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
          </Tab.Screen>
          <Tab.Screen name="Library" component={LibraryStackScreen} options={{ title: 'Biblioteca' }} />
          <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Buscar' }} />
        </Tab.Navigator>
        <Toast config={configToast} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;