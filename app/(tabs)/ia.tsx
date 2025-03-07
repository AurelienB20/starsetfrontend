import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import config from '../../config.json';

const ChatScreen = () => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute() as any;
  

  const getAccountId = async () => {
    try {
      const account_id = await AsyncStorage.getItem('account_id');
      return account_id || '';
    } catch (e) {
      console.error('Erreur lors de la récupération du type de compte', e);
      return '';
    }
  };

  const goToPrestationViewWithId = (id : any) => {
    
    console.log(123)
    console.log(id)
    navigation.navigate({
      name: 'prestationView',
      params: { id },
    } as never);
  };

  const getAllMessages = async () => {
    const user_id = await getAccountId();
    console.log(user_id)
    console.log('Fetching messages');
    try {
      const response = await fetch(`${config.backendUrl}/api/ai/get-all-ai-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id : user_id }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      console.log(data.messages)
      setMessages(data.messages);
    } catch (error) {
      console.error('An error occurred while fetching messages:', error);
    }
  };

  const handleSendAiMessage = async () => {
    if (newMessage.trim()) {
      const user_id = await getAccountId();
      
      // Ajouter un message temporaire avec un état de chargement
      const tempMessage = {
        message_text: newMessage,
        sender_id: user_id,
      };
      setMessages([...messages, tempMessage, { loading: true }]);
      setNewMessage('');
      setLoading(true);
      
      try {
        const response = await fetch(`${config.backendUrl}/api/ai/send-ai-message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id, message_text: newMessage }),
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const response_json = await response.json();
        const data = response_json.data
        console.log("data")
        console.log(data)

        setMessages((prevMessages: any[]) => prevMessages.concat(data.message));
      } catch (error) {
        console.error('An error occurred while fetching messages:', error);
      }
      setLoading(false);
    }
  };

  

  useEffect(() => {
    getAllMessages();
  }, []);

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

    return (
      <View style={styles.fullScreenContainer}>
        <Text style={styles.centeredText}>IA en développement</Text>
      </View>
    );

  return (
    <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={styles.greenCircle}></View>
      <ScrollView>
      
      <View style={styles.messageContainer}>
        {messages.map((message: any, index: React.Key | null | undefined) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              message?.sended_by_user === true ? styles.myMessage : styles.otherMessage,
            ]}
          >
            {message.worker && renderProfileItem({ item: message.worker })}
            <Text style={styles.messageText}>{message.message_text}</Text>
          </View>
        ))}
        {loading && (
          <View style={styles.loadingBubble}>
            <AnimatedCircularProgress
              size={20}
              width={2}
              fill={100}
              tintColor="#008000"
              backgroundColor="#E0E0E0"
            />
          </View>
        )}
      </View>
      
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder='"Je cherche une baby-sitter..."'
          placeholderTextColor="#808080"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendAiMessage} disabled={loading}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#D4F1E3',
  },
  greenCircle: {
    width: 100,
    height: 100,
    backgroundColor: '#008000',
    borderRadius: 50,
    marginTop: 50,
  },
  messageContainer: {
    flex: 1,
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 30,
  },
  messageBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
  },
  loadingBubble: {
    alignSelf: 'flex-end',
    marginVertical: 5,
    padding: 10,
  },
  messageText: {
    fontSize: 16,
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#008000',
  },
  input: {
    width: '87%',
    paddingRight: 30,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000000',
  },
  myMessage: {
    backgroundColor: '#FFEB3B',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#E0E0E0',
    alignSelf: 'flex-start',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#008000',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal : 20,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    marginHorizontal : 10,
    width : '70%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',  // Blanc avec 50% de transparence
    borderRadius: 10,
  },

  categoryText2: {
    fontSize: 7,
    color: '#333',
  },

  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D4F1E3', // Garde la couleur de fond
  },
  centeredText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ChatScreen;
