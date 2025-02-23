import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';

const PrestationsScreen = () => {
  const [prestations, setPrestations] = useState([
    { id: '1', title: 'Spectacle Enfant Thème Disney', price: '50,00€' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPrestation, setNewPrestation] = useState({ title: '', price: '', description: '' });

  const handleAddPrestation = () => {
    if (!newPrestation.title || !newPrestation.price) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    setPrestations([
      ...prestations,
      {
        id: Math.random().toString(),
        title: newPrestation.title,
        price: `${newPrestation.price}€`,
        //description: newPrestation.description,
      },
    ]);
    setNewPrestation({ title: '', price: '', description: '' });
    setModalVisible(false);
  };

  const renderPrestation = ({ item } : any) => (
    <View style={styles.prestationCard}>
        <Text style={styles.prestationTitle}>PRESTATION 1</Text>
        <Text style={styles.prestationTitle}>{item.title}</Text>
        <View style={styles.prestationPriceContainer}>
            <Text style={styles.prestationPrice}>{item.price}</Text>
        </View>
        
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>TARIF PAR PRESTATION</Text>
      <FlatList
        data={prestations}
        renderItem={renderPrestation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      {/* Bouton pour afficher la modal */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Ajouter une prestation</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>AJOUTER UNE PRESTATION</Text>

            {/* Titre */}
            <Text style={styles.label}>Titre</Text>
            <TextInput
              style={styles.input}
              placeholder="Titre de la prestation"
              value={newPrestation.title}
              onChangeText={(text) => setNewPrestation({ ...newPrestation, title: text })}
            />

            {/* Description */}
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="Description (facultatif)"
              value={newPrestation.description}
              onChangeText={(text) => setNewPrestation({ ...newPrestation, description: text })}
            />

            {/* Tarifs */}
            <Text style={styles.label}>Ajouter le tarif</Text>
            <TextInput
              style={styles.input}
              placeholder="Tarif en €"
              keyboardType="numeric"
              value={newPrestation.price}
              onChangeText={(text) => setNewPrestation({ ...newPrestation, price: text })}
            />

            {/* Boutons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddPrestation}>
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#008000',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start'
  },
  prestationCard: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
  },
  prestationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  prestationPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    margin : 5,
     textAlign : 'center'
  },
  prestationPriceContainer: {
    
    fontWeight: 'bold',
    backgroundColor : '#FFD700',
    marginTop: 5,
    width : '100%',
    borderRadius : 3
   
  },
  addButton: {
    backgroundColor: '#008000',
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    width: '90%',
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#008000',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  saveButtonText: {
    color: '#FFF',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  cancelButtonText: {
    color: '#FFF',
    textAlign: 'center',
  },
});

export default PrestationsScreen;
