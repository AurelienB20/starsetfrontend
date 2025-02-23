import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Modal, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Assurez-vous d'avoir installé cette bibliothèque
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Calendar } from 'react-native-calendars'; // Import the Calendar component
import config from '../config.json';

const PrestationViewScreen = () => {
  const [selectedTab, setSelectedTab] = useState('photos'); // Onglet par défaut: 'photos'
  const navigation = useNavigation()
  const route = useRoute() as any;
  const prestation_id = route.params?.id;
  const prestationRef = useRef(null);
  const [account, setAccount] = useState<any>(null);
  const [metiers, setMetiers] = useState<any>([]);
  const [prestation, setPrestation] = useState<any>({});
  const [prestationImages, setPrestationImages] = useState<any>([]);
  const [experiences, setExperiences] = useState([])
  const [isDatePickerVisible, setDatePickerVisible] = useState(false); // State for the date picker modal
  const [selectedDate, setSelectedDate] = useState('');
  const [isCalendarVisible, setCalendarVisible] = useState(false); // State for the calendar modal
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [isArrivalTimePickerVisible, setArrivalTimePickerVisible] = useState(false);
  const [isDepartureTimePickerVisible, setDepartureTimePickerVisible] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [showAllBadges, setShowAllBadges] = useState(false);
  const [isImageModalVisible, setImageModalVisible] = useState(false); // Contrôle de la visibilité du modal
  const [selectedImage, setSelectedImage] = useState(null); // Image sélectionnée
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')); // Array from "00" to "23"
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')); // Array from "00" to "59"

  const [arrivalHour, setArrivalHour] = useState('');
  const [arrivalMinute, setArrivalMinute] = useState('');

  const [departureHour, setDepartureHour] = useState('');
  const [departureMinute, setDepartureMinute] = useState('');
  const [selectedMetier, setSelectedMetier] = useState(null);

  const photos = [
    { uri: 'https://www.asiakingtravel.fr/cuploads/files/voyage-malaisie-itineraire-budget-circuit-7-jours-1.jpg' },
    { uri: 'https://images.partir.com/AkZB3l-cw9XLIP7t9SBGA20aW2Q=/750x/filters:sharpen(0.3,0.3,true)/lieux-interet/malaisie/malaisie-perhentian.jpg' },
    { uri: 'https://www.monde-authentique.com/wp-content/gallery/Malaisie/Paysage-de-Tasik-Dayang-Bunting-sur-l-ile-de-Langkawi.jpg' },
    { uri: 'https://www.parcours-voyages.fr/photoblogfancy/1000/600/65b22dca427c2-temple-4580960-1280.jpg' },
    { uri: 'https://media.oovatu.com/43-540/malaisie_82366.jpg' },
    { uri: 'https://abouttravel.ch/wp-content/uploads/2022/03/F22-110-06_Malaysia.jpg' },
    { uri: 'https://abouttravel.ch/wp-content/uploads/2022/03/F22-110-06_Malaysia.jpg' },
    { uri: 'https://abouttravel.ch/wp-content/uploads/2022/03/F22-110-06_Malaysia.jpg' },
    { uri: 'https://abouttravel.ch/wp-content/uploads/2022/03/F22-110-06_Malaysia.jpg' },
    { uri: 'https://abouttravel.ch/wp-content/uploads/2022/03/F22-110-06_Malaysia.jpg' },
    { uri: 'https://abouttravel.ch/wp-content/uploads/2022/03/F22-110-06_Malaysia.jpg' },
  ];

  console.log("url")
  console.log(profilePictureUrl)

  const handleHourChange = (text : any, setHour : any) => {
    const value = text.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (value === '' || (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 23)) {
      setHour(value);
    }
  };

  // Function to validate minute input
  const handleMinuteChange = (text : any, setMinute : any) => {
    const value = text.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (value === '' || (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 59)) {
      setMinute(value);
    }
  };

  const handleDepartureHourChange = (text : any, setHour : any) => {
    const value = text.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (value === '' || (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 23)) {
      setHour(value);
    }
  };

  // Function to validate minute input
  const handleDepartureMinuteChange = (text : any, setMinute : any) => {
    const value = text.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (value === '' || (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 59)) {
      setMinute(value);
    }
  };

  const toggleDatePicker = () => {
    setDatePickerVisible(!isDatePickerVisible); // Toggle the visibility of the date picker
  };

  const toggleArrivalTimePicker = () => setArrivalTimePickerVisible(!isArrivalTimePickerVisible);
  const toggleDepartureTimePicker = () => setDepartureTimePickerVisible(!isDepartureTimePickerVisible);


  const toggleTimePicker = () => {
    setTimePickerVisible(!isTimePickerVisible);
  };

  const toggleCalendar = () => {
    setCalendarVisible(!isCalendarVisible); // Toggle the visibility of the calendar
    console.log(1)
  };

  const handleDateSelect = (day : any) => {
    const selectedDate = day.dateString;

    if (!startDate) {
      setStartDate(selectedDate); // Si aucune date de début n'est définie, définissez-la
      console.log("Date de début sélectionnée:", selectedDate);
    } else if (!endDate) {
      setEndDate(selectedDate); // Si aucune date de fin n'est définie, définissez-la
      console.log("Date de fin sélectionnée:", selectedDate);
      console.log("Plage de dates sélectionnée:", startDate, "à", selectedDate); // Affiche la plage de dates
      
    } else {
      // Réinitialisez les dates si les deux ont déjà été sélectionnées
      console.log("Réinitialisation des dates");
      setStartDate(selectedDate); // Redémarrez avec la nouvelle date de début
      setEndDate(''); // Réinitialisez la date de fin
      console.log("Nouvelle date de début sélectionnée:", selectedDate);
    }
  };

  const getPrestation = async () => {
    try {
      console.log('debut prestation')
      
      const response = await fetch(`${config.backendUrl}/api/mission/get-prestation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prestation_id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Prestation:', data.prestation[0]);
      console.log('Prestation:', data.prestation);
      console.log('ici :', data);
      // Stocker les prestations dans l'état
      setPrestation(data.prestation);
      setProfilePictureUrl(data.account.profile_picture_url)
      console.log('ICI 123')
      console.log(data.metiers)
      setMetiers(data.metiers)
      setAccount(data.account)
      setPrestationImages(data.images)
      
      
    } catch (error) {
      console.error('Une erreur est survenue lors de la récupération des prestations:', error);
    }
  };

  const getConversation = async () => {
    try {
      const prestation2 :any = prestationRef.current
      const person1_id =  await getAccountId();
      console.log('ici ',prestation2);
      const person2_id= prestation2.worker_id;
      console.log(prestation2.worker_id)
      const person1_type = 'user';
      const person2_type = 'worker'
      console.log('debut get conversation')
      
      const response = await fetch(`${config.backendUrl}/api/conversation/get-conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ person1_id, person2_id, person1_type, person2_type}),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const conversation_id = data.conversation_id
      console.log('conversation_id:', data.conversation_id);
      goToChat(conversation_id)
      // Stocker les prestations dans l'état
      
      
    } catch (error) {
      console.error('Une erreur est survenue lors de la récupération des prestations:', error);
    }
  };

  const getAccountId = async () => {
    try {
      const accountId = await AsyncStorage.getItem('account_id');
      if (accountId !== null) {
        console.log(1);
        console.log(accountId);
        return accountId;
      }
    } catch (e) {
      console.error('Erreur lors de la récupération du type de compte', e);
    }
  };

  const goToChat = async (conversation_id : any) => {
    const account_id = await getAccountId()
    navigation.navigate({
      name: 'chat',
      params: {conversation_id : conversation_id , sender_id : account_id , sender_type : 'user'},
    } as never);
  
  }

  const goToOtherPrestation = async (prestation_id : any, metier : any) => {
    console.log("ca marche")
    setSelectedTag(metier)
    navigation.navigate({
      name: 'prestationView',
      params: {id : prestation_id},
    } as never);
  
  }

  const getAllExperience = async () => {
    try {
      console.log('debut get experiences')
      
      const response = await fetch(`${config.backendUrl}/api/mission/get-all-experience`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prestation_id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('experiences :', data.experiences);

      // Stocker les prestations dans l'état
      setExperiences(data.experiences);
      
    } catch (error) {
      console.error('Une erreur est survenue lors de la récupération des experiences:', error);
    }
  };

  const getMarkedDates = () => {
    const markedDates : any = {};
    if (startDate) {
      markedDates[startDate] = { startingDay: true, color: 'green', textColor: 'white' };
    }
    if (endDate) {
      markedDates[endDate] = { endingDay: true, color: 'green', textColor: 'white' };

      // Marquer toutes les dates entre startDate et endDate
      const start = new Date(startDate);
      const end = new Date(endDate);
      let currentDate = start;

      while (currentDate <= end) {
        const dateString = currentDate.toISOString().split('T')[0];
        markedDates[dateString] = { color: 'lightgreen', textColor: 'white' };
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    return markedDates;
  };

  const openImageModal = (imageUri : any) => {
    setSelectedImage(imageUri);
    setImageModalVisible(true);
  };
  
  const closeImageModal = () => {
    setSelectedImage(null);
    setImageModalVisible(false);
  };


  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 10 }}>
          {/* Icône enveloppe */}
          <TouchableOpacity
            onPress={() => {
              getConversation();
              
              console.log('Icône enveloppe cliquée');
            }}
            style={{ marginRight: 15 }}
          >
            <Icon name="mail" size={24} color="black" />
          </TouchableOpacity>

          {/* Icône trois points verticaux pour paramètres */}
          <TouchableOpacity
            onPress={() => {
              // Action pour les paramètres
              console.log('Icône paramètres cliquée');
            }}
          >
            <Icon name="more-vert" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    getPrestation();
    getAllExperience()
    
  }, []);

  useEffect(() => {
    console.log("Page rechargée avec un nouvel ID :", route.params.id);
    // Ajoutez ici la logique pour recharger les données avec l'ID
    getPrestation()
    getAllExperience()
    
  }, [route.params.id]);

  useEffect(() => {
    
    console.log('Prestation mis à jour:', prestation);
    console.log(prestation.worker_id)
    prestationRef.current = prestation;  // Met à jour la référence à chaque changement de prestation
  }, [prestation]);

  const goToSummary = () => {
    const arrivalTime = new Date();
    arrivalTime.setHours(parseInt(arrivalHour, 10), parseInt(arrivalMinute, 10),  0);
    const departureTime = new Date();
    departureTime.setHours(parseInt(departureHour, 10), parseInt(departureMinute, 10),  0);
    toggleCalendar()
    toggleArrivalTimePicker()
    toggleDepartureTimePicker()
    navigation.navigate({
      name: 'summary',
      params: {startDate : startDate, endDate: endDate, arrivalTime : arrivalTime, departureTime : departureTime, prestation : prestation, profilePictureUrl : profilePictureUrl},
    } as never);
  }

  return (
    <View>
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: profilePictureUrl }} 
          style={styles.profilePicture}
        />
        <Text style={styles.profileName}>{account?.firstname}</Text>
        <Text style={styles.profileDescription}>
          {account?.description || "Aucune description disponible"}
        </Text>
      </View>

      <View style={styles.tagsContainer}>
        <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tagsScrollContainer}
    >
      {metiers.map((item : any, index: any) => (
        <TouchableOpacity
        key={index}
        style={[styles.tag, selectedTag === item.metier && styles.selectedTag]}
        onPress={() => goToOtherPrestation(item.id, item.metier)}
      >
        <Text style={[styles.tagText, selectedTag === item.metier && styles.selectedTagText]}>
          {item.metier.includes(' ') ? `${item.metier.split(' ')[0]}...` : item.metier}
        </Text>
      </TouchableOpacity>
      ))}
    </ScrollView>
    
      </View>

      {/* Section des statistiques */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.profileName}>{prestation.metier}</Text>
        <Text style={styles.descriptionContainerText}>
        {prestation.description || "Aucune description disponible"}
        </Text>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{prestation.completedPrestation || 0}</Text>
            <Text style={styles.statLabel}>Prestations effectuées</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>❤️</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>“Passionée”</Text>
            <Text style={styles.statLabel}>Caractère</Text>
          </View>
        </View>
      </View>

      {/* Onglets pour Photos, Expériences, Certifications */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'photos' && styles.activeTabButton]}
          onPress={() => setSelectedTab('photos')}
        >
          <Text style={styles.tabButtonText}>Photos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'experiences' && styles.activeTabButton]}
          onPress={() => setSelectedTab('experiences')}
        >
          <Text style={styles.tabButtonText}>Expériences</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'certifications' && styles.activeTabButton]}
          onPress={() => setSelectedTab('certifications')}
        >
          <Text style={styles.tabButtonText}>Certifications</Text>
        </TouchableOpacity>
      </View>

      {/* Contenu des onglets */}
      {selectedTab === 'photos' && (
        <View style={styles.photosContainer}>
          {prestationImages.map((photo : any, index : any) => (
            <TouchableOpacity key={index} onPress={() => openImageModal(photo.adress)} style={styles.photoButton}>
              <Image source={{ uri: photo.adress }} style={styles.photo} />
            </TouchableOpacity>
          ))}
          
        </View>
        
      )}

      {selectedTab === 'experiences' && (
        <View style={styles.experienceContainer}>
          {experiences.length === 0 ? (
            <Text>Aucune expérience disponible.</Text>
          ) : (
            experiences.map((experience : any, index) => (
              <View key={index} style={styles.experienceCard}>
                <Text style={styles.experienceTitle}>{experience.title}</Text>
                <Text style={styles.experienceDate}>{experience.date}</Text>
                <Text style={styles.experienceDescription}>{experience.description}</Text>
                
              </View>
            ))
          )}
        </View>
      )}

      {selectedTab === 'certifications' && (
        <View style={styles.certificationsContainer}>
          <Text>Aucune certification disponible pour l'instant.</Text>
        </View>
      )}

      {/* Avis */}
      <View style={styles.reviewsContainer}>
        <Text style={styles.sectionHeader}>Avis (12)</Text>
        <View style={styles.review}>
          <Text style={styles.reviewText}>Alicia est la meilleure babysitter que j'ai eu pour mes enfants !</Text>
          <Text style={styles.reviewAuthor}>- Jérôme.B</Text>
        </View>
      </View>

      {/* Tarification */}
      <View style={styles.pricingContainer}>
        <Text style={styles.pricingText}>{prestation.remuneration ? `${prestation.remuneration}€/heure` : "Tarif non défini"}</Text>
        <TouchableOpacity style={styles.calendarButton}>
          <Text style={styles.calendarButtonText}>Voir le calendrier</Text>
        </TouchableOpacity>
        <View style={styles.diagonal} />
        <View style={styles.diagonal2} />
      </View>

      

      {/* Date Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCalendarVisible}
        onRequestClose={toggleCalendar}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Petite croix pour fermer le modal */}
            <TouchableOpacity onPress={toggleCalendar} style={styles.closeIcon}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Choisissez une date</Text>
            <Calendar
              onDayPress={handleDateSelect}
              markingType="period" // Utiliser le marquage de période
              markedDates={getMarkedDates()}
              style={styles.calendar}
            />

            {/* Bouton Horaires */}
            <TouchableOpacity onPress={toggleArrivalTimePicker} style={styles.horairesButton}>
              <Text style={styles.horairesButtonText}>Horaires</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      
            {/* Custom Time Input Modal */}
        {/* Arrival Time Input Modal */}
      <Modal animationType="slide" transparent={true} visible={isArrivalTimePickerVisible} onRequestClose={toggleArrivalTimePicker}>
        <View style={styles.timePickerModalContainer}>
          <View style={styles.timePickerContent}>
            <TouchableOpacity onPress={toggleArrivalTimePicker} style={styles.closeIcon}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.timePickerTitle}>ARRIVÉE</Text>

            <View style={styles.inputRow}>
              {/* Hour Input for Arrival */}
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                maxLength={2}
                placeholder="HH"
                value={arrivalHour}
                onChangeText={(text) => handleHourChange(text, setArrivalHour)}
              />
              <Text style={styles.timeSeparator}>:</Text>
              {/* Minute Input for Arrival */}
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                maxLength={2}
                placeholder="MM"
                value={arrivalMinute}
                onChangeText={(text) => handleMinuteChange(text, setArrivalMinute)}
              />
            </View>

            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => {
                
                toggleDepartureTimePicker(); // Show the departure time picker
              }}
            >
              <Text style={styles.nextButtonText}>Suivant</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Departure Time Input Modal */}
      <Modal animationType="none" transparent={true} visible={isDepartureTimePickerVisible} onRequestClose={toggleDepartureTimePicker}>
        <View style={styles.timePickerModalContainer}>
          <View style={styles.timePickerContent}>
            {/* Back Arrow instead of Close Icon */}
            <TouchableOpacity onPress={() => {
              toggleDepartureTimePicker();
              
            }} style={styles.backIcon}>
              <Icon name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.timePickerTitle}>DÉPART</Text>

            <View style={styles.inputRow}>
              {/* Hour Input for Departure */}
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                maxLength={2}
                placeholder="HH"
                value={departureHour}
                onChangeText={(text) => handleHourChange(text, setDepartureHour)}
              />
              <Text style={styles.timeSeparator}>:</Text>
              {/* Minute Input for Departure */}
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                maxLength={2}
                placeholder="MM"
                value={departureMinute}
                onChangeText={(text) => handleMinuteChange(text, setDepartureMinute)}
              />
            </View>

            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => goToSummary()}
            >
              <Text style={styles.nextButtonText}>Confirmer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isImageModalVisible}
        transparent={true}
        onRequestClose={closeImageModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackground} onPress={closeImageModal}>
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.fullScreenImage} />
            )}
          </TouchableOpacity>
        </View>
      </Modal>
      
    </ScrollView>

    {/* Ajouter au panier */}
    <View style={styles.addButtonFixedContainer}>
        <TouchableOpacity style={styles.addButton} onPress={toggleCalendar}>
          <Text style={styles.addButtonText}>Ajouter au panier</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
    textAlign : 'center',

  },
  profileDescription: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginVertical: 10,
  },
  tagsContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  tagsScrollContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  tag: {
    paddingHorizontal : 15,
    paddingVertical: 12,
    //backgroundColor: '#f0f0f0', // Couleur par défaut pour les badges
  },
  selectedTag: {
    backgroundColor: '#dcdcdc', // Fond grisé
    borderColor: '#999', // Bordure visible
  },
  tagText: {
    fontSize: 14,
    color: '#555',
    fontWeight: 'bold',
  },
  selectedTagText: {
    color: '#000', // Texte plus foncé pour le badge sélectionné
    fontWeight: 'bold',
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 11,
    width : '80%',
    color: '#000',
    textAlign : 'center'
  },
  descriptionContainer: {
    //backgroundColor: '#f4f4f4',
    //margin : 20,
    textAlign : 'center',
    //marginHorizontal: 10,
    borderRadius: 5,
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0', // Couleur claire pour la bordure
  },
  descriptionContainerText: {
    fontSize: 12,
    textAlign : 'center'
  },
  tabContainer: {
    flexDirection: 'row',
    //justifyContent: 'space-around',
    marginVertical: 20,
  },
  tabButton: {
    padding: 10,
    borderRadius: 20,
    margin : 5,
    backgroundColor: '#00cc66',
  },
  activeTabButton: {
    backgroundColor: '#7ed957',
  },
  tabButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight : 'bold'
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems : 'flex-start'
   
    
  },
  photo: {
    width: '100%',
    aspectRatio: 1,
    
  },
  photoButton: {
    width: '33.33%',
    aspectRatio: 1,
    
  },

  experienceContainer: {
    padding: 10,
  },
  experienceCard: {
    marginBottom: 20,
  },
  experienceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  experienceDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  experienceDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  experienceImages: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  experienceImage: {
    width: '48%',
    height: 100,
    borderRadius: 5,
  },
  certificationsContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewsContainer: {
    marginBottom: 20,
  },
  review: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  reviewText: {
    fontSize: 16,
    color: '#000',
  },
  reviewAuthor: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  pricingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 120,
    backgroundColor: 'green',
    height: 100,
    marginHorizontal: 10,
    paddingHorizontal: 30,
    position: 'relative',
    overflow: 'hidden',
    
  },
  diagonal: {
    position: 'absolute',
    right: -35,
    top: -35,
    width: 70,
    height: 70,
    backgroundColor: 'white',
    transform: [{ rotate: '45deg' }],
  },
  diagonal2: {
    position: 'absolute',
    right: -35,
    bottom: -35,
    width: 70,
    height: 70,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
  },
  pricingText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
  },
  calendarButton: {
    color: 'white',
    padding: 10,
    borderRadius: 5,
  },
  calendarButtonText: {
    fontSize: 16,
    color: '#FFF',
  },
  addButtoncontainer: {
    width: '100%',
    alignItems: 'center',
    
  },
  
  addButtonFixedContainer: {
    position: 'absolute', // Position fixe
    bottom: 0, // Positionné à 10px du bas de l'écran
    left: 0,
    right: 0,
    alignItems: 'center', // Centré horizontalement
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Fond semi-transparent (optionnel)
    paddingVertical: 10, // Espacement autour du bouton
    zIndex: 1000, // Toujours au-dessus du contenu
  },
  addButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: 300,
  },
  addButtonText: {
    fontSize: 16,
    color: '#FFF',
  },

  sectionHeader: {
    fontSize : 15,
    fontWeight: 'bold',
    color: '#000',
    marginVertical : 10,
    marginLeft : 5,
    padding : 8,
    backgroundColor : '#d9d9d9',
    borderRadius : 20,
    alignSelf: 'flex-start'
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dateButton: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#00cc66', // Button color
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FF6666', // Close button color
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
    textAlign: 'center',
  },

  calendar: {
    marginBottom: 10,
  },

  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  horairesButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#00cc66', // Couleur du bouton Horaires
    width: '100%',
    alignItems: 'center',
  },
  horairesButtonText: {
    color: '#fff',
    fontSize: 16,
  },

  timePickerModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  timePickerContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  timePickerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  timePickerItem: {
    fontSize: 40,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  timePickerSeparator: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    width: '50%',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
  },

  pickerContainer: {
    width: 50,
    height: 150, // Set a fixed height for scrolling
  },
  pickerItem: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 24,
  },
  selectedText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },

  datePicker: {
    width: 300,
    marginBottom: 20,
  },
  
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  picker: {
    width: 100,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  input: {
    width: 60,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
  },
  timeSeparator: {
    fontSize: 40,
    marginHorizontal: 10,
  },

  backIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fond semi-transparent
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  fullScreenImage: {
    width: '90%', // Adapte l'image à l'écran
    height: '90%',
    resizeMode: 'contain',
  },

  
});

export default PrestationViewScreen;
