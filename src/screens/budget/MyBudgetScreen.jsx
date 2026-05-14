import {FAB} from '@rneui/themed';
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import BudgetModal from '../../components/modals/BudgetModal';
import DeleteModal from '../../components/modals/DeleteModal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoadingContainer from '../../components/common/LoadingContainer';
import NoDataFound from '../../components/common/NoDataFound';
import Toast from 'react-native-toast-message';
import api from '../../api';
import styles from '../../styles/MyBudgetScreen.styles';

const MyBudgetScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [budgetToEditId, setBudgetToEditId] = useState(null);
  const [budgetName, setBudgetName] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [budgetItems, setBudgetItems] = useState([
    {id: 1, name: '', planned: '', actual: ''},
  ]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const showToast = (message, type = 'success') => {
    Toast.show({type, text1: message, position: 'bottom'});
  };

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/budget');
      setBudgets(response.data.data);
    } catch (error) {
      setBudgets([]);
      showToast('বাজেট লোড করতে ব্যর্থ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBudget = async () => {
    if (!budgetToDelete) return;
    try {
      setLoading(true);
      await api.delete(`/api/budget/${budgetToDelete}`);
      setBudgets(budgets.filter(budget => budget.id !== budgetToDelete));
      showToast('বাজেট সফলভাবে মুছে ফেলা হয়েছে', 'success');
    } catch (error) {
      showToast('বাজেট মুছতে ব্যর্থ', 'error');
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
      setBudgetToDelete(null);
    }
  };

  const calculateBudgetTotals = budget => {
    const incomeAmount = budget.budgetDetails
      ?.reduce((sum, item) => sum + Number(item.plannedAmount || 0), 0)
      .toString();
    const expenseAmount = budget.budgetDetails
      ?.reduce((sum, item) => sum + Number(item.actualAmount || 0), 0)
      .toString();
    return {incomeAmount, expenseAmount};
  };

  const getBudgetStatus = budget => {
    const now = new Date();
    const parseDate = dateStr => {
      const [day, month, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day);
    };
    const start = parseDate(budget.planStartDate);
    const end = parseDate(budget.planEndDate);
    if (now < start) return 'প্রস্তুতি';
    if (now > end) return 'সম্পন্ন';
    return 'চলমান';
  };

  const addBudgetItem = () => {
    setBudgetItems([
      ...budgetItems,
      {id: Date.now(), name: '', planned: '', actual: ''},
    ]);
  };

  const removeBudgetItem = id => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
  };

  const updateBudgetItem = (id, key, value) => {
    setBudgetItems(
      budgetItems.map(item =>
        item.id === id ? {...item, [key]: value} : item,
      ),
    );
  };

  const handleEditBudget = budgetId => {
    setBudgetToEditId(budgetId);
    setEditModalVisible(true);
  };

  const handleEditModalClose = () => {
    setEditModalVisible(false);
    setBudgetToEditId(null);
    setBudgetName('');
    setStartDate(null);
    setEndDate(null);
    setBudgetItems([{id: 1, name: '', planned: '', actual: ''}]);
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchBudgets}
            colors={['#1D2A74']}
          />
        }>
        <View style={styles.container}>
          <Text style={styles.sectionLabel}>সারাংশ</Text>
          <Text style={styles.pageTitle}>আপনার সকল বাজেট</Text>

          {loading ? (
            <LoadingContainer title="বাজেট লোড হচ্ছে" />
          ) : budgets.length > 0 ? (
            budgets.map(budget => {
              const {incomeAmount, expenseAmount} =
                calculateBudgetTotals(budget);
              const planned = parseFloat(incomeAmount) || 0;
              const actual = parseFloat(expenseAmount) || 0;
              const progress =
                planned > 0
                  ? Math.min((actual / planned) * 100, 100)
                  : 0;
              const status = getBudgetStatus(budget);

              return (
                <View key={budget.id} style={styles.card}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.cardHeaderLeft}>
                      <Text style={styles.cardTitle}>{budget.budgetName}</Text>
                      <Text style={styles.cardSubtitle}>
                        {budget.planStartDate} - {budget.planEndDate}
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
                          ব্যয় {Math.round(progress)}%
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
                        setBudgetToDelete(budget.id);
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
                      onPress={() => handleEditBudget(budget.id)}>
                      <Text style={styles.detailButtonText}>
                        বিস্তারিত দেখুন →
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : (
            <NoDataFound title="বাজেট" />
          )}
        </View>
      </ScrollView>

      <FAB
        visible={true}
        title="নতুন বাজেট"
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
          setBudgetToDelete(null);
        }}
        onConfirm={handleDeleteBudget}
        message="আপনি এই বাজেটটি মুছে ফেলতে চান?"
      />

      <BudgetModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        budgetName={budgetName}
        setBudgetName={setBudgetName}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        budgetItems={budgetItems}
        setBudgetItems={setBudgetItems}
        addBudgetItem={addBudgetItem}
        updateBudgetItem={updateBudgetItem}
        removeBudgetItem={removeBudgetItem}
        isEditMode={false}
        fetchBudgets={fetchBudgets}
      />

      <BudgetModal
        modalVisible={editModalVisible}
        setModalVisible={setEditModalVisible}
        budgetName={budgetName}
        setBudgetName={setBudgetName}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        budgetItems={budgetItems}
        setBudgetItems={setBudgetItems}
        addBudgetItem={addBudgetItem}
        updateBudgetItem={updateBudgetItem}
        removeBudgetItem={removeBudgetItem}
        isEditMode={true}
        budgetId={budgetToEditId}
        fetchBudgets={fetchBudgets}
        onClose={handleEditModalClose}
      />
    </View>
  );
};

export default MyBudgetScreen;
