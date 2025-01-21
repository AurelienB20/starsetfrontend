import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Icône de carte (ou utilisez une autre lib si nécessaire)
import { useNavigation } from '@react-navigation/native';

const PaymentMethodScreen = () => {
  const navigation = useNavigation();

  const handleAddCard = () => {
    // Logique pour ajouter une nouvelle carte
    console.log('Ajouter une nouvelle carte');
  };

  const handleEditCard = (cardType: string) => {
    // Logique pour modifier une carte spécifique
    console.log(`Modifier la carte ${cardType}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes cartes</Text>
      
      {/* Carte Maman */}
      <View style={styles.cardContainer}>
        <View style={styles.cardInfo}>
          <Icon name="card" size={30} color="#000" />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardName}>Carte Maman</Text>
            <Text style={styles.cardStatusValid}>Valide</Text>
            <Text style={styles.cardNumber}>--- 2546</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEditCard('Maman')}>
          <Text style={styles.editButtonText}>Modifier</Text>
        </TouchableOpacity>
      </View>

      {/* Carte Papa */}
      <View style={styles.cardContainer}>
        <View style={styles.cardInfo}>
          <Icon name="card" size={30} color="#000" />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardName}>Carte Papa</Text>
            <Text style={styles.cardStatusExpired}>Expiré</Text>
            <Text style={styles.cardNumber}>--- 254G</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEditCard('Papa')}>
          <Text style={styles.editButtonText}>Modifier</Text>
        </TouchableOpacity>
      </View>

      {/* Bouton pour ajouter une nouvelle carte */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddCard}>
        <Text style={styles.addButtonText}>+ Ajouter une carte</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTextContainer: {
    marginLeft: 10,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  cardStatusValid: {
    color: 'green',
    fontSize: 14,
  },
  cardStatusExpired: {
    color: 'red',
    fontSize: 14,
  },
  cardNumber: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 14,
    color: '#000',
  },
  addButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    borderColor: 'green',
    borderWidth: 1,
  },
  addButtonText: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentMethodScreen;
