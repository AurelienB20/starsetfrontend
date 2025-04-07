import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import {Calendar} from 'react-native-big-calendar';
import moment from 'moment';
import config from '../config.json';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '@/context/userContext';

const ModifyAvailabilityScreen = () => {
  const navigation = useNavigation();
  const { user, setUser } = useUser();

  const [events, setEvents] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [workingDays, setWorkingDays] = useState<any>({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  const [timeRange, setTimeRange] = useState({ start: '', end: '' });

  useEffect(() => {
    if (user?.availability) {
      setEvents(user.availability);
    }
  }, [user]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleAddAvailability = () => {
    if (!selectedDate || !timeRange.start || !timeRange.end) return;

    const startTime = moment(`${moment(selectedDate).format('YYYY-MM-DD')}T${timeRange.start}`).toDate();
    const endTime = moment(`${moment(selectedDate).format('YYYY-MM-DD')}T${timeRange.end}`).toDate();

    const newEvent = {
      title: 'Disponible',
      start: startTime,
      end: endTime,
    };

    setEvents([...events, newEvent]);
    setShowModal(false);
  };

  const handleConfirmUpdate = async () => {
    const updatedUser = { ...user, availability: events };
    setUser(updatedUser);

    try {
      const response = await fetch(`${config.backendUrl}/api/auth/update-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account: updatedUser }),
      });
      if (!response.ok) throw new Error('Erreur de réseau');

      const data = await response.json();
      console.log('Mise à jour réussie:', data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du compte:', error);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier vos disponibilités</Text>

      <View style={styles.daysContainer}>
        <Text style={styles.label}>Jours de la semaine</Text>
        {Object.keys(workingDays).map((day, index) => (
          <View key={index} style={styles.dayCheckboxContainer}>
            <Text style={styles.dayLabel}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setWorkingDays({ ...workingDays, [day]: !workingDays[day] })}
            >
              <Text>{workingDays[day] ? '✔️' : '❌'}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Calendar
        events={events}
        height={400}
        onPressCell={handleDateClick}
        mode="week"
      />

      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter une disponibilité</Text>

            <TextInput
              style={styles.input}
              placeholder="Heure de début (ex: 09:00)"
              value={timeRange.start}
              onChangeText={(text) => setTimeRange({ ...timeRange, start: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Heure de fin (ex: 17:00)"
              value={timeRange.end}
              onChangeText={(text) => setTimeRange({ ...timeRange, end: text })}
            />

            <TouchableOpacity style={styles.button} onPress={handleAddAvailability}>
              <Text style={styles.buttonText}>Ajouter Disponibilité</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => setShowModal(false)}>
              <Text style={styles.buttonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmUpdate}>
        <Text style={styles.buttonText}>Confirmer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  daysContainer: { marginBottom: 20 },
  dayCheckboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  dayLabel: { fontSize: 16, marginRight: 10 },
  checkbox: { padding: 10, borderWidth: 1, borderRadius: 5, marginRight: 20 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 5, marginBottom: 10, paddingHorizontal: 10 },
  button: { backgroundColor: '#70FF70', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, marginBottom: 10 },
  buttonText: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  confirmButton: { backgroundColor: '#70FF70', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
});

export default ModifyAvailabilityScreen;
