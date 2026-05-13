import {Icon} from '@rneui/themed';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import React from 'react';
import Toast from 'react-native-toast-message';
import menuItems from '../../data/menuItems';
import {useNavigation} from '@react-navigation/native';

export default function HomeScreen({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FF" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Icon name="menu" type="material" size={26} color="#2E3192" />
          </TouchableOpacity>
          <Text style={styles.title}>PEDAL</Text>
          <Icon name="notifications-none" type="material" size={26} color="#2E3192" />
        </View>

        <View style={styles.searchCard}>
          <Icon name="search" type="material" size={20} color="#777" />
          <TextInput
            placeholder="সার্চ করুন..."
            placeholderTextColor="#777"
            style={styles.searchInput}
          />
          <TouchableOpacity style={styles.searchAction}>
            <Icon name="arrow-forward-ios" type="material" size={14} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.quickActionsWrap}>
          {menuItems.map(item => (
            <QuickActionCard key={item.title} item={item} />
          ))}
        </View>

        <View style={styles.promoCard}>
          <View>
            <Text style={styles.promoTitle}>PEDAL GOLD</Text>
            <Text style={styles.promoText}>৫% ক্যাশব্যাক লাভ প্রতি ট্রানজেকশনে</Text>
          </View>
          <TouchableOpacity style={styles.promoButton}>
            <Text style={styles.promoButtonText}>জয়েন করুন</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.investSection}>
          <View style={styles.infoCard}>
            <Icon name="rocket-launch" type="material-community" size={22} color="#1D4CF3" />
            <Text style={styles.infoTitle}>দ্রুত বিনিয়োগ</Text>
            <Text style={styles.infoSub}>সর্বনিম্ন ১০০ টাকা থেকে শুরু</Text>
          </View>
          <View style={styles.infoCard}>
            <Icon name="shield-check" type="material-community" size={22} color="#1D4CF3" />
            <Text style={styles.infoTitle}>নিরাপদ পেমেন্ট</Text>
            <Text style={styles.infoSub}>২-স্তর সুরক্ষা ব্যবস্থা</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const QuickActionCard = ({item}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.quickActionCard}
      activeOpacity={0.7}
      onPress={() => {
        if (!item.screen) {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: '🚧 This feature is under development',
            visibilityTime: 2000,
          });
        } else {
          navigation.navigate(item.screen);
        }
      }}>
      <View style={[styles.actionIcon, {backgroundColor: item.color + '20'}]}>
        <Icon name={item.icon} type={item.type} size={22} color={item.color} />
      </View>
      <Text style={styles.actionLabel}>{item.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  content: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  title: {
    color: '#2E3192',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 10,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    elevation: 4,
    marginBottom: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0C0E48',
    padding: 0,
  },
  searchAction: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#2E3192',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  quickActionCard: {
    width: '48%',
    minHeight: 104,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    elevation: 3,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#17173C',
  },
  promoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    elevation: 4,
    marginBottom: 18,
  },
  promoTitle: {
    color: '#2E3192',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  promoText: {
    color: '#6F759B',
    fontSize: 14,
  },
  promoButton: {
    backgroundColor: '#2E3192',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  promoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  investSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    elevation: 3,
  },
  infoTitle: {
    color: '#2E3192',
    fontSize: 16,
    fontWeight: '800',
    marginVertical: 6,
  },
  infoSub: {
    color: '#6F759B',
    fontSize: 13,
  },
});
