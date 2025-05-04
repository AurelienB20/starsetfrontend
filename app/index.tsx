import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import config from '../config.json';
import { Image } from 'expo-image';
import { useUser } from '@/context/userContext';

const StarsetScreen = () => {
  const [progress, setProgress] = useState(0);
  const [showGif, setShowGif] = useState(true); // État pour afficher le GIF ou l'image statique
  const { setUser } = useUser()
  const navigation = useNavigation();

  const getAccountId = async () => {
    try {
      const account_id = await AsyncStorage.getItem('account_id');
      console.log("account_id 123")
      console.log(account_id)
      if (account_id !== null) {
        return account_id;
      }
    } catch (e) {
      console.error('Erreur lors de la récupération du type de compte', e);
    }
  };

  const getProfile = async () => {
    try {
      const accountId = await getAccountId();
      if (!accountId) {
        navigation.navigate('connexion' as never);
        return;
      }
  
      const response = await fetch(`${config.backendUrl}/api/auth/get-account-by-id`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId }),
      });
  
      if (!response.ok) throw new Error('Erreur de réseau');
  
      const data = await response.json();
      console.log('Utilisateur chargé:', data.account);
  
      setUser(data.account); // Met à jour le contexte utilisateur
  
      console.log('test putain j espere ca marche')
      // 🚨 Redirection ici selon verified
      if (!data.account.verified) {
        navigation.navigate('(tabs)' as never);
      } else {
        navigation.navigate('(tabs)' as never);
      }
  
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  };

  useEffect(() => {
    

    

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 25; // Increment de 12.5% à chaque seconde
        } else {
          clearInterval(interval);
          getProfile()
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(interval);


    // Remplace le GIF par une image statique après 3 secondes
    const gifTimeout = setTimeout(() => {
      setShowGif(false);
    }, 3000); // 3000 ms = 3 secondes (ajuste selon la durée de ton GIF)

    return () => {
      clearInterval(interval);
      clearTimeout(gifTimeout);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      
      <Image
        source={require('../assets/images/logo_gif_hd.gif')}
        style={{ width: '80%', height: 200 }}
        contentFit="contain"
        
      />

      
      {/* Remplacer par un objet de style et non un tableau 
      <AnimatedCircularProgress
        size={120}
        width={10}
        fill={progress}
        tintColor="#3498db"
        backgroundColor="#e0e0e0"
        style={styles.circularProgress} // Utilisation d'un objet style directement
      />*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: '80%',
    resizeMode: 'contain',
    marginBottom: 50,
  },
  circularProgress: {
    marginTop: 50, // Aucun tableau ici, juste un objet style
  },
});

export default StarsetScreen;
