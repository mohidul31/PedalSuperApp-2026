import {Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import AccountScreen from '../screens/tabs/AccountScreen';
import HomeScreen from '../screens/home/HomeScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import OfferScreen from '../screens/tabs/OfferScreen';
import PedalScreen from '../screens/tabs/PedalScreen';
import React from 'react';
import SettingScreen from '../screens/tabs/SettingScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import styles from '../styles/HomeTabs.styles';

const Tab = createBottomTabNavigator();

const TAB_CONFIG = {
  OfferScreen:   {title: 'অফার',      icon: 'gift-outline',     activeIcon: 'gift'},
  PedalScreen:   {title: 'Pedal',     icon: 'wallet-outline',   activeIcon: 'wallet'},
  HomeScreen:    {title: 'হোম',       icon: 'home-outline',     activeIcon: 'home',     center: true},
  SettingScreen: {title: 'সেবা',      icon: 'settings-outline', activeIcon: 'settings-sharp'},
  AccountScreen: {title: 'অ্যাকাউন্ট', icon: 'person-outline',   activeIcon: 'person'},
};

/* ── Custom Tab Bar ── */
const CustomTabBar = ({state, descriptors, navigation}) => {
  const {bottom} = useSafeAreaInsets();
  return (
  <View style={[styles.wrapper, {paddingBottom: Math.max(bottom, 10)}]}>
    <View style={styles.bar}>
      {state.routes.map((route, index) => {
        const cfg = TAB_CONFIG[route.name] ?? {};
        const focused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (cfg.center) {
          return (
            <TouchableOpacity
              key={route.key}
              style={styles.centerTab}
              onPress={onPress}
              activeOpacity={0.85}>
              <LinearGradient
                colors={focused ? ['#5B55FF', '#2E3192'] : ['#4A52C8', '#2E3192']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.centerBtn}>
                <Ionicons
                  name={focused ? cfg.activeIcon : cfg.icon}
                  size={26}
                  color="#fff"
                />
              </LinearGradient>
              <Text style={[styles.label, focused && styles.labelActive]}>
                {cfg.title}
              </Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tab}
            onPress={onPress}
            activeOpacity={0.75}>
            <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
              <Ionicons
                name={focused ? cfg.activeIcon : cfg.icon}
                size={21}
                color={focused ? '#fff' : '#A0A8C0'}
              />
            </View>
            <Text style={[styles.label, focused && styles.labelActive]}>
              {cfg.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
  );
};

/* ── Navigator ── */
const HomeTabs = () => (
  <Tab.Navigator
    tabBar={props => <CustomTabBar {...props} />}
    screenOptions={{headerShown: false}}>
    <Tab.Screen name="OfferScreen"   component={OfferScreen} />
    <Tab.Screen name="PedalScreen"   component={PedalScreen} />
    <Tab.Screen name="HomeScreen"    component={HomeScreen} />
    <Tab.Screen name="SettingScreen" component={SettingScreen} />
    <Tab.Screen name="AccountScreen" component={AccountScreen} />
  </Tab.Navigator>
);

export default HomeTabs;
