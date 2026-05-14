import {Animated, Text, View} from 'react-native';
import React, {useEffect} from 'react';

import {ActivityIndicator} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles/LoadingScreen.styles';

const LoadingScreen = () => {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [fadeAnim]);

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator
          size="large"
          color="#ffffff"
          style={styles.spinner}
        />
        <Text style={styles.subText}>Please wait a moment</Text>
      </View>
      <View style={styles.betaContainer}>
        <Text style={styles.betaText}>Beta Version</Text>
      </View>
      <View style={styles.circleTopLeft} />
      <View style={styles.circleBottomRight} />
    </LinearGradient>
  );
};

export default LoadingScreen;
