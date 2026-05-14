import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Icon} from '@rneui/themed';
import styles from '../../styles/ScreenHeader.styles';

export default function ScreenHeader({
  navigation,
  title = 'PEDAL',
  rightIcon = 'home',
  onRightPress,
}) {
  const handleRightPress = onRightPress ?? (() => navigation.navigate('HomeStack'));
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Icon name="menu" type="material" size={26} color="#2E3192" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={handleRightPress}>
        <Icon name={rightIcon} type="material" size={26} color="#2E3192" />
      </TouchableOpacity>
    </View>
  );
}
