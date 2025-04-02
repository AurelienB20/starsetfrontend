
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
import { UserProvider } from '@/context/userContext';
import { AllWorkerPrestationProvider } from '@/context/userContext';
import { CurrentWorkerPrestationProvider } from '@/context/userContext';
import { PlannedPrestationProvider } from '@/context/userContext';
import { StripeProvider } from '@stripe/stripe-react-native';

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
    <StripeProvider
      publishableKey="pk_test_51QhAaYAVD111mkgn6K7YTlVYj4VZUKi6vb3j4xHIGcgxUgGEcPoJ34pxGca9XJIbeTwDmraHaAfo7LtBnh19Sggy00D7gjtYhJ" // <- ta clé publique Stripe ici
    >
      <UserProvider>
        <AllWorkerPrestationProvider>
          <CurrentWorkerPrestationProvider>
            <ThemeProvider value={MyTheme}>
              <Stack initialRouteName="starsetScreen">
                
                <Stack.Screen name="starsetScreen"   options={{ headerShown: false }}/>
                <Stack.Screen name="index"   options={{ headerShown: false }}/>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
                <Stack.Screen name="(tabs_worker)" options={{ headerShown: false }}/>
                <Stack.Screen name="connexion" options={{ headerShown: false }}/>
                <Stack.Screen name="prestationView"  options={{ headerShown : false }} />
                <Stack.Screen name="paymentMethod"  />
                <Stack.Screen name="modifyAccount"  />
                <Stack.Screen name="modifyPseudo"  options={{ headerShown : false }} />
                <Stack.Screen name="testImage"  options={{ headerShown : false }} />
                
              </Stack>
            </ThemeProvider>
          </CurrentWorkerPrestationProvider>
        </AllWorkerPrestationProvider>
      </UserProvider>
    </StripeProvider>
  );
}

export default RootLayoutNav;