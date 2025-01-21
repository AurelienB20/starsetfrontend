import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, GestureResponderEvent } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, TextStyle } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import axios from '../api/axios';
import config from '../config.json';

const CreationScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const handleEmailChange = (text:React.SetStateAction<string>) => {
    setEmail(text);
  };

  const handlePasswordChange = (text:React.SetStateAction<string>) => {
    setPassword(text);
  };

  const handleConfirmPasswordChange = (text:React.SetStateAction<string>) => {
    setConfirmPassword(text);
  };

  const handleSubmit = async () => {
    if (password==confirmPassword)  {
      console.log(password)
      try {
        const response = await fetch(`${config.backendUrl}/api/auth/register`, {
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
          console.log(data);
          console.log(data.account)
          console.log(data.account['id'])
          saveData(data.account['id'])
          navigation.navigate('accountInfo' as never); // Par exemple, pour naviguer vers la page d'accueil
          
        } else {
          setErrorMessage('Email ou mot de passe incorrect');
        }
      } catch (error) {
        setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
      } finally {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    }
    
  };

  const saveData = async (account: any) => {
    try {
      await AsyncStorage.setItem('account_id', account['id']);
      await AsyncStorage.setItem('worker_id', account['worker_id']);
      
    } catch (e) {
      // gérer les erreurs de stockage ici
      console.error('Erreur lors de la sauvegarde du type de compte', e);
    }
  };

  const toggleCheckbox = (event: GestureResponderEvent): void => {
    setIsChecked(!isChecked);
  };

  return (
    <View style={styles.container}>

        <Text
          style={styles.enter}
        >
          Création par Email !
        </Text>
        
        <Text
          style={styles.subtitle}
        >
          Laissez-nous identifier votre profil, Star Set n'attends plus que vous !
        </Text>
        
          <TextInput
            style={styles.inputemailcreation}
            onChangeText={handleEmailChange}
            
            placeholder="starset@exemple.com"
            placeholderTextColor="#808080"
          />
          <TextInput
            style={styles.inputpassword}
            onChangeText={handlePasswordChange}
            
            placeholder="mot de passe"
            placeholderTextColor="#808080"
          />
          <TextInput
            style={styles.inputpassword}
            onChangeText={handleConfirmPasswordChange}
            
            placeholder="confirmation mot de passe"
            placeholderTextColor="#808080"
          />
          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.submitbutton}
          >
            <Text style={{ fontSize: 20, fontWeight : 'bold', }}>Suivant</Text>
          </TouchableOpacity>
        
        
      
    </View>
  );
};

const styles = StyleSheet.create({
  container : {
    width : '100%',
    height : '100%',
    backgroundColor : '#FFFFFF',
    paddingHorizontal : 10,
    flex: 1, alignItems: 'center', justifyContent: 'center' ,
    marginHorizontal: 3
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
    fontSize: 10,
    textAlign: "center",
    color : 'black',
    marginBottom : 50,
    
  },


  inputemailcreation: {
    fontFamily: "Outfit",
    width: '70%',
    maxWidth : 450,
    backgroundColor: "white",
    borderRadius: 15,
    borderWidth: 2,         
    borderColor: 'black', 
    color: "black",
    textAlign: "center",
    fontSize: 15,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal : 10,
   
    paddingHorizontal : 30,
  },

  
  inputpassword: {
    fontFamily: "Outfit",
    width: '70%',
    maxWidth : 450,
    backgroundColor: "white",
    borderRadius: 15,
    borderWidth: 2,       
    borderColor: 'black',   
    color: "black",
    textAlign: "center",
    fontSize: 15,
    padding: 10,
    marginTop: 10,
    marginHorizontal : 10,
    paddingHorizontal : 30,
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
  
});

export default CreationScreen;