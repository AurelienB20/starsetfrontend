import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, GestureResponderEvent, ScrollView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';


import { StyleSheet, TextStyle, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import config from '../../config.json';
//import axios from '../api/axios';


const SearchScreen = () => {
  const navigation = useNavigation()
  const [prestations, setPrestations] = useState([]);
  const [workers, setWorkers] = useState([]);
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
        <Text style={styles.profileName}>{item.firstname}</Text>
        <Text style={styles.profileDescription}>
          "Babysitting, animaux, assistance quotidienne, je suis là pour vous servir !"
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
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, index) => (
            <Ionicons key={index} name="star" size={16} color="gold" />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
  

  // Utiliser useEffect pour charger les prestations lors du montage du composant
  useEffect(() => {
    fetchPrestations();
    getWorkers();
  }, []);
  

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Star Set</Text>
      

      <Text style={styles.sectionHeader}>TOP Workers !</Text>
      <View style={styles.profileContainer}>
        {prestations.slice(0, 3).map((prestation : any, index) => (
          <TouchableOpacity key={index} onPress={() => goToPrestationView(prestation)}>
            <View style={styles.workerContainer}>
              <Image
                source={{ uri: 'https://img.20mn.fr/wb0GX0XqSd2N4Y3ItfLEGik/1444x920_squeezie-youtubeur-chanteur-et-desormais-auteur-de-bd' }} 
                style={styles.profilePicture}
              />
              
            </View>
          </TouchableOpacity>
        ))}
      </View>

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

    flex: 1,
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
    marginHorizontal : 20
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '95%',
    marginBottom: 20,
    borderTopColor: 'black',
    //borderTopWidth: 1, // Ajoute une bordure noire en haut
    borderBottomColor: 'black',
    //borderBottomWidth: 1, // Ajoute une bordure noire en 
    paddingVertical : 10,
    paddingHorizontal : 10
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 20,
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
    fontWeight : 'bold'
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
  },
  profileInfo: {
    
    
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileUsername: {
    color: '#888',
    fontSize: 14,
  },
  profileDescription: {
    fontSize: 12,
    marginVertical: 5,
    textAlign : 'center'
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
});

export default SearchScreen;
