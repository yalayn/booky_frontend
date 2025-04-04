import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '../styles/AppStyles';
import Section from '../components/Section';

const HomeScreen = (): React.JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter }]}>
      <Section title="Bienvenido a la aplicación">
        Esta es la pantalla de inicio de tu aplicación. Aquí puedes agregar más contenido y personalizarla según tus necesidades.
      </Section>
      <Section title="Comenzar a trabajar">
        Editar <Text style={styles.highlight}>HomeScreen.tsx</Text> para comenzar a trabajar en tu aplicación.
      </Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  highlight: {
    fontWeight: '700',
  },
});

export default HomeScreen;