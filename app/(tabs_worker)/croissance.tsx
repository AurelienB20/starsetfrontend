import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import config from '../../config.json';

const CroissanceScreen = () => {
  const [jobsOfTheDay, setJobsOfTheDay] = useState([]);
  const [loading, setLoading] = useState(true);

  const news = {
    title: "Big Announcement",
    date: "September 22, 2024",
    description: "We are excited to introduce new features to our platform that will make your job search easier and more efficient!"
  };

  const fetchJobsOfTheDay = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/api/mission/get-job-of-the-day`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const data = await response.json();
      setJobsOfTheDay(data.metiers || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    

    fetchJobsOfTheDay();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Image source={{uri : 'http://109.176.199.54/images/icon/Croissance.png'}} style={styles.croissance} />
      
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/864/864685.png'}} style={styles.icon} />
          <Text style={styles.statText}>TOP JOB</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>18</Text>
          <Text style={styles.statText}>Missions accomplies</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>2%</Text>
          <Text style={styles.statText}>Activité</Text>
        </View>
      </View>

      <Text style={styles.sectionHeader}>WORKERS OF THE DAY</Text>
      <View style={styles.workersContainer}>
        <Image source={{uri: 'https://img.20mn.fr/wb0GX0XqSd2N4Y3ItfLEGik/1444x920_squeezie-youtubeur-chanteur-et-desormais-auteur-de-bd'}} style={styles.workerImage} />
        <Image source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwwXfPD8d-KenzH6diGi3tKJu9liPKonRhgw&s'}} style={styles.workerImage} />
        <Image source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrZEnI6ULp75xTWZpfj0mTHaebwUDaiE0OBA&s'}} style={styles.workerImage} />
        <Image source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSicKbK7hKK2PMZLyJBtbec1a1vMTGwV0GTOg&s'}} style={styles.workerImage} />
      </View>

      <Text style={styles.sectionHeader}>JOBS OF THE DAY</Text>
      <View style={styles.jobsContainer}>
          {jobsOfTheDay.length > 0 ? (
            jobsOfTheDay.map((job : any, index) => (
              <View key={index} style={styles.jobItem}>
                <Image source={{ uri: job.picture_url || 'https://cdn-icons-png.flaticon.com/512/91/91501.png' }} style={styles.jobIcon} />
                <Text style={styles.jobText}>{job.name}</Text>
              </View>
            ))
          ) : (
            <Text >Aucun job disponible</Text>
          )}
        </View>

      <Text style={styles.sectionHeader}>CES JOBS QUI ONT BESOIN DE VOUS</Text>
      <View style={styles.jobsContainer}>
        <View style={styles.jobItem}>
          <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/4703/4703487.png'}} style={styles.jobIcon} />
          <Text style={styles.jobText}>DEV WEB</Text>
        </View>
        <View style={styles.jobItem}>
          <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/864/864685.png'}} style={styles.jobIcon} />
          <Text style={styles.jobText}>LECTURE</Text>
        </View>
        <View style={styles.jobItem}>
          <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/846/846338.png'}} style={styles.jobIcon} />
          <Text style={styles.jobText}>CHAUFFEUR</Text>
        </View>
        <View style={styles.jobItem}>
          <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/2793/2793765.png'}} style={styles.jobIcon} />
          <Text style={styles.jobText}>TRADUCTEUR</Text>
        </View>
      </View>

      <Text style={styles.sectionHeader}>STARSET NEWS</Text>
      <View style={styles.newsCard}>
        <View style={styles.newsHeader}>
          <Text style={styles.newsTitle}>{news.title} <FontAwesome name="smile-o" size={20} /></Text>
          <Text style={styles.newsDate}>{news.date}</Text>
        </View>
        <Text style={styles.newsDescription}>{news.description}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    
  },
  statItem: {
    flexDirection: 'column',
    
    alignItems: 'center',
    paddingBottom: 10,
    justifyContent: 'flex-end',
    
  },
  statText: {
    fontSize: 14,
    color: '#000',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  icon: {
    width: 35,
    height: 35,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  workersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  workerImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  jobsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 30,
  },
  jobItem: {
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#E3E3E3',
    borderRadius: 6,
    padding: 10,
    paddingHorizontal: 10,
    width: '23%',
    aspectRatio: 1
  },
  jobIcon: {
    width: '70%',
    aspectRatio: 1,
  },
  jobText: {
    fontSize: 10,
    color: '#000',
    fontWeight: 'bold'
  },
  newsCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    marginBottom: 30,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  newsDate: {
    fontSize: 12,
    color: '#888',
  },
  newsDescription: {
    fontSize: 14,
    color: '#666',
  },

  croissance : {
    
    resizeMode : 'contain',
    height : 80,
    marginBottom : 30
  },
});

export default CroissanceScreen;
