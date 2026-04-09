import {Animated, StyleSheet, Text, View} from 'react-native';
// components/LoadingScreen.js
import React, {useEffect} from 'react';

import {ActivityIndicator} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const LoadingScreen = () => {
  // Animation for text opacity
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
        {/* Animated Spinner */}
        <ActivityIndicator
          size="large"
          color="#ffffff"
          style={styles.spinner}
        />

        {/* Animated Loading Text */}
        {/* <Animated.Text style={[styles.loadingText, { opacity: fadeAnim }]}>
          Loading...
        </Animated.Text> */}

        {/* Optional Subtext */}
        <Text style={styles.subText}>Please wait a moment</Text>
      </View>
      <View style={styles.betaContainer}>
        <Text style={styles.betaText}>Beta Version</Text>
      </View>

      {/* Decorative Circles */}
      <View style={styles.circleTopLeft} />
      <View style={styles.circleBottomRight} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  spinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  subText: {
    fontSize: 16,
    color: '#d1d8e0',
    fontStyle: 'italic',
  },
  circleTopLeft: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circleBottomRight: {
    position: 'absolute',
    bottom: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  betaContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  betaText: {
    fontSize: 12,
    color: '#ffffffaa',
    fontStyle: 'italic',
  },
});

export default LoadingScreen;
