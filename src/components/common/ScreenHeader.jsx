import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from '@rneui/themed';

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

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F8F9FF',
  },
  title: {
    color: '#2E3192',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});
