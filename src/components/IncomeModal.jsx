import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Icon} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {Row, Rows, Table} from 'react-native-table-component';

import {COLORS} from '../styles/colors';
import DatePicker from 'react-native-date-picker';
import Toast from 'react-native-toast-message';
import api from '../api';

export default function IncomeModal({
  modalVisible,
  setModalVisible,
  name,
  setName,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  incomeItems,
  setIncomeItems,
  addIncomeItem,
  updateIncomeItem,
  removeIncomeItem,
  isEditMode = false,
  incomePlanId,
  fetchIncomes,
  onClose,
}) {
  const ROW_HEIGHT = 60;
  const tableHead = ['বিষয়ের নাম', 'পরিকল্পিত', 'প্রকৃত', 'মুছুন'];
  const widthArr = ['35%', '25%', '25%', '15%'];

  const [openStartPicker, setOpenStartPicker] = useState(false);
  const [openEndPicker, setOpenEndPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [subModalVisible, setSubModalVisible] = useState(false);
  const [subIncomeItems, setSubIncomeItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [subErrorMessage, setSubErrorMessage] = useState('');

  const totalPlanned = incomeItems
    .reduce((sum, item) => sum + (parseFloat(item.planned) || 0), 0)
    .toFixed(0);

  const totalActual = incomeItems
    .reduce((sum, item) => sum + (parseFloat(item.actual) || 0), 0)
    .toFixed(0);

  const showToast = (message, type = 'success') => {
    Toast.show({type, text1: message, position: 'bottom'});
  };

  useEffect(() => {
    if (isEditMode && incomePlanId && modalVisible) {
      fetchIncomeData();
    }
  }, [isEditMode, incomePlanId, modalVisible]);

  const fetchIncomeData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/incomePlan/${incomePlanId}`);
      const income = response.data.data;

      setName(income.name);

      const parseDate = dateStr => {
        const [day, month, year] = dateStr.split('/').map(Number);
        return new Date(year, month - 1, day);
      };

      setStartDate(parseDate(income.planStartDate));
      setEndDate(parseDate(income.planEndDate));
      setIncomeItems(
        income.incomePlanDetails.map(item => ({
          id: Date.now() + Math.random(),
          name: item.sectorName,
          planned: item.plannedAmount.toString(),
          actual: item.actualAmount.toString(),
          subItems: item.sectorDetails ? item.sectorDetails.map(subItem => ({
            id: Date.now() + Math.random(),
            name: subItem.name,
            planned: subItem.plannedAmount.toString(),
            actual: subItem.actualAmount.toString()
          })) : []
        })),
      );
    } catch (error) {
      showToast('আয় লোড করতে ব্যর্থ', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const addSubIncomeItem = () => {
    setSubIncomeItems(prev => [
      ...prev,
      { id: Date.now() + Math.random(), name: '', planned: '', actual: '' }
    ]);
    setSubErrorMessage('');
  };

  const updateSubIncomeItem = (id, field, value) => {
    setSubIncomeItems(prev =>
      prev.map(item =>
        item.id === id 
          ? { 
              ...item, 
              [field]: field === 'name' ? value : Math.floor(parseFloat(value) || 0).toString()
            } 
          : item
      )
    );
  };

  const removeSubIncomeItem = (id) => {
    setSubIncomeItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddSubItems = () => {
    const hasEmptyFields = subIncomeItems.some(item => 
      !item.name.trim() || !item.planned || !item.actual
    );

    if (subIncomeItems.length === 0 || hasEmptyFields) {
      setSubErrorMessage('সব সাব-আইটেমের জন্য নাম, পরিকল্পিত এবং প্রকৃত পরিমাণ প্রয়োজন');
      return;
    }

    setIncomeItems(prev =>
      prev.map(item =>
        item.id === selectedItemId
          ? { ...item, subItems: subIncomeItems }
          : item
      )
    );
    setSubModalVisible(false);
    setSubIncomeItems([]);
    setSubErrorMessage('');
  };

  const tableData = incomeItems.map(item => [
    <TextInput
      style={styles.slimInput}
      placeholder="বিষয়ের নাম"
      placeholderTextColor={COLORS.PLACEHOLDER_TEXT}
      value={item.name}
      onChangeText={text => updateIncomeItem(item.id, 'name', text)}
    />,
    <TextInput
      style={styles.slimInput}
      placeholder="পরিকল্পিত"
      placeholderTextColor={COLORS.PLACEHOLDER_TEXT}
      value={item.planned}
      onChangeText={text => updateIncomeItem(item.id, 'planned', text)}
      keyboardType="numeric"
    />,
    <TextInput
      style={styles.slimInput}
      placeholder="প্রকৃত"
      placeholderTextColor={COLORS.PLACEHOLDER_TEXT}
      value={item.actual}
      onChangeText={text => updateIncomeItem(item.id, 'actual', text)}
      keyboardType="numeric"
    />,
    <View style={styles.actionButtons}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          setSelectedItemId(item.id);
          setSubIncomeItems(item.subItems || []);
          setSubModalVisible(true);
          setSubErrorMessage('');
        }}>
        <Icon name="add" size={16} color="#28A745" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => removeIncomeItem(item.id)}>
        <Icon name="delete" size={16} color="#FF4D4F" />
      </TouchableOpacity>
    </View>,
  ]);

  const subTableData = subIncomeItems.map(item => [
    <TextInput
      style={styles.slimInput}
      placeholder="বিষয়ের নাম"
      placeholderTextColor={COLORS.PLACEHOLDER_TEXT}
      value={item.name}
      onChangeText={text => updateSubIncomeItem(item.id, 'name', text)}
    />,
    <TextInput
      style={styles.slimInput}
      placeholder="পরিকল্পিত"
      placeholderTextColor={COLORS.PLACEHOLDER_TEXT}
      value={item.planned}
      onChangeText={text => updateSubIncomeItem(item.id, 'planned', text)}
      keyboardType="numeric"
    />,
    <TextInput
      style={styles.slimInput}
      placeholder="প্রকৃত"
      placeholderTextColor={COLORS.PLACEHOLDER_TEXT}
      value={item.actual}
      onChangeText={text => updateSubIncomeItem(item.id, 'actual', text)}
      keyboardType="numeric"
    />,
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => removeSubIncomeItem(item.id)}>
      <Icon name="delete" size={16} color="#FF4D4F" />
    </TouchableOpacity>,
  ]);

  const tableFooter = ['মোট', totalPlanned, totalActual, '-'];

  const formatDate = date => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleEndDateConfirm = date => {
    setOpenEndPicker(false);
    if (startDate && date <= startDate) {
      const newEndDate = new Date(startDate);
      newEndDate.setDate(startDate.getDate() + 1);
      setEndDate(newEndDate);
    } else {
      setEndDate(date);
    }
  };

  const handleSave = async () => {
    const hasEmptyFields = incomeItems.some(item => 
      !item.name.trim() || !item.planned || !item.actual
    );
    
    if (incomeItems.length === 0 || hasEmptyFields) {
      setErrorMessage('সব আইটেমের জন্য নাম, পরিকল্পিত এবং প্রকৃত পরিমাণ প্রয়োজন');
      return;
    }

    setIsSaving(true);
    try {
      if (isEditMode && incomePlanId) {
        const payload = {
          id: incomePlanId,
          name: name,
          planStartDate: formatDate(startDate),
          planEndDate: formatDate(endDate),
          incomePlanDetails: incomeItems.map(item => ({
            incomePlanId: incomePlanId,
            sectorName: item.name,
            plannedAmount: item.planned,
            actualAmount: item.actual,
            sectorDetails: (item.subItems || []).map(subItem => ({
              incomePlanId: incomePlanId,
              name: subItem.name,
              plannedAmount: subItem.planned,
              actualAmount: subItem.actual
            }))
          })),
        };
        const response = await api.put(`/api/incomePlan/${incomePlanId}`, payload);
        if (response.data.success) {
          showToast('আয় সফলভাবে আপডেট করা হয়েছে');
        }
      } else {
        const payload = {
          name: name,
          planStartDate: formatDate(startDate),
          planEndDate: formatDate(endDate),
          incomePlanDetails: incomeItems.map(item => ({
            sectorName: item.name,
            plannedAmount: item.planned,
            actualAmount: item.actual,
            sectorDetails: (item.subItems || []).map(subItem => ({
              name: subItem.name,
              plannedAmount: subItem.planned,
              actualAmount: subItem.actual
            }))
          })),
        };
        const response = await api.post('/api/incomePlan', payload);
        if (response.data.success) {
          showToast('আয় যোগ করা হয়েছে');
        }
      }

      setModalVisible(false);
      fetchIncomes();
      if (!isEditMode) {
        setName('');
        setStartDate(null);
        setEndDate(null);
        setIncomeItems([{id: 1, name: '', planned: '', actual: '', subItems: []}]);
      }
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('আয় সংরক্ষণে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => onClose?.() || setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {isLoading && isEditMode ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                <Text style={styles.loadingText}>আয় লোড হচ্ছে...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.modalTitle}>
                  {isEditMode ? 'আয় সম্পাদনা করুন' : 'নতুন আয় যোগ করুন'}
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="আয়ের নাম লিখুন"
                  placeholderTextColor={COLORS.PLACEHOLDER_TEXT}
                  value={name}
                  onChangeText={setName}
                />

                <TouchableOpacity
                  style={styles.datePickerContainer}
                  onPress={() => setOpenStartPicker(true)}>
                  <Text style={styles.dateText}>
                    শুরুর তারিখ: {formatDate(startDate)}
                  </Text>
                </TouchableOpacity>
                <DatePicker
                  modal
                  mode="date"
                  open={openStartPicker}
                  date={startDate || new Date()}
                  onConfirm={date => {
                    setOpenStartPicker(false);
                    setStartDate(date);
                    if (endDate && endDate <= date) {
                      const newEndDate = new Date(date);
                      newEndDate.setDate(date.getDate() + 1);
                      setEndDate(newEndDate);
                    }
                  }}
                  onCancel={() => {
                    setOpenStartPicker(false);
                  }}
                />

                <TouchableOpacity
                  style={styles.datePickerContainer}
                  onPress={() => setOpenEndPicker(true)}>
                  <Text style={styles.dateText}>
                    শেষের তারিখ: {formatDate(endDate)}
                  </Text>
                </TouchableOpacity>
                <DatePicker
                  modal
                  mode="date"
                  open={openEndPicker}
                  date={endDate || new Date()}
                  minimumDate={startDate}
                  onConfirm={handleEndDateConfirm}
                  onCancel={() => {
                    setOpenEndPicker(false);
                  }}
                />

                <View style={styles.addNewButtonContainer}>
                  <Button
                    title="+ বিষয় যোগ করুন"
                    buttonStyle={styles.addNewButton}
                    titleStyle={styles.addNewText}
                    onPress={() => {
                      addIncomeItem();
                      setErrorMessage('');
                    }}
                  />
                </View>

                <View style={styles.tableContainer}>
                  <ScrollView style={{maxHeight: ROW_HEIGHT * 5}}>
                    <Table borderStyle={{borderWidth: 1, borderColor: '#e0e0e0'}}>
                      <Row
                        data={tableHead}
                        widthArr={widthArr}
                        style={styles.slimModalHead}
                        textStyle={styles.slimHeadText}
                      />
                      <Rows
                        data={tableData}
                        widthArr={widthArr}
                        style={styles.slimRow}
                        textStyle={styles.text}
                      />
                      <Row
                        data={tableFooter}
                        widthArr={widthArr}
                        style={styles.footerRow}
                        textStyle={styles.footerText}
                      />
                    </Table>
                  </ScrollView>
                </View>

                {errorMessage ? (
                  <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}

                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => onClose?.() || setModalVisible(false)}>
                    <Text style={styles.buttonText}>বাতিল</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.saveButton,
                      isSaving && styles.saveButtonDisabled,
                    ]}
                    onPress={handleSave}
                    disabled={isSaving}>
                    <View style={styles.buttonContent}>
                      {isSaving && (
                        <ActivityIndicator
                          size="small"
                          color="#fff"
                          style={styles.loadingIndicator}
                        />
                      )}
                      <Text style={styles.buttonText}>
                        {isSaving
                          ? 'সংরক্ষণ হচ্ছে...'
                          : isEditMode
                          ? 'আপডেট'
                          : 'সংরক্ষণ'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={subModalVisible}
        onRequestClose={() => setSubModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>সাব-আইটেম যোগ করুন</Text>

            <View style={styles.addNewButtonContainer}>
              <Button
                title="+ বিষয় যোগ করুন"
                buttonStyle={styles.addNewButton}
                titleStyle={styles.addNewText}
                onPress={addSubIncomeItem}
              />
            </View>

            <View style={styles.tableContainer}>
              <ScrollView style={{maxHeight: ROW_HEIGHT * 5}}>
                <Table borderStyle={{borderWidth: 1, borderColor: '#e0e0e0'}}>
                  <Row
                    data={tableHead}
                    widthArr={widthArr}
                    style={styles.slimModalHead}
                    textStyle={styles.slimHeadText}
                  />
                  <Rows
                    data={subTableData}
                    widthArr={widthArr}
                    style={styles.slimRow}
                    textStyle={styles.text}
                  />
                </Table>
              </ScrollView>
            </View>

            {subErrorMessage ? (
              <Text style={styles.errorText}>{subErrorMessage}</Text>
            ) : null}

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setSubModalVisible(false)}>
                <Text style={styles.buttonText}>বাতিল</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddSubItems}>
                <Text style={styles.buttonText}>যোগ করুন</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fafafa',
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  datePickerContainer: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fafafa',
    marginBottom: 20,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  addNewButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  tableContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  footerRow: {
    height: 30,
    backgroundColor: '#f0f0f0',
  },
  text: {
    margin: 6,
    textAlign: 'center',
    color: 'black',
  },
  footerText: {
    margin: 2,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
    fontSize: 12,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    gap: 5,
  },
  actionButton: {
    padding: 5,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6C757D',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY || '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  saveButtonDisabled: {
    backgroundColor: '#80bdff',
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIndicator: {
    marginRight: 8,
  },
  addNewButton: {
    backgroundColor: COLORS.PRIMARY || '#28A745',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addNewText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  slimModalHead: {
    height: 30,
    backgroundColor: COLORS.PRIMARY,
  },
  slimHeadText: {
    margin: 2,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
  },
  slimRow: {
    height: 40,
  },
  slimInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 2,
    margin: 2,
    borderRadius: 4,
    textAlign: 'center',
    fontSize: 12,
    height: 30,
  },
  errorText: {
    color: '#FF4D4F',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
});