import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {tabStyles} from '../styles/tabStyles';
import {COLORS} from '../styles/colors';

const CustomTabBar = ({navigationState, jumpTo}) => (
  <View style={tabStyles.tabBar}>
    {navigationState.routes.map((route, i) => {
      const isFocused = navigationState.index === i;
      return (
        <TouchableOpacity
          key={route.key}
          style={[tabStyles.tabItem, isFocused && tabStyles.tabItemFocused]}
          onPress={() => jumpTo(route.key)}>
          <Icon
            name={route.icon}
            size={24}
            color={isFocused ? COLORS.PRIMARY : COLORS.GRAY}
          />
          <Text
            style={[
              tabStyles.tabLabel,
              isFocused && tabStyles.tabLabelFocused,
            ]}>
            {route.title}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

export default CustomTabBar;
