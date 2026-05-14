import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import DatePicker from 'react-native-date-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import api from '../../api';
import styles from '../../styles/BudgetModal.styles';

export default function BudgetModal({
  modalVisible,
  setModalVisible,
  budgetName,
  setBudgetName,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  budgetItems,
  setBudgetItems,
  addBudgetItem,
  updateBudgetItem,
  removeBudgetItem,
  isEditMode = false,
  budgetId,
  fetchBudgets,
  onClose,
}) {
  const [openStartPicker, setOpenStartPicker] = useState(false);
  const [openEndPicker, setOpenEndPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [subModalVisible, setSubModalVisible] = useState(false);
  const [subBudgetItems, setSubBudgetItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [subErrorMessage, setSubErrorMessage] = useState('');

  const totalPlanned = budgetItems
    .reduce((sum, item) => sum + (parseFloat(item.planned) || 0), 0)
    .toFixed(0);

  const totalActual = budgetItems
    .reduce((sum, item) => sum + (parseFloat(item.actual) || 0), 0)
    .toFixed(0);

  const showToast = (message, type = 'success') => {
    Toast.show({type, text1: message, position: 'bottom'});
  };

  useEffect(() => {
    if (isEditMode && budgetId && modalVisible) {
      fetchBudgetData();
    }
  }, [isEditMode, budgetId, modalVisible]);

  const fetchBudgetData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/budget/${budgetId}`);
      const budget = response.data.data;
      setBudgetName(budget.budgetName);
      const parseDate = dateStr => {
        const [day, month, year] = dateStr.split('/').map(Number);
        return new Date(year, month - 1, day);
      };
      setStartDate(parseDate(budget.planStartDate));
      setEndDate(parseDate(budget.planEndDate));
      setBudgetItems(
        budget.budgetDetails.map(item => ({
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
      showToast('বাজেট লোড করতে ব্যর্থ', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const addSubBudgetItem = () => {
    setSubBudgetItems(prev => [
      ...prev,
      {id: Date.now() + Math.random(), name: '', planned: '', actual: ''},
    ]);
    setSubErrorMessage('');
  };

  const updateSubBudgetItem = (id, field, value) => {
    setSubBudgetItems(prev =>
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

  const removeSubBudgetItem = id => {
    setSubBudgetItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddSubItems = () => {
    const hasEmptyFields = subBudgetItems.some(
      item => !item.name.trim() || !item.planned || !item.actual,
    );
    if (subBudgetItems.length === 0 || hasEmptyFields) {
      setSubErrorMessage(
        'সব সাব-আইটেমের জন্য নাম, পরিকল্পিত এবং প্রকৃত পরিমাণ প্রয়োজন',
      );
      return;
    }
    setBudgetItems(prev =>
      prev.map(item =>
        item.id === selectedItemId
          ? {...item, subItems: subBudgetItems}
          : item,
      ),
    );
    setSubModalVisible(false);
    setSubBudgetItems([]);
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
    const hasEmptyFields = budgetItems.some(
      item => !item.name.trim() || !item.planned || !item.actual,
    );
    if (budgetItems.length === 0 || hasEmptyFields) {
      setErrorMessage(
        'সব আইটেমের জন্য নাম, পরিকল্পিত এবং প্রকৃত পরিমাণ প্রয়োজন',
      );
      return;
    }
    setIsSaving(true);
    try {
      if (isEditMode && budgetId) {
        const payload = {
          id: budgetId,
          budgetName,
          planStartDate: formatDate(startDate),
          planEndDate: formatDate(endDate),
          budgetDetails: budgetItems.map(item => ({
            budgetId,
            sectorName: item.name,
            plannedAmount: item.planned,
            actualAmount: item.actual,
            sectorDetails: (item.subItems || []).map(subItem => ({
              budgetId,
              name: subItem.name,
              plannedAmount: subItem.planned,
              actualAmount: subItem.actual,
            })),
          })),
        };
        const response = await api.put(`/api/budget/${budgetId}`, payload);
        if (response.data.success) {
          showToast('বাজেট সফলভাবে আপডেট করা হয়েছে');
        }
      } else {
        const payload = {
          budgetName,
          planStartDate: formatDate(startDate),
          planEndDate: formatDate(endDate),
          budgetDetails: budgetItems.map(item => ({
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
        const response = await api.post('/api/budget', payload);
        if (response.data.success) {
          showToast('বাজেট যোগ করা হয়েছে');
        }
      }
      setModalVisible(false);
      fetchBudgets();
      if (!isEditMode) {
        setBudgetName('');
        setStartDate(null);
        setEndDate(null);
        setBudgetItems([{id: 1, name: '', planned: '', actual: '', subItems: []}]);
      }
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(
        'বাজেট সংরক্ষণে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।',
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
                <Text style={styles.loadingText}>বাজেট লোড হচ্ছে...</Text>
              </View>
            ) : (
              <>
                <View style={styles.sheetHeader}>
                  <Text style={styles.sheetTitle}>
                    {isEditMode
                      ? 'বাজেট সম্পাদনা করুন'
                      : 'নতুন বাজেট তৈরি করুন'}
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
                    <Text style={styles.fieldLabel}>বাজেটের নাম লিখুন</Text>
                    <View style={styles.inputBox}>
                      <TextInput
                        placeholder="উদা: জুন মাসের বাজেট"
                        placeholderTextColor="#8F96B0"
                        value={budgetName}
                        onChangeText={setBudgetName}
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
                    <Text style={styles.sectionTitle}>ব্যয়ের বিবরণ</Text>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => {
                        addBudgetItem();
                        setErrorMessage('');
                      }}>
                      <Ionicons name="add" size={18} color="#FFFFFF" />
                      <Text style={styles.addButtonText}>নতুন ঘর</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.tableCard}>
                    <View style={styles.tableHeader}>
                      <Text style={[styles.tableHeaderText, {flex: 2}]}>
                        বিষয়ের নাম
                      </Text>
                      <Text style={styles.tableHeaderText}>পরিকল্পিত</Text>
                      <Text style={styles.tableHeaderText}>প্রকৃত</Text>
                      <View style={{width: 68}} />
                    </View>
                    <ScrollView style={{maxHeight: 240}} nestedScrollEnabled>
                      {budgetItems.map(item => (
                        <View key={item.id} style={styles.tableRow}>
                          <TextInput
                            style={[styles.cellInput, {flex: 2}]}
                            placeholder="নাম"
                            placeholderTextColor="#BBC0D3"
                            value={item.name}
                            onChangeText={text =>
                              updateBudgetItem(item.id, 'name', text)
                            }
                          />
                          <TextInput
                            style={styles.cellInput}
                            placeholder="0"
                            placeholderTextColor="#BBC0D3"
                            keyboardType="numeric"
                            value={item.planned}
                            onChangeText={text =>
                              updateBudgetItem(item.id, 'planned', text)
                            }
                          />
                          <TextInput
                            style={styles.cellInput}
                            placeholder="0"
                            placeholderTextColor="#BBC0D3"
                            keyboardType="numeric"
                            value={item.actual}
                            onChangeText={text =>
                              updateBudgetItem(item.id, 'actual', text)
                            }
                          />
                          <View style={styles.rowActions}>
                            <TouchableOpacity
                              style={styles.rowActionBtn}
                              onPress={() => {
                                setSelectedItemId(item.id);
                                setSubBudgetItems(item.subItems || []);
                                setSubModalVisible(true);
                                setSubErrorMessage('');
                              }}>
                              <Ionicons
                                name="add-circle-outline"
                                size={17}
                                color="#1E592D"
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.rowActionBtn}
                              onPress={() => removeBudgetItem(item.id)}>
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
                        মোট প্রকৃত
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
              onPress={addSubBudgetItem}>
              <Ionicons name="add" size={18} color="#FFFFFF" />
              <Text style={styles.addButtonText}> বিষয় যোগ করুন</Text>
            </TouchableOpacity>

            <View style={styles.tableCard}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, {flex: 2}]}>
                  বিষয়ের নাম
                </Text>
                <Text style={styles.tableHeaderText}>পরিকল্পিত</Text>
                <Text style={styles.tableHeaderText}>প্রকৃত</Text>
                <View style={{width: 40}} />
              </View>
              <ScrollView style={{maxHeight: 220}} nestedScrollEnabled>
                {subBudgetItems.map(item => (
                  <View key={item.id} style={styles.tableRow}>
                    <TextInput
                      style={[styles.cellInput, {flex: 2}]}
                      placeholder="নাম"
                      placeholderTextColor="#BBC0D3"
                      value={item.name}
                      onChangeText={text =>
                        updateSubBudgetItem(item.id, 'name', text)
                      }
                    />
                    <TextInput
                      style={styles.cellInput}
                      placeholder="0"
                      placeholderTextColor="#BBC0D3"
                      keyboardType="numeric"
                      value={item.planned}
                      onChangeText={text =>
                        updateSubBudgetItem(item.id, 'planned', text)
                      }
                    />
                    <TextInput
                      style={styles.cellInput}
                      placeholder="0"
                      placeholderTextColor="#BBC0D3"
                      keyboardType="numeric"
                      value={item.actual}
                      onChangeText={text =>
                        updateSubBudgetItem(item.id, 'actual', text)
                      }
                    />
                    <TouchableOpacity
                      style={[styles.rowActionBtn, {width: 40}]}
                      onPress={() => removeSubBudgetItem(item.id)}>
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
                নতুন বিষয় যোগ করতে সবুজ বাটনে ক্লিক করুন। সব তথ্য ইনপুট
                দেওয়ার পর "যোগ করুন" বাটনে প্রেস করুন।
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
