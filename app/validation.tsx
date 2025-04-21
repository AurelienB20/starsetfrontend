import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';



const ValidationScreen = () => {
  
  const navigation = useNavigation();
  const [validated, setValidated] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => setValidated(true), 3000);

    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (validated) {
      const timer = setTimeout(() => {
        navigation.navigate('(tabs)' as never);
      }, 2000); // 2 secondes après validation
  
      return () => clearTimeout(timer); // Nettoyage
    }
  }, [validated]);
  

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.topLine} />
        <Text style={styles.title}>Validation</Text>
        <View style={styles.bottomLine} />
      </View>

      <View style={styles.iconContainer}>
        {!validated && (
          <Animated.View style={[styles.arcContainer, { transform: [{ rotate: spin }] }]}>
            <Svg width="130" height="130" viewBox="0 0 130 130">
              <Path
                d="M 60 10
                   A 54 54 0 0 1 120 60"
                stroke="#00844A"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </Svg>
          </Animated.View>
        )}

        <View style={styles.innerCircle}>
          <MaterialIcons
            name={validated ? 'check' : 'shopping-cart'}
            size={50}
            color="white"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  topLine: {
    height: 2,
    backgroundColor: '#9B59B6',
    width: 280,
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  bottomLine: {
    height: 2,
    backgroundColor: '#000',
    width: 280,
    marginTop: 5,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  arcContainer: {
    position: 'absolute',
  },
  innerCircle: {
    backgroundColor: '#00723F',
    borderRadius: 95,
    height: 95,
    width: 95,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ValidationScreen;
