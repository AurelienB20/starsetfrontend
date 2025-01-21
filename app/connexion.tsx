import { View, Text, TextInput, TouchableOpacity, Alert, GestureResponderEvent } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { router } from 'expo-router';
import config from '../config.json';

const ConnexionScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();
  

  const handleEmailChange = (text: React.SetStateAction<string>) => {
    setEmail(text);
  };

  const handlePasswordChange = (text: React.SetStateAction<string>) => {
    setPassword(text);
  };

  const goToCreate = () => {
    navigation.navigate('creation' as never)
  };

  const handleSubmit = async () => {
    console.log("test")
    try {
      const response = await fetch(`${config.backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data)
      if (data.success) {
        // Rediriger ou faire autre chose en cas de succès
        console.log(data.account);
        console.log(data.account['id'])
        saveData(data.account)
       
        
        navigation.navigate({
          name: '(tabs)',
          params: { screen: 'home' },
        } as never);
        
      } else {
        setErrorMessage('Email ou mot de passe incorrect');
      }
    } catch (error) {
      setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setEmail('');
      setPassword('');
    }
  };

  const saveData = async (account: any) => {
    try {
      console.log(account)
      await AsyncStorage.setItem('account_id', account['id']);
      await AsyncStorage.setItem('worker_id', account['worker']);
      await AsyncStorage.setItem('firstname', account['firstname']);
      await AsyncStorage.setItem('lastname', account['lastname']);
    } catch (e) {
      // gérer les erreurs de stockage ici
      console.error('Erreur lors de la sauvegarde du type de compte', e);
    }
  };

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  const isFormValid = email.length > 0 && password.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}></View>

      <Text style={styles.enter}>Connectez vous !</Text>
      <View style={styles.separator}></View>
      <Text style={styles.description}>
        Laissez-nous identifier votre profil, Star Set n'attend plus que vous !
      </Text>

      <TextInput
        style={styles.input}
        onChangeText={handleEmailChange}
        placeholder="chapter@exemple.com"
        placeholderTextColor="#808080"
      />
      <TextInput
        style={styles.input}
        onChangeText={handlePasswordChange}
        placeholder="mot de passe"
        placeholderTextColor="#808080"
        secureTextEntry={true}
      />

      <View style={styles.spacer}></View>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <TouchableOpacity
        onPress={handleSubmit}
        style={[styles.connexionbutton, !isFormValid && { backgroundColor: 'gray' }]}
        disabled={!isFormValid}
      >
        <Text style={styles.buttonText}>Connexion</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToCreate}>
        <Text style={styles.createAccount}>
          Créer un compte
        </Text>
      </TouchableOpacity>
      
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
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: "#A0A0FF",
    borderRadius: 50,
    marginBottom: 70,
    top: 80,
  },
  separator: {
    width: '50%',
    height: 3,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginTop: 20,
  },
  spacer: {
    width: '100%',
    height: 120,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },

  enter: {
    fontWeight: 'bold',
    textAlign: 'center',
    
    fontSize: 40,
    marginTop: 0,
    marginHorizontal : 20,
    
    
    color : 'black'
},
description: {
  marginTop: 20,
  fontSize: 13,
  textAlign: "center",
  color : 'black',
  marginHorizontal : 10,
  
},

createAccount : {
  color : 'blue'
},
input: {
  fontFamily: "Outfit",
  width: "80%", // Utilisation de pourcentage pour la largeur
  maxWidth: 450, // Nombre pour maxWidth
  backgroundColor: "white",
  borderRadius: 15, // Nombre pour borderRadius
  borderWidth: 2, // Utilisation de borderWidth
  borderColor: "black", // Utilisation de borderColor
  color: "black",
  textAlign: "center",
  fontSize: 15,
  padding: 10, // Nombre pour padding
  marginTop: 20, // Nombre pour marginTop
  marginHorizontal: 10, // Nombre pour marginHorizontal
  paddingHorizontal: 30, // Nombre pour paddingHorizontal
  // transition: "all 0.5s", // Non pris en charge, utilisez Animated pour les animations
},

connexionbutton: {
  width: "80%", // Utilisation de pourcentage pour la largeur
  maxWidth: 400, // Nombre pour maxWidth
  height: 50,
  backgroundColor: "#70FF70",
  justifyContent: "center",
  alignItems: "center",
  marginVertical: 10,
  borderRadius: 25,
  marginHorizontal: 10,
},

});

export default ConnexionScreen;