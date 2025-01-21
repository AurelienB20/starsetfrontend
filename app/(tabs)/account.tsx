import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Assurez-vous d'avoir installé cette bibliothèque
import { saveMode } from '../chooseAccount';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountScreen = () => {
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false); // Gérer l'affichage du rectangle pour le menu
  const [isModalVisible, setIsModalVisible] = useState(false); // Pour afficher le popup de déconnexion
  const [profilePicture, setProfilePicture] = useState<any>(null)

  const changeToWorker = async () => {
    saveMode('worker');
    navigation.navigate({
      name: '(tabs_worker)',
      params: { screen: 'Account_Worker' },
    } as never);
  };

  const goToTest = async () => {
    navigation.navigate('test' as never);
  };

  const goToCard = async () => {
    navigation.navigate('paymentMethod' as never);
  };

  const goToProfilePicture = async () => {
    navigation.navigate('modifyAccount' as never);
  };
 
  const getProfilePicture = async () => {
    const profilePicture2 = await AsyncStorage.getItem('profile_picture');
    console.log(profilePicture2)
    setProfilePicture(profilePicture2)
  }; 

  const confirmLogout = async () => {
    // Logique pour déconnecter l'utilisateur
    // Ici, vous pouvez effacer les informations d'authentification, par exemple.
    await AsyncStorage.removeItem('account_id');
    await AsyncStorage.removeItem('worker_id');
    await AsyncStorage.removeItem('firstname');
    await AsyncStorage.removeItem('lastname');
    navigation.navigate('connexion' as never);
    setIsModalVisible(false);
  };

  useEffect(() => {
    getProfilePicture();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 10 }}>
          {/* Icône trois points verticaux pour paramètres */}
          <TouchableOpacity
            onPress={() => {
              setIsVisible(true); // Afficher le menu pop-up
            }}
          >
            <Icon name="more-vert" size={24} color="black" />
          </TouchableOpacity>
          {isVisible && (
            <View style={styles.popup}>
              <Text style={styles.popupText}>Paramètre 1</Text>
              <Text style={styles.popupText}>Paramètre 2</Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Text style={styles.closeButton}>Fermer</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ),
      // Mettre le titre en gras
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 25,
      },
      // Enlever la barre fine entre le header et le reste
      headerShadowVisible: false, // Pour React Navigation v6+
      // Pour une ancienne version, tu peux utiliser ceci :
      headerStyle: {
        elevation: 0, // Enlève l'ombre sur Android
        shadowOpacity: 0, // Enlève l'ombre sur iOS
      },
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileHeader}>
          <TouchableOpacity  onPress={goToProfilePicture}>
          <Image
            source={{ 
              uri: profilePicture 
                ? profilePicture 
                : 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png' 
            }} 
            style={styles.profilePicture}
          />
          </TouchableOpacity>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Viriya Chip</Text>
            <Text style={styles.profileHandle}>@viriya77400</Text>
          </View>
        </View>
        <View style={styles.rightHeader}>
          <Text style={styles.typeOAccount}>User</Text>
        </View>
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Mode paiement</Text>
        <TouchableOpacity style={styles.balanceCard} onPress={goToCard}>
          <Text style={styles.balanceAmount}>0,00 €</Text>
          <Image
            source={{ uri: 'https://example.com/wallet-icon.png' }} // Replace with actual URL
            style={styles.walletIcon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuItemText}>Aide</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuItemText}>Star Set Premiere</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuItemText}>Paramètres</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuItemText}>Langues</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuItemText}>À propos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={goToTest}>
        <Text style={styles.menuItemText}>Test</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={changeToWorker}>
        <Text style={styles.menuItemText}>Interface Worker</Text>
      </TouchableOpacity>

      {/* Bouton pour afficher le popup de déconnexion */}
      <TouchableOpacity style={styles.menuItem} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.deconnectText}>Se déconnecter</Text>
      </TouchableOpacity>

      {/* Modal de confirmation de déconnexion */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Êtes-vous sûr de vouloir vous déconnecter ?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={confirmLogout}>
                <Text style={styles.modalButtonText}>Oui</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent : 'space-between',
    marginBottom: 20,
    
  },

  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    marginLeft: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  profileHandle: {
    fontSize: 14,
    color: '#666',
  },
  balanceContainer: {
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  balanceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFEB3B',
    padding: 15,
    borderRadius: 10,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  walletIcon: {
    width: 40,
    height: 40,
  },
  menuItem: {
    backgroundColor: '#E0E0E0',
    padding: 15,
    borderRadius: 25,
    marginBottom: 10,
  },
  menuItemText: {
    fontSize: 16,
    color: '#000',
  },

  deconnectText: {
    fontSize: 16,
    color: 'red',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  footerIcon: {
    padding: 10,
  },
  footerProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },

  typeOAccount: {
    fontSize: 30,
    fontWeight : 'bold'
  },

  rightHeader : {
    marginRight : 30,
    marginTop : 10,
  },

 
  popup: {
    position: 'absolute',
    top: 50, // Position en haut (ajuste cette valeur si nécessaire)
    right: 10, // Position à droite
    width: 150, // Largeur du rectangle
    backgroundColor: 'white',
    borderRadius: 10, // Coins arrondis
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // Ajoute une ombre sur Android
  },
  popupText: {
    fontSize: 16,
    padding: 5,
  },
  closeButton: {
    color: 'blue',
    textAlign: 'center',
    marginTop: 10,
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AccountScreen;