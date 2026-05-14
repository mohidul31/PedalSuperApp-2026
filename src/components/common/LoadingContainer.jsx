import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

import React from 'react';

export default function LoadingContainer({title}) {
  return (
    <View style={styles.container}>
      <View style={styles.indicatorContainer}>
        <ActivityIndicator size="large" color="#1D2A74" />
      </View>
      <Text style={styles.text}>{title || 'লোড হচ্ছে...'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  indicatorContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#EEF0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1D2A74',
  },
});
