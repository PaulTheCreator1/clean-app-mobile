import axios from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { BASE_URL } from './config';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await axios.post(`${BASE_URL}/api/users/register`, {
        name,
        email,
        password,
      });
      Alert.alert('Επιτυχία', 'Ο λογαριασμός δημιουργήθηκε');
      router.replace('/');
    } catch (error) {
      console.error('Register error:', error);
      Alert.alert('Σφάλμα', 'Δεν έγινε εγγραφή');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>e-στιατόρια</Text>
      <Text style={styles.title}>Εγγραφή</Text>

      <TextInput
        style={styles.input}
        placeholder="Όνομα"
        placeholderTextColor="#ccc"
        value={name}
        onChangeText={setName}
      />
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

      <Button title="Εγγραφή" onPress={handleRegister} color="#2196f3" />
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
});
