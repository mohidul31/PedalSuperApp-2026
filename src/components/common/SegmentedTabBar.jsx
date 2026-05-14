import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

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

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: '#F0F0FB',
    borderRadius: 24,
    padding: 6,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 6},
    elevation: 3,
  },
  tabInactive: {
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 14,
    color: '#8A92B8',
    fontWeight: '600',
  },
  labelActive: {
    color: '#1D2A74',
    fontWeight: '700',
  },
});
