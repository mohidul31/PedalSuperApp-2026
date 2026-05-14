import {Icon} from '@rneui/themed';
import {
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import React from 'react';
import menuItems from '../../data/menuItems';
import QuickActionCard from '../../components/home/QuickActionCard';
import ScreenHeader from '../../components/common/ScreenHeader';
import styles from '../../styles/HomeScreen.styles';

export default function HomeScreen({navigation}) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FF" />
      <ScreenHeader
        navigation={navigation}
        rightIcon="notifications-none"
        onRightPress={() => {}}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
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
