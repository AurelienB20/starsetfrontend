import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import config from '../config.json';

const AccountInfoScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();
  const route = useRoute() as any;
  const { email, password , preferredFields} = route.params || {};

  const handleFirstNameChange = (text : any) => setFirstName(text);
  const handleLastNameChange = (text : any) => setLastName(text);
  const handleAddressChange = (text : any) => setAddress(text);
  const handlePhoneNumberChange = (text : any) => setPhoneNumber(text);

  const getAccountId = async () => {
    try {
      const accountId = await AsyncStorage.getItem('account_id');
      if (accountId !== null) {
        return accountId;
      }
    } catch (e) {
      console.error('Erreur lors de la récupération du type de compte', e);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          preferredFields,
          firstName,
          lastName,
          birthDate: birthDate.toISOString().split('T')[0],
          address,
          phoneNumber,
        }),
      });
      const data = await response.json();
      saveData(data.account);
      if (data.success) {
        navigation.navigate('chooseAccount' as never);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  const saveData = async (account: any) => {
    try {
      await AsyncStorage.setItem('account_id', account['id']);
      await AsyncStorage.setItem('worker_id', account['worker']);
    } catch (e) {
      console.error('Erreur lors de la sauvegarde du type de compte', e);
    }
  };

  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);

  const onChangeDate = (event : any, selectedDate : any) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(false);
    setBirthDate(currentDate);
  };

  const changeYearBy = (years: any) => {
    const newDate = new Date(birthDate);
    newDate.setFullYear(newDate.getFullYear() + years);
    setBirthDate(newDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.enter}>Nouveau worker</Text>
      <Text style={styles.subtitle}>
        Parlez-nous de vous, nous souhaitons vraiment vous connaître !
      </Text>

      <TextInput
        style={styles.nameInput}
        onChangeText={handleFirstNameChange}
        placeholder="Prénom"
        placeholderTextColor="#808080"
        value={firstName}
      />

      <TextInput
        style={styles.nameInput}
        onChangeText={handleLastNameChange}
        placeholder="Nom"
        placeholderTextColor="#808080"
        value={lastName}
      />

      <TouchableOpacity onPress={toggleDatePicker} style={styles.dateDiv}>
        <TextInput
          style={styles.birth}
          placeholder="Date de naissance"
          placeholderTextColor="#808080"
          value={birthDate.toLocaleDateString()}
          editable={false}
        />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={birthDate}
          mode="date"
          display="spinner"
          onChange={onChangeDate}
        />
      )}

      

      <TextInput
        style={styles.place}
        onChangeText={handleAddressChange}
        placeholder="Adresse"
        placeholderTextColor="#808080"
        value={address}
      />

      <TextInput
        style={styles.number}
        onChangeText={handlePhoneNumberChange}
        placeholder="+33 "
        placeholderTextColor="#808080"
        keyboardType="phone-pad"
        maxLength={15}
        value={phoneNumber}
      />

      <TouchableOpacity onPress={handleSubmit} style={styles.submitbutton}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Suivant</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 16, color: 'black', position: 'absolute', bottom: 30, left: 0, right: 0, textAlign: 'center' }}>
        Star set
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enter: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 40,
    marginTop: 0,
    marginHorizontal: 20,
    color: 'black',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 13,
    textAlign: 'center',
    color: 'black',
    marginBottom: 50,
  },
  nameInput: {
    fontFamily: 'Outfit',
    width: '70%',
    maxWidth: 250,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'black',
    color: 'black',
    textAlign: 'center',
    fontSize: 15,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    paddingHorizontal: 30,
  },
  birth: {
    fontFamily: 'Outfit',
    width: '70%',
    maxWidth: 250,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'black',
    color: 'black',
    textAlign: 'center',
    fontSize: 15,
    padding: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  place: {
    fontFamily: 'Outfit',
    width: '70%',
    maxWidth: 350,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'black',
    color: 'black',
    textAlign: 'center',
    fontSize: 15,
    padding: 8,
    marginTop: 10,
  },
  number: {
    fontFamily: 'Outfit',
    width: '70%',
    maxWidth: 350,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'black',
    color: 'black',
    textAlign: 'center',
    fontSize: 15,
    padding: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  submitbutton: {
    maxWidth: 300,
    width: '60%',
    height: 50,
    backgroundColor: '#70FF70',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  dateDiv: {
    alignItems: 'center',
  },
  quickNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '70%',
    marginBottom: 20,
  },
  quickNavText: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default AccountInfoScreen;
