import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config.json';

const ModifyAccountScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDescriptionModalVisible, setDescriptionModalVisible] = useState(false);

  // Champs individuels
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [descriptionPopup, setDescriptionPopup] = useState('');

  const handleDescriptionSave = async () => {
    setDescription(descriptionPopup);
    setDescriptionModalVisible(false);
    try {
      const accountId = await AsyncStorage.getItem('account_id');
      const response = await fetch(`${config.backendUrl}/api/auth/update-account-description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId,descriptionPopup }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data)
    } catch (error) {
      console.error('Une erreur est survenue lors de la récupération des données du compte:', error);
    }
  };

  const getAccount = async () => {
    try {
      const accountId = await AsyncStorage.getItem('account_id');
      const response = await fetch(`${config.backendUrl}/api/auth/get-account-by-id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const account = data.account;

      // Initialiser les champs
      setFirstname(account.firstname || '');
      setLastname(account.lastname || '');
      setDateOfBirth(account.dateofbirth || '');
      setAddress(account.address || '');
      setCity(account.city || '');
      setPostcode(account.postcode || '');
      setCountry(account.country || '');
      setPhone(account.number || '');
      setEmail(account.email || '');
      setDescription(account.description || '');
      setProfilePictureUrl(account.profile_picture_url || '');
      setPseudo(account.pseudo || '');
    } catch (error) {
      console.error('Une erreur est survenue lors de la récupération des données du compte:', error);
    }
  };

  const handleSave = async () => {
    try {
      const accountId = await AsyncStorage.getItem('account_id');
      const updatedAccount = {
        firstname,
        lastname,
        dateofbirth: dateOfBirth,
        address,
        city,
        pseudo,
        postcode,
        country,
        number: phone,
        email,
        description,
        profile_picture_url: profilePictureUrl,
      };

      console.log(updatedAccount);

      const response = await fetch(`${config.backendUrl}/api/auth/update-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId, ...updatedAccount }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Une erreur est survenue lors de la mise à jour du compte:', error);
    }
  };

  useEffect(() => {
    getAccount();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center', padding: 20 }}>
      <View style={styles.profilePictureContainer}>
        <Image
          source={{ uri: profilePictureUrl }}
          style={styles.profilePicture}
        />
        <Text style={styles.editPhotoText}>Modifier la photo de profil</Text>
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionLabel}>Description générale</Text>
        <TouchableOpacity
          style={styles.editDescriptionButton}
          onPress={() => setDescriptionModalVisible(true)}
        >
          <Text style={styles.editDescriptionText}>Modifier la description</Text>
        </TouchableOpacity>
        <Text style={styles.descriptionValue}>{description}</Text>
      </View>

      <Modal
        visible={isDescriptionModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setDescriptionModalVisible(false)}
            >
              <Text style={styles.closeIconText}>✕</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.modalInput}
              value={descriptionPopup}
              onChangeText={setDescriptionPopup}
              placeholder="Saisissez votre description"
              placeholderTextColor="#aaa"
              multiline
            />
            <TouchableOpacity
              style={styles.saveModalButton}
              onPress={handleDescriptionSave}
            >
              <Text style={styles.saveModalButtonText}>ENREGISTRER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.infoContainer}>
        <InfoRow label="Prénom" value={firstname} onChange={setFirstname} isEditing={isEditing} />
        <InfoRow label="Nom" value={lastname} onChange={setLastname} isEditing={isEditing} />
        <InfoRow label="Pseudo" value={pseudo} onChange={setPseudo} isEditing={isEditing} />
        <InfoRow label="Date de naissance" value={dateOfBirth} onChange={setDateOfBirth} isEditing={isEditing} />
        <InfoRow label="Adresse" value={address} onChange={setAddress} isEditing={isEditing} />
        <InfoRow label="Ville" value={city} onChange={setCity} isEditing={isEditing} />
        <InfoRow label="Code postal" value={postcode} onChange={setPostcode} isEditing={isEditing} />
        <InfoRow label="Pays" value={country} onChange={setCountry} isEditing={isEditing} />
        <InfoRow label="N° Téléphone" value={phone} onChange={setPhone} isEditing={isEditing} />
        <InfoRow label="E-mail" value={email} onChange={setEmail} isEditing={isEditing} />
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={isEditing ? handleSave : () => setIsEditing(true)}
      >
        <Text style={styles.saveButtonText}>
          {isEditing ? 'ENREGISTRER' : 'MODIFIER'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const InfoRow = ({ label, value, onChange, isEditing }: any) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    {isEditing ? (
      <TextInput
        style={styles.infoInput}
        value={value}
        onChangeText={onChange}
      />
    ) : (
      <Text style={styles.infoValue}>{value}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    
    
    
    backgroundColor: '#FFFFFF',
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#00cc66',
  },
  editPhotoText: {
    color: '#00cc66',
    marginTop: 10,
  },
  descriptionContainer: {
    width: '100%',
    marginBottom: 20,
  },
  descriptionLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  editDescriptionButton: {
    padding: 10,
    backgroundColor: '#00cc66',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  editDescriptionText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  descriptionValue: {
    fontSize: 16,
    color: '#000',
  },
  
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Couleur d'arrière-plan semi-transparente
  },

  modalContent: {
    width: '90%', // Largeur relative à l'écran
    backgroundColor: '#FFF', // Fond blanc
    borderRadius: 10, // Coins arrondis
    padding: 20, // Espacement interne
    alignItems: 'center', // Aligner les éléments au centre
    shadowColor: '#000', // Ombre pour un effet d'élévation
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Ombre pour Android
  },

  modalInput: {
    width: '90%',
    height: 150,
    fontSize: 18,
    color: '#000', // Texte noir pour plus de contraste
    textAlignVertical: 'top',
    padding: 10,
    backgroundColor: '#FFF', // Fond blanc
    borderRadius: 10, // Ajout d'une légère bordure arrondie pour un meilleur style
  },
  closeModalButton: {
    marginTop: 20,
    backgroundColor: '#00cc66',
    padding: 10,
    borderRadius: 10,
  },
  closeModalButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  infoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  infoLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    color: '#000',
  },
  infoInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#F9F9F9',
    width: '70%',
  },
  saveButton: {
    backgroundColor: '#00cc66',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  closeIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  closeIconText: {
    fontSize: 20,
    color: '#000',
  },

  saveModalButton: {
    marginTop: 20,
    backgroundColor: '#00cc66',
    padding: 10,
    borderRadius: 10,
  },
  saveModalButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default ModifyAccountScreen;
