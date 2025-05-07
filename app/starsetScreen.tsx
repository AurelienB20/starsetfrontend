import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import config from '../config.json';

import { Image } from 'expo-image';

const StarsetScreen = () => {
  const [progress, setProgress] = useState(0);
  const [showGif, setShowGif] = useState(true); // État pour afficher le GIF ou l'image statique
  
  const navigation = useNavigation();

  useEffect(() => {
    const checkAccount = async () => {
      try {
        const accountId = await AsyncStorage.getItem('account_id');
        if (!accountId) {
          console.log(1)
          navigation.navigate('connexion' as never);
        } else {
          console.log('connecté')
          navigation.navigate('(tabs)' as never);
        }
      } catch (error) {
        console.error('Error fetching account_id from AsyncStorage', error);
      }
    };

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 25; // Increment de 12.5% à chaque seconde
        } else {
          clearInterval(interval);
          checkAccount();
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
        source={{ uri: './assets/images/logo_gif.gif' }}
        style={styles.logo}
        
      />
      <Image
        source={require('../assets/images/logo_gif.gif')}
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
