import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

const prestationData = [
    {
      title: 'Babysitting',
      name: 'Patrick.C',
      price: '120,00 €',
      showPopup: true
    },
    {
      title: 'Animation',
      name: 'Céline.B',
      price: '2 500,00€',
      badge: 'Prestation 1'
    },
    {
      title: 'Petsitter',
      name: 'Laurence.V',
      price: '2 500,00€',
      badge: 'Prestation 1'
    }
  ];

const HistoryScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const openPopup = () => {
    setModalVisible(true);
  };

  const closePopup = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historique</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AUJOURD’HUI</Text>

        {prestationData.map((item, index) => (
  <TouchableOpacity
    key={index}
    style={styles.row}
    onPress={item.showPopup ? openPopup : undefined}
  >
    <View>
      <Text style={styles.label}>
        {item.title}
        {item.badge && <Text style={styles.badge}> {item.badge}</Text>}
      </Text>
      <Text style={styles.worker}>{item.name}</Text>
    </View>
    <Text style={styles.price}>{item.price}</Text>
  </TouchableOpacity>
))}
      </View>

      {/* POPUP */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Babysitting</Text>
            <Text style={styles.modalSub}>Patrick.C</Text>

            <TouchableOpacity style={styles.greenButton}>
              <Text style={styles.greenButtonText}>Télécharger la fiche de suivi</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.redButton} onPress={closePopup}>
              <Text style={styles.redButtonText}>SIGNALER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    flex: 1
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20
  },
  section: {
    marginBottom: 30
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10
  },
  row: {
    paddingVertical: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black'
  },
  worker: {
    fontSize: 14,
    color: 'gray'
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  },
  badge: {
    fontSize: 14,
    color: 'green',
    fontWeight: '500'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBox: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black'
  },
  modalSub: {
    fontSize: 16,
    marginVertical: 10,
    color: '#333'
  },
  greenButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 10
  },
  greenButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14
  },
  redButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8
  },
  redButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14
  }
});

export default HistoryScreen;
