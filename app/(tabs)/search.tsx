import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, GestureResponderEvent, ScrollView, FlatList,ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';


import { StyleSheet, TextStyle, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import config from '../../config.json';
import * as Font from 'expo-font';
import { useFonts, BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';

import AppLoading from 'expo-app-loading';
//import axios from '../api/axios';


const profilePictures = [
  "https://www.utopix.com/fr/blog/wp-content/uploads/2024/04/Mzk0NGJkOWEtY2ZlYS00MjVjLTkwNTAtOGY5OWQzN2IzNGVi_762cec57-2eaf-4eaf-9a0d-2e7860147e48_profilhomme7-scaled.jpg",
  "https://st4.depositphotos.com/10313122/39913/i/450/depositphotos_399138226-stock-photo-portrait-young-handsome-persian-businessman.jpg",
  "https://www.utopix.com/fr/blog/wp-content/uploads/2024/04/d34203d9-3bea-4d9e-9e83-e445d3e754de_instagram3-scaled.jpg",
  "https://c.superprof.com/i/a/14131262/7200420/600/20230925185954/coach-sportif-nutrition-seances-personnalisees-adaptees-objectifs-capacites-service-personne.jpg",
  "https://www.missnumerique.com/blog/wp-content/uploads/une-bonne-photo-de-profil-cest-quoi-jurica-koletic.jpg",
  "https://c.superprof.com/i/a/22899983/10725281/600/20220930153117/seance-sport-personnalisee-adaptee-profil-coach-sportive-diplomee.jpg",
  "https://www.pagesjaunes.fr/media/agc/d8/de/74/00/00/f9/7f/0c/cd/a2/624ed8de740000f97f0ccda2/624ed8de740000f97f0ccda3.jpg",
  "https://www.utopix.com/fr/blog/wp-content/uploads/2024/04/Y2E4OTI3NzQtNmUyOC00YmU2LWE5ZjctODcxY2RlMzg2ZDIy_26dfc43e-31dd-463f-ad04-56f39a430691_profilhomme1-scaled.jpg"
];

const SearchScreen = () => {
  const navigation = useNavigation()
  const [prestations, setPrestations] = useState([]);
  const [workers, setWorkers] = useState([]);
  let [fontsLoaded] = useFonts({
    BebasNeue: BebasNeue_400Regular,
  });

  

  
  

  const goToProfile = async () => {
    navigation.navigate('profile' as never)
  }

  const goToPrestationView = (prestation : any) => {
    const id = prestation.id
    console.log(123)
    navigation.navigate({
      name: 'prestationView',
      params: { id },
    } as never);
  };

  const goToPrestationViewWithId = (id : any) => {
    
    console.log(123)
    navigation.navigate({
      name: 'prestationView',
      params: { id },
    } as never);
  };

  const fetchPrestations = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/api/mission/get-all-prestation-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      const data = await response.json() 
      console.log(1)
      console.log(data)
      console.log(data.prestations)
      setPrestations(data.prestations);
    } catch (error) {
      console.error('Erreur lors de la récupération des prestations :', error);
    }
  };

  const getWorkers = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/api/mission/get-workers-with-metiers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      const data = await response.json() 
      console.log(1)
      console.log(data)
      setWorkers(data.workers)
      
    } catch (error) {
      console.error('Erreur lors de la récupération des prestations :', error);
    }
  };

  const renderProfileItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.profileContainerList}
      onPress={() => goToPrestationViewWithId(item.metiers[0]?.id)}
    >
      <Image source={{ uri: item.profile_picture_url }} style={styles.profileImage} />
      <View style={styles.profileInfo}>
        <View style={styles.nameAndRating}>
          <Text style={styles.profileName}>{item.firstname}</Text>
          <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, index) => (
            <Ionicons key={index} name="star" size={16} color="gold" />
          ))}
        </View>
      </View>
        <Text style={styles.profileDescription}>
          {item.description}
        </Text>
        <View style={styles.profileCategories}>
          {item.metiers.slice(0, 3).map((metier: any, index: any) => (
            <View key={index} style={styles.categoryBadge}>
              <Text style={styles.categoryText2}>{metier.name}</Text>
            </View>
          ))}
          <View  style={styles.categoryBadge}>
              <Text style={styles.categoryText2}>+</Text>
            </View>
        </View>
        
      </View>
    </TouchableOpacity>
  );
  

  // Utiliser useEffect pour charger les prestations lors du montage du composant
  useEffect(() => {
    fetchPrestations();
    getWorkers();
  }, []);

  if (!fontsLoaded) {
    return (
      <View >
        
      </View>
    );
  }
  

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Star Set</Text>
      <FlatList
        data={prestations} 
        horizontal
        keyExtractor={(item, index) => index.toString()} // Générer une clé unique
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.profileContainerFlatList} // Nouveau style pour aligner à gauche
        renderItem={({ item,index }) => (
          <TouchableOpacity onPress={() => goToPrestationView(item)}>
            <View style={styles.workerContainer}>
            <Image
              source={{ uri: profilePictures[index % profilePictures.length] }} // Sélection cyclique des images
              style={styles.profilePicture}
            />
              <Image source={require('../../assets/images/valide_or.png')} style={styles.statusIndicator} />
            </View>
          </TouchableOpacity>
        )}
      />
      <Text style={styles.sectionHeader}>Ce qui pourrait vous plaire</Text>
      <FlatList
          data={workers}
          renderItem={renderProfileItem}
          keyExtractor={(item: any) => item.worker_id}
          nestedScrollEnabled={true} // Permet de gérer les défilements imbriqués
        />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Voir Plus</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({

  
  container: {
    //flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingTop : 30
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    marginHorizontal: 20, 
    paddingHorizontal : 20,
  },
  stepContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    marginHorizontal : 20,
    paddingHorizontal : 20
  },
  step: {
    alignItems: 'center',
  },
  stepText: {
    fontSize: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginHorizontal : 20,
    fontFamily: 'BebasNeue-Regular', // Utilisation de la police
  },
  profileContainer: {
    //flexGrow: 1, // Assure que le ScrollView peut s'étendre
    alignItems: 'flex-start', // Centre les éléments pour éviter les espaces
    justifyContent : 'flex-start',
    //width : '100%',
    gap : '5%',
    marginBottom: 20,
    paddingLeft : 130,
    borderTopColor: 'black',
    //borderTopWidth: 1, // Ajoute une bordure noire en haut
    borderBottomColor: 'black',
    //borderBottomWidth: 1, // Ajoute une bordure noire en 
    paddingVertical : 10,
    
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginHorizontal : 10
  },
  infoContainer: {
    width: '90%',
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    marginBottom: 20,
  },
  tag: {
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
  },
  tagText: {
    fontSize: 16,
    fontFamily: 'BebasNeue-Regular', // Utilisation de la police
  },
  descriptionText: {
    fontSize: 16,
    color: '#000',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#00cc66',
    padding: 10,
    marginBottom : 10,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },

  workerContainer : {
    flexDirection : 'column',
    gap : 4,
    fontWeight : 'bold',
  },

  profileContainerList: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    marginHorizontal : 10,
    width : '70%'
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginRight: 10,
    paddingHorizontal : 20
  },
  profileInfo: {
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'BebasNeue', // Utilisation du nom défini dans useFonts
  },

  profileUsername: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'BebasNeue',
  },

  profileDescription: {
    fontSize: 12,
    marginVertical: 5,
    textAlign : 'center',
    fontFamily: 'BebasNeue',
  },

  profileCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  categoryBadge: {
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 5,
    marginBottom: 5,
  },

  categoryText2: {
    fontSize: 7,
    color: '#333',
  },

  ratingContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },

  nameAndRating: {
    justifyContent : 'space-between',
    width : '100%',
    flexDirection : 'row'
  },

  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 5,
    width: 25,
    height: 25,
  },

  profileContainerFlatList: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Aligner les items à gauche
    justifyContent: 'flex-start',
    paddingHorizontal: 10, // Un petit padding pour éviter le collage complet à gauche
    marginBottom: 20,
    paddingVertical: 10,
  },
});

export default SearchScreen;
