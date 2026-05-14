import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import api from '../../api';
import styles from '../../styles/SMEDashboardScreen.styles';

const weeklySummary = [
  {label: 'মোট বিক্রয়', value: '৳ ২,১০,৫০০', color: '#10165F'},
  {label: 'মোট লাভ', value: '৳ ৪২,৩০০', color: '#138A36'},
  {label: 'মোট খরচ', value: '৳ ১২,৪৫০', color: '#D11B1B'},
  {label: 'নেট লাভ', value: '৳ ২৯,৮৫০', color: '#10165F', highlight: '#ECEBF9'},
];

const monthlySummary = [
  {label: 'মোট বিক্রয়', value: '৳ ৮,৪০,০০০', color: '#10165F'},
  {label: 'মোট লাভ', value: '৳ ১,৬৮,০০০', color: '#138A36'},
  {label: 'মোট খরচ', value: '৳ ৪৫,২০০', color: '#D11B1B'},
  {label: 'নেট লাভ', value: '৳ ১,২২,৮০০', color: '#138A36', highlight: '#EDF7F0'},
];

export default function SMEDashboardScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [todaySells, setTodaySells] = useState(null);
  const [monthSells, setMonthSells] = useState(null);
  const [totalInStockProducts, setTotalInStockProducts] = useState(null);
  const [totalPendingAmount, setTotalPendingAmount] = useState(null);

  const showToast = (message, type = 'success') => {
    Toast.show({type, text1: message, position: 'bottom'});
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('api/dashboard');
      setTodaySells(response.data.todaySells);
      setMonthSells(response.data.monthSells);
      setTotalInStockProducts(response.data.totalInStockProducts);
      setTotalPendingAmount(response.data.totalPendingAmount);
    } catch (error) {
      setTodaySells(null);
      setMonthSells(null);
      setTotalInStockProducts(null);
      setTotalPendingAmount(null);
      showToast('লোড করতে ব্যর্থ', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const topCards = [
    {
      title: 'আজকের বিক্রয়',
      value: todaySells !== null ? `৳ ${todaySells}` : '—',
      icon: 'cash-multiple',
      iconBg: '#EEF0FF',
      iconColor: '#1A237E',
      badge: '+১২%',
      badgeBg: '#A8F28C',
    },
    {
      title: 'এই মাসের বিক্রয়',
      value: monthSells !== null ? `৳ ${monthSells}` : '—',
      icon: 'trending-up',
      iconBg: '#EDF7F1',
      iconColor: '#2E7D32',
      badge: '+৮%',
      badgeBg: '#A8F28C',
    },
    {
      title: 'মোট স্টক',
      value: totalInStockProducts !== null ? `${totalInStockProducts} পিস` : '—',
      icon: 'archive',
      iconBg: '#FFF4DF',
      iconColor: '#F4B400',
      badge: 'স্টক',
      badgeBg: '#FFE39E',
      badgeColor: '#8A5B00',
    },
    {
      title: 'মোট বাকি',
      value: totalPendingAmount !== null ? `৳ ${totalPendingAmount}` : '—',
      icon: 'wallet-outline',
      iconBg: '#FBE9E9',
      iconColor: '#D32F2F',
      badge: 'বাকি',
      badgeBg: '#FFD6D1',
      badgeColor: '#D32F2F',
    },
  ];

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={fetchDashboardData}
          colors={['#111B74']}
        />
      }>
      <View style={styles.hero}>
        <Text style={styles.greeting}>স্বাগতম, ম্যানেজার</Text>
        <Text style={styles.subtitle}>
          আপনার ব্যবসার আজকের বর্তমান অবস্থা এখানে দেখুন।
        </Text>
      </View>

      <View style={styles.cardsGrid}>
        {topCards.map(card => (
          <View key={card.title} style={styles.statCard}>
            <View style={styles.cardTopRow}>
              <View
                style={[styles.cardIconWrap, {backgroundColor: card.iconBg}]}>
                <MaterialCommunityIcons
                  name={card.icon}
                  size={22}
                  color={card.iconColor}
                />
              </View>
              <View
                style={[styles.cardBadge, {backgroundColor: card.badgeBg}]}>
                <Text
                  style={[
                    styles.cardBadgeText,
                    card.badgeColor ? {color: card.badgeColor} : null,
                  ]}>
                  {card.badge}
                </Text>
              </View>
            </View>
            <Text style={styles.cardLabel}>{card.title}</Text>
            {isLoading ? (
              <ActivityIndicator
                size="small"
                color="#111B74"
                style={{marginTop: 6}}
              />
            ) : (
              <Text style={styles.cardValue}>{card.value}</Text>
            )}
          </View>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>৭ দিনের সারাংশ</Text>
      </View>
      <View style={styles.summaryCard}>
        {weeklySummary.map((item, index) => (
          <View
            key={item.label}
            style={[
              styles.summaryRow,
              item.highlight ? {backgroundColor: item.highlight} : null,
              index !== weeklySummary.length - 1
                ? styles.summaryDivider
                : null,
            ]}>
            <Text
              style={[
                styles.summaryLabel,
                item.highlight ? styles.summaryLabelStrong : null,
              ]}>
              {item.label}
            </Text>
            <Text style={[styles.summaryValue, {color: item.color}]}>
              {item.value}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>এই মাস</Text>
      </View>
      <View style={styles.summaryCard}>
        {monthlySummary.map((item, index) => (
          <View
            key={item.label}
            style={[
              styles.summaryRow,
              item.highlight ? {backgroundColor: item.highlight} : null,
              index !== monthlySummary.length - 1
                ? styles.summaryDivider
                : null,
            ]}>
            <Text
              style={[
                styles.summaryLabel,
                item.highlight ? styles.summaryLabelStrong : null,
              ]}>
              {item.label}
            </Text>
            <Text style={[styles.summaryValue, {color: item.color}]}>
              {item.value}
            </Text>
          </View>
        ))}
      </View>

      <View style={[styles.alertCard, styles.alertDanger]}>
        <View style={[styles.alertIconWrap, styles.alertDangerIconWrap]}>
          <Ionicons name="warning" size={22} color="#FFFFFF" />
        </View>
        <View style={styles.alertBody}>
          <Text style={styles.alertTitleDanger}>কম স্টক: ৩ টি</Text>
          <Text style={styles.alertTextDanger}>
            কিছু মালামাল দ্রুত শেষ হচ্ছে।
          </Text>
        </View>
      </View>

      <View style={[styles.alertCard, styles.alertWarning]}>
        <View style={[styles.alertIconWrap, styles.alertWarningIconWrap]}>
          <MaterialCommunityIcons name="cash-clock" size={22} color="#111B74" />
        </View>
        <View style={styles.alertBody}>
          <Text style={styles.alertTitle}>আজ বাকি বিক্রি: ৳ ১,২০০</Text>
          <Text style={styles.alertText}>বাকি টাকা সংগ্রহের সময় হয়েছে।</Text>
        </View>
      </View>
    </ScrollView>
  );
}
