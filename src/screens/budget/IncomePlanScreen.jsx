import {FAB} from '@rneui/themed';
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import DeleteModal from '../../components/modals/DeleteModal';
import IncomeModal from '../../components/modals/IncomeModal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoadingContainer from '../../components/common/LoadingContainer';
import NoDataFound from '../../components/common/NoDataFound';
import Toast from 'react-native-toast-message';
import api from '../../api';
import styles from '../../styles/IncomePlanScreen.styles';

const IncomePlanScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState(null);
  const [incomeToEditId, setIncomeToEditId] = useState(null);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [incomeItems, setIncomeItems] = useState([
    {id: 1, name: '', planned: '', actual: ''},
  ]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncomes();
  }, []);

  const showToast = (message, type = 'success') => {
    Toast.show({type, text1: message, position: 'bottom'});
  };

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/IncomePlan');
      setIncomes(response.data.data);
    } catch (error) {
      setIncomes([]);
      showToast('আয় লোড করতে ব্যর্থ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIncome = async () => {
    if (!incomeToDelete) return;
    try {
      setLoading(true);
      await api.delete(`/api/IncomePlan/${incomeToDelete}`);
      setIncomes(incomes.filter(income => income.id !== incomeToDelete));
      showToast('আয় সফলভাবে মুছে ফেলা হয়েছে', 'success');
    } catch (error) {
      showToast('আয় মুছতে ব্যর্থ', 'error');
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
      setIncomeToDelete(null);
    }
  };

  const calculateIncomeTotals = income => {
    const incomeAmount = income.incomePlanDetails
      ?.reduce((sum, item) => sum + Number(item.plannedAmount || 0), 0)
      .toString();
    const expenseAmount = income.incomePlanDetails
      ?.reduce((sum, item) => sum + Number(item.actualAmount || 0), 0)
      .toString();
    return {incomeAmount, expenseAmount};
  };

  const getIncomeStatus = income => {
    const now = new Date();
    const parseDate = dateStr => {
      const [day, month, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day);
    };
    const start = parseDate(income.planStartDate);
    const end = parseDate(income.planEndDate);
    if (now < start) return 'প্রস্তুতি';
    if (now > end) return 'সম্পন্ন';
    return 'চলমান';
  };

  const addIncomeItem = () => {
    setIncomeItems([
      ...incomeItems,
      {id: Date.now(), name: '', planned: '', actual: ''},
    ]);
  };

  const removeIncomeItem = id => {
    setIncomeItems(incomeItems.filter(item => item.id !== id));
  };

  const updateIncomeItem = (id, key, value) => {
    setIncomeItems(
      incomeItems.map(item =>
        item.id === id ? {...item, [key]: value} : item,
      ),
    );
  };

  const handleEditIncome = incomePlanId => {
    setIncomeToEditId(incomePlanId);
    setEditModalVisible(true);
  };

  const handleEditModalClose = () => {
    setEditModalVisible(false);
    setIncomeToEditId(null);
    setName('');
    setStartDate(null);
    setEndDate(null);
    setIncomeItems([{id: 1, name: '', planned: '', actual: ''}]);
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchIncomes}
            colors={['#1D2A74']}
          />
        }>
        <View style={styles.container}>
          <Text style={styles.sectionLabel}>সারাংশ</Text>
          <Text style={styles.pageTitle}>আপনার আয় পরিকল্পনা</Text>

          {loading ? (
            <LoadingContainer title="আয় লোড হচ্ছে" />
          ) : incomes.length > 0 ? (
            incomes.map(income => {
              const {incomeAmount, expenseAmount} =
                calculateIncomeTotals(income);
              const planned = parseFloat(incomeAmount) || 0;
              const actual = parseFloat(expenseAmount) || 0;
              const progress =
                planned > 0
                  ? Math.min((actual / planned) * 100, 100)
                  : 0;
              const status = getIncomeStatus(income);

              return (
                <View key={income.id} style={styles.card}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.cardHeaderLeft}>
                      <Text style={styles.cardTitle}>{income.name}</Text>
                      <Text style={styles.cardSubtitle}>
                        {income.planStartDate} - {income.planEndDate}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusPill,
                        status === 'চলমান'
                          ? styles.statusActive
                          : status === 'সম্পন্ন'
                          ? styles.statusComplete
                          : styles.statusPending,
                      ]}>
                      <Text style={styles.statusText}>{status}</Text>
                    </View>
                  </View>

                  <View style={styles.metricRow}>
                    <View>
                      <Text style={styles.metricLabel}>পরিকল্পিত</Text>
                      <Text style={styles.metricValue}>৳ {incomeAmount}</Text>
                    </View>
                    <View>
                      <Text
                        style={[styles.metricLabel, styles.metricLabelRight]}>
                        প্রকৃত
                      </Text>
                      <Text style={styles.metricValueGreen}>
                        ৳ {expenseAmount}
                      </Text>
                    </View>
                  </View>

                  {planned > 0 && (
                    <View style={styles.progressRow}>
                      <View style={styles.progressBarBackground}>
                        <View
                          style={[
                            styles.progressFill,
                            {width: `${progress}%`},
                          ]}
                        />
                      </View>
                      <View style={styles.progressInfoRow}>
                        <Text style={styles.progressInfo}>
                          সংগ্রহিত {Math.round(progress)}%
                        </Text>
                        <Text style={styles.progressInfo}>
                          বাকি ৳ {Math.max(planned - actual, 0)}
                        </Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => {
                        setIncomeToDelete(income.id);
                        setDeleteModalVisible(true);
                      }}>
                      <Ionicons
                        name="trash-outline"
                        size={16}
                        color="#6c757d"
                      />
                      <Text style={styles.deleteButtonText}> মুছুন</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.detailButton}
                      onPress={() => handleEditIncome(income.id)}>
                      <Text style={styles.detailButtonText}>
                        বিস্তারিত দেখুন →
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : (
            <NoDataFound title="আয়" />
          )}
        </View>
      </ScrollView>

      <FAB
        visible={true}
        title="নতুন আয়"
        icon={{name: 'add', color: 'white'}}
        color="#1D2A74"
        placement="right"
        style={{marginBottom: 50}}
        onPress={() => setModalVisible(true)}
      />

      <DeleteModal
        visible={deleteModalVisible}
        onClose={() => {
          setDeleteModalVisible(false);
          setIncomeToDelete(null);
        }}
        onConfirm={handleDeleteIncome}
        message="আপনি এই আয়টি মুছে ফেলতে চান?"
      />

      <IncomeModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        name={name}
        setName={setName}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        incomeItems={incomeItems}
        setIncomeItems={setIncomeItems}
        addIncomeItem={addIncomeItem}
        updateIncomeItem={updateIncomeItem}
        removeIncomeItem={removeIncomeItem}
        isEditMode={false}
        fetchIncomes={fetchIncomes}
      />

      <IncomeModal
        modalVisible={editModalVisible}
        setModalVisible={setEditModalVisible}
        name={name}
        setName={setName}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        incomeItems={incomeItems}
        setIncomeItems={setIncomeItems}
        addIncomeItem={addIncomeItem}
        updateIncomeItem={updateIncomeItem}
        removeIncomeItem={removeIncomeItem}
        isEditMode={true}
        incomePlanId={incomeToEditId}
        fetchIncomes={fetchIncomes}
        onClose={handleEditModalClose}
      />
    </View>
  );
};

export default IncomePlanScreen;
