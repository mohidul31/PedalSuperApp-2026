import {Button, Card, FAB, Icon} from '@rneui/themed';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';

import {COLORS} from '../../../styles/colors';
import DeleteModal from '../../../components/DeleteModal';
import IncomeModal from '../../../components/IncomeModal'; // Renamed component import
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoadingContainer from '../../../components/LoadingContainer';
import NoDataFound from '../../../components/NoDataFound';
import Toast from 'react-native-toast-message';
import api from '../../../api';

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
      showToast('আয় লোড করতে ব্যর্থ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchIncomes();
  };

  const handleDeleteIncome = async () => {
    if (!incomeToDelete) return;

    try {
      setLoading(true);
      await api.delete(`/api/IncomePlan/${incomeToDelete}`);
      setIncomes(incomes.filter(income => income.id !== incomeToDelete));
      showToast('আয় সফলভাবে মুছে ফেলা হয়েছে', 'success');
    } catch (error) {
      showToast('আয় মুছতে ব্যর্থ', 'error');
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

  const isIncomeActive = income => {
    const now = new Date();

    const parseDate = dateStr => {
      const [day, month, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day);
    };

    const start = parseDate(income.planStartDate);
    const end = parseDate(income.planEndDate);

    return now >= start && now <= end;
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

          <Text style={styles.header}>আমার আয়</Text>
          <Text style={styles.subHeader}>আপনার সকল আয় দেখুন</Text>

          {loading ? (
            <LoadingContainer title="আয় লোড হচ্ছে" />
          ) : incomes.length > 0 ? (
            incomes.map(income => {
              const {incomeAmount, expenseAmount} =
                calculateIncomeTotals(income);
              const isActive = isIncomeActive(income);

              return (
                <Card key={income.id} containerStyle={styles.card}>
                  {isActive && (
                    <View style={styles.cardHeaderContainer}>
                      <Text style={styles.headerText}>
                        বর্তমান সক্রিয় আয়
                      </Text>
                    </View>
                  )}

                  <Text style={styles.cardTitle}>{income.name}</Text>

                  <View style={styles.detailsContainer}>
                    <View style={styles.detailsRow}>
                      <Text style={styles.label}>সময়কাল:</Text>
                      <Text style={styles.details}>
                        {income.planStartDate} - {income.planEndDate}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.incomeContainer}>
                    <View style={[styles.incomeItem, styles.incomeBackground]}>
                      <Text style={styles.incomeLabel}>মোট পরিকল্পিত</Text>
                      <Text style={styles.incomeAmount}>{incomeAmount}৳</Text>
                    </View>
                    <View style={[styles.incomeItem, styles.expenseBackground]}>
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
                        setIncomeToDelete(income.id);
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
                      onPress={() => handleEditIncome(income.id)}
                    />
                  </View>
                </Card>
              );
            })
          ) : (
            <NoDataFound title="আয়" />
          )}
        </View>
      </ScrollView>

      <FAB
        visible={true}
        title="নতুন আয় যোগ করুন"
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
          setIncomeToDelete(null);
        }}
        onConfirm={handleDeleteIncome}
        message="আপনি এই আয়টি মুছে ফেলতে চান?"
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
  incomeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 8,
    padding: 10,
  },
  incomeItem: {
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

export default IncomePlanScreen;