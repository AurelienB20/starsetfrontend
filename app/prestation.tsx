import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, Modal } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Assurez-vous d'avoir installé cette bibliothèque
import config from '../config.json';
import * as ImagePicker from 'expo-image-picker';

const PrestationScreen = () => {
  const [description, setDescription] = useState('');
  const [selectedTab, setSelectedTab] = useState('photos'); // 'photos', 'experiences', or 'certifications'
  const [isEditing, setIsEditing] = useState(false);
  const [prestationPhotos, setPrestationPhotos] = useState([])
  const [uploading, setUploading] = useState<boolean>(false);
  const [prestation, setPrestation] = useState({
    id: '',
    worker_id: '',
    metier: '',
    description: null,
    remuneration: null,
    completedPrestation: 0,
  });
  const [experiences, setExperiences] = useState([])
  const [isPopupVisible, setIsPopupVisible] = useState(false); // État pour gérer la visibilité du popup

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [experienceDescription, setExperienceDescription] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [remuneration, setRemuneration] = useState(prestation.remuneration || ''); // Assurez-vous que prestation.remuneration est disponible

  const [certifications, setCertifications] = useState<any>([]);
  const [isCertificationFormVisible, setCertificationFormVisible] = useState(false);
  const [certificationTitle, setCertificationTitle] = useState('');
  const [certificationInstitution, setCertificationInstitution] = useState('');
  const [certificationDate, setCertificationDate] = useState('');
  const [certificationDescription, setCertificationDescription] = useState('');
  const [certificationImage, setCertificationImage] = useState<any>(null);

  const route = useRoute() as any;
  const prestation_id = route.params?.id;

  const maxDescriptionLength = 300;
  const photos = [
    
  ];
  const navigation = useNavigation();

  const experienceData = {
    title: 'Baby Sitting de Emma et Louis',
    date: 'Le 21/09/2022',
    description: 'C’est joie que j’ai pu garder les Emma et Louis ! Louis ayant des carences en gluten, j’ai eu l’obligation de cuisiner des repas dans "Gluten Free". Ce fut une expérience enrichissante car désormais, je sais m’adapter aux besoins de différents enfants, et à n’importe quelle situation.',
    images: [
      { uri: 'https://images.pexels.com/photos/1104012/pexels-photo-1104012.jpeg' },
      { uri: 'https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg' }
    ],
  };

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

  const addPrestationPhoto = async () => {
    console.log(1234)
    const options = {
      mediaType: 'photo',
    };
    let photo : any = null
    await launchImageLibrary(options as any, (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        photo = { uri: response.assets[0].uri };
        
      }
    });
    console.log(1)
    if (!photo) {
      console.log(2)
      Alert.alert('Erreur', 'Aucune photo sélectionnée');
      return;
    }

    setUploading(true);

    try {
      // Convertir l'image en base64 pour envoyer directement via JSON
      const response = await fetch(photo.uri);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Data = reader.result;

        // Créer un objet JSON avec les informations du fichier
        const file = {
          filename: 'profile-photo.jpg',
          mimetype: 'image/jpeg', // Type MIME de l'image
          data: base64Data,   // Base64 ou blob
        };
        console.log(file)
        const object_id=prestation.id
        const type_object = 'prestation'

        // Envoyer l'image au serveur
        const uploadResponse = await fetch(`${config.backendUrl}/api/uploads/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({file,object_id,type_object}), // Envoyer l'objet JSON directement
        });

        if (uploadResponse.ok) {
          const responseData = await uploadResponse.json();
          console.log('Upload success:', responseData);
          Alert.alert('Succès', 'Photo téléchargée avec succès');
        } else {
          console.log('Upload failed:', uploadResponse.status);
          Alert.alert('Erreur', 'Échec du téléchargement');
        }
      };

      reader.readAsDataURL(blob); // Lire le blob comme une chaîne base64
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setUploading(false);
    }
  }

  const getPrestation = async () => {
    try {
      console.log('debut prestation')
      
      const response = await fetch(`${config.backendUrl}/api/mission/get-prestation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prestation_id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data)
      console.log('Prestation:', data.prestation);
      console.log('images : ' , data.images)

      // Stocker les prestations dans l'état
      setPrestation(data.prestation);
      setPrestationPhotos(data.images);
      setRemuneration(data.remuneration);
    } catch (error) {
      console.error('Une erreur est survenue lors de la récupération des prestations:', error);
    }
  };

  const handleSaveRemuneration = async () => {
    // Code pour sauvegarder la rémunération
    setModalVisible(false);
    Alert.alert("Succès", "La rémunération a été enregistrée.");
    const response = await fetch(`${config.backendUrl}/api/mission/update-remuneration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prestation_id,remuneration }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log(data);

  };

  
  const getAllExperience = async () => {
    try {
      console.log('debut get experiences')
      
      const response = await fetch(`${config.backendUrl}/api/mission/get-all-experience`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prestation_id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('experiences :', data.experiences);

      // Stocker les prestations dans l'état
      setExperiences(data.experiences);
      
    } catch (error) {
      console.error('Une erreur est survenue lors de la récupération des experiences:', error);
    }
  };

  const getAllCertification = async () => {
    try {
      console.log('debut get experiences')
      
      const response = await fetch(`${config.backendUrl}/api/mission/get-all-certification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prestation_id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('certification :', data.certifications);

      // Stocker les prestations dans l'état
      setCertifications(data.certifications);
      
    } catch (error) {
      console.error('Une erreur est survenue lors de la récupération des experiences:', error);
    }
  };

  
  const getPrestationPhotos = async () => {
    try {
      console.log('debut get experiences')
      
      const response = await fetch(`${config.backendUrl}/api/mission/get-all-experience`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prestation_id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('experiences :', data.experiences);

      // Stocker les prestations dans l'état
      setExperiences(data.experiences);
      
    } catch (error) {
      console.error('Une erreur est survenue lors de la récupération des experiences:', error);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const checkPrestation = async () => {
    console.log('prestation : ',prestation)
  };

  const handleSaveDescription = async () => {
    setIsEditing(false);
    // Vous pouvez ajouter ici le code pour sauvegarder la nouvelle description, si nécessaire
    console.log(123)
    try {
      console.log('debut save description')
      
      const response = await fetch(`${config.backendUrl}/api/mission/save-prestation-description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prestation_id, description }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('prestation modifié:', data.prestation[0]);

      // Stocker les prestations dans l'état
      
    } catch (error) {
      console.error('Une erreur est survenue lors de la récupération des prestations:', error);
    }
  };

  const createExperience = async () => {
    setIsEditing(false);
    // Vous pouvez ajouter ici le code pour sauvegarder la nouvelle description, si nécessaire
    console.log(123)
    try {
      console.log('debut create experience')
      
      const response = await fetch(`${config.backendUrl}/api/mission/create-experience`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, date, experienceDescription, prestation_id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('experience:', data.experience[0]);

      // Stocker les prestations dans l'état
      
    } catch (error) {
      console.error('Une erreur est survenue lors de la récupération des prestations:', error);
    }
  };

  const handleAddCertification = async () => {
    try {
      const newCertification = {
        title: certificationTitle,
        institution: certificationInstitution,
        date: certificationDate,
        description: certificationDescription,
        image: certificationImage, // Optionnel
      };
  
      const response = await fetch(`${config.backendUrl}/api/mission/create-certification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newCertification, prestation_id }),
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout de la certification');
      }
  
      const data = await response.json();
      
      setCertifications((prev : any) => [...prev, data.certification]);
      setCertificationFormVisible(false);
  
      Alert.alert('Succès', 'Certification ajoutée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la certification:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter la certification');
    }
  };

  useEffect(() => {
    getPrestation();
    getAllExperience();
    getAllCertification();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 10 }}>
          {/* Icône enveloppe */}
          

          {/* Icône trois points verticaux pour paramètres */}
          <TouchableOpacity
            onPress={() => setIsPopupVisible(true)} // Affiche le popup
          >
            <Icon name="more-vert" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (prestation.description) {
      console.log(prestation)
      setDescription(prestation.description as any);
    }
  }, [prestation]); // Cette fonction s'exécute quand 'prestation' est mis à jour

  return (
    <ScrollView style={styles.container}>
      <View style={styles.iconContainer}>
        <FontAwesome name="child" size={60} color="black" />
      </View>
      <Text style={styles.title}>{prestation.metier}</Text>
      <View style={styles.widthMax}>
      {isEditing ? (
        <>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Description"
            placeholderTextColor="#808080"
            value={description}
            onChangeText= {(text) => setDescription(text)}
            maxLength= {maxDescriptionLength}
            multiline= {true}
          />
          <TouchableOpacity style={styles.modifyButton} onPress={handleSaveDescription}>
            <Text style={styles.modifyButtonText}>Valider</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.descriptionText}>{description || "Aucune description disponible"}</Text>
          <TouchableOpacity style={styles.modifyButton} onPress={handleEditToggle}>
            <Text style={styles.modifyButtonText}>Modifier</Text>
          </TouchableOpacity>
        </>
      )}
      <Text style={styles.characterCount}>{maxDescriptionLength - description.length} caractères</Text>

      <View style={styles.remunerationContainer}>
        {prestation.remuneration ? (
          <>
            <Text style={styles.remunerationText}>Rémunération : {prestation.remuneration} €</Text>
            <TouchableOpacity style={styles.modifyButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.modifyButtonText}>Modifier rémunération</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addButtonText}>Ajouter mes tarifs</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal pour la saisie de la rémunération */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>TARIF PAR HEURE</Text>
            <TextInput
              style={styles.inputModal}
              placeholder="0,00"
              keyboardType="numeric"
              value={remuneration}
              onChangeText={setRemuneration}
            />
            <Text style={styles.currency}>€</Text>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveRemuneration}>
              <Text style={styles.saveButtonText}>ENREGISTRER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Popup Modal */}
      <Modal visible={isPopupVisible} animationType="slide" transparent={true}>
      <View style={styles.tarifPopupOverlay}>
        <View style={styles.tarifPopupContainer}>
          {/* Section 1: Prestation 1 */}
          <View style={styles.tarifPopupSectionContainer}>
            <Text style={styles.tarifPopupSectionTitle}>PRESTATION 1</Text>
            <TextInput style={styles.tarifPopupInput} placeholder="Titre" editable={false} />
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Description"
              editable={false}
            />
            <View style={styles.tarifPopupContainer}>
              <TextInput
                style={[styles.input, styles.tarifPopupInput]}
                placeholder="Ajouter le tarif"
                editable={false}
              />
              <TouchableOpacity style={styles.tarifPopupButton}>
                <Icon name="euro" size={20} color="black" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.tarifPopupSaveButton}>
              <Text style={styles.tarifPopupSaveButtonText}>ENREGISTRER</Text>
            </TouchableOpacity>
          </View>

          {/* Section 2: Complément */}
          <View style={styles.tarifPopupSectionContainer}>
            <Text style={styles.tarifPopupSectionTitle}>COMPLÉMENT</Text>
            <TextInput style={styles.tarifPopupInput} placeholder="Titre" editable={false} />
            <View style={styles.tarifPopupContainer}>
              <TextInput
                style={[styles.input, styles.tarifPopupInput]}
                placeholder="Ajouter le tarif"
                editable={false}
              />
              <TouchableOpacity style={styles.tarifPopupButton}>
                <Icon name="euro" size={20} color="black" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.tarifPopupSaveButton}>
              <Text style={styles.tarifPopupSaveButtonText}>ENREGISTRER</Text>
            </TouchableOpacity>
          </View>

          {/* Ajouter une prestation */}
          <TouchableOpacity style={styles.tarifPopupAddButton}>
            <Text style={styles.tarifPopupAddButtonText}>Ajouter une prestation</Text>
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity style={styles.tarifPopupCloseButton} onPress={() =>setIsPopupVisible(false)}>
            <Text style={styles.tarifPopupCloseButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

      {/* Section pour les horaires */}
      <View style={styles.availabilityContainer}>
        <TouchableOpacity style={styles.addButton} onPress={() => {/* Fonction pour ajouter les disponibilités */}}>
          <Text style={styles.addButtonText}>Ajouter mes disponibilités</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.categoryButton, selectedTab === 'photos' && styles.activeCategoryButton]}
          onPress={() => setSelectedTab('photos')}
        >
          <Text style={styles.categoryButtonText}>Photos (6)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.categoryButton, selectedTab === 'experiences' && styles.activeCategoryButton]}
          onPress={() => setSelectedTab('experiences')}
        >
          <Text style={styles.categoryButtonText}>Expériences</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.categoryButton, selectedTab === 'certifications' && styles.activeCategoryButton]}
          onPress={() => setSelectedTab('certifications')}
        >
          <Text style={styles.categoryButtonText}>Certifications</Text>
        </TouchableOpacity>
      </View>
      </View>

      {selectedTab === 'photos' && (
        <View style={styles.photoGrid}>
          
          {prestationPhotos.map((photo : any, index) => (
            <Image key={index} source={{ uri: photo.adress }} style={styles.photo} />
          ))}
          <TouchableOpacity style={styles.addPhotoButton} onPress={addPrestationPhoto}>
            <FontAwesome name="plus" size={40} color="gray" />
          </TouchableOpacity>
        </View>
      )}

      {selectedTab === 'experiences' && (
        <View>
          <View style={styles.experienceCard}>
            <View style={styles.experienceHeader}>
              <Text style={styles.experienceTitle}>{experienceData.title} <FontAwesome name="smile-o" size={20} /></Text>
              <Text style={styles.experienceDate}>{experienceData.date}</Text>
            </View>
            <Text style={styles.experienceDescription}>{experienceData.description}</Text>
            <View style={styles.experienceImages}>
              {experienceData.images.map((image, index) => (
                <Image key={index} source={{ uri: image.uri }} style={styles.experienceImage} />
              ))}
            </View>
          </View>
          {experiences.map((experience : any) => (
            <View style={styles.experienceCard}>
            <View style={styles.experienceHeader}>
              <Text style={styles.experienceTitle}>{experience.title} <FontAwesome name="smile-o" size={20} /></Text>
              <Text style={styles.experienceDate}>{experience.date}</Text>
            </View>
            <Text style={styles.experienceDescription}>{experience.description}</Text>
            <View style={styles.experienceImages}>
              {experienceData.images.map((image, index) => (
                <Image key={index} source={{ uri: image.uri }} style={styles.experienceImage} />
              ))}
            </View>
          </View>
          ))}

          <View style={styles.experienceForm}>
            <TextInput
              style={styles.input}
              placeholder="Titre"
              placeholderTextColor="#808080"
              value={title}
              onChangeText={setTitle} // Met à jour l'état 'title' à chaque changement
            />
            <TextInput
              style={styles.input}
              placeholder="Date"
              placeholderTextColor="#808080"
              value={date}
              onChangeText={setDate} // Met à jour l'état 'date' à chaque changement
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor="#808080"
              multiline
              value={experienceDescription}
              onChangeText={setExperienceDescription} // Met à jour l'état 'description' à chaque changement
            />
            <View style={styles.photoGrid}>
              <TouchableOpacity style={styles.addPhotoButton}>
                <FontAwesome name="plus" size={40} color="gray" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={createExperience}>
              <Text style={styles.submitButtonText}>Valider</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Placeholder for the "Certifications" tab */}
      {selectedTab === 'certifications' && (
        <View>
        {certifications.length > 0 ? (
          certifications.map((certification : any, index : any) => (
            <View key={index} style={styles.certificationCard}>
              <Text style={styles.certificationTitle}>{certification.title}</Text>
              <Text style={styles.certificationInstitution}>{certification.institution}</Text>
              <Text style={styles.certificationDate}>{certification.date}</Text>
              <Text style={styles.certificationDescription}>{certification.description}</Text>
              {certification.image && (
                <Image source={{ uri: certification.image }} style={styles.certificationImage} />
              )}
            </View>
          ))
        ) : (
          <Text>Aucune certification disponible</Text>
        )}
    
        {!isCertificationFormVisible ? (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setCertificationFormVisible(true)}
          >
            <Text style={styles.addButtonText}>Ajouter une certification</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.certificationForm}>
            <TextInput
              style={styles.input}
              placeholder="Titre de la certification"
              value={certificationTitle}
              onChangeText={setCertificationTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Établissement de formation"
              value={certificationInstitution}
              onChangeText={setCertificationInstitution}
            />
            <TextInput
              style={styles.input}
              placeholder="Date"
              value={certificationDate}
              onChangeText={setCertificationDate}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              multiline
              value={certificationDescription}
              onChangeText={setCertificationDescription}
            />
            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={() => {
                launchImageLibrary({ mediaType: 'photo' }, (response) => {
                  if (response.assets && response.assets.length > 0) {
                    setCertificationImage(response.assets[0].uri);
                  }
                });
              }}
            >
              <FontAwesome name="camera" size={24} color="gray" />
              <Text>Ajouter une image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAddCertification}
            >
              <Text style={styles.submitButtonText}>Valider</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setCertificationFormVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    
    paddingVertical: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },

  descriptionInput: {
    maxHeight : 100,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
  },

  modifyButton: {
    alignSelf: 'center',
    backgroundColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  modifyButtonText: {
    color: '#000',
    fontSize: 16,
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#808080',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#00cc66',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeCategoryButton: {
    backgroundColor: '#FF6666',
  },
  categoryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  photo: {
    width: '33.33%',
    height : '1',
    aspectRatio: 1,

    
  },
  addPhotoButton: {
    width: '33.33%',
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  experienceCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  experienceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  experienceDate: {
    fontSize: 14,
    color: '#666',
  },
  experienceDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  experienceImages: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  experienceImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  experienceForm: {
    marginTop: 20,
    padding : 10,
    borderRadius : 10,
    backgroundColor: '#F0F0F0'
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#00cc66',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  descriptionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },

  widthMax : {
    paddingHorizontal : 20
  },

  remunerationContainer: {
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  remunerationSet: {
    backgroundColor: '#FFD700', // Couleur pour la rémunération définie
  },
  remunerationAdd: {
    backgroundColor: '#FFCC00', // Couleur pour ajouter la rémunération
  },
  remunerationText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  availabilityContainer: {
    marginVertical: 10,
    
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButton: {
    alignSelf: 'stretch',
    backgroundColor: '#FFCC00',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#006400',
    marginBottom: 20,
  },
  inputModal: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  currency: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    position: 'absolute',
    right: 40,
    top: 80,
  },
  saveButton: {
    backgroundColor: '#006400',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  certificationCard: {
    backgroundColor: '#D5D5D5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    margin : 15
  },
  certificationTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  certificationInstitution: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  certificationDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  certificationDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  certificationImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  certificationForm: {
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    margin : 15
  },
  cancelButton: {
    backgroundColor: '#FF6666',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer2: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalTitle2: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalOption: {
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  modalCloseButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  modalCloseButtonText: {
    color: '#fff',
    textAlign: 'center',
  },

  tarifPopupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tarifPopupContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  tarifPopupSectionContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  tarifPopupSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  tarifPopupInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    color: '#888', // Text color to simulate placeholder text
  },
  tarifPopupDescriptionInput: {
    height: 60,
    textAlignVertical: 'top',
  },
  tarifPopupTarifContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tarifPopupTarifInput: {
    flex: 1,
  },
  tarifPopupButton: {
    backgroundColor: '#FFD700',
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
  },
  tarifPopupSaveButton: {
    backgroundColor: '#28a745',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  tarifPopupSaveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tarifPopupAddButton: {
    backgroundColor: '#28a745',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  tarifPopupAddButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tarifPopupCloseButton: {
    backgroundColor: '#dc3545',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  tarifPopupCloseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
});

export default PrestationScreen;
