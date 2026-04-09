import {StyleSheet, Text, View} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';

export default function NoDataFound({icon = 'cart-outline', title = 'ডাটা'}) {
  return (
    <View style={styles.noDataContainer}>
      <Ionicons name={icon} size={100} color="#f39c12" />
      <Text style={styles.noDataText}>কোনো {title} যোগ করা নেই</Text>
      <Text style={styles.noDataSubText}>নতুন {title} যোগ করে শুরু করুন</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    color: '#34495e',
    fontWeight: 'bold',
    marginTop: 10,
  },
  noDataSubText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
});
