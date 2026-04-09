import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Card, Icon, Text} from '@rneui/themed';
import React, {useEffect, useState} from 'react';

import {COLORS} from '../../../styles/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import api from '../../../api';

export default function SMEDashboardScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [todaySells, setTodaySells] = useState(false);
  const [monthSells, setMonthSells] = useState(false);
  const [totalInStockProducts, setTotalInStockProducts] = useState(false);
  const [totalPendingAmount, setTotalPendingAmount] = useState(false);

  const showToast = (message, type = 'success') => {
    Toast.show({
      type,
      text1: message,
      position: 'bottom',
    });
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
      setTodaySells(false);
      setMonthSells(false);
      setTotalInStockProducts(false);
      setTotalPendingAmount(false);
      showToast('লোড করতে ব্যর্থ', 'error');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text h3 style={styles.header}>
          ড্যাশবোর্ড
        </Text>
        <Pressable
          style={styles.reloadButton}
          onPress={handleRefresh}
          disabled={isLoading}>
          <Ionicons
            name="reload"
            size={20}
            color={isLoading ? 'gray' : COLORS.PRIMARY}
          />
          <Text
            style={[
              styles.reloadText,
              {color: isLoading ? 'gray' : COLORS.PRIMARY},
            ]}>
            রিফ্রেশ
          </Text>
        </Pressable>
      </View>

      <View style={styles.row}>
        <InfoCard
          title="আজকের বিক্রয়"
          value={`৳ ${todaySells}`}
          icon="chart-bar"
          colors={['#6DD5FA', '#2980B9']}
          isLoading={isLoading}
        />
        <InfoCard
          title="এই মাসের বিক্রয়"
          value={`৳ ${monthSells}`}
          icon="chart-line"
          colors={['#48C6EF', '#6F86D6']}
          isLoading={isLoading}
        />
      </View>

      <View style={styles.row}>
        <InfoCard
          title="মোট স্টক"
          value={`${totalInStockProducts} পিস`}
          icon="cube"
          colors={['#FAD961', '#F76B1C']}
          isLoading={isLoading}
        />
        <InfoCard
          title="মোট বাকি"
          value={`৳ ${totalPendingAmount}`}
          icon="dollar-sign"
          colors={['#FF758C', '#FF7EB3']}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
}

const InfoCard = ({title, value, icon, colors, isLoading}) => (
  <LinearGradient colors={colors} style={styles.card}>
    <View style={styles.cardContent}>
      <Icon
        name={icon}
        type="font-awesome-5"
        size={28}
        color="#fff"
        containerStyle={styles.icon}
      />
      <Text style={styles.title}>{title}</Text>
      {isLoading ? (
        <ActivityIndicator size="small" color="#fff" style={styles.loader} />
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F5F7FA',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  header: {
    textAlign: 'left',
    fontWeight: 'bold',
    color: '#333',
  },
  refreshIcon: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    borderRadius: 15,
    padding: 20,
    margin: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  cardContent: {
    alignItems: 'center',
  },
  icon: {
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginTop: 5,
  },
  loader: {
    marginTop: 5,
  },
  reloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 5,
    // backgroundColor: '#f0f0f0',
  },
  reloadText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
