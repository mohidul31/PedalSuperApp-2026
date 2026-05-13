import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import AccountScreen from '../screens/app_screens/home_tabs/AccountScreen';
import HomeScreen from '../screens/app_screens/HomeScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import OfferScreen from '../screens/app_screens/home_tabs/OfferScreen';
import PedalScreen from '../screens/app_screens/home_tabs/PedalScreen';
import React from 'react';
import SettingScreen from '../screens/app_screens/home_tabs/SettingScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

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

/* ── Styles ── */
const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#F8F9FF',
    paddingTop: 4,
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'flex-end',
    shadowColor: '#2E3192',
    shadowOpacity: 0.14,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 6},
    elevation: 14,
  },

  /* Regular tab */
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  iconBox: {
    width: 42,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxActive: {
    backgroundColor: '#2E3192',
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: '#A0A8C0',
  },
  labelActive: {
    color: '#2E3192',
    fontWeight: '700',
  },

  /* Center tab */
  centerTab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  centerBtn: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    shadowColor: '#2E3192',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    elevation: 10,
  },
});
