import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import config from '../../config.json';
import { useNavigation } from '@react-navigation/native';

const categories = [
  { id: '1', title: 'MARIAGE', image: 'https://cache.magicmaman.com/data/photo/w1200_h630_ci/1ea/couple-mariage-exigences.jpg' },
  { id: '2', title: 'SPORT', image: 'https://img.freepik.com/free-photo/sports-tools_53876-138077.jpg' },
  { id: '3', title: 'ENFANT / PARENTALITE', image: 'https://blog.ama-campus.com/wp-content/uploads/2023/08/se-former-dans-la-petite-enfance.jpg' },
  { id: '4', title: 'FORMATION & PROFESSEUR', image: 'https://www.ecoletremplin.ch/wp-content/uploads/2021/11/cours.jpeg' },
  { id: '5', title: 'ANIMAUX', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROeS79QYYouwls4wY4QAL2C4zLLdKbxubHnA&s' },
  { id: '6', title: 'EVENEMENTIEL', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIE5JDjhZl_GCQRh-oFkfG36aU7KEx1ICA9g&s' },
  { id: '7', title: 'LOCATION', image: 'https://img-ccmbg-1.lefigaro.fr/1qiHUA8iESjIuSaWvGmKJU6HovE=/1500x/smart/bde83bb8bfbe4388b2f05686bfc0cc0c/ccmcms-figaroimmobilier/39471133.jpg' },
  { id: '8', title: 'EDITION / IMPRIMERIE', image: 'https://www.atechprint.com/wp-content/uploads/2023/10/Imprimerie-pressse-numerique.png' },
  { id: '9', title: 'JARDINAGE', image: 'https://i0.wp.com/www.greenweez.com/magazine/wp-content/uploads/2022/04/materil-jardinage.png?fit=810%2C539&ssl=1' },
  { id: '10', title: 'BRICOLAGE / MAISON', image: 'https://www.capital.fr/imgre//fit/~1~cap~2024~03~14~d3e40af1-9b0b-4357-b4d5-c8cb72ab7c8d.jpeg/896x504/focus-point/50%2C50/background-color/ffffff/quality/70/picture.jpg' },
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigation = useNavigation()
  const suggestions = [
    'Babysitter de nuit',
    'Babysitter petsitter',
    'Babysitter autour de moi',
  ];

  // Met à jour la recherche sans déclencher l'affichage
  const handleInputChange = (text: any) => {
    setSearch(text);
    setShowSuggestions(true); // Affiche les suggestions dès qu'on clique sur la barre de recherche
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

  const renderSuggestion = ({ item } : any) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => {
        setSearch(item);
        setShowSuggestions(false);
        setShowProfiles(true);
      }}
    >
      <Ionicons name="search" size={20} color="black" style={styles.suggestionIcon} />
      <Text style={styles.suggestionText}>{item}</Text>
    </TouchableOpacity>
  );

  const goToPrestationViewWithId = (id : any) => {
    
    console.log(123)
    navigation.navigate({
      name: 'prestationView',
      params: { id },
    } as never);
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
        
      </View>
    </TouchableOpacity>
  );

  const renderProfileSuggestion = ({ item } : any) => (
    <View style={styles.profileSuggestionContainer}>
      <Image source={{ uri: item.image }} style={styles.profileSuggestionImage} />
      <View style={styles.profileSuggestionInfo}>
        <Text style={styles.profileSuggestionName}>{item.name}</Text>
        <Text style={styles.profileSuggestionUsername}>{item.username}</Text>
        <View style={styles.profileSuggestionCategories}>
          {item.categories.map((category : any, index : any) => (
            <View key={index} style={styles.profileSuggestionBadge}>
              <Text style={styles.profileSuggestionBadgeText}>{category}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

 
  const CategoryItem = ({ item } : any) => {
    const [isPressed, setIsPressed] = useState(false);
  
    return (
      <TouchableOpacity
        style={[
          styles.categoryContainer,
         
        ]}
        onPressIn={() => setIsPressed(true)} // Activer le zoom
        onPressOut={() => setIsPressed(false)} // Désactiver le zoom
      >
      <Image source={{ uri: item.image }} style={[styles.categoryImage,  isPressed && styles.pressedStyle]}  />
        <View style={styles.overlay}>
          <Text style={styles.categoryText}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  // Fonction pour rendre les items dans FlatList ou autre
  const renderCategoryItem = ({ item } : any) => {
    return <CategoryItem item={item} />;
  };

  return (
    <KeyboardAvoidingView 
    behavior={Platform.OS === "ios" ? "padding" : "height"} 
    style={{ flex: 1 }}
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={handleInputChange}
          placeholder="Babysitter autour de moi"
          placeholderTextColor="#808080"
          onFocus={() => setShowSuggestions(true)} // Affiche les suggestions au clic
          onBlur={() => setShowSuggestions(false)} // Cache les suggestions lorsqu'on quitte la barre de recherche
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

      {/* Suggestions de recherche */}
      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          <ScrollView style={styles.suggestionsScroll}>
            <FlatList
              data={suggestions}
              renderItem={renderSuggestion}
              keyExtractor={(item, index) => index.toString()}
            />

            <FlatList
              data={profiles}
              renderItem={renderProfileSuggestion}
              keyExtractor={(item) => item.id}
              style={styles.profileSuggestionList}
            />
          </ScrollView>
        </View>
      )}

      {/* Affichage conditionnel : profils ou catégories */}
      {showProfiles ? (
        <FlatList
          data={workers}
          renderItem={renderProfileItem}
          keyExtractor={(item : any) => item.id}
          nestedScrollEnabled={true} // Permet le scrolling imbriqué
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
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
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

  nameAndRating: {
    justifyContent : 'space-between',
    width : '100%',
    flexDirection : 'row',
  },

  profileContainerList: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    marginHorizontal : 10,
    width : '70%'
  },

  categoryText2: {
    fontSize: 7,
    color: '#333',
  },

  pressedStyle: {
    transform: [{ scale: 1.1 }], // Appliquer un léger zoom
  },

  suggestionsContainer: {
    position : 'absolute',
    top: 100, // Positionne le conteneur en dessous de la barre de recherche
    left: 0,
    right: 0,
    zIndex: 1000, // Assure que les suggestions apparaissent au-dessus du contenu
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 10,
  },

  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  suggestionIcon: {
    marginRight: 10,
  },
  suggestionText: {
    fontSize: 16,
    color: '#000',
  },
  

  profileSuggestionList: {
    marginTop: 10,
  },
  profileSuggestionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  profileSuggestionImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  profileSuggestionInfo: {
    flex: 1,
  },
  profileSuggestionName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileSuggestionUsername: {
    fontSize: 14,
    color: '#808080',
  },
  profileSuggestionCategories: {
    flexDirection: 'row',
    marginTop: 5,
  },
  profileSuggestionBadge: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 5,
  },
  profileSuggestionBadgeText: {
    fontSize: 12,
    color: '#333',
  },

  suggestionsScroll: {
    maxHeight: 250, // Limite la hauteur pour éviter que ça couvre tout l'écran
  },

});

export default HomeScreen;
