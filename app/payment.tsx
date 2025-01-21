import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, GestureResponderEvent } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { StyleSheet, TextStyle, Image } from 'react-native';
import config from '../config.json';
//import axios from '../api/axios';


const PaymentScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>PAIEMENT</Text>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: 'https://example.com/profile-picture.jpg' }} // Replace with the actual profile picture URL
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
        <Text style={styles.addressText}>
          📍 19 avenue Charles de Gaulle, 77400
        </Text>
        <Text style={styles.noteText}>
          ✏️ “Pouvez-vous préparez son dîner aux alentours de 19h30 svp. Merci 😊”
        </Text>
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
      <TouchableOpacity style={styles.button}>
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
  stepContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginBottom: 20,
  },
  step: {
    alignItems: 'center',
  },
  stepText: {
    fontSize: 20,
    color: '#00FF00',
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
    backgroundColor: '#00FF00',
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