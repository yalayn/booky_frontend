import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../styles/AppStyles';
import { initLogin, addUser } from '../api/loginService';
import { setAccessToken } from '../api/httpClient';
import StylesModal from '../styles/StylesModal';
import StandarModal from '../components/StandarModal';

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Estado para el modal de registro
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [registerLoading, setRegisterLoading]   = useState(false);

  const BodyModal = ({ onRegister, loading, onClose }) => {
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');

    const handleRegisterPress = () => {
      onRegister({ registerName, registerEmail, registerPassword });
    };

    return (
      <View style={StylesModal.modalBody}>
        <Text style={StylesModal.modalTitle}>Registro</Text>
        <TextInput
          style={StylesModal.modalInput}
          placeholder="Nombre de usuario"
          placeholderTextColor={Colors.darker}
          autoCapitalize="none"
          value={registerName}
          onChangeText={setRegisterName}
          keyboardType="default"
        />
        <TextInput
          style={StylesModal.modalInput}
          placeholder="Email"
          placeholderTextColor={Colors.darker}
          autoCapitalize="none"
          value={registerEmail}
          onChangeText={setRegisterEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={StylesModal.modalInput}
          placeholder="Contraseña"
          placeholderTextColor={Colors.darker}
          secureTextEntry
          value={registerPassword}
          onChangeText={setRegisterPassword}
        />
        <TouchableOpacity style={StylesModal.modalOption} onPress={handleRegisterPress} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={StylesModal.modalOptionText}>Registrarse</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={{ marginTop: 12 }}>
          <Text style={{ color: Colors.primary, textAlign: 'center' }}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await initLogin({ username: email, password: password });
      const tokenSuccess = response?.success;
      if (!tokenSuccess) throw new Error('Credenciales incorrectas');
      const data = response.data;
      const accessToken  = data.token;
      const refreshToken = data.refresh_token;
      const userInfo     = data.user;
      onLogin({accessToken,refreshToken,userInfo});
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  // Simulación de registro (reemplaza por tu lógica real)
  const handleRegister = async ({ registerName, registerEmail, registerPassword }) => {
    setRegisterLoading(true);
    try {
        const response = await addUser({ name: registerName, username: registerEmail, password: registerPassword });
        if (!response?.response?.success){
            Alert.alert('Registro exitoso', 'Ahora puedes iniciar sesión.');
            setRegisterModalVisible(false);
        }else{
            Alert.alert('Error', response?.response?.message || 'No se pudo registrar el usuario');
            throw new Error('Error al registrar usuario');
        }
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo registrar');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor={Colors.tertiary}
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor={Colors.tertiary}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text style={{ textAlign: 'center', marginTop: 16, color: '#666' }}> ¿No tienes una cuenta? </Text>
        <TouchableOpacity onPress={() => setRegisterModalVisible(true)}>
          <Text style={{ color: Colors.primary }}>Regístrate</Text>
        </TouchableOpacity>
      </View>
      <StandarModal onVisible={registerModalVisible} onClose={() => setRegisterModalVisible(false)}>
        <BodyModal onRegister={handleRegister} loading={registerLoading} onClose={() => setRegisterModalVisible(false)} />
      </StandarModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: Colors.lighter },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16, backgroundColor: '#fff' },
  button: { backgroundColor: Colors.primary, padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  registerContainer: { marginTop: 16, alignItems: 'center' },
  registerText: { color: Colors.primary, fontWeight: 'bold' },
  errorText: { color: 'red', marginTop: 8, textAlign: 'center' },
  loading: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -50 }, { translateY: -50 }] },
  error: { color: 'red', marginTop: 8, textAlign: 'center' },
  success: { color: 'green', marginTop: 8, textAlign: 'center' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '85%',
    alignItems: 'center',
  },
  modalBody: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '85%',
    alignItems: 'center',
  },
});

export default LoginScreen;