import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from '../../styles/SegmentedTabBar.styles';

export default function SegmentedTabBar({navigationState, jumpTo}) {
  return (
    <View style={styles.row}>
      {navigationState.routes.map((route, i) => {
        const isActive = navigationState.index === i;
        return (
          <TouchableOpacity
            key={route.key}
            style={[styles.tab, isActive ? styles.tabActive : styles.tabInactive]}
            onPress={() => jumpTo(route.key)}>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {route.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
