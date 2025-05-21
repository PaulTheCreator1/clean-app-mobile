import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>e-στιατόρια</Text>
      <Text style={styles.subtitle}>Αρχική Σελίδα</Text>

      <Button title="Λίστα Εστιατορίων" onPress={() => router.push('/restaurants')} color="#2196f3" />
      <View style={{ height: 10 }} />
      <Button title="Οι Κρατήσεις μου" onPress={() => router.push('/my-reservations')} color="#2196f3" />
      <View style={{ height: 10 }} />
      <Button title="Αποσύνδεση" onPress={handleLogout} color="#f44336" />
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
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#ccc',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});
