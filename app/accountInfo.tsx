import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, GestureResponderEvent , StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config.json';

const AccountInfoScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [show, setShow] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const navigation = useNavigation();
  console.log(1111)

  const handleFirstNameChange = (text: React.SetStateAction<string>) => setFirstName(text);
  const handleLastNameChange = (text: React.SetStateAction<string>) => setLastName(text);
  const handleAddressChange = (text: React.SetStateAction<string>) => setAddress(text);
  const handlePhoneNumberChange = (text: React.SetStateAction<string>) => setPhoneNumber(text);
  

  const onChange = (e: any, selectedDate: any) => {
    const currentDate = selectedDate || birthDate;
    setShow(false);
    setBirthDate(currentDate);
  };

  

  const getAccountId = async () => {
    try {
      const accountId = await AsyncStorage.getItem('account_id');
      if (accountId !== null) {
        // Rediriger l'utilisateur en fonction du type de compte
        return accountId
      }
    } catch (e) {
      // gérer les erreurs de récupération ici
      console.error('Erreur lors de la récupération du type de compte', e);
    }
  };

  const handleSubmit = async () => {
    console.log(1)
    const accountId = await getAccountId()
    console.log('accountId')
    console.log(accountId)
    
    try {
      
      const response = await fetch(`${config.backendUrl}/api/auth/update-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          birthDate,
          address,
          phoneNumber,
          accountId,
         }),
      });
      const data = await response.json();
      console.log(data)
      saveData(data.account)
      if (data.success) {
        navigation.navigate('chooseAccount' as never); // Remplacez 'NextScreen' par le nom de votre prochaine écran
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
      await AsyncStorage.setItem('firstname', account['firstname']);
      await AsyncStorage.setItem('lastname', account['lastname']);
      
    } catch (e) {
      // gérer les erreurs de stockage ici
      console.error('Erreur lors de la sauvegarde du type de compte', e);
    }
  };



  const showDatepicker = () => setShow(true);

  return (
    <View style={styles.container}>
      <Text style={styles.enter}>
        Nouveau worker
      </Text>

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

      <TouchableOpacity onPress={showDatepicker} style={styles.dateDiv}>
        <TextInput
          style={styles.birth}
          placeholder="Date de naissance"
          placeholderTextColor="#808080"
          value={birthDate.toLocaleDateString()}
          editable={false}
        />
      </TouchableOpacity>

      

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
  container : {
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
    marginHorizontal : 20,
    color : 'black'
},

  subtitle: {
    marginTop: 10,
    fontSize: 13,
    textAlign: "center",
    color : 'black',
    marginBottom : 50,
  },

  nameInput: {
    fontFamily: "Outfit",
    width: "70%",
    maxWidth : 250,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'black',
    color: "black",
    textAlign: "center",
    fontSize: 15,
    padding: 10,
    marginBottom: 10,
    marginHorizontal : 10,
    paddingHorizontal : 30,
  },

  
  birth: {
    fontFamily: "Outfit",
    width: "70%",
    maxWidth : 250,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'black',
    color: "black",
    textAlign: "center",
    fontSize: 15,
    padding: 8,
    marginTop: 10,
    marginBottom: 20,
  },

  place: {
    fontFamily: "Outfit",
    width: "70%",
    maxWidth : 350,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'black',
    color: "black",
    textAlign: "center",
    fontSize: 15,
    padding: 8,
    marginTop: 10,
  },

  
  number: {
    fontFamily: "Outfit",
    width: "70%",
    maxWidth : 350,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'black',
    color: "black",
    textAlign: "center",
    fontSize: 15,
    padding: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  
  submitbutton : {   
    maxWidth: 300,
    width: "60%",
    height: 50,
    backgroundColor: '#70FF70',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius : 25,
    marginHorizontal : 10,
  },

  dateDiv : {
    alignItems: 'center'
  }

});

export default AccountInfoScreen;


