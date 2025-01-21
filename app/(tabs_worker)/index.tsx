import { StyleSheet } from 'react-native';


import { View, Text, TextInput, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function IndexScreen() {
  const navigation = useNavigation();
  const testNewWorker = async () => {
    navigation.navigate('newworker' as never)
  }

  const testChooseAccount = async () => {
    navigation.navigate('chooseAccount' as never)
  }

  const testChat = async () => {
    navigation.navigate('chat' as never)
  }

  const testPayment = async () => {
    navigation.navigate('payment' as never)
  }

  const testAccountScreen = async () => {
    navigation.navigate('accountScreen' as never)
  }

  const testProfilePhotoScreen = async () => {
    navigation.navigate('profilePhotoScreen' as never)
  }

  const testProfile = async () => {
    navigation.navigate('profile' as never)
  }

  const testCreation = async () => {
    navigation.navigate('creation' as never)
  }

  const testConnexion = async () => {
    navigation.navigate('connexion' as never)
  }

  const testSearch = async () => {
    navigation.navigate('search' as never)
  }

  const testSummary = async () => {
    navigation.navigate('summary' as never)
  }

  const testUserTabs = async () => {
    navigation.navigate('(tabs)' as never)
  }

  const testJobs = async () => {
    navigation.navigate('jobs' as never)
  }

  const testCroissance = async () => {
    navigation.navigate('croissance' as never)
  }

  const testPrestationView = async () => {
    navigation.navigate('prestationView' as never)
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} />
      
      <TouchableOpacity onPress={testUserTabs} >
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>testUserTabs</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={testJobs} >
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>testJobs</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={testCroissance} >
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>testCroissance</Text>
      </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
