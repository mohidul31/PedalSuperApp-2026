import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

import {COLORS} from '../styles/colors';
import React from 'react';

export default function LoadingContainer({title}) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      <Text style={styles.loadingText}>{title ? title : 'লোড হচ্ছে...'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.PRIMARY,
  },
});
