import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BASE_URL } from './config';

export default function RestaurantsScreen() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [people, setPeople] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/restaurants`  , {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurants(response.data);
      } catch (error) {
        Alert.alert('Σφάλμα', 'Αποτυχία φόρτωσης εστιατορίων');
      }
    };
    fetchRestaurants();
  }, []);

  const handleReservation = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const user_email = await AsyncStorage.getItem('user_email');
      const formattedDate = date.toISOString().split('T')[0];
      const formattedTime = time.toTimeString().split(' ')[0];

      await axios.post(
        `${BASE_URL}/api/reservations`,
        {
          restaurant_name: selectedRestaurant.name,
          reservation_date: formattedDate,
          reservation_time: formattedTime,
          people,
          user_email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert('✅ Επιτυχία', 'Η κράτηση ολοκληρώθηκε');
      setSelectedRestaurant(null);
      setPeople('');
    } catch (error) {
      Alert.alert('Σφάλμα', 'Αποτυχία καταχώρησης κράτησης');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.text}>Τοποθεσία: {item.location}</Text>
      <Text style={styles.text}>Κουζίνα: {item.cuisine}</Text>
      <Button title="Κράτηση" onPress={() => setSelectedRestaurant(item)} color="#1e90ff" />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>e-στιατόρια</Text>

        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
          ListFooterComponent={
            selectedRestaurant && (
              <View style={styles.form}>
                <Text style={styles.formTitle}>Κράτηση για: {selectedRestaurant.name}</Text>

                <Button
                  title={`Ημερομηνία: ${date.toDateString()}`}
                  onPress={() => setShowDatePicker(true)}
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
                  placeholder="Αριθμός ατόμων"
                  placeholderTextColor="#ccc"
                  keyboardType="numeric"
                  value={people}
                  onChangeText={setPeople}
                />

                <Button title="Ολοκλήρωση" onPress={handleReservation} color="#1e90ff" />
              </View>
            )
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 12,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
  text: {
    color: '#ccc',
  },
  form: {
    marginTop: 20,
    backgroundColor: '#1c1c1c',
    padding: 20,
    borderRadius: 10,
  },
  formTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});
