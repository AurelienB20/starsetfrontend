import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import moment from 'moment';
import 'moment-timezone';
import { AnimatedCircularProgress } from 'react-native-circular-progress'; // Import du composant
import { useNavigation } from '@react-navigation/native';
import config from '../../config.json';

console.log("backendUrl")
console.log(config.backendUrl)
const ConversationScreen = () => {
  const navigation = useNavigation()
  const [conversations, setConversations] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true); // Ajout de l'état pour le chargement

  const getWorkerId = async () => {
    try {
      const worker_id = await AsyncStorage.getItem('worker_id');
      if (worker_id !== null) {
        console.log(worker_id)
        console.log("worker_id conv" )
        return worker_id;
      }
    } catch (e) {
      console.error('Erreur lors de la récupération du type de compte', e);
    }
  };

  const getFormattedTime = (timestamp: string) => {
    // Obtenir le fuseau horaire de l'utilisateur
    const userTimezone = moment.tz.guess();

    // Convertir l'horodatage en un objet moment
    const messageTime = moment(timestamp).tz(userTimezone);

    // Vérifier si la date du message est aujourd'hui
    if (messageTime.isSame(moment(), 'day')) {
      // Si c'est aujourd'hui, afficher seulement l'heure
      return messageTime.format('HH:mm');
    } else {
      // Si ce n'est pas aujourd'hui, afficher la date
      return messageTime.format('DD/MM/YYYY');
    }
  };

  const gotoChat = async (conversationId: string, contactProfilePictureUrl : string, contactFirstname : string) => {
    // Logique pour aller au chat spécifique
    console.log('Navigating to chat with ID:', conversationId);
    const worker_id = await  getWorkerId()
    navigation.navigate({
      name: 'chat',
      params: {conversation_id : conversationId , sender_id : worker_id , sender_type : 'worker', contact_profile_picture_url : contactProfilePictureUrl, contact_firstname : contactFirstname},
    } as never);
    // Vous pouvez ici utiliser une navigation ou une autre action
    // Par exemple, navigation.navigate('ChatScreen', { id: conversationId });
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.messageContainer} 
      onPress={() => gotoChat(item.id, item.profile_picture_url, item.firstname)} // Appel de la fonction avec l'ID de la conversation
    >
      <Image
        source={{
          uri: item.profile_picture_url,
        }}
        style={styles.profileImage}
      />
      <View style={styles.messageContent}>
        <Text style={styles.name}>{item.firstname}</Text>
        <Text style={styles.message}>{item.message_text}</Text>
      </View>
      <Text style={styles.time}>{getFormattedTime(item.timestamp)}</Text>
    </TouchableOpacity>
  );


  const getAllConversation = async () => {
    try {
      const worker_id = await getWorkerId();
      console.log('ICI 12345')
      console.log(worker_id)
      const response = await fetch(`${config.backendUrl}/api/conversation/get-all-worker-conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ worker_id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Conversations:', data.conversations);

      // Stocker les conversations dans l'état
      setConversations(data.conversations);
    } catch (error) {
      console.error('Une erreur est survenue lors de la récupération des conversations:', error);
    } finally {
      // Masquer l'indicateur de chargement après la récupération des données
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllConversation();
  }, []);

  // Si les données sont en cours de chargement, afficher le nouveau composant de chargement
  if (isLoading) {
    return (
      <View style={styles.loadingOverlay}>
        <View style={styles.loadingContainer}>
          <AnimatedCircularProgress
            size={60}
            width={5}
            fill={100}
            tintColor="#0000ff"
            backgroundColor="#F0F0F0"
            rotation={0}
            duration={1000}
          />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.messagerieContainer}>
        <Image source={{uri : 'http://109.176.199.54/images/icon/messagerie.png'}} style={styles.messagerie} />
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Rechercher"
        placeholderTextColor="#666"
      />
      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  searchBar: {
    height: 40,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  messageContent: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    color: '#666',
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Légère opacité pour ne pas bloquer l'écran
  },
  loadingContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },

  messagerie : {
    resizeMode : 'contain',
    height : 80,
    width : '80%',
  },

  messagerieContainer : {
    width : '100%',
    justifyContent : 'center',
    alignItems : 'center',
  }
});

export default ConversationScreen;
