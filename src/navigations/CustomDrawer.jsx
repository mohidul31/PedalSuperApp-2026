import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../context/AuthContext';
import {Icon} from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import menuItems from '../data/menuItems';

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
      {/* ── Gradient Header ── */}
      <LinearGradient
        colors={['#1A237E', '#2E3192', '#4A52C8']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.header}>

        {/* Close button */}
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => props.navigation.closeDrawer()}
          activeOpacity={0.7}>
          <Icon name="close" type="material" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Avatar */}
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

      {/* ── Scrollable Menu ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Home shortcut */}
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

        {/* Logout */}
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

/* ── Small sub-components ── */

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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },

  /* Header */
  header: {
    paddingTop: 52,
    paddingBottom: 28,
    paddingHorizontal: 24,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarRing: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatar: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#FFB347',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  headerName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  headerContact: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
  },
  betaPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  betaPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 0.8,
  },

  /* Scroll */
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },

  /* Section label */
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A0A8C0',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 6,
    paddingHorizontal: 6,
  },

  /* Menu row */
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 14,
    gap: 12,
    marginBottom: 2,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#17173C',
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  /* Logout */
  divider: {
    height: 1,
    backgroundColor: '#E8EDF5',
    marginVertical: 16,
    marginHorizontal: 6,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    gap: 12,
    borderRadius: 14,
  },
  logoutIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E53935',
  },
});

export default CustomDrawer;
