import {Button, Card, FAB, Icon} from '@rneui/themed';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';

import BudgetModal from '../../../components/BudgetModal';
import {COLORS} from '../../../styles/colors';
import DeleteModal from '../../../components/DeleteModal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoadingContainer from '../../../components/LoadingContainer';
import NoDataFound from '../../../components/NoDataFound';
import Toast from 'react-native-toast-message';
import api from '../../../api';

const MyBudgetScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [budgetToEditId, setBudgetToEditId] = useState(null);
  const [budgetName, setBudgetName] = useState('');
  const [startDate, setStartDate] = useState(null); // Changed to null
  const [endDate, setEndDate] = useState(null); // Changed to null
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

  const handleRefresh = () => {
    fetchBudgets();
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

  const isBudgetActive = budget => {
    const now = new Date();

    const parseDate = dateStr => {
      const [day, month, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day);
    };

    const start = parseDate(budget.planStartDate);
    const end = parseDate(budget.planEndDate);

    return now >= start && now <= end;
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text></Text>
            <Pressable
              style={styles.reloadButton}
              onPress={handleRefresh}
              disabled={loading}>
              <Ionicons
                name="reload"
                size={20}
                color={loading ? 'gray' : COLORS.PRIMARY}
              />
              <Text
                style={[
                  styles.reloadText,
                  {color: loading ? 'gray' : COLORS.PRIMARY},
                ]}>
                রিফ্রেশ
              </Text>
            </Pressable>
          </View>

          <Text style={styles.header}>আমার বাজেট</Text>
          <Text style={styles.subHeader}>আপনার সকল বাজেট দেখুন</Text>

          {loading ? (
            <LoadingContainer title="বাজেট লোড হচ্ছে" />
          ) : budgets.length > 0 ? (
            budgets.map(budget => {
              const {incomeAmount, expenseAmount} =
                calculateBudgetTotals(budget);
              const isActive = isBudgetActive(budget);

              return (
                <Card key={budget.id} containerStyle={styles.card}>
                  {isActive && (
                    <View style={styles.cardHeaderContainer}>
                      <Text style={styles.headerText}>
                        বর্তমান সক্রিয় বাজেট
                      </Text>
                    </View>
                  )}

                  <Text style={styles.cardTitle}>{budget.budgetName}</Text>

                  <View style={styles.detailsContainer}>
                    <View style={styles.detailsRow}>
                      <Text style={styles.label}>সময়কাল:</Text>
                      <Text style={styles.details}>
                        {budget.planStartDate} - {budget.planEndDate}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.budgetContainer}>
                    <View style={[styles.budgetItem, styles.incomeBackground]}>
                      <Text style={styles.incomeLabel}>মোট পরিকল্পিত</Text>
                      <Text style={styles.incomeAmount}>{incomeAmount}৳</Text>
                    </View>
                    <View style={[styles.budgetItem, styles.expenseBackground]}>
                      <Text style={styles.expenseLabel}>মোট প্রকৃত</Text>
                      <Text style={styles.expenseAmount}>{expenseAmount}৳</Text>
                    </View>
                  </View>

                  <View style={styles.buttonContainer}>
                    <Button
                      icon={
                        <Icon
                          name="trash-2"
                          type="feather"
                          color="#6c757d"
                          size={20}
                        />
                      }
                      title=" মুছুন"
                      buttonStyle={styles.deleteButton}
                      type="outline"
                      onPress={() => {
                        setBudgetToDelete(budget.id);
                        setDeleteModalVisible(true);
                      }}
                    />
                    <Button
                      icon={
                        <Icon
                          name="eye"
                          type="feather"
                          color="#fff"
                          size={20}
                        />
                      }
                      title=" দেখুন"
                      buttonStyle={styles.viewButton}
                      onPress={() => handleEditBudget(budget.id)}
                    />
                  </View>
                </Card>
              );
            })
          ) : (
            <NoDataFound title="বাজেট" />
          )}
        </View>
      </ScrollView>

      <FAB
        visible={true}
        title="নতুন বাজেট যোগ করুন"
        icon={{name: 'add', color: 'white'}}
        color={COLORS.PRIMARY}
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
        onClose={handleEditModalClose} // Pass the close handler
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingTop: 10,
    marginBottom: 100,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    // marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subHeader: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  card: {
    width: '90%',
    borderRadius: 20,
    padding: 0,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    shadowColor: 'transparent',
  },
  cardHeaderContainer: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 8,
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  detailsContainer: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    width: '90%',
    alignSelf: 'center',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  details: {
    fontSize: 14,
    color: '#555',
  },
  budgetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 8,
    padding: 10,
  },
  budgetItem: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 8,
  },
  incomeBackground: {
    backgroundColor: '#d4edda',
  },
  expenseBackground: {
    backgroundColor: '#f8d7da',
  },
  incomeLabel: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
  },
  expenseLabel: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  incomeAmount: {
    color: 'green',
    fontSize: 18,
    fontWeight: 'bold',
  },
  expenseAmount: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  deleteButton: {
    borderColor: '#6c757d',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'white',
    paddingHorizontal: 15,
  },
  viewButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingHorizontal: 25,
  },
  reloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  reloadText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyBudgetScreen;