import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import HomeScreen from '../screens/HomeScreen';
import LibraryScreen from '../screens/LibraryScreen';
import SearchScreen from '../screens/SearchScreen';
import BookDetail from '../screens/BookDetail';
import LoginScreen from '../screens/LoginScreen';
import BottomMenu from '../components/BottomMenu';

const Tab          = createBottomTabNavigator();
const LibraryStack = createNativeStackNavigator();
const HomeStack    = createNativeStackNavigator();

const HomeStackScreen = () => {
  const { logout } = useContext(AuthContext);
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen
        name="Home"
        children={(props) => <HomeScreen {...props} onLogout={logout} />}
      />
      <HomeStack.Screen name="BookDetail" component={BookDetail} />
    </HomeStack.Navigator>
  );
};

const LibraryStackScreen = () => (
  <LibraryStack.Navigator screenOptions={{ headerShown: false }}>
    <LibraryStack.Screen name="Library" component={LibraryScreen} />
    <LibraryStack.Screen name="BookDetail" component={BookDetail} />
  </LibraryStack.Navigator>
);

const AppNavigator = () => {
  const { isAuthenticated, checkingAuth, login } = useContext(AuthContext);

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <BottomMenu {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="HomeTab" options={{ title: 'Inicio' }}>
          {() => <HomeStackScreen />}
        </Tab.Screen>
        <Tab.Screen name="Library" component={LibraryStackScreen} options={{ title: 'Biblioteca' }} />
        <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Buscar' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;