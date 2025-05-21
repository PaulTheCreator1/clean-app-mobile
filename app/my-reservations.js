// ... imports (ίδιοι όπως πριν)
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BASE_URL } from './config';

export default function MyReservationsScreen() {
  const [reservations, setReservations] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [editData, setEditData] = useState({
    reservation_date: '',
    reservation_time: '',
    people: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const fetchReservations = async () => {
    const token = await AsyncStorage.getItem('token');
    const user_id = await AsyncStorage.getItem('user_id');

    try {
      const res = await axios.get(`${BASE_URL}/api/reservations?user_id=${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations(res.data);
    } catch {
      Alert.alert('Σφάλμα', 'Αποτυχία φόρτωσης κρατήσεων');
    }
  };

  const deleteReservation = async (id) => {
    const token = await AsyncStorage.getItem('token');
    try {
      await axios.delete(`${BASE_URL}/api/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReservations();
    } catch {
      Alert.alert('Σφάλμα', 'Αποτυχία διαγραφής κράτησης');
    }
  };

  const openEditModal = (reservation) => {
    setSelectedReservation(reservation);
    setEditData({
      reservation_date: reservation.reservation_date.split('T')[0],
      reservation_time: reservation.reservation_time,
      people: reservation.people.toString(),
    });
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    const token = await AsyncStorage.getItem('token');

    const updatedReservation = {
      restaurant_name: selectedReservation.restaurant_name,
      reservation_date: editData.reservation_date,
      reservation_time: editData.reservation_time,
      people: parseInt(editData.people),
    };

    try {
      await axios.put(
        `${BASE_URL}/api/reservations/${selectedReservation.id}`,
        updatedReservation,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setEditModalVisible(false);
      fetchReservations();
    } catch (err) {
      Alert.alert('Σφάλμα', err.response?.data?.error || 'Αποτυχία ενημέρωσης');
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.restaurant_name}</Text>
      <Text style={styles.text}>Ημερομηνία: {item.reservation_date}</Text>
      <Text style={styles.text}>Ώρα: {item.reservation_time}</Text>
      <Text style={styles.text}>Άτομα: {item.people}</Text>
      <View style={styles.buttonRow}>
        <Button title="Διαγραφή" onPress={() => deleteReservation(item.id)} color="red" />
        <Button title="Επεξεργασία" onPress={() => openEditModal(item)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>e-στιατόρια | Οι κρατήσεις μου</Text>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Modal visible={editModalVisible} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Επεξεργασία Κράτησης</Text>

          <Button
            title={`Ημερομηνία: ${editData.reservation_date}`}
            onPress={() => setShowDatePicker(true)}
          />
          {showDatePicker && (
            <DateTimePicker
              value={new Date(editData.reservation_date)}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setEditData({ ...editData, reservation_date: selectedDate.toISOString().split('T')[0] });
                }
                setShowDatePicker(false);
              }}
            />
          )}

          <Button
            title={`Ώρα: ${editData.reservation_time}`}
            onPress={() => setShowTimePicker(true)}
          />
          {showTimePicker && (
            <DateTimePicker
              value={new Date(`2000-01-01T${editData.reservation_time}`)}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                if (selectedTime) {
                  const formatted = selectedTime.toTimeString().slice(0, 5);
                  setEditData({ ...editData, reservation_time: formatted });
                }
                setShowTimePicker(false);
              }}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Άτομα"
            keyboardType="numeric"
            value={editData.people}
            onChangeText={(val) => setEditData({ ...editData, people: val })}
          />

          <Button title="Αποθήκευση" onPress={handleSaveEdit} />
          <View style={{ marginTop: 10 }}>
            <Button title="Ακύρωση" onPress={() => setEditModalVisible(false)} color="grey" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  header: { color: '#fff', fontSize: 24, marginBottom: 20, fontWeight: 'bold', textAlign: 'center' },
  card: { backgroundColor: '#222', padding: 16, marginBottom: 12, borderRadius: 10 },
  title: { fontWeight: 'bold', fontSize: 18, color: '#fff', marginBottom: 6 },
  text: { color: '#ccc' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  modal: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
