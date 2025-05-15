import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CountryPicker from 'react-native-country-picker-modal'; // Importer la bibliothèque
import DateTimePicker from '@react-native-community/datetimepicker';
import config from '../config.json';
import PhoneInput from 'react-native-phone-number-input';
import { Platform } from 'react-native';

const AccountInfoScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState<any>(null);
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const phoneInputRef = useRef<PhoneInput>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [countryCode, setCountryCode] = useState<any>('FR'); // Code du pays initial, ici la France
  const [callingCode, setCallingCode] = useState('+33'); // Code du pays initial
  const [showCountryPicker, setShowCountryPicker] = useState(false); // Afficher ou cacher le picker du pays

  const navigation = useNavigation();
  const route = useRoute() as any;
  const { email, password , preferredFields, address, coordinates} = route.params || {};
  
  const handleFirstNameChange = (text : any) => setFirstName(text);
  const handleLastNameChange = (text : any) => setLastName(text);
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
    const fullPhoneNumber = `+${callingCode}${phoneNumber}`.replace(/\s/g, '');
    console.log('fullPhoneNumber')
    console.log(fullPhoneNumber)

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
          coordinates : coordinates
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

  // Fonction pour gérer la sélection du pays
  const onSelectCountry = (country: any) => {
    setCountryCode(country.cca2); // Code du pays (par exemple, 'FR' pour la France)
    setCallingCode(country.callingCode[0]); // Indicatif téléphonique
    setShowCountryPicker(false); // Fermer le picker une fois qu'un pays est sélectionné
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

      

      <PhoneInput
        ref={phoneInputRef}
        defaultValue={phoneNumber}
        defaultCode="FR"
        layout="first"
        onChangeFormattedText={(text : any) => setPhoneNumber(text)}
        containerStyle={{
          borderWidth: 2,
          borderColor: 'black',
          borderRadius: 10,
          backgroundColor: 'white',
          width: '80%',
          
          marginBottom: 20,
        }}
        textContainerStyle={{
          borderRadius: 8,
          backgroundColor: 'white',
        }}
        textInputStyle={{
          color: 'black',
          fontFamily: 'Outfit',
          textAlign: 'center',
          fontSize: 15,
        }}
        codeTextStyle={{ color: 'black' }}
      />

      {/* Modal de sélection du pays */}
      {showCountryPicker && (
        <CountryPicker
          withFlag
          withCallingCode
          onSelect={onSelectCountry}
          countryCode={countryCode}
          withFilter
        />
      )}

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

  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    width: 60,
    height: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 8,
  },
  countryCodeText: {
    fontSize: 15,
    color: 'black',
  },
});

export default AccountInfoScreen;
