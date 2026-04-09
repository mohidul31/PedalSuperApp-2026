import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Button, FAB} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {Row, Rows, Table} from 'react-native-table-component';

import {COLORS} from '../../../styles/colors';
import DeleteModal from '../../../components/DeleteModal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NoDataFound from '../../../components/NoDataFound';
import {Picker} from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import api from '../../../api';

export default function SellScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [newSellerModalVisible, setNewSellerModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [sellerDeleteModalVisible, setSellerDeleteModalVisible] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [selectedSaleDetails, setSelectedSaleDetails] = useState(null);
  const [deletingSellerId, setDeletingSellerId] = useState(null);
  const [selectedSaleItemId, setSelectedSaleItemId] = useState(null);
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const [isFetchingSellers, setIsFetchingSellers] = useState(false);
  const [isCreatingSeller, setIsCreatingSeller] = useState(false);
  const [isUpdatingSeller, setIsUpdatingSeller] = useState(false);
  const [saleItems, setSaleItems] = useState([]);
  const [seller, setSeller] = useState('');
  const [newSellerName, setNewSellerName] = useState('');
  const [newSellerError, setNewSellerError] = useState('');
  const [editingSellerId, setEditingSellerId] = useState(null);
  const [editingSellerName, setEditingSellerName] = useState('');
  const [editingSellerError, setEditingSellerError] = useState('');
  const [buyer, setBuyer] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [isDue, setIsDue] = useState(false);
  const [dueAmount, setDueAmount] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [sellerError, setSellerError] = useState('');
  const [quantityError, setQuantityError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const [productSearchQuery, setProductSearchQuery] = useState('');

  const tableHead = ['ক্রেতা', 'পেইড এমাউন্ট', 'তারিখ', 'অ্যাকশন'];
  const modalTableHead = ['পণ্য', 'পরিমাণ', 'মুছুন'];
  const sellerTableHead = ['নাম', 'অ্যাকশন'];

  const showToast = (message, type = 'success') => {
    Toast.show({type, text1: message, position: 'bottom'});
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/sell');
      const fetchedSales = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setSales(fetchedSales);
    } catch (error) {
      setSales([]);
      showToast('বিক্রয় লোড করতে ব্যর্থ', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductsForSell = async () => {
    setIsFetchingProducts(true);
    try {
      const response = await api.get('/api/Product/GetProductListForSell');
      const fetchedProducts = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setProducts(fetchedProducts);
      setSaleItems([{id: Date.now(), productId: '', quantity: ''}]);
    } catch (error) {
      setProducts([]);
      showToast('পণ্য তালিকা লোড করতে ব্যর্থ', 'error');
    } finally {
      setIsFetchingProducts(false);
    }
  };

  const fetchSellers = async () => {
    setIsFetchingSellers(true);
    try {
      const response = await api.get('/api/seller');
      const fetchedSellers = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setSellers(fetchedSellers);
      if (fetchedSellers.length > 0 && !seller) {
        setSeller(fetchedSellers[0].id);
      }
    } catch (error) {
      setSellers([]);
      showToast('বিক্রেতা তালিকা লোড করতে ব্যর্থ', 'error');
    } finally {
      setIsFetchingSellers(false);
    }
  };

  const createSeller = async () => {
    if (!newSellerName.trim()) {
      setNewSellerError('বিক্রেতার নাম প্রয়োজন');
      return;
    }

    setIsCreatingSeller(true);
    try {
      const response = await api.post('/api/seller', {sellerName: newSellerName});
      if (response.data.success) {
        showToast('বিক্রেতা সফলভাবে যোগ করা হয়েছে', 'success');
        await fetchSellers();
        setNewSellerModalVisible(false);
        setNewSellerName('');
        setNewSellerError('');
        if (response.data.data?.id) {
          setSeller(response.data.data.id);
        }
      } else {
        showToast('বিক্রেতা যোগ করতে ব্যর্থ', 'error');
      }
    } catch (error) {
      showToast('বিক্রেতা যোগ করতে ব্যর্থ', 'error');
    } finally {
      setIsCreatingSeller(false);
    }
  };

  const updateSeller = async sellerId => {
    if (!editingSellerName.trim()) {
      setEditingSellerError('বিক্রেতার নাম প্রয়োজন');
      return;
    }

    setIsUpdatingSeller(true);
    try {
      const response = await api.put(`/api/seller/${sellerId}`, {
        id: sellerId,
        sellerName: editingSellerName,
      });
      if (response.data.success) {
        showToast('বিক্রেতা সফলভাবে আপডেট করা হয়েছে', 'success');
        await fetchSellers();
        setEditingSellerId(null);
        setEditingSellerName('');
        setEditingSellerError('');
      } else {
        showToast('বিক্রেতা আপডেট করতে ব্যর্থ', 'error');
      }
    } catch (error) {
      showToast('বিক্রেতা আপডেট করতে ব্যর্থ', 'error');
    } finally {
      setIsUpdatingSeller(false);
    }
  };

  const deleteSeller = async () => {
    if (!deletingSellerId) return;

    try {
      await api.delete(`/api/seller/${deletingSellerId}`);
      showToast('বিক্রেতা সফলভাবে মুছে ফেলা হয়েছে', 'success');
      await fetchSellers();
      if (seller === deletingSellerId && sellers.length > 1) {
        setSeller(sellers.find(s => s.id !== deletingSellerId).id);
      } else if (sellers.length <= 1) {
        setSeller('');
      }
    } catch (error) {
      showToast('বিক্রেতা মুছতে ব্যর্থ', 'error');
    } finally {
      setSellerDeleteModalVisible(false);
      setDeletingSellerId(null);
    }
  };

  const fetchSaleDetails = async saleId => {
    try {
      setIsViewLoading(true);
      const response = await api.get(`/api/sell/${saleId}`);
      setSelectedSaleDetails(response.data.data);
      setViewModalVisible(true);
    } catch (error) {
      showToast('বিক্রয় বিবরণ লোড করতে ব্যর্থ', 'error');
    } finally {
      setIsViewLoading(false);
    }
  };

  const handleReload = async () => {
    await fetchSales();
  };

  const handleAddSale = async () => {
    setModalVisible(true);
    setSeller('');
    setBuyer('');
    setBuyerPhone('');
    setIsDue(false);
    setDueAmount('');
    setDiscountAmount('');
    setSellerError('');
    setQuantityError('');
    await Promise.all([fetchProductsForSell(), fetchSellers()]);
  };

  const handleDelete = index => {
    const saleId = sales[index].id;
    setSelectedSaleId(saleId);
    setDeleteModalVisible(true);
    setSelectedSaleItemId(null);
  };

  const confirmDelete = async () => {
    if (!selectedSaleId) return;

    try {
      await api.delete(`/api/sell/${selectedSaleId}`);
      setSales(sales.filter(sale => sale.id !== selectedSaleId));
      showToast('বিক্রয় সফলভাবে মুছে ফেলা হয়েছে', 'success');
    } catch (error) {
      showToast('বিক্রয় মুছতে ব্যর্থ', 'error');
    } finally {
      setDeleteModalVisible(false);
      setSelectedSaleId(null);
    }
  };

  const tableData = sales.map((item, index) => [
    item.customerName || '-',
    item.paid || 0,
    item.createdTime ? item.createdTime : '-',
    <View style={styles.actionCell}>
      <Pressable onPress={() => fetchSaleDetails(item.id)}>
        <Ionicons
          name="eye-outline"
          size={20}
          color={COLORS.PRIMARY}
          style={styles.actionIcon}
        />
      </Pressable>
      <Pressable onPress={() => handleDelete(index)}>
        <Ionicons
          name="trash-outline"
          size={20}
          color="red"
          style={styles.actionIcon}
        />
      </Pressable>
    </View>,
  ]);

  const sellerTableData = sellers.map(seller => [
    editingSellerId === seller.id ? (
      <View style={styles.editContainer}>
        <TextInput
          style={styles.slimInput}
          value={editingSellerName}
          onChangeText={text => {
            setEditingSellerName(text);
            setEditingSellerError('');
          }}
          autoFocus
        />
        <Pressable
          style={styles.actionButton}
          onPress={() => updateSeller(seller.id)}
          disabled={isUpdatingSeller}>
          <Ionicons
            name="checkmark"
            size={20}
            color={isUpdatingSeller ? 'gray' : COLORS.PRIMARY}
          />
        </Pressable>
        <Pressable
          style={styles.actionButton}
          onPress={() => {
            setEditingSellerId(null);
            setEditingSellerName('');
            setEditingSellerError('');
          }}
          disabled={isUpdatingSeller}>
          <Ionicons
            name="close"
            size={20}
            color={isUpdatingSeller ? 'gray' : 'red'}
          />
        </Pressable>
      </View>
    ) : (
      seller.sellerName
    ),
    <View style={styles.actionCell}>
      <Pressable
        onPress={() => {
          setEditingSellerId(seller.id);
          setEditingSellerName(seller.sellerName);
          setEditingSellerError('');
        }}
        disabled={editingSellerId !== null}>
        <Ionicons
          name="pencil-outline"
          size={20}
          color={editingSellerId !== null ? 'gray' : COLORS.PRIMARY}
          style={styles.actionIcon}
        />
      </Pressable>
      <Pressable
        onPress={() => {
          setDeletingSellerId(seller.id);
          setSellerDeleteModalVisible(true);
        }}
        disabled={editingSellerId !== null}>
        <Ionicons
          name="trash-outline"
          size={20}
          color={editingSellerId !== null ? 'gray' : 'red'}
          style={styles.actionIcon}
        />
      </Pressable>
    </View>,
  ]);

  const addSaleItem = () => {
    setSaleItems([
      ...saleItems,
      {id: Date.now(), productId: '', quantity: ''},
    ]);
  };

  const removeSaleItem = id => {
    setSaleItems(saleItems.filter(item => item.id !== id));
  };

  const updateSaleItem = (id, key, value) => {
    setSaleItems(
      saleItems.map(item => (item.id === id ? {...item, [key]: value} : item)),
    );
    setQuantityError('');
  };

  const calculateSellingAmount = () => {
    return saleItems
      .reduce((total, item) => {
        const product = products.find(p => p.id === item.productId);
        const sellingRate = product?.sellingRate || 0;
        const quantity = parseFloat(item.quantity) || 0;
        return total + sellingRate * quantity;
      }, 0)
      .toFixed(2);
  };

  const handleSubmit = async () => {
    let hasError = false;

    const invalidItems = saleItems.some(
      item =>
        !item.productId || !item.quantity || parseFloat(item.quantity) <= 0,
    );
    if (invalidItems) {
      setQuantityError('অন্তত একটি পণ্যের জন্য বৈধ পরিমাণ প্রয়োজন');
      hasError = true;
    } else {
      setQuantityError('');
    }

    if (!seller) {
      setSellerError('বিক্রেতা নির্বাচন করুন');
      hasError = true;
    } else {
      setSellerError('');
    }

    if (isDue && (!dueAmount || parseFloat(dueAmount) <= 0)) {
      showToast('বাকির পরিমাণ বৈধ হতে হবে', 'error');
      return;
    }

    if (hasError) return;

    setIsSubmitting(true);
    try {
      const sellAmount = parseFloat(calculateSellingAmount()) || 0;
      const discount = parseFloat(discountAmount) || 0;
      const paid = sellAmount - discount;
      const due = isDue ? parseFloat(dueAmount) || 0 : 0;
      const payload = {
        sellerId: seller,
        customerName: buyer,
        customerPhone: buyerPhone,
        sellAmount: sellAmount,
        paid: paid,
        pendingAmount: due,
        discount: discount,
        sellDetails: saleItems.map(item => {
          const sellingRate =
            products.find(p => p.id === item.productId)?.sellingRate || 0;
          const quantity = parseFloat(item.quantity) || 0;
          return {
            productId: item.productId,
            quantity: quantity,
            unitPrice: sellingRate,
            total: quantity * sellingRate,
          };
        }),
      };

      const response = await api.post('/api/sell', payload);
      if (response.data.success) {
        showToast('বিক্রয় যোগ করা হয়েছে');
      } else {
        showToast('Something went wrong', 'error');
      }
      const newSales = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setSales(prevSales => [...prevSales, ...newSales]);

      await handleReload();
      setModalVisible(false);
      setSaleItems([]);
      setDiscountAmount('');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalTableData = saleItems.map(item => {
    const selectedProduct = products.find(p => p.id === item.productId);
    return [
      <Pressable
        style={styles.productPickerContainer}
        onPress={() => {
          setSelectedSaleItemId(item.id);
          setProductModalVisible(true);
          setProductSearchQuery('');
        }}
        disabled={isSubmitting}>
        <Text style={styles.productPickerText}>
          {selectedProduct
            ? `${selectedProduct.name}-${selectedProduct.stockQty}-${selectedProduct.sellingRate}`
            : 'পণ্য নির্বাচন করুন'}
        </Text>
        <Ionicons name="chevron-down" size={16} color={COLORS.PRIMARY} />
      </Pressable>,
      <TextInput
        style={styles.slimInput}
        placeholder="পরিমাণ"
        placeholderTextColor={COLORS.PLACEHOLDER_TEXT}
        value={item.quantity}
        onChangeText={text => updateSaleItem(item.id, 'quantity', text)}
        keyboardType="numeric"
      />,
      <View style={styles.trashCell}>
        {saleItems.length > 1 && (
          <Pressable onPress={() => removeSaleItem(item.id)}>
            <Ionicons name="trash-outline" size={16} color="red" />
          </Pressable>
        )}
      </View>,
    ];
  });

  return (
    <View style={{flex: 1, padding: 10}}>
      <View style={styles.headerContainer}>
        <Text style={styles.totalCount}>মোট বিক্রয়: {sales.length}</Text>
        <Pressable
          style={styles.reloadButton}
          onPress={handleReload}
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

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>বিক্রয় লোড হচ্ছে...</Text>
        </View>
      ) : sales.length === 0 ? (
        <NoDataFound title="বিক্রয়" />
      ) : (
        <Table borderStyle={{borderWidth: 1, borderColor: '#ccc'}}>
          <Row
            data={tableHead}
            style={styles.head}
            textStyle={styles.headText}
          />
          <Rows data={tableData} textStyle={styles.text} />
        </Table>
      )}

      <FAB
        visible={true}
        title="বিক্রয় যোগ করুন"
        icon={{name: 'add', color: 'white'}}
        color={COLORS.PRIMARY}
        placement="right"
        style={{marginBottom: 50}}
        onPress={handleAddSale}
        disabled={isFetchingProducts || isSubmitting}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          if (!isFetchingProducts && !isSubmitting) setModalVisible(false);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeaderContainer}>
              <Text style={styles.modalTitle}>নতুন বিক্রয় যোগ করুন</Text>
            </View>

            {isFetchingProducts || isFetchingSellers ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                <Text style={styles.loadingText}>
                  পণ্য এবং বিক্রেতা লোড হচ্ছে...
                </Text>
              </View>
            ) : products.length === 0 ? (
              <>
                <Text style={[styles.noDataText, {color: 'red'}]}>
                  কোনো পণ্য যোগ করা নেই, স্টক ম্যানেজার থেকে প্রথমে পণ্য যোগ
                  করুন।
                </Text>
                <View style={styles.buttonContainer}>
                  <Pressable
                    style={[styles.button, {backgroundColor: 'gray'}]}
                    onPress={() => setModalVisible(false)}
                    disabled={isSubmitting}>
                    <Text style={styles.buttonText}>বাতিল</Text>
                  </Pressable>
                </View>
              </>
            ) : sellers.length === 0 ? (
              <>
                <Text style={[styles.noDataText, {color: 'red'}]}>
                  কোনো বিক্রেতা পাওয়া যায়নি, প্রথমে বিক্রেতা যোগ করুন।
                </Text>
                <View style={styles.buttonContainer}>
                  <Pressable
                    style={[styles.button, {backgroundColor: 'gray'}]}
                    onPress={() => setModalVisible(false)}
                    disabled={isSubmitting}>
                    <Text style={styles.buttonText}>বাতিল</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <View style={styles.addNewButtonContainer}>
                  <Button
                    title="+ বিক্রয় করা পণ্য যোগ করুন "
                    buttonStyle={styles.addNewButton}
                    titleStyle={styles.addNewText}
                    onPress={addSaleItem}
                    disabled={isSubmitting}
                  />
                </View>
                <Table borderStyle={{borderWidth: 1, borderColor: '#ccc'}}>
                  <Row
                    data={modalTableHead}
                    style={styles.slimModalHead}
                    textStyle={styles.slimHeadText}
                    widthArr={['50%', '35%', '15%']}
                  />
                  <Rows
                    data={modalTableData}
                    style={styles.slimRow}
                    widthArr={['50%', '35%', '15%']}
                  />
                </Table>
                {quantityError ? (
                  <Text style={styles.errorText}>{quantityError}</Text>
                ) : null}

                <View style={styles.inputContainer}>
                  <View style={styles.sellerPickerContainer}>
                    <View style={[styles.slimPickerContainer, {flex: 1}]}>
                      <Picker
                        selectedValue={seller}
                        style={styles.slimUnitPicker}
                        onValueChange={value => {
                          setSeller(value);
                          setSellerError('');
                        }}
                        enabled={!isSubmitting}
                        mode="dropdown"
                        accessibilityLabel="বিক্রেতা নির্বাচন করুন">
                        {sellers.map(seller => (
                          <Picker.Item
                            key={seller.id}
                            label={seller.sellerName}
                            value={seller.id}
                          />
                        ))}
                      </Picker>
                    </View>
                    <Pressable
                      style={styles.addSellerButton}
                      onPress={() => {
                        setNewSellerModalVisible(true);
                        setActiveTab('create');
                        fetchSellers();
                      }}
                      disabled={isSubmitting}>
                      <Ionicons name="add" size={24} color={COLORS.PRIMARY} />
                    </Pressable>
                  </View>
                  {sellerError ? (
                    <Text style={styles.errorText}>{sellerError}</Text>
                  ) : null}
                  <TextInput
                    style={styles.input}
                    placeholder="ক্রেতা"
                    placeholderTextColor={COLORS.PLACEHOLDER_TEXT}
                    value={buyer}
                    onChangeText={setBuyer}
                    editable={!isSubmitting}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="ক্রেতা ফোন"
                    placeholderTextColor={COLORS.PLACEHOLDER_TEXT}
                    value={buyerPhone}
                    onChangeText={setBuyerPhone}
                    keyboardType="phone-pad"
                    editable={!isSubmitting}
                  />
                  <View style={styles.checkboxContainer}>
                    <Pressable
                      onPress={() => setIsDue(!isDue)}
                      style={styles.checkbox}
                      disabled={isSubmitting}>
                      <Ionicons
                        name={isDue ? 'checkbox' : 'checkbox-outline'}
                        size={20}
                        color={COLORS.PRIMARY}
                      />
                      <Text style={styles.checkboxLabel}>বাকি</Text>
                    </Pressable>
                    {isDue && (
                      <TextInput
                        style={[styles.input, {width: '100%'}]}
                        placeholder="বাকির পরিমাণ"
                        placeholderTextColor={COLORS.PLACEHOLDER_TEXT}
                        value={dueAmount}
                        onChangeText={setDueAmount}
                        keyboardType="numeric"
                        editable={!isSubmitting}
                      />
                    )}
                  </View>
                  <TextInput
                    style={[styles.input, styles.readonlyInput]}
                    placeholder="বিক্রয় মূল্য"
                    placeholderTextColor={COLORS.PLACEHOLDER_TEXT}
                    value={calculateSellingAmount()}
                    editable={false}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="ডিসকাউন্ট পরিমাণ"
                    placeholderTextColor={COLORS.PLACEHOLDER_TEXT}
                    value={discountAmount}
                    onChangeText={setDiscountAmount}
                    keyboardType="numeric"
                    editable={!isSubmitting}
                  />
                </View>

                <View style={styles.buttonContainer}>
                  <Pressable
                    style={[styles.button, {backgroundColor: 'gray'}]}
                    onPress={() => setModalVisible(false)}
                    disabled={isSubmitting}>
                    <Text style={styles.buttonText}>বাতিল</Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.button,
                      {backgroundColor: COLORS.PRIMARY},
                      isSubmitting && styles.disabledButton,
                    ]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}>
                    {isSubmitting ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text style={styles.buttonText}>সংরক্ষণ করুন</Text>
                    )}
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={newSellerModalVisible}
        onRequestClose={() => {
          if (!isCreatingSeller && !isUpdatingSeller) {
            setNewSellerModalVisible(false);
            setActiveTab('create');
            setNewSellerName('');
            setNewSellerError('');
            setEditingSellerId(null);
            setEditingSellerName('');
            setEditingSellerError('');
          }
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeaderContainer}>
              <Text style={styles.modalTitle}>
                {activeTab === 'create'
                  ? 'নতুন বিক্রেতা যোগ করুন'
                  : 'বিক্রেতা তালিকা'}
              </Text>
            </View>
            <View style={styles.tabContainer}>
              <Pressable
                style={[
                  styles.tabButton,
                  activeTab === 'create' && styles.activeTab,
                ]}
                onPress={() => {
                  setActiveTab('create');
                  setEditingSellerId(null);
                  setEditingSellerName('');
                  setEditingSellerError('');
                }}>
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'create' && styles.activeTabText,
                  ]}>
                  নতুন বিক্রেতা
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.tabButton,
                  activeTab === 'list' && styles.activeTab,
                ]}
                onPress={() => {
                  setActiveTab('list');
                  fetchSellers();
                }}>
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'list' && styles.activeTabText,
                  ]}>
                  বিক্রেতা তালিকা
                </Text>
              </Pressable>
            </View>

            {activeTab === 'create' ? (
              <>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="বিক্রেতার নাম"
                    placeholderTextColor={COLORS.PLACEHOLDER_TEXT}
                    value={newSellerName}
                    onChangeText={text => {
                      setNewSellerName(text);
                      setNewSellerError('');
                    }}
                    editable={!isCreatingSeller}
                  />
                  {newSellerError ? (
                    <Text style={styles.errorText}>{newSellerError}</Text>
                  ) : null}
                </View>
                <View style={styles.buttonContainer}>
                  <Pressable
                    style={[styles.button, {backgroundColor: 'gray'}]}
                    onPress={() => {
                      setNewSellerModalVisible(false);
                      setNewSellerName('');
                      setNewSellerError('');
                    }}
                    disabled={isCreatingSeller}>
                    <Text style={styles.buttonText}>বাতিল</Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.button,
                      {backgroundColor: COLORS.PRIMARY},
                      isCreatingSeller && styles.disabledButton,
                    ]}
                    onPress={createSeller}
                    disabled={isCreatingSeller}>
                    {isCreatingSeller ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text style={styles.buttonText}>সংরক্ষণ করুন</Text>
                    )}
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                {isFetchingSellers ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                    <Text style={styles.loadingText}>
                      বিক্রেতা তালিকা লোড হচ্ছে...
                    </Text>
                  </View>
                ) : sellers.length === 0 ? (
                  <Text style={[styles.noDataText, {color: 'red'}]}>
                    কোনো বিক্রেতা পাওয়া যায়নি
                  </Text>
                ) : (
                  <>
                    <Table borderStyle={{borderWidth: 1, borderColor: '#ccc'}}>
                      <Row
                        data={sellerTableHead}
                        style={styles.head}
                        textStyle={styles.headText}
                        widthArr={['70%', '30%']}
                      />
                      <Rows
                        data={sellerTableData}
                        textStyle={styles.text}
                        widthArr={['70%', '30%']}
                      />
                    </Table>
                    {editingSellerError ? (
                      <Text style={styles.errorText}>{editingSellerError}</Text>
                    ) : null}
                  </>
                )}
                <View style={styles.buttonContainer}>
                  <Pressable
                    style={[styles.button, {backgroundColor: 'gray'}]}
                    onPress={() => {
                      setNewSellerModalVisible(false);
                      setActiveTab('create');
                      setEditingSellerId(null);
                      setEditingSellerName('');
                      setEditingSellerError('');
                    }}
                    disabled={isFetchingSellers || isUpdatingSeller}>
                    <Text style={styles.buttonText}>বন্ধ করুন</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={productModalVisible}
        onRequestClose={() => {
          if (!isSubmitting) {
            setProductModalVisible(false);
            setProductSearchQuery('');
            setSelectedSaleItemId(null);
          }
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeaderContainer}>
              <Text style={styles.modalTitle}>পণ্য নির্বাচন করুন</Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="পণ্য অনুসন্ধান করুন"
                placeholderTextColor={COLORS.PLACEHOLDER_TEXT}
                value={productSearchQuery}
                onChangeText={text => setProductSearchQuery(text)}
              />
            </View>

            {isFetchingProducts ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                <Text style={styles.loadingText}>পণ্য লোড হচ্ছে...</Text>
              </View>
            ) : products.length === 0 ? (
              <Text style={[styles.noDataText, {color: 'red'}]}>
                কোনো পণ্য পাওয়া যায়নি
              </Text>
            ) : (
              <ScrollView style={styles.productList}>
                {products
                  .filter(product =>
                    product.name
                      .toLowerCase()
                      .includes(productSearchQuery.toLowerCase()),
                  )
                  .map(product => {
                    const isSelected =
                      selectedSaleItemId &&
                      saleItems.find(item => item.id === selectedSaleItemId)
                        ?.productId === product.id;
                    return (
                      <View key={product.id} style={styles.productItem}>
                        <Pressable
                          style={styles.checkboxContainer}
                          onPress={() => {
                            if (selectedSaleItemId) {
                              updateSaleItem(
                                selectedSaleItemId,
                                'productId',
                                product.id,
                              );
                              setProductModalVisible(false);
                              setProductSearchQuery('');
                              setSelectedSaleItemId(null);
                            }
                          }}>
                          <Ionicons
                            name={
                              isSelected ? 'checkbox' : 'checkbox-outline'
                            }
                            size={20}
                            color={COLORS.PRIMARY}
                          />
                        </Pressable>
                        <Pressable
                          style={styles.productTextContainer}
                          onPress={() => {
                            if (selectedSaleItemId) {
                              updateSaleItem(
                                selectedSaleItemId,
                                'productId',
                                product.id,
                              );
                              setProductModalVisible(false);
                              setProductSearchQuery('');
                              setSelectedSaleItemId(null);
                            }
                          }}>
                          <Text style={styles.productItemText}>
                            {`${product.name} - Stock: ${product.stockQty} - Price: ${product.sellingRate}`}
                          </Text>
                        </Pressable>
                      </View>
                    );
                  })}
              </ScrollView>
            )}

            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, {backgroundColor: 'gray'}]}
                onPress={() => {
                  setProductModalVisible(false);
                  setProductSearchQuery('');
                  setSelectedSaleItemId(null);
                }}
                disabled={isSubmitting}>
                <Text style={styles.buttonText}>বাতিল</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <DeleteModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={confirmDelete}
        message="আপনি এই বিক্রয়টি মুছে ফেলতে চান?"
      />

      <DeleteModal
        visible={sellerDeleteModalVisible}
        onClose={() => {
          setSellerDeleteModalVisible(false);
          setDeletingSellerId(null);
        }}
        onConfirm={deleteSeller}
        message="আপনি এই বিক্রেতাটি মুছে ফেলতে চান?"
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={viewModalVisible}
        onRequestClose={() => setViewModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeaderContainer}>
              <Text style={styles.modalTitle}>বিক্রয় বিবরণ</Text>
            </View>

            {isViewLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                <Text style={styles.loadingText}>লোড হচ্ছে...</Text>
              </View>
            ) : selectedSaleDetails ? (
              <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>
                  ক্রেতা: {selectedSaleDetails.customerName || '-'}
                </Text>
                <Text style={styles.detailText}>
                  ফোন: {selectedSaleDetails.customerPhone || '-'}
                </Text>
                <Text style={styles.detailText}>
                  মোট মূল্য: {selectedSaleDetails.sellAmount || 0}
                </Text>
                <Text style={styles.detailText}>
                  পেইড: {selectedSaleDetails.paid || 0}
                </Text>
                <Text style={styles.detailText}>
                  বাকি: {selectedSaleDetails.pendingAmount || 0}
                </Text>
                <Text style={styles.detailText}>
                  তারিখ: {selectedSaleDetails.createdTime || '-'}
                </Text>

                <Text style={styles.detailTitle}>পণ্য তালিকা:</Text>
                <Table borderStyle={{borderWidth: 1, borderColor: '#ccc'}}>
                  <Row
                    data={['পণ্য', 'পরিমাণ', 'মূল্য']}
                    style={styles.slimModalHead}
                    textStyle={styles.slimHeadText}
                  />
                  <Rows
                    data={
                      selectedSaleDetails.sellDetails?.map(detail => [
                        detail.product?.name,
                        detail.quantity,
                        detail.total,
                      ]) || []
                    }
                    textStyle={styles.text}
                  />
                </Table>
              </View>
            ) : (
              <Text style={styles.noDataText}>কোনো তথ্য পাওয়া যায়নি</Text>
            )}

            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, {backgroundColor: 'gray'}]}
                onPress={() => setViewModalVisible(false)}>
                <Text style={styles.buttonText}>বন্ধ করুন</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  modalHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  activeTab: {
    borderBottomColor: COLORS.PRIMARY,
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  slimModalHead: {
    height: 30,
    backgroundColor: COLORS.TABLE_HEAD,
  },
  slimHeadText: {
    margin: 2,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
  },
  slimRow: {
    height: 50,
  },
  slimInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 2,
    margin: 2,
    borderRadius: 4,
    textAlign: 'center',
    fontSize: 12,
    height: 40,
  },
  slimPickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    overflow: 'hidden',
    margin: 2,
  },
  slimUnitPicker: {
    height: 50,
    width: '100%',
  },
  sellerPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addSellerButton: {
    marginLeft: 10,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    padding: 5,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  addNewButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  head: {
    height: 40,
    backgroundColor: COLORS.PRIMARY,
  },
  headText: {
    margin: 4,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  text: {
    margin: 6,
    textAlign: 'center',
    color: 'black',
  },
  noDataText: {
    fontSize: 18,
    color: '#34495e',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.PRIMARY,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  totalCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  reloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  reloadText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  trashCell: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    width: 40,
  },
  actionCell: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    width: 60,
  },
  actionIcon: {
    marginHorizontal: 5,
  },
  inputContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    borderRadius: 4,
    fontSize: 14,
  },
  readonlyInput: {
    backgroundColor: '#f0f0f0',
    color: '#666',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'left',
  },
  detailsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 10,
  },
  productPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    margin: 2,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  productPickerText: {
    fontSize: 12,
    color: '#333',
    flex: 1,
  },
  productList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productTextContainer: {
    flex: 1,
  },
  productItemText: {
    fontSize: 14,
    color: '#333',
  },
});