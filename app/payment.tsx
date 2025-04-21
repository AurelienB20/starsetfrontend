import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import config from '../config.json';
import AsyncStorage from '@react-native-async-storage/async-storage';


const PaymentScreen = () => {
  const route = useRoute() as any;
  const navigation = useNavigation();
  
  // Récupération des paramètres passés
  const { 
    startDate, 
    endDate, 
    arrivalTime, 
    departureTime, 
    prestation, 
    profilePictureUrl,
  } = route.params;

  const getAccountId = async () => {
    console.log(" debut accoount id")
    try {
      const account_id = await AsyncStorage.getItem('account_id');
      console.log("account_id 12")
      console.log(account_id)
      if (account_id !== null) {
        return account_id;
      }
    } catch (e) {
      console.error('Erreur lors de la récupération du type de compte', e);
    }
  };

  // Fonction pour gérer le paiement
  const handlePayment = async () => {
    
    let user_id =  await getAccountId()
    console.log("user_id")
    console.log(user_id)
    try {
      const response = await fetch(`${config.backendUrl}/api/planned-prestation/create-planned-prestation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          worker_id : prestation.worker_id,
          user_id : user_id,
          prestation_id : prestation.id,
          start_date: startDate,
          end_date: endDate,
          type_of_remuneration : 'hours',
          remuneration : prestation.remuneration,
          start_time : arrivalTime,
          end_time : departureTime,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        
        navigation.navigate('validation' as never);
      } else {
        Alert.alert("Erreur", "Une erreur est survenue lors du paiement.");
      }
    } catch (error) {
      console.error('Erreur lors de la requête:', error);
      Alert.alert("Erreur", "Impossible de valider le paiement. Vérifiez votre connexion.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>PAIEMENT</Text>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: profilePictureUrl || 'https://example.com/profile-picture.jpg' }} 
          style={styles.profilePicture}
        />
      </View>

      <Text style={styles.sectionHeader}>Informations générales</Text>
      <View style={styles.infoContainer}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>👶 Babysitting</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>🐶 Petsitting</Text>
        </View>
        <Text style={styles.addressText}>📍 19 avenue Charles de Gaulle, 77400</Text>
        <Text style={styles.noteText}>✏️ “Pouvez-vous préparer son dîner aux alentours de 19h30 svp. Merci 😊”</Text>
      </View>

      <Text style={styles.sectionHeader}>Mode de paiement</Text>
      <View style={styles.paymentContainer}>
        <Text style={styles.paymentText}>Total achat</Text>
        <Text style={styles.paymentAmount}>30,00€</Text>
      </View>
      <View style={styles.paymentContainer}>
        <Text style={styles.paymentText}>Frais de services</Text>
        <Text style={styles.paymentAmount}>3,00€</Text>
      </View>
      <View style={styles.paymentContainer}>
        <Text style={styles.paymentText}>Frais de déplacement</Text>
        <Text style={styles.paymentAmount}>1,30€</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handlePayment}>
        <Text style={styles.buttonText}>Valider le paiement</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  profileContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },

  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  tag: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },

  tagText: {
    fontSize: 16,
    color: '#000',
  },

  addressText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },

  noteText: {
    fontSize: 16,
    color: '#000',
    fontStyle: 'italic',
  },

  paymentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },

  paymentText: {
    fontSize: 16,
    color: '#000',
  },

  paymentAmount: {
    fontSize: 16,
    color: '#000',
  },

  button: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 16,
    color: '#000',
  },
});

export default PaymentScreen;


