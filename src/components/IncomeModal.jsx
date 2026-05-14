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
import React, {useEffect, useState} from 'react';

import DatePicker from 'react-native-date-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
          subItems: item.sectorDetails
            ? item.sectorDetails.map(subItem => ({
                id: Date.now() + Math.random(),
                name: subItem.name,
                planned: subItem.plannedAmount.toString(),
                actual: subItem.actualAmount.toString(),
              }))
            : [],
        })),
      );
    } catch (error) {
      showToast('আয় লোড করতে ব্যর্থ', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const addSubIncomeItem = () => {
    setSubIncomeItems(prev => [
      ...prev,
      {id: Date.now() + Math.random(), name: '', planned: '', actual: ''},
    ]);
    setSubErrorMessage('');
  };

  const updateSubIncomeItem = (id, field, value) => {
    setSubIncomeItems(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === 'name'
                  ? value
                  : Math.floor(parseFloat(value) || 0).toString(),
            }
          : item,
      ),
    );
  };

  const removeSubIncomeItem = id => {
    setSubIncomeItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddSubItems = () => {
    const hasEmptyFields = subIncomeItems.some(
      item => !item.name.trim() || !item.planned || !item.actual,
    );
    if (subIncomeItems.length === 0 || hasEmptyFields) {
      setSubErrorMessage(
        'সব সাব-আইটেমের জন্য নাম, পরিকল্পিত এবং প্রকৃত পরিমাণ প্রয়োজন',
      );
      return;
    }
    setIncomeItems(prev =>
      prev.map(item =>
        item.id === selectedItemId
          ? {...item, subItems: subIncomeItems}
          : item,
      ),
    );
    setSubModalVisible(false);
    setSubIncomeItems([]);
    setSubErrorMessage('');
  };

  const formatDate = date => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const formatDateDisplay = date => {
    if (!date) return 'তারিখ বেছে নিন';
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
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
    const hasEmptyFields = incomeItems.some(
      item => !item.name.trim() || !item.planned || !item.actual,
    );
    if (incomeItems.length === 0 || hasEmptyFields) {
      setErrorMessage(
        'সব আইটেমের জন্য নাম, পরিকল্পিত এবং প্রকৃত পরিমাণ প্রয়োজন',
      );
      return;
    }
    setIsSaving(true);
    try {
      if (isEditMode && incomePlanId) {
        const payload = {
          id: incomePlanId,
          name,
          planStartDate: formatDate(startDate),
          planEndDate: formatDate(endDate),
          incomePlanDetails: incomeItems.map(item => ({
            incomePlanId,
            sectorName: item.name,
            plannedAmount: item.planned,
            actualAmount: item.actual,
            sectorDetails: (item.subItems || []).map(subItem => ({
              incomePlanId,
              name: subItem.name,
              plannedAmount: subItem.planned,
              actualAmount: subItem.actual,
            })),
          })),
        };
        const response = await api.put(
          `/api/incomePlan/${incomePlanId}`,
          payload,
        );
        if (response.data.success) {
          showToast('আয় সফলভাবে আপডেট করা হয়েছে');
        }
      } else {
        const payload = {
          name,
          planStartDate: formatDate(startDate),
          planEndDate: formatDate(endDate),
          incomePlanDetails: incomeItems.map(item => ({
            sectorName: item.name,
            plannedAmount: item.planned,
            actualAmount: item.actual,
            sectorDetails: (item.subItems || []).map(subItem => ({
              name: subItem.name,
              plannedAmount: subItem.planned,
              actualAmount: subItem.actual,
            })),
          })),
        };
        const response = await api.post('/api/incomePlan', payload);
        if (response.data.success) {
          showToast('আয় যোগ করা হয়েছে');
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
      setErrorMessage(
        'আয় সংরক্ষণে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setModalVisible(false);
    }
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleClose}>
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            {isLoading && isEditMode ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1D2A74" />
                <Text style={styles.loadingText}>আয় লোড হচ্ছে...</Text>
              </View>
            ) : (
              <>
                <View style={styles.sheetHeader}>
                  <Text style={styles.sheetTitle}>
                    {isEditMode ? 'আয় সম্পাদনা করুন' : 'নতুন আয় তৈরি করুন'}
                  </Text>
                  <TouchableOpacity
                    onPress={handleClose}
                    style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#1D2A74" />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.sheetContent}>
                  <View style={styles.field}>
                    <Text style={styles.fieldLabel}>আয়ের নাম লিখুন</Text>
                    <View style={styles.inputBox}>
                      <TextInput
                        placeholder="উদা: জুন মাসের আয়"
                        placeholderTextColor="#8F96B0"
                        value={name}
                        onChangeText={setName}
                        style={styles.textInput}
                      />
                    </View>
                  </View>

                  <View style={styles.field}>
                    <Text style={styles.fieldLabel}>শুরুর তারিখ</Text>
                    <TouchableOpacity
                      style={styles.inputBoxRow}
                      onPress={() => setOpenStartPicker(true)}>
                      <Text
                        style={[
                          styles.textInput,
                          !startDate && styles.placeholderText,
                        ]}>
                        {formatDateDisplay(startDate)}
                      </Text>
                      <Ionicons
                        name="calendar-outline"
                        size={22}
                        color="#1D2A74"
                      />
                    </TouchableOpacity>
                  </View>
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
                    onCancel={() => setOpenStartPicker(false)}
                  />

                  <View style={styles.field}>
                    <Text style={styles.fieldLabel}>শেষের তারিখ</Text>
                    <TouchableOpacity
                      style={styles.inputBoxRow}
                      onPress={() => setOpenEndPicker(true)}>
                      <Text
                        style={[
                          styles.textInput,
                          !endDate && styles.placeholderText,
                        ]}>
                        {formatDateDisplay(endDate)}
                      </Text>
                      <Ionicons
                        name="calendar-outline"
                        size={22}
                        color="#1D2A74"
                      />
                    </TouchableOpacity>
                  </View>
                  <DatePicker
                    modal
                    mode="date"
                    open={openEndPicker}
                    date={endDate || new Date()}
                    minimumDate={startDate}
                    onConfirm={handleEndDateConfirm}
                    onCancel={() => setOpenEndPicker(false)}
                  />

                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>আয়ের বিবরণ</Text>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => {
                        addIncomeItem();
                        setErrorMessage('');
                      }}>
                      <Ionicons name="add" size={18} color="#FFFFFF" />
                      <Text style={styles.addButtonText}>নতুন ঘর</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.tableCard}>
                    <View style={styles.tableHeader}>
                      <Text style={[styles.tableHeaderText, {flex: 2}]}>
                        সোর্স
                      </Text>
                      <Text style={styles.tableHeaderText}>পরিকল্পিত</Text>
                      <Text style={styles.tableHeaderText}>প্রাপ্ত</Text>
                      <View style={{width: 68}} />
                    </View>
                    <ScrollView style={{maxHeight: 240}} nestedScrollEnabled>
                      {incomeItems.map(item => (
                        <View key={item.id} style={styles.tableRow}>
                          <TextInput
                            style={[styles.cellInput, {flex: 2}]}
                            placeholder="নাম"
                            placeholderTextColor="#BBC0D3"
                            value={item.name}
                            onChangeText={text =>
                              updateIncomeItem(item.id, 'name', text)
                            }
                          />
                          <TextInput
                            style={styles.cellInput}
                            placeholder="0"
                            placeholderTextColor="#BBC0D3"
                            keyboardType="numeric"
                            value={item.planned}
                            onChangeText={text =>
                              updateIncomeItem(item.id, 'planned', text)
                            }
                          />
                          <TextInput
                            style={styles.cellInput}
                            placeholder="0"
                            placeholderTextColor="#BBC0D3"
                            keyboardType="numeric"
                            value={item.actual}
                            onChangeText={text =>
                              updateIncomeItem(item.id, 'actual', text)
                            }
                          />
                          <View style={styles.rowActions}>
                            <TouchableOpacity
                              style={styles.rowActionBtn}
                              onPress={() => {
                                setSelectedItemId(item.id);
                                setSubIncomeItems(item.subItems || []);
                                setSubModalVisible(true);
                                setSubErrorMessage('');
                              }}>
                              <Ionicons
                                name="add-circle-outline"
                                size={17}
                                color="#1D2A74"
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.rowActionBtn}
                              onPress={() => removeIncomeItem(item.id)}>
                              <Ionicons
                                name="trash-outline"
                                size={17}
                                color="#E43A3A"
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    </ScrollView>
                    <View style={styles.tableFooter}>
                      <Text style={[styles.footerLabel, {flex: 2}]}>মোট</Text>
                      <Text style={styles.footerValue}>{totalPlanned}</Text>
                      <Text style={styles.footerValue}>{totalActual}</Text>
                      <View style={{width: 68}} />
                    </View>
                  </View>

                  <View style={styles.summaryRow}>
                    <View style={styles.summaryBox}>
                      <Text style={styles.summaryLabel}>মোট পরিকল্পিত</Text>
                      <Text style={styles.summaryAmount}>{totalPlanned} ৳</Text>
                    </View>
                    <View style={[styles.summaryBox, styles.summaryBoxGreen]}>
                      <Text style={[styles.summaryLabel, {color: '#1D2A74'}]}>
                        মোট প্রাপ্ত
                      </Text>
                      <Text
                        style={[styles.summaryAmount, {color: '#0E3E1F'}]}>
                        {totalActual} ৳
                      </Text>
                    </View>
                  </View>

                  {errorMessage ? (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  ) : null}

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
                          style={{marginRight: 8}}
                        />
                      )}
                      <Text style={styles.saveButtonText}>
                        {isSaving
                          ? 'সংরক্ষণ হচ্ছে...'
                          : isEditMode
                          ? 'আপডেট করুন'
                          : 'সংরক্ষণ করুন'}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleClose}>
                    <Text style={styles.cancelText}>বাতিল</Text>
                  </TouchableOpacity>
                </ScrollView>
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
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>সাব-আইটেম যোগ করুন</Text>
              <TouchableOpacity
                onPress={() => setSubModalVisible(false)}
                style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#1D2A74" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.modalAddButton}
              onPress={addSubIncomeItem}>
              <Ionicons name="add" size={18} color="#FFFFFF" />
              <Text style={styles.addButtonText}> বিষয় যোগ করুন</Text>
            </TouchableOpacity>

            <View style={styles.tableCard}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, {flex: 2}]}>সোর্স</Text>
                <Text style={styles.tableHeaderText}>পরিকল্পিত</Text>
                <Text style={styles.tableHeaderText}>প্রাপ্ত</Text>
                <View style={{width: 40}} />
              </View>
              <ScrollView style={{maxHeight: 220}} nestedScrollEnabled>
                {subIncomeItems.map(item => (
                  <View key={item.id} style={styles.tableRow}>
                    <TextInput
                      style={[styles.cellInput, {flex: 2}]}
                      placeholder="নাম"
                      placeholderTextColor="#BBC0D3"
                      value={item.name}
                      onChangeText={text =>
                        updateSubIncomeItem(item.id, 'name', text)
                      }
                    />
                    <TextInput
                      style={styles.cellInput}
                      placeholder="0"
                      placeholderTextColor="#BBC0D3"
                      keyboardType="numeric"
                      value={item.planned}
                      onChangeText={text =>
                        updateSubIncomeItem(item.id, 'planned', text)
                      }
                    />
                    <TextInput
                      style={styles.cellInput}
                      placeholder="0"
                      placeholderTextColor="#BBC0D3"
                      keyboardType="numeric"
                      value={item.actual}
                      onChangeText={text =>
                        updateSubIncomeItem(item.id, 'actual', text)
                      }
                    />
                    <TouchableOpacity
                      style={[styles.rowActionBtn, {width: 40}]}
                      onPress={() => removeSubIncomeItem(item.id)}>
                      <Ionicons
                        name="trash-outline"
                        size={17}
                        color="#E43A3A"
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>

            {subErrorMessage ? (
              <Text style={styles.errorText}>{subErrorMessage}</Text>
            ) : null}

            <View style={styles.infoBox}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color="#1D2A74"
              />
              <Text style={styles.infoText}>
                নতুন সোর্স যোগ করতে প্লাস বাটনে চাপুন। তারপরে তথ্য পূরণ করে
                "যোগ করুন" বাটনে প্রেস করুন।
              </Text>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setSubModalVisible(false)}>
                <Text style={styles.modalCancelText}>বাতিল</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleAddSubItems}>
                <Text style={styles.modalConfirmText}>যোগ করুন</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    maxHeight: '92%',
  },
  loadingContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6F759B',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1D2A74',
  },
  closeButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetContent: {
    paddingBottom: 12,
  },
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D2A74',
    marginBottom: 8,
  },
  inputBox: {
    backgroundColor: '#F0F1FA',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0F1FA',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#1D2A74',
  },
  placeholderText: {
    color: '#8F96B0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1D2A74',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1D2A74',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 6,
    fontSize: 13,
  },
  modalAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C6D2F',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  tableCard: {
    backgroundColor: '#F8F9FF',
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF0FF',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  tableHeaderText: {
    flex: 1,
    color: '#6D7396',
    fontWeight: '700',
    fontSize: 12,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0FF',
    gap: 6,
  },
  cellInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 13,
    color: '#1D2A74',
  },
  rowActions: {
    width: 68,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 4,
  },
  rowActionBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#F0F1FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF0FF',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  footerLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1D2A74',
  },
  footerValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#1D2A74',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#F0F1FA',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },
  summaryBoxGreen: {
    backgroundColor: '#E5F8E8',
  },
  summaryLabel: {
    color: '#6F759B',
    fontSize: 13,
    marginBottom: 6,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1D2A74',
  },
  errorText: {
    color: '#E43A3A',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#1D2A74',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonDisabled: {
    backgroundColor: '#8A92B8',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelText: {
    color: '#1D2A74',
    fontSize: 15,
    fontWeight: '700',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#F3F5FF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 18,
  },
  infoText: {
    color: '#4B5478',
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F5F7FF',
  },
  modalCancelText: {
    color: '#1D2A74',
    fontSize: 15,
    fontWeight: '700',
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#1D2A74',
  },
  modalConfirmText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
