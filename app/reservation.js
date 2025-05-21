import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { BASE_URL } from './config';

export default function ReservationScreen() {
  const { restaurant_id } = useLocalSearchParams();
  const router = useRouter();

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [people, setPeople] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleReservation = async () => {
    if (!restaurant_id || !people) {
      Alert.alert('Σφάλμα', 'Συμπλήρωσε όλα τα πεδία');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const user_id = await AsyncStorage.getItem('user_id');
      const formattedDate = date.toISOString().split('T')[0];
      const formattedTime = time.toTimeString().split(' ')[0];

      await fetch(`${BASE_URL}/api/reservations`  , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurant_id,
          user_id,
          reservation_date: formattedDate,
          reservation_time: formattedTime,
          people: Number(people),
        }),
      });

      Alert.alert('✅ Επιτυχία', 'Η κράτηση υποβλήθηκε');
      router.replace('/home');
    } catch (err) {
      console.error('Reservation error:', err);
      Alert.alert('Σφάλμα', 'Η κράτηση απέτυχε');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>e-στιατόρια</Text>
      <Text style={styles.subtitle}>Φόρμα Κράτησης</Text>

      <Button
        title={`Ημερομηνία: ${date.toDateString()}`}
        onPress={() => setShowDatePicker(true)}
        color="#1e90ff"
      />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            if (selectedDate) setDate(selectedDate);
            setShowDatePicker(false);
          }}
        />
      )}

      <Button
        title={`Ώρα: ${time.toTimeString().slice(0, 5)}`}
        onPress={() => setShowTimePicker(true)}
        color="#1e90ff"
      />
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            if (selectedTime) setTime(selectedTime);
            setShowTimePicker(false);
          }}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Αριθμός Ατόμων"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        value={people}
        onChangeText={setPeople}
      />

      <Button title="Κράτηση" onPress={handleReservation} color="#1e90ff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#ccc',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
});
