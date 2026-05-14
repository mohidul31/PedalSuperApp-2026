import {StyleSheet, Text, View} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#EEF0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1D2A74',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6F759B',
  },
});
