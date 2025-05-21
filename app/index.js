import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { BASE_URL } from './config';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/users/login`, {
        user_email: email,
        password,
      });
      await AsyncStorage.setItem('token', response.data.token);
      router.replace('/home');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Σφάλμα', 'Τα στοιχεία σύνδεσης είναι λάθος');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>e-στιατόρια</Text>
      <Text style={styles.title}>Σύνδεση</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Κωδικός"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Σύνδεση" onPress={handleLogin} color="#2196f3" />
      <Text
        style={styles.link}
        onPress={() => router.push('/register')}
      >
        Δεν έχεις λογαριασμό;
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    color: '#ccc',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  link: {
    color: '#2196f3',
    textAlign: 'center',
    marginTop: 15,
  },
});
