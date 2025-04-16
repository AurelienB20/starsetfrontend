import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import 'moment-timezone';
import { useNavigation } from '@react-navigation/native';
import config from '../../config.json';

const SCREEN_WIDTH = Dimensions.get('window').width;

const SkeletonMessage = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, SCREEN_WIDTH],
  });

  return (
    <View style={styles.messageContainer}>
      <View style={[styles.profileImage, { backgroundColor: '#DDD' }]} />
      <View style={styles.skeletonTextWrapper}>
        <View style={styles.skeletonText} />
        <Animated.View
          style={[
            styles.shimmerOverlay,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </View>
    </View>
  );
};

const ConversationScreen = () => {
  const navigation = useNavigation();
  const [conversations, setConversations] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getWorkerId = async () => {
    try {
      const worker_id = await AsyncStorage.getItem('worker_id');
      if (worker_id !== null) {
        return worker_id;
      }
    } catch (e) {
      console.error('Erreur lors de la récupération du type de compte', e);
    }
  };

  const getFormattedTime = (timestamp: string) => {
    const userTimezone = moment.tz.guess();
    const messageTime = moment(timestamp).tz(userTimezone);
    return messageTime.isSame(moment(), 'day')
      ? messageTime.format('HH:mm')
      : messageTime.format('DD/MM/YYYY');
  };

  const gotoChat = async (conversationId: string, contactProfilePictureUrl: string, contactFirstname: string) => {
    const worker_id = await getWorkerId();
    navigation.navigate({
      name: 'chat',
      params: {
        conversation_id: conversationId,
        sender_id: worker_id,
        sender_type: 'worker',
        contact_profile_picture_url: contactProfilePictureUrl,
        contact_firstname: contactFirstname,
      },
    } as never);
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.messageContainer}
      onPress={() => gotoChat(item.id, item.profile_picture_url, item.firstname)}
    >
      <Image
        source={{ uri: item.profile_picture_url }}
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
      setConversations(data.conversations);
    } catch (error) {
      console.error('Erreur récupération des conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllConversation();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.messagerieContainer}>
        <Image
          source={{ uri: 'http://109.176.199.54/images/icon/messagerie.png' }}
          style={styles.messagerie}
        />
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Rechercher"
        placeholderTextColor="#666"
      />

      {isLoading ? (
        <>
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonMessage key={idx} />
          ))}
        </>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    marginTop: 40,
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
  messagerie: {
    resizeMode: 'contain',
    height: 80,
    width: '80%',
  },
  messagerieContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonTextWrapper: {
    flex: 1,
    height: 20,
    backgroundColor: '#DDD',
    marginLeft: 10,
    borderRadius: 4,
    overflow: 'hidden',
  },
  skeletonText: {
    width: '100%',
    height: '100%',
    backgroundColor: '#DDD',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
});

export default ConversationScreen;
