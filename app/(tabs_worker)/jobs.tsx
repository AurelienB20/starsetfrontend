import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config.json';

const JobsScreen = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false); // Modal for "Nouveau"
  const [isRequestModalVisible, setRequestModalVisible] = useState(false); // New modal for "Demande de missions"
  const [selectedJob, setSelectedJob] = useState(null);
  const [prestations, setPrestations] = useState([]); 
  const [metierNames, setMetierNames] = useState([]); 

  const handleJobSelection = (jobTitle : any) => {
    setSelectedJob(jobTitle);
  };

  const handleValidation = async () => {
    try {
      const account_id = await getAccountId();
      const response = await fetch(`${config.backendUrl}/api/mission/create-prestation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ account_id, selectedJob }),
      });
      const data = await response.json();
      console.log(data);
      setModalVisible(false);
    } catch (error) {
      console.error('Une erreur est survenue. Veuillez réessayer.');
    }
    setModalVisible(false);
  };

  const getAllPrestation = async () => {
    try {
      const account_id = await getAccountId();
      const response = await fetch(`${config.backendUrl}/api/mission/get-all-prestation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ account_id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setPrestations(data.prestations);
    } catch (error) {
      console.error('Une erreur est survenue lors de la récupération des prestations:', error);
    }
  };

  const goToPrestation = (prestation : any) => {
    const id = prestation.id;
    console.log(123);
    navigation.navigate({
      name: 'prestation',
      params: { id },
    } as never);
  };

  const getAllMetierNames = async () => {
    try {
      const account_id = await getAccountId();
      const response = await fetch(`${config.backendUrl}/api/mission/get-all-metier-names`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMetierNames(data.metierNames);
    } catch (error) {
      console.error('Une erreur est survenue lors de la récupération des prestations:', error);
    }
  };

  const getAccountId = async () => {
    try {
      const accountId = await AsyncStorage.getItem('account_id');
      if (accountId !== null) {
        return accountId;
      }
    } catch (e) {
      console.error('Erreur lors de la récupération du type de compte', e);
    }
  };

  useEffect(() => {
    getAllPrestation();
    getAllMetierNames();
  }, []);

  const isSelected = (jobTitle : any) => selectedJob === jobTitle;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>MY JOBS</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher"
        placeholderTextColor="#808080"
      />
      
      <TouchableOpacity style={styles.missionBanner} onPress={() => setRequestModalVisible(true)}>
        <Text style={styles.missionText}>Demande de missions : 1</Text>
      </TouchableOpacity>

      {prestations.map((prestation : any, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.jobCard}
          onPress={() => goToPrestation(prestation)}
        >
          <View style={styles.jobHeader}>
            <Text style={styles.jobTitle}>{prestation.metier}</Text>
          </View>
          <Text style={styles.jobStats}>({prestation.completedprestation}) Missions effectuées</Text>
          <Text style={styles.jobStats}>(0) Multimédia</Text>
          <Text style={styles.jobRequests}>(0) Demandes missions</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.newJobButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.newJobButtonText}>Nouveau</Text>
      </TouchableOpacity>

      {/* Modal for job selection */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sélectionner un job</Text>
            {metierNames.map((metier : any, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.modalOption, isSelected(metier.name) && styles.selectedOption]}
                onPress={() => handleJobSelection(metier.name)}
              >
                <Text style={[styles.modalOptionText, isSelected(metier.name) && styles.selectedOptionText]}>
                  {metier.name}
                </Text>
              </TouchableOpacity>
            ))}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.validateButton} onPress={handleValidation}>
                <Text style={styles.validateButtonText}>Valider</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* New Modal for "Demande de missions" */}
      <Modal
        transparent={true}
        visible={isRequestModalVisible}
        animationType="slide"
        onRequestClose={() => setRequestModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.requestModalContent}>
            <Text style={styles.requestModalTitle}>Coursier : Patrick.C</Text>
            <Text style={styles.requestModalDetail}>x1 Course à Bureau Vallée</Text>
            <Text style={styles.requestModalSectionTitle}>INFORMATIONS UTILES</Text>
            <Text style={styles.requestModalInfo}>📍 19 avenue Charles de Gaulle, 77400</Text>
            <Text style={styles.requestModalInfo}>🖊️ “Pouvez-vous acheter 50 sacs en craft et de la colle pour les pistolet à colle ? 😌”</Text>
            <Text style={styles.requestModalTotal}>TOTAL DE L’OFFRE 20,00€</Text>
            <TouchableOpacity>
              <Text style={styles.requestModalLink}>Télécharger la Fiche Descriptive n°0987</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptButton} onPress={() => setRequestModalVisible(false)}>
              <Text style={styles.acceptButtonText}>ACCEPTER L'OFFRE 🤝</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
    marginVertical: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  missionBanner: {
    backgroundColor: '#00cc66',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  missionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  jobCard: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  jobStats: {
    fontSize: 16,
    color: '#666',
  },
  jobRequests: {
    fontSize: 16,
    color: 'red',
  },
  newJobButton: {
    backgroundColor: '#00cc66',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  newJobButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  modalOptionText: {
    fontSize: 18,
  },
  selectedOption: {
    backgroundColor: '#00cc66',
  },
  selectedOptionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  validateButton: {
    backgroundColor: '#00cc66',
    padding: 10,
    borderRadius: 5,
  },
  validateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  requestModalContent: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  requestModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  requestModalDetail: {
    fontSize: 16,
    color: '#00cc66',
    marginBottom: 15,
  },
  requestModalSectionTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  requestModalInfo: {
    fontSize: 14,
    marginBottom: 5,
  },
  requestModalTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00cc66',
    marginVertical: 10,
  },
  requestModalLink: {
    color: '#007BFF',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  acceptButton: {
    backgroundColor: '#00cc66',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default JobsScreen;
