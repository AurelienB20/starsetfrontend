import { StyleSheet } from 'react-native';
import { View, Text, TextInput, TouchableOpacity, GestureResponderEvent, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { saveMode } from '../chooseAccount';
import config from '../../config.json';

const AccountWorkerScreen = () => {

  const navigation = useNavigation();

  const changeToUser = async () => {
    saveMode('user')
    
    navigation.navigate({
      name: '(tabs)',
      params: { screen: 'account' },
    } as never);
    //navigation.navigate({
    //  name: '(tabs)/account',
    //  screen: 'account',
    //} as never);
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: 'https://img.20mn.fr/wb0GX0XqSd2N4Y3ItfLEGik/1444x920_squeezie-youtubeur-chanteur-et-desormais-auteur-de-bd' }} // Replace with actual URL
            style={styles.profilePicture}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Viriya Chip</Text>
            <Text style={styles.profileHandle}>@viriya77400</Text>
          </View>
          
        </View>
        <View style={styles.rightHeader}>
          <Text style={styles.typeOAccount}>Worker</Text>
          
        </View>
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Mode paiement</Text>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceAmount}>0,00 €</Text>
          <Image
            source={{ uri: 'https://example.com/wallet-icon.png' }} // Replace with actual URL
            style={styles.walletIcon}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuItemText}>Aide</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuItemText}>Star Set Premiere</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuItemText}>Paramètres</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuItemText}>Langues</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuItemText}>À propos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}  onPress={changeToUser}>
        <Text style={styles.menuItemText}>Interface User</Text>
      </TouchableOpacity>

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    marginLeft: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  profileHandle: {
    fontSize: 14,
    color: '#666',
  },
  balanceContainer: {
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  balanceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFEB3B',
    padding: 15,
    borderRadius: 10,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  walletIcon: {
    width: 40,
    height: 40,
  },
  menuItem: {
    backgroundColor: '#F0F0F0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  menuItemText: {
    fontSize: 16,
    color: '#000',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  footerIcon: {
    padding: 10,
  },
  footerProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },

  typeOAccount: {
    fontSize: 30,
    fontWeight : 'bold'
  },

  rightHeader : {
    marginRight : 30,
    marginTop : 10,
  },

  header: {
    flexDirection: 'row',
    justifyContent : 'space-between',
    marginBottom: 20,
    
  }

});

export default AccountWorkerScreen;