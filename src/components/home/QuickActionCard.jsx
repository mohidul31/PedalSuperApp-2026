import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Icon} from '@rneui/themed';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import styles from '../../styles/QuickActionCard.styles';

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
