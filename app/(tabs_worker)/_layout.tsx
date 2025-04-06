import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import JobsScreen from './jobs';
import ConversationScreen from './conversation';
import AccountWorkerScreen from './account_worker';
import CroissanceScreen from './croissance';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import AddJobScreen from './addJob';
import { Image } from 'react-native';
import { useState } from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { Pressable } from 'react-native';
import { Tabs } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';


const Tab = createBottomTabNavigator();

function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string; }) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}



export default function TabNavigator() {
  const [isPopupVisible, setPopupVisible] = useState(false);
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    
    const goToUserTabs = async () => {
      navigation.navigate('(tabs)' as never);
    };
  
    const goToWorkerTabs = async () => {
      navigation.navigate('(tabs_worker)' as never);
    };


  return (
    <>
    
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="croissance"
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/croissance_icone.png')}
              style={{ width: 28, height: 28, tintColor: color }}
              resizeMode="contain"
            />
          )
        }}
      />
      <Tabs.Screen
        name="jobs"
        
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/tableau.png')}
              style={{ width: 28, height: 28, tintColor: color }}
              resizeMode="contain"
            />
          )
        }}
      />
      <Tabs.Screen
        name="addJob"
        
        options={{
          title: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
        }}
      />
      <Tabs.Screen
        name="conversation"
        
        options={{
          title: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="comments" color={color} />,
        }}
      />
      <Tabs.Screen
  name="account_worker"
  options={{
    title: '',
    tabBarButton: (props) => (
      <Pressable
        {...props}
        onLongPress={() => {setPopupVisible(true), console.log(123), console.log(isPopupVisible)}
      }
        onPress={props.onPress} // conserve la navigation
        style={props.style}
      >
        <Ionicons name="person" size={28} color={props.accessibilityState?.selected ? Colors[colorScheme ?? 'light'].tint : 'gray'} />
      </Pressable>
    ),
  }}
/>   
    </Tabs>
     <Modal
      animationType="slide"
      transparent
      visible={isPopupVisible}
      onRequestClose={() => setPopupVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Options de profil</Text>
          <Pressable onPress={goToUserTabs}>
            <Text style={styles.closeButton}>compte user</Text>
          </Pressable>
          <Pressable onPress={goToWorkerTabs}>
            <Text style={styles.closeButton}>compte worker</Text>
          </Pressable>
          <Pressable onPress={() => setPopupVisible(false)}>
            <Text style={styles.closeButton}>Fermer</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
    </>
  );
}


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },

  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  closeButton: {
    fontSize: 16,
    color: 'blue',
  },
});

