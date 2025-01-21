import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config.json';

const AddJobScreen = () => {
  const navigation = useNavigation();
  const [metierNames, setMetierNames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const getAllMetierNames = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/api/mission/get-all-metier-names`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMetierNames(data.metierNames);
    } catch (error) {
      console.error('Une erreur est survenue lors de la récupération des métiers:', error);
    }
  };

  const gotoJobView = async (selectedJob: string) => {
    // Logique pour aller au chat spécifique
    
    
    navigation.navigate({
      name: 'jobView',
      params: { selectedJob : selectedJob},
    } as never);
    // Vous pouvez ici utiliser une navigation ou une autre action
    // Par exemple, navigation.navigate('ChatScreen', { id: conversationId });
  };

  useEffect(() => {
    getAllMetierNames();
  }, []);

  const filteredMetiers = metierNames.filter((metier : any) =>
    metier.name.toLowerCase().includes(searchTerm.toLowerCase()) // Filtre sur le nom du métier
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>ADD A JOB</Text>

      {/* Barre de recherche */}
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher"
        placeholderTextColor="#808080"
        value={searchTerm}
        onChangeText={setSearchTerm} // Met à jour le terme de recherche
      />

      {/* Affichage des métiers filtrés */}
      {filteredMetiers.map((metier : any, index) => (
        <TouchableOpacity
          key={index}
          style={styles.jobCard}
          onPress={() => gotoJobView(metier)} // Remplace cette ligne par la navigation si nécessaire
        >
          <Image
            source={{uri : 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png' }} // Remplace cette ligne avec les bonnes images
            style={styles.jobImage}
          />
          <Text style={styles.jobTitle}>{metier.name.toUpperCase()}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  jobCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  jobImage: {
    width: 50,
    height: 50,
    marginRight: 20,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddJobScreen;
