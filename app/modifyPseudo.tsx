import 'react-native-get-random-values';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import config from '../config.json';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '@/context/userContext';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Assurez-vous d'avoir installé cette bibliothèque

const ModifyPseudoScreen = () => {
  const navigation = useNavigation();
  const { user, setUser } = useUser(); // Contexte utilisateur

  const [pseudo, setPseudo] = useState(user?.pseudo || '');

  const updatePseudo = async () => {
    try {
      const updatedUser = { ...user, pseudo };
      setUser(updatedUser);
      
      const response = await fetch(`${config.backendUrl}/api/auth/update-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account: updatedUser }),
      });
      if (!response.ok) throw new Error('Erreur de réseau');
      
      const data = await response.json();
      console.log('Mise à jour réussie:', data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du pseudo:', error);
    }
  };

  const confirmUpdate = async () => {
    await updatePseudo();
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* 🔥 HEADER INTÉGRÉ DANS LE JSX */}
      <View style={styles.header}>
        {/* Flèche retour */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={30} color="black" />
        </TouchableOpacity>

        

        {/* Icônes à droite */}
        <View style={styles.headerIcons}>
          <TouchableOpacity
            onPress={() => console.log("✅ Mail cliqué")}
            style={styles.iconButton}
          >
            <Icon name="mail" size={30} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => console.log("✅ Icône paramètres cliquée !")}
            style={styles.iconButton}
          >
            <Icon name="more-vert" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔥 CONTENU PRINCIPAL */}
      <View style={styles.content}>
        <Text style={styles.label}>Pseudo</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.atSymbol}>@</Text>
          <TextInput
            style={styles.input}
            value={pseudo}
            onChangeText={setPseudo}
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={confirmUpdate}>
          <Text style={styles.buttonText}>Confirmer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    flex: 1,
    textAlign: 'center', // Centrage du titre
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 5,
    marginLeft: 10,
  },

  // CONTENU PRINCIPAL
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: '#70FF70',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
    height: 50,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  
  atSymbol: {
    fontSize: 16,
    color: '#888',
    
  },
  
  input: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
});

export default ModifyPseudoScreen;
