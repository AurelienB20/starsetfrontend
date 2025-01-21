import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import config from '../../config.json';

const categories = [
  { id: '1', title: 'MARIAGE', image: 'https://cache.magicmaman.com/data/photo/w1200_h630_ci/1ea/couple-mariage-exigences.jpg' },
  { id: '2', title: 'SPORT', image: 'https://img.freepik.com/free-photo/sports-tools_53876-138077.jpg' },
  { id: '3', title: 'ENFANCE', image: 'https://blog.ama-campus.com/wp-content/uploads/2023/08/se-former-dans-la-petite-enfance.jpg' },
  { id: '4', title: 'COURS', image: 'https://www.ecoletremplin.ch/wp-content/uploads/2021/11/cours.jpeg' },
  { id: '5', title: 'ANIMAUX', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROeS79QYYouwls4wY4QAL2C4zLLdKbxubHnA&s' },
  { id: '6', title: 'ÉVÉNEMENT', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIE5JDjhZl_GCQRh-oFkfG36aU7KEx1ICA9g&s' },
];

const profiles = [
  {
    id: '1',
    name: 'Louise MARTIN',
    username: '@louisemartin87',
    description: '"J\'aime aider et je serais ravie de vous partager mon expérience"',
    rating: 5,
    categories: ['Babysitting', 'Pet Sitting', 'Cours'],
    image: 'https://fr.web.img6.acsta.net/c_310_420/pictures/20/01/15/12/35/3532251.jpg',
  },
  {
    id: '2',
    name: 'Antoine GARDIN',
    username: '@antogardin_75',
    description: '"J\'aime travailler et aider ceux qui m\'entourent"',
    rating: 4,
    categories: ['Babysitting', 'Parenting', 'Cours'],
    image: 'https://www.influenceur.promo/wp-content/uploads/2024/03/maghla-788x788.jpg',
  },
  {
    id: '3',
    name: 'Céline Claire-Marie',
    username: '@celineclairemarie09',
    description: '"Babysitting, animaux, assistance quotidienne, je suis là pour vous servir !"',
    rating: 5,
    categories: ['Babysitting', 'Pet Sitting', 'Parenting'],
    image: 'https://assets.afcdn.com/album/D20211115/phalbm26023325_w320.webp',
  },
  {
    id: '4',
    name: 'Lisa Karino',
    username: '@lisakarin07',
    description: '"Bienvenue sur mon compte Starset !"',
    rating: 4,
    categories: ['Babysitting', 'Cours'],
    image: 'https://photos.tf1.fr/1280/720/enjoyphoenix-2-49caba-0@3x.webp',
  },
];

const HomeScreen = () => {
  const [search, setSearch] = useState('');
  const [showProfiles, setShowProfiles] = useState(false);
  const [workers, setWorkers] = useState([]);

  // Met à jour la recherche sans déclencher l'affichage
  const handleInputChange = (text: any) => {
    setSearch(text);
  };

  // Affiche les profils lorsque l'utilisateur appuie sur la loupe
  const handleSearchSubmit = () => {
    searchWorkers()
    setShowProfiles(true);
  };

  // Réinitialise la recherche et l'affichage
  const clearSearch = () => {
    setSearch('');
    setShowProfiles(false);
  };

  const searchWorkers = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/api/mission/search-workers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({searchString : search}),
      });
      const data = await response.json() 
      console.log(1)
      console.log(data)
      setWorkers(data.workers)
      
    } catch (error) {
      console.error('Erreur lors de la récupération des prestations :', error);
    }
  };


  const renderProfileItem = ({ item } : any) => (
    <View style={styles.profileContainer}>
      <Image source={{ uri: item.profile_picture_url }} style={styles.profileImage} />
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{item.firstname}</Text>
        <Text style={styles.profileUsername}>@antogardin_75</Text>
        <Text style={styles.profileDescription}>'"J\'aime aider et je serais ravie de vous partager mon expérience"'</Text>
        <View style={styles.profileCategories}>
          {item?.metiers?.map((metier : any, index : any) => (
            <View key={index} style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{metier.name}</Text>
            </View>
          ))}
        </View>
        <View style={styles.ratingContainer}>
          {[...Array(item.rating)].map((_, index) => (
            <Ionicons key={index} name="star" size={16} color="gold" />
          ))}
        </View>
      </View>
    </View>
  );

  const renderCategoryItem = ({ item } :any) => (
    <TouchableOpacity style={styles.categoryContainer}>
      <Image source={{ uri: item.image }} style={styles.categoryImage} />
      <View style={styles.overlay}>
        <Text style={styles.categoryText}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={handleInputChange}
          placeholder="Babysitter autour de moi"
          placeholderTextColor="#808080"
        />
        {search.length > 0 ? (
          <TouchableOpacity style={styles.clearIcon} onPress={clearSearch}>
            <Ionicons name="close-circle" size={24} color="black" />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity style={styles.searchIcon} onPress={handleSearchSubmit}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Affichage conditionnel : profils ou catégories */}
      {showProfiles ? (
        <FlatList
          data={workers}
          renderItem={renderProfileItem}
          keyExtractor={(item : any) => item.id}
        />
      ) : (
        <>
          <Text style={styles.sectionTitle}>En ce moment</Text>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop : 30
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginLeft: 10,
  },
  clearIcon: {
    position: 'absolute',
    right: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryContainer: {
    flex: 1,
    marginHorizontal: 5,
    height: 150,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  categoryText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  profileInfo: {
    flex: 1,
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
    fontSize: 14,
    marginVertical: 5,
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
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
});

export default HomeScreen;
