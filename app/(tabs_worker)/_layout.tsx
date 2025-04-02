import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import JobsScreen from './jobs';
import ConversationScreen from './conversation';
import AccountWorkerScreen from './account_worker';
import CroissanceScreen from './croissance';

import AddJobScreen from './addJob';
import { Image } from 'react-native';


const Tab = createBottomTabNavigator();

function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string; }) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}



export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2f95dc', // Personnaliser la couleur active des icônes
      }}>
      <Tab.Screen
        name="Croissance"
        component={CroissanceScreen}
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
      <Tab.Screen
        name="Jobs"
        component={JobsScreen}
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
      <Tab.Screen
        name="addJob"
        component={AddJobScreen}
        options={{
          title: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
        }}
      />
      <Tab.Screen
        name="Conversation"
        component={ConversationScreen}
        options={{
          title: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="comments" color={color} />,
        }}
      />
      <Tab.Screen
        name="Account_Worker"
        component={AccountWorkerScreen}
        options={{
          title: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
      
    </Tab.Navigator>
  );
}