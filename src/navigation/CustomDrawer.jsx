import {Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../context/AuthContext';
import {Icon} from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import menuItems from '../data/menuItems';
import styles from '../styles/CustomDrawer.styles';

const utilityItems = [
  {label: 'সেটিংস', icon: 'cog-outline', type: 'material-community', color: '#0D79FF'},
  {label: 'নিরাপত্তা', icon: 'shield-check-outline', type: 'material-community', color: '#533BFF'},
  {label: 'সহায়তা কেন্দ্র', icon: 'help-circle-outline', type: 'material-community', color: '#5B55FF'},
  {label: 'শর্তাবলী', icon: 'file-document-outline', type: 'material-community', color: '#07A6FF'},
];

const getInitial = name => (name ? name.trim().charAt(0).toUpperCase() : '?');

const CustomDrawer = props => {
  const {setIsAuthenticated} = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    AsyncStorage.multiGet(['user_name', 'user_email', 'user_phone'])
      .then(([u, e, p]) => {
        if (u[1]) setUsername(u[1]);
        if (e[1]) setEmail(e[1]);
        if (p[1]) setPhone(p[1]);
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'লগআউট',
      'আপনি কি নিশ্চিত লগআউট করতে চান?',
      [
        {text: 'না', style: 'cancel'},
        {
          text: 'হ্যাঁ, লগআউট',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user_name', 'user_email', 'user_phone']);
            setIsAuthenticated(false);
          },
        },
      ],
      {cancelable: true},
    );
  };

  const navigate = screen => {
    props.navigation.navigate(screen);
  };

  const showWIP = () =>
    Toast.show({type: 'error', position: 'bottom', text1: '🚧 শীঘ্রই আসছে', visibilityTime: 1500});

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#1A237E', '#2E3192', '#4A52C8']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.header}>

        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => props.navigation.closeDrawer()}
          activeOpacity={0.7}>
          <Icon name="close" type="material" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={styles.avatarRing}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitial(username)}</Text>
          </View>
        </View>

        <Text style={styles.headerName}>{username || 'ব্যবহারকারী'}</Text>

        {(phone || email) ? (
          <Text style={styles.headerContact}>{phone || email}</Text>
        ) : null}

        <View style={styles.betaPill}>
          <Text style={styles.betaPillText}>Beta</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        <MenuItem
          icon="home-outline"
          iconType="material-community"
          label="হোম"
          color="#2E3192"
          onPress={() => navigate('HomeStack')}
        />

        <SectionLabel text="অ্যাপ মেনু" />

        {menuItems.map((item, i) => {
          const ready = item.screen && item.screen !== 'UnderConstruction';
          return (
            <MenuItem
              key={i}
              icon={item.icon}
              iconType={item.type}
              label={item.title}
              color={item.color}
              badge={!ready ? 'শীঘ্রই' : null}
              onPress={ready ? () => navigate(item.screen) : showWIP}
            />
          );
        })}

        <SectionLabel text="সাধারণ" />

        {utilityItems.map((item, i) => (
          <MenuItem
            key={i}
            icon={item.icon}
            iconType={item.type}
            label={item.label}
            color={item.color}
            onPress={showWIP}
          />
        ))}

        <View style={styles.divider} />
        <TouchableOpacity style={styles.logoutRow} onPress={handleLogout} activeOpacity={0.7}>
          <View style={styles.logoutIconBox}>
            <Icon name="logout" type="material" size={20} color="#E53935" />
          </View>
          <Text style={styles.logoutLabel}>লগআউট</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const SectionLabel = ({text}) => (
  <Text style={styles.sectionLabel}>{text}</Text>
);

const MenuItem = ({icon, iconType, label, color, badge, onPress}) => (
  <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.72}>
    <View style={[styles.menuIconBox, {backgroundColor: color + '18'}]}>
      <Icon name={icon} type={iconType} size={20} color={color} />
    </View>
    <Text style={styles.menuLabel}>{label}</Text>
    {badge ? (
      <View style={[styles.badge, {backgroundColor: color + '18'}]}>
        <Text style={[styles.badgeText, {color}]}>{badge}</Text>
      </View>
    ) : (
      <Icon name="chevron-right" type="material" size={18} color="#CBD0E0" />
    )}
  </TouchableOpacity>
);

export default CustomDrawer;
