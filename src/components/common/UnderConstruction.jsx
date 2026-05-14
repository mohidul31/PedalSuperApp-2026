import {Text, View} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import styles from '../../styles/UnderConstruction.styles';

export default function UnderConstruction({title}) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="construct-outline" size={40} color="#f39c12" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>শীঘ্রই আসছে</Text>
      <Text style={styles.description}>
        আমরা এই ফিচারটি তৈরি করছি। অপেক্ষা করুন!
      </Text>
    </View>
  );
}
