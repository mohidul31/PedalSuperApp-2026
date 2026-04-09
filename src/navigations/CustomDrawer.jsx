import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
// CustomDrawer.js
import React, { useContext, useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import { COLORS } from '../styles/colors';
import { Icon } from '@rneui/themed';
import Toast from 'react-native-toast-message';
import menuItems from '../data/menuItems';

const CustomDrawer = props => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [username, setUsername] = useState(null); // Default value
    const [email, setEmail] = useState(null); // Default value
    const [phone, setPhone] = useState(null); // Default value

    // Fetch username and email from AsyncStorage when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('user_name');
        const storedEmail = await AsyncStorage.getItem('user_email');
        const storedPhone = await AsyncStorage.getItem('user_phone');
        
        if (storedUsername) setUsername(storedUsername);
        if (storedEmail) setEmail(storedEmail);
        if (storedPhone) setPhone(storedPhone);
      } catch (error) {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Failed to load user data',
          visibilityTime: 2000,
        });
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    // Show confirmation dialog
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              // Remove tokens from storage
              await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user_name', 'user_email', 'user_phone']);
              // Update authentication state
              setIsAuthenticated(false);
              Toast.show({
                type: 'success',
                position: 'bottom',
                text1: 'Successfully logged out',
                visibilityTime: 2000,
              });
            } catch (error) {
              console.error('Logout error:', error);
              Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Failed to logout',
                visibilityTime: 2000,
              });
            }
          },
          style: 'destructive', // Makes the "Yes" button red on iOS
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: 'https://img1.wsimg.com/isteam/ip/85d30a0b-f0a3-4c2b-ad02-86ad127a68c2/blob-25b027d.png',
          }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{username}</Text>
        <Text style={styles.profileEmail}>{email}</Text>
        <Text style={styles.profileEmail}>{phone}</Text>
      </View>

      {/* Drawer Navigation Links */}
      <View style={styles.drawerItems}>
        {menuItems.map((item, index) => {
          const isScreenReady =
            item.screen === null || item.screen === 'UnderConstruction';
          const isActive =
            props.navigation.isFocused() &&
            props.navigation.getState().routeNames[
              props.navigation.getState().index
            ] === item.screen;

          return (
            <DrawerItem
              key={index}
              label={item.title}
              onPress={() => {
                if (isScreenReady) {
                  Toast.show({
                    type: 'error',
                    position: 'bottom',
                    text1: 'This feature is under development',
                    visibilityTime: 1000,
                  });
                } else {
                  props.navigation.navigate(item.screen);
                }
              }}
              labelStyle={[
                styles.drawerItemLabel,
                isScreenReady ? { color: 'gray' } : { color: 'black' },
                isActive && { color: COLORS.PRIMARY, fontWeight: 'bold' },
              ]}
              icon={({ size, color }) => (
                <Icon
                  name={item.icon}
                  type={item.type}
                  size={size}
                  color={
                    isScreenReady ? color : isActive ? COLORS.PRIMARY : 'black'
                  }
                />
              )}
            />
          );
        })}
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 14,
    color: '#888',
  },
  drawerItems: {
    marginTop: 20,
  },
  drawerItemLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 'auto',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  logoutButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: '#f44336',
  },
});

export default CustomDrawer;