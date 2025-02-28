
import React from 'react';
import StarsetScreen from './starsetScreen';
import TabLayout from './(tabs)/_layout';
import ConnexionScreen from './connexion';
import { Stack } from 'expo-router';
import PrestationViewScreen from './prestationView';
import PaymentMethodScreen from './paymentMethod';
import ModifyAccountScreen from './modifyAccount';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect } from 'expo-router';


function RootLayoutNav() {
  
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'white', // Personnalisez ici
      text: 'black',
    },
  };

  return (
    <ThemeProvider value={MyTheme}>
      <Stack initialRouteName="starsetScreen">
        
        <Stack.Screen name="starsetScreen"   options={{ headerShown: false }}/>
        <Stack.Screen name="index"   options={{ headerShown: false }}/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
        <Stack.Screen name="(tabs_worker)" options={{ headerShown: false }}/>
        <Stack.Screen name="connexion" options={{ headerShown: false }}/>
        <Stack.Screen name="prestationView"   />
        <Stack.Screen name="paymentMethod"  />
        <Stack.Screen name="modifyAccount"  />
      </Stack>
    </ThemeProvider>
  );
}

export default RootLayoutNav;