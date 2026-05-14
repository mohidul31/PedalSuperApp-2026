import {Text, View} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import styles from '../../styles/NoDataFound.styles';

export default function NoDataFound({icon = 'cart-outline', title = 'ডাটা'}) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={40} color="#f39c12" />
      </View>
      <Text style={styles.title}>কোনো {title} পাওয়া যায়নি</Text>
      <Text style={styles.subtitle}>নতুন {title} যোগ করে শুরু করুন</Text>
    </View>
  );
}
