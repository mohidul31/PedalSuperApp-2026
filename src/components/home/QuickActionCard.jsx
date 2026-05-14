import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from '@rneui/themed';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';

export default function QuickActionCard({item}) {
  const navigation = useNavigation();

  const handlePress = () => {
    if (!item.screen) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: '🚧 This feature is under development',
        visibilityTime: 2000,
      });
    } else {
      navigation.navigate(item.screen);
    }
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={handlePress}>
      <View style={[styles.iconBox, {backgroundColor: item.color + '20'}]}>
        <Icon name={item.icon} type={item.type} size={22} color={item.color} />
      </View>
      <Text style={styles.label}>{item.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    minHeight: 104,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    elevation: 3,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#17173C',
  },
});
