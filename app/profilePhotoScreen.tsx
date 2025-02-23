import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

import config from '../config.json';
import * as ImagePicker from 'expo-image-picker';

const ProfilePhotoScreen = () => {
  const [photo, setPhoto] = useState<any>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const getAccountId = async () => {
    try {
      const account_id = await AsyncStorage.getItem('account_id');
      if (account_id !== null) {
        return account_id;
      }
    } catch (e) {
      console.error('Erreur lors de la récupération du type de compte', e);
    }
  };

  const uploadProfilePhoto = async () => {
  // Demander la permission d'accès à la bibliothèque d'images
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    Alert.alert('Permission refusée', 'Vous devez autoriser l\'accès à la galerie pour continuer.');
    return;
  }

  // Ouvrir la bibliothèque d'images
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1, // Qualité maximale
  });

  if (result.canceled) {
    console.log('L\'utilisateur a annulé la sélection d\'image.');
    Alert.alert('Erreur', 'Aucune photo sélectionnée');
    return;
  }

  const photo = { uri: result.assets[0].uri };

  setUploading(true);

  try {
    // Convertir l'image en base64 pour envoyer directement via JSON
    const response = await fetch(photo.uri);
    const blob = await response.blob();
    const reader = new FileReader();

    const account_id = await getAccountId(); // Récupérer l'ID de l'utilisateur

    reader.onloadend = async () => {
      const base64Data = reader.result;

      // Créer un objet JSON avec les informations du fichier
      const file = {
        filename: 'profile-photo.jpg', // Nom du fichier
        mimetype: 'image/jpeg',       // Type MIME de l'image
        data: base64Data,             // Contenu base64 de l'image
      };

      // Envoyer l'image au serveur
      const uploadResponse = await fetch(`${config.backendUrl}/api/uploads/upload-profile-picture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file, account_id }), // Envoyer l'objet JSON directement
      });

      if (uploadResponse.ok) {
        const responseData = await uploadResponse.json();
        console.log('Upload success:', responseData);

        // Mettre à jour l'image de profil dans le stockage local
        await AsyncStorage.setItem('profile_picture', responseData.dbRecord.profile_picture_url);

        Alert.alert('Succès', 'Photo téléchargée avec succès');
      } else {
        console.log('Upload failed:', uploadResponse.status);
        Alert.alert('Erreur', 'Échec du téléchargement');
      }
    };

    reader.readAsDataURL(blob); // Lire le blob comme une chaîne base64
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    Alert.alert('Erreur', 'Une erreur est survenue');
  } finally {
    setUploading(false);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>PHOTO DE PROFIL</Text>
      <Text style={styles.subHeaderText}>
        Un petit sourire pour la caméra ! Cheeeeeese 📸
      </Text>
      <View style={{ width: '100%', height: 50 }}></View>
      <View style={styles.photoContainer}>
        {photo ? (
          <Image source={photo} style={styles.profilePhoto} />
        ) : (
          <Image
            source={{ uri: 'https://img.20mn.fr/wb0GX0XqSd2N4Y3ItfLEGik/1444x920_squeezie-youtubeur-chanteur-et-desormais-auteur-de-bd' }} 
            style={styles.profilePhoto}
          />
        )}
      </View>
      <View style={{ width: '100%', height: 10 }}></View>
      <TouchableOpacity style={styles.button} >
        <Text style={styles.buttonText}>Choisir sa photo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={uploadProfilePhoto} disabled={uploading}>
        <Text style={styles.buttonText}>{uploading ? 'Téléchargement en cours...' : 'Envoyer la photo'}</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>Star Set</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 60,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subHeaderText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginVertical: 20,
  },
  photoContainer: {
    width: 300,
    height: 300,
    borderRadius: 100,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
  },
  button: {
    backgroundColor: '#DDDDDD',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
  },
  footerText: {
    fontSize: 16,
    color: 'black',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
});

export default ProfilePhotoScreen;
