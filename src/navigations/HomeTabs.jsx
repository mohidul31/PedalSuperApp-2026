import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/app_screens/HomeScreen';
import OfferScreen from '../screens/app_screens/home_tabs/OfferScreen';
import PedalScreen from '../screens/app_screens/home_tabs/PedalScreen';
import SettingScreen from '../screens/app_screens/home_tabs/SettingScreen';
import AccountScreen from '../screens/app_screens/home_tabs/AccountScreen';
import { COLORS } from '../styles/colors';
const Tab = createBottomTabNavigator();

const HomeTabs = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      tabBarIcon: ({color, size}) => {
        let iconName;
        switch (route.name) {
          case 'HomeScreen':
            iconName = 'home-outline';
            break;
          case 'OfferScreen':
            iconName = 'gift-outline';
            break;
          case 'PedalScreen':
            iconName = 'wallet-outline';
            break;
          case 'SettingScreen':
            iconName = 'settings-outline';
            break;
          case 'AccountScreen':
            iconName = 'person-outline';
            break;
          default:
            break;
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.PRIMARY,
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}>
    <Tab.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{title: 'হোম'}}
    />
    <Tab.Screen
      name="OfferScreen"
      component={OfferScreen}
      options={{title: 'অফার'}}
    />
    <Tab.Screen
      name="PedalScreen"
      component={PedalScreen}
      options={{title: 'Pedal'}}
    />
    <Tab.Screen
      name="SettingScreen"
      component={SettingScreen}
      options={{title: 'সেবা'}}
    />
    <Tab.Screen
      name="AccountScreen"
      component={AccountScreen}
      options={{title: 'অ্যাকাউন্ট'}}
    />
  </Tab.Navigator>
);

export default HomeTabs;