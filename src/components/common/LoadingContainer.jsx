import {ActivityIndicator, Text, View} from 'react-native';

import React from 'react';
import styles from '../../styles/LoadingContainer.styles';

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
