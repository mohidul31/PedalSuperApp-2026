import {
  ActivityIndicator,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import DeleteModal from '../../components/modals/DeleteModal';
import {FAB} from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoadingContainer from '../../components/common/LoadingContainer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NoDataFound from '../../components/common/NoDataFound';
import {Picker} from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import api from '../../api';

export default function SellScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [newSellerModalVisible, setNewSellerModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [sellerDeleteModalVisible, setSellerDeleteModalVisible] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [selectedSaleDetails, setSelectedSaleDetails] = useState(null);
  const [deletingSellerId, setDeletingSellerId] = useState(null);
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
      const fetched = Array.isArray(response.data.data) ? response.data.data : [];
      setSales(fetched);
    } catch (error) {
      setSales([]);
      showToast('বিক্রয় লোড করতে ব্যর্থ', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductsForSell = async () => {
    setIsFetchingProducts(true);
    try {
      const response = await api.get('/api/Product/GetProductListForSell');
      const fetched = Array.isArray(response.data.data) ? response.data.data : [];
      setProducts(fetched);
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
      const fetched = Array.isArray(response.data.data) ? response.data.data : [];
      setSellers(fetched);
      if (fetched.length > 0 && !seller) {
        setSeller(fetched[0].id);
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
      showToast('বিক্রয় বিবরণ লোড করতে ব্যর্থ', 'error');
    } finally {
      setIsViewLoading(false);
    }
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
    setSaleItems([]);
    setProductSearchQuery('');
    await Promise.all([fetchProductsForSell(), fetchSellers()]);
  };

  const handleDelete = saleId => {
    setSelectedSaleId(saleId);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedSaleId) return;
    try {
      await api.delete(`/api/sell/${selectedSaleId}`);
      setSales(sales.filter(sale => sale.id !== selectedSaleId));
      showToast('বিক্রয় সফলভাবে মুছে ফেলা হয়েছে', 'success');
    } catch (error) {
      showToast('বিক্রয় মুছতে ব্যর্থ', 'error');
    } finally {
      setDeleteModalVisible(false);
      setSelectedSaleId(null);
    }
  };

  const toggleProduct = product => {
    const existing = saleItems.find(i => i.productId === product.id);
    if (existing) {
      setSaleItems(saleItems.filter(i => i.productId !== product.id));
    } else {
      setSaleItems([
        ...saleItems,
        {id: product.id, productId: product.id, quantity: '1'},
      ]);
    }
    setQuantityError('');
  };

  const updateProductQty = (productId, qty) => {
    setSaleItems(
      saleItems.map(i => (i.productId === productId ? {...i, quantity: qty} : i)),
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

    if (saleItems.length === 0) {
      setQuantityError('কমপক্ষে একটি পণ্য নির্বাচন করুন');
      hasError = true;
    } else {
      const invalidItems = saleItems.some(
        item => !item.quantity || parseFloat(item.quantity) <= 0,
      );
      if (invalidItems) {
        setQuantityError('নির্বাচিত সব পণ্যের জন্য সঠিক পরিমাণ দিন');
        hasError = true;
      } else {
        setQuantityError('');
      }
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
        showToast('বিক্রয় যোগ করা হয়েছে');
      } else {
        showToast('Something went wrong', 'error');
      }
      const newSales = Array.isArray(response.data.data) ? response.data.data : [];
      setSales(prevSales => [...prevSales, ...newSales]);

      await fetchSales();
      setModalVisible(false);
      setSaleItems([]);
      setDiscountAmount('');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const visibleProducts = (products || []).filter(p =>
    p.name.toLowerCase().includes(productSearchQuery.toLowerCase()),
  );

  return (
    <View style={styles.page}>
      <View style={styles.countRow}>
        <Text style={styles.countText}>মোট বিক্রয়: {sales.length}</Text>
      </View>

      {isLoading && sales.length === 0 ? (
        <LoadingContainer />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchSales}
              colors={['#1D2A74']}
            />
          }>
          {sales.length === 0 ? (
            <NoDataFound title="বিক্রয়" icon="receipt-outline" />
          ) : (
            sales.map(item => (
              <View key={item.id} style={styles.saleCard}>
                <View style={styles.saleCardLeft}>
                  <Text style={styles.saleCustomer}>
                    {item.customerName || 'অজানা ক্রেতা'}
                  </Text>
                  <Text style={styles.saleDate}>{item.createdTime || '-'}</Text>
                  <View style={styles.salePaidPill}>
                    <Text style={styles.salePaidLabel}>পেইড</Text>
                    <Text style={styles.salePaidValue}>৳ {item.paid || 0}</Text>
                  </View>
                </View>
                <View style={styles.saleCardActions}>
                  <TouchableOpacity
                    style={styles.viewBtn}
                    onPress={() => fetchSaleDetails(item.id)}>
                    <Ionicons name="eye-outline" size={18} color="#1D2A74" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(item.id)}>
                    <Ionicons name="trash-outline" size={18} color="#E43A3A" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      <FAB
        visible={true}
        title="বিক্রয় যোগ করুন"
        icon={{name: 'add', color: 'white'}}
        color="#1D2A74"
        placement="right"
        style={{marginBottom: 50}}
        onPress={handleAddSale}
        disabled={isSubmitting}
      />

      {/* ── Add Sale Modal ── */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          if (!isFetchingProducts && !isSubmitting) setModalVisible(false);
        }}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>নতুন বিক্রয়</Text>

            {isFetchingProducts || isFetchingSellers ? (
              <View style={styles.centeredLoader}>
                <ActivityIndicator size="large" color="#1D2A74" />
                <Text style={styles.loaderText}>লোড হচ্ছে...</Text>
              </View>
            ) : products.length === 0 ? (
              <View style={styles.emptyNotice}>
                <Ionicons
                  name="alert-circle-outline"
                  size={40}
                  color="#E43A3A"
                />
                <Text style={styles.emptyNoticeText}>
                  কোনো পণ্য যোগ করা নেই। স্টক ম্যানেজার থেকে পণ্য যোগ করুন।
                </Text>
                <TouchableOpacity
                  style={styles.cancelBtnFull}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelBtnText}>বাতিল</Text>
                </TouchableOpacity>
              </View>
            ) : sellers.length === 0 ? (
              <View style={styles.emptyNotice}>
                <Ionicons
                  name="alert-circle-outline"
                  size={40}
                  color="#E43A3A"
                />
                <Text style={styles.emptyNoticeText}>
                  কোনো বিক্রেতা পাওয়া যায়নি। প্রথমে বিক্রেতা যোগ করুন।
                </Text>
                <TouchableOpacity
                  style={styles.cancelBtnFull}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelBtnText}>বাতিল</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">

                {/* ── Seller ── */}
                <View style={styles.formSection}>
                  <Text style={styles.formLabel}>বিক্রেতা</Text>
                  <View style={styles.sellerInputRow}>
                    <View style={styles.sellerInputBox}>
                      <MaterialCommunityIcons
                        name="account-tie"
                        size={22}
                        color="#7B7C8E"
                      />
                      <View style={styles.sellerPickerWrap}>
                        <Picker
                          selectedValue={seller}
                          style={styles.sellerPicker}
                          onValueChange={val => {
                            setSeller(val);
                            setSellerError('');
                          }}
                          enabled={!isSubmitting}
                          mode="dropdown">
                          {sellers.map(s => (
                            <Picker.Item
                              key={s.id}
                              label={s.sellerName}
                              value={s.id}
                            />
                          ))}
                        </Picker>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.addSellerIconBtn}
                      onPress={() => {
                        setNewSellerModalVisible(true);
                        setActiveTab('create');
                        fetchSellers();
                      }}
                      disabled={isSubmitting}>
                      <Ionicons name="person-add-outline" size={20} color="#1D2A74" />
                    </TouchableOpacity>
                  </View>
                  {sellerError ? (
                    <Text style={styles.errorText}>{sellerError}</Text>
                  ) : null}
                </View>

                {/* ── Product Selection ── */}
                <View style={styles.formSection}>
                  <Text style={styles.formLabel}>পণ্য নির্বাচন</Text>
                  <View style={styles.selectionCard}>
                    {/* Search */}
                    <View style={styles.productSearchBox}>
                      <Ionicons
                        name="search-outline"
                        size={18}
                        color="#777A89"
                      />
                      <TextInput
                        style={styles.productSearchInput}
                        value={productSearchQuery}
                        onChangeText={setProductSearchQuery}
                        placeholder="পণ্য খুঁজুন..."
                        placeholderTextColor="#7D8090"
                      />
                      {productSearchQuery.length > 0 && (
                        <TouchableOpacity
                          onPress={() => setProductSearchQuery('')}>
                          <Ionicons
                            name="close-circle"
                            size={16}
                            color="#8A92B8"
                          />
                        </TouchableOpacity>
                      )}
                    </View>

                    {visibleProducts.length === 0 ? (
                      <Text style={styles.emptyStateText}>
                        কোনো পণ্য পাওয়া যায়নি।
                      </Text>
                    ) : (
                      visibleProducts.map(product => {
                        const isSelected = saleItems.some(
                          i => i.productId === product.id,
                        );
                        const selectedItem = saleItems.find(
                          i => i.productId === product.id,
                        );
                        return (
                          <View key={product.id}>
                            <TouchableOpacity
                              style={[
                                styles.productRow,
                                isSelected && styles.productRowActive,
                              ]}
                              activeOpacity={0.85}
                              onPress={() => toggleProduct(product)}
                              disabled={isSubmitting}>
                              <View style={styles.productLeft}>
                                <View
                                  style={[
                                    styles.checkbox,
                                    isSelected && styles.checkboxActive,
                                  ]}>
                                  {isSelected && (
                                    <Ionicons
                                      name="checkmark"
                                      size={14}
                                      color="#FFFFFF"
                                    />
                                  )}
                                </View>
                                <Text style={styles.productName}>
                                  {product.name}
                                </Text>
                              </View>
                              <Text style={styles.productPrice}>
                                ৳{product.sellingRate}/
                                {product.unit || 'পিস'}
                              </Text>
                            </TouchableOpacity>

                            {isSelected && (
                              <View style={styles.qtyRow}>
                                <Ionicons
                                  name="layers-outline"
                                  size={16}
                                  color="#8A92B8"
                                  style={styles.qtyIcon}
                                />
                                <TextInput
                                  style={styles.qtyInput}
                                  placeholder="পরিমাণ লিখুন"
                                  placeholderTextColor="#999AA8"
                                  value={selectedItem?.quantity || ''}
                                  onChangeText={txt =>
                                    updateProductQty(product.id, txt)
                                  }
                                  keyboardType="decimal-pad"
                                  editable={!isSubmitting}
                                />
                                <Text style={styles.qtyUnit}>
                                  {product.unit || 'পিস'}
                                </Text>
                              </View>
                            )}
                          </View>
                        );
                      })
                    )}
                  </View>
                  {quantityError ? (
                    <Text style={styles.errorText}>{quantityError}</Text>
                  ) : null}
                </View>

                {/* ── Payment Type ── */}
                <View style={styles.formSection}>
                  <Text style={styles.formLabel}>পেমেন্ট ধরন</Text>
                  <View style={styles.paymentRow}>
                    <TouchableOpacity
                      style={[
                        styles.paymentButton,
                        !isDue && styles.paymentButtonActive,
                      ]}
                      activeOpacity={0.85}
                      onPress={() => setIsDue(false)}
                      disabled={isSubmitting}>
                      <MaterialCommunityIcons
                        name="cash-multiple"
                        size={24}
                        color={!isDue ? '#101A79' : '#4B4E60'}
                      />
                      <Text
                        style={
                          !isDue ? styles.paymentTextActive : styles.paymentText
                        }>
                        নগদ
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.paymentButton,
                        isDue && styles.paymentButtonActive,
                      ]}
                      activeOpacity={0.85}
                      onPress={() => setIsDue(true)}
                      disabled={isSubmitting}>
                      <MaterialCommunityIcons
                        name="wallet-outline"
                        size={24}
                        color={isDue ? '#101A79' : '#4B4E60'}
                      />
                      <Text
                        style={
                          isDue ? styles.paymentTextActive : styles.paymentText
                        }>
                        বাকি
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* ── Summary Banner ── */}
                <View style={styles.summaryBanner}>
                  <Text style={styles.summaryLabel}>নির্বাচিত পণ্য</Text>
                  <Text style={styles.summaryValue}>{saleItems.length}</Text>
                  <Text style={styles.summaryLabel}>মোট</Text>
                  <Text style={styles.summaryValue}>
                    ৳ {calculateSellingAmount()}
                  </Text>
                </View>

                <View style={styles.divider} />

                {/* ── Buyer Info ── */}
                <View style={styles.formSection}>
                  <View style={styles.infoTitleRow}>
                    <MaterialCommunityIcons
                      name="file-document-edit-outline"
                      size={18}
                      color="#101A79"
                    />
                    <Text style={styles.infoTitle}>ক্রেতার তথ্য</Text>
                  </View>

                  <Text style={styles.smallLabel}>ক্রেতার নাম</Text>
                  <TextInput
                    style={styles.textInput}
                    value={buyer}
                    onChangeText={setBuyer}
                    placeholder="নাম লিখুন"
                    placeholderTextColor="#888A99"
                    editable={!isSubmitting}
                  />

                  <Text style={styles.smallLabel}>মোবাইল নম্বর</Text>
                  <TextInput
                    style={styles.textInput}
                    value={buyerPhone}
                    onChangeText={setBuyerPhone}
                    placeholder="০১XXXXXXXXX"
                    placeholderTextColor="#888A99"
                    keyboardType="phone-pad"
                    editable={!isSubmitting}
                  />

                  <Text style={styles.smallLabel}>
                    বাকি পরিমাণ (যদি প্রযোজ্য হয়)
                  </Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      !isDue && styles.textInputDisabled,
                    ]}
                    value={dueAmount}
                    onChangeText={setDueAmount}
                    placeholder="৳ ০.০০"
                    placeholderTextColor="#888A99"
                    keyboardType="numeric"
                    editable={isDue && !isSubmitting}
                  />

                  <Text style={styles.smallLabel}>ডিসকাউন্ট (ঐচ্ছিক)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={discountAmount}
                    onChangeText={setDiscountAmount}
                    placeholder="৳ ০.০০"
                    placeholderTextColor="#888A99"
                    keyboardType="numeric"
                    editable={!isSubmitting}
                  />
                </View>

                {/* ── Submit ── */}
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    isSubmitting && styles.submitButtonDisabled,
                  ]}
                  activeOpacity={0.9}
                  onPress={handleSubmit}
                  disabled={isSubmitting}>
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <View style={styles.submitIconWrap}>
                        <Ionicons
                          name="checkmark"
                          size={18}
                          color="#101A79"
                        />
                      </View>
                      <Text style={styles.submitText}>বিক্রি সম্পন্ন</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.cancelBtnFull, {marginTop: 12, marginBottom: 8}]}
                  onPress={() => setModalVisible(false)}
                  disabled={isSubmitting}>
                  <Text style={styles.cancelBtnText}>বাতিল</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* ── Seller Management Modal ── */}
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
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>বিক্রেতা ব্যবস্থাপনা</Text>

            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[
                  styles.tabBtn,
                  activeTab === 'create' && styles.tabBtnActive,
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
                    activeTab === 'create' && styles.tabTextActive,
                  ]}>
                  নতুন বিক্রেতা
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabBtn,
                  activeTab === 'list' && styles.tabBtnActive,
                ]}
                onPress={() => {
                  setActiveTab('list');
                  fetchSellers();
                }}>
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'list' && styles.tabTextActive,
                  ]}>
                  বিক্রেতা তালিকা
                </Text>
              </TouchableOpacity>
            </View>

            {activeTab === 'create' ? (
              <View>
                <Text style={styles.smallLabel}>বিক্রেতার নাম *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="বিক্রেতার নাম লিখুন"
                  placeholderTextColor="#888A99"
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
                <View style={styles.sheetActions}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => {
                      setNewSellerModalVisible(false);
                      setNewSellerName('');
                      setNewSellerError('');
                    }}
                    disabled={isCreatingSeller}>
                    <Text style={styles.cancelBtnText}>বাতিল</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.saveBtn,
                      isCreatingSeller && styles.submitButtonDisabled,
                    ]}
                    onPress={createSeller}
                    disabled={isCreatingSeller}>
                    {isCreatingSeller ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.saveBtnText}>সংরক্ষণ করুন</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View>
                {isFetchingSellers ? (
                  <LoadingContainer />
                ) : sellers.length === 0 ? (
                  <NoDataFound title="বিক্রেতা" icon="person-outline" />
                ) : (
                  <ScrollView
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                    style={styles.sellerList}>
                    {sellers.map(s => (
                      <View key={s.id} style={styles.sellerRow}>
                        {editingSellerId === s.id ? (
                          <>
                            <View style={styles.sellerEditRow}>
                              <TextInput
                                style={[
                                  styles.textInput,
                                  {flex: 1, marginRight: 8, marginBottom: 0},
                                ]}
                                value={editingSellerName}
                                onChangeText={text => {
                                  setEditingSellerName(text);
                                  setEditingSellerError('');
                                }}
                                autoFocus
                              />
                              <TouchableOpacity
                                onPress={() => updateSeller(s.id)}
                                disabled={isUpdatingSeller}>
                                <Ionicons
                                  name="checkmark-circle"
                                  size={26}
                                  color={
                                    isUpdatingSeller ? '#ccc' : '#1B792E'
                                  }
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={{marginLeft: 6}}
                                onPress={() => {
                                  setEditingSellerId(null);
                                  setEditingSellerName('');
                                  setEditingSellerError('');
                                }}
                                disabled={isUpdatingSeller}>
                                <Ionicons
                                  name="close-circle"
                                  size={26}
                                  color={
                                    isUpdatingSeller ? '#ccc' : '#E43A3A'
                                  }
                                />
                              </TouchableOpacity>
                            </View>
                            {editingSellerError ? (
                              <Text style={styles.errorText}>
                                {editingSellerError}
                              </Text>
                            ) : null}
                          </>
                        ) : (
                          <View style={styles.sellerViewRow}>
                            <Text style={styles.sellerName}>
                              {s.sellerName}
                            </Text>
                            <View style={styles.sellerBtns}>
                              <TouchableOpacity
                                style={styles.editBtn}
                                onPress={() => {
                                  setEditingSellerId(s.id);
                                  setEditingSellerName(s.sellerName);
                                  setEditingSellerError('');
                                }}
                                disabled={editingSellerId !== null}>
                                <Ionicons
                                  name="pencil-outline"
                                  size={16}
                                  color={
                                    editingSellerId !== null
                                      ? '#ccc'
                                      : '#1D2A74'
                                  }
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.deleteBtn}
                                onPress={() => {
                                  setDeletingSellerId(s.id);
                                  setSellerDeleteModalVisible(true);
                                }}
                                disabled={editingSellerId !== null}>
                                <Ionicons
                                  name="trash-outline"
                                  size={16}
                                  color={
                                    editingSellerId !== null
                                      ? '#ccc'
                                      : '#E43A3A'
                                  }
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        )}
                      </View>
                    ))}
                  </ScrollView>
                )}
                <TouchableOpacity
                  style={[styles.cancelBtnFull, {marginTop: 16}]}
                  onPress={() => {
                    setNewSellerModalVisible(false);
                    setActiveTab('create');
                    setEditingSellerId(null);
                    setEditingSellerName('');
                    setEditingSellerError('');
                  }}
                  disabled={isFetchingSellers || isUpdatingSeller}>
                  <Text style={styles.cancelBtnText}>বন্ধ করুন</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* ── View Sale Details Modal ── */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={viewModalVisible}
        onRequestClose={() => setViewModalVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>বিক্রয় বিবরণ</Text>

            {isViewLoading ? (
              <LoadingContainer />
            ) : selectedSaleDetails ? (
              <ScrollView
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}>
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>ক্রেতার তথ্য</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>নাম</Text>
                    <Text style={styles.detailValue}>
                      {selectedSaleDetails.customerName || '-'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>ফোন</Text>
                    <Text style={styles.detailValue}>
                      {selectedSaleDetails.customerPhone || '-'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>তারিখ</Text>
                    <Text style={styles.detailValue}>
                      {selectedSaleDetails.createdTime || '-'}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>পেমেন্ট তথ্য</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>মোট মূল্য</Text>
                    <Text style={styles.detailValue}>
                      ৳ {selectedSaleDetails.sellAmount || 0}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>পেইড</Text>
                    <Text style={[styles.detailValue, {color: '#1B792E'}]}>
                      ৳ {selectedSaleDetails.paid || 0}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>বাকি</Text>
                    <Text
                      style={[
                        styles.detailValue,
                        {
                          color:
                            (selectedSaleDetails.pendingAmount || 0) > 0
                              ? '#E43A3A'
                              : '#1B792E',
                        },
                      ]}>
                      ৳ {selectedSaleDetails.pendingAmount || 0}
                    </Text>
                  </View>
                </View>

                {selectedSaleDetails.sellDetails?.length > 0 && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>পণ্য তালিকা</Text>
                    <View style={styles.productTableHeader}>
                      <Text style={[styles.productTableCell, {flex: 3}]}>
                        পণ্য
                      </Text>
                      <Text
                        style={[
                          styles.productTableCell,
                          {flex: 1, textAlign: 'center'},
                        ]}>
                        পরিমাণ
                      </Text>
                      <Text
                        style={[
                          styles.productTableCell,
                          {flex: 2, textAlign: 'right'},
                        ]}>
                        মূল্য
                      </Text>
                    </View>
                    {selectedSaleDetails.sellDetails.map((detail, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.productTableRow,
                          idx % 2 === 0 && {backgroundColor: '#F8F9FF'},
                        ]}>
                        <Text style={[styles.productTableValue, {flex: 3}]}>
                          {detail.product?.name || '-'}
                        </Text>
                        <Text
                          style={[
                            styles.productTableValue,
                            {flex: 1, textAlign: 'center'},
                          ]}>
                          {detail.quantity}
                        </Text>
                        <Text
                          style={[
                            styles.productTableValue,
                            {flex: 2, textAlign: 'right'},
                          ]}>
                          ৳ {detail.total}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                <TouchableOpacity
                  style={[
                    styles.cancelBtnFull,
                    {marginTop: 8, marginBottom: 16},
                  ]}
                  onPress={() => setViewModalVisible(false)}>
                  <Text style={styles.cancelBtnText}>বন্ধ করুন</Text>
                </TouchableOpacity>
              </ScrollView>
            ) : (
              <NoDataFound title="বিবরণ" icon="receipt-outline" />
            )}
          </View>
        </View>
      </Modal>

      <DeleteModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={confirmDelete}
        message="আপনি এই বিক্রয়টি মুছে ফেলতে চান?"
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
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F6F7FF',
  },
  countRow: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  countText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6F759B',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  // Sale list cards
  saleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#B3B7D5',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: {width: 0, height: 4},
    elevation: 3,
  },
  saleCardLeft: {
    flex: 1,
  },
  saleCustomer: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1D2A74',
    marginBottom: 4,
  },
  saleDate: {
    fontSize: 12,
    color: '#8A92B8',
    marginBottom: 8,
  },
  salePaidPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF7F1',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  salePaidLabel: {
    fontSize: 11,
    color: '#8A92B8',
    marginRight: 4,
  },
  salePaidValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1B792E',
  },
  saleCardActions: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  viewBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#EEF0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FCE8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#EEF0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  // Bottom sheet
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 32,
    maxHeight: '95%',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E3F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1D2A74',
    marginBottom: 18,
  },
  // Form sections
  formSection: {
    marginBottom: 22,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#23283A',
    marginBottom: 12,
  },
  smallLabel: {
    fontSize: 14,
    color: '#34384A',
    marginBottom: 8,
  },
  // Seller input row
  sellerInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerInputBox: {
    flex: 1,
    height: 64,
    borderRadius: 14,
    backgroundColor: '#E7E3EC',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  sellerPickerWrap: {
    flex: 1,
  },
  sellerPicker: {
    color: '#23283A',
    marginLeft: 8,
  },
  addSellerIconBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#EEF0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Product selection card
  selectionCard: {
    borderRadius: 18,
    backgroundColor: '#F2EEF7',
    padding: 14,
  },
  productSearchBox: {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  productSearchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: '#23283A',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#75798B',
    textAlign: 'center',
    paddingVertical: 12,
  },
  productRow: {
    minHeight: 58,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productRowActive: {
    borderWidth: 1.5,
    borderColor: '#C9CEFF',
  },
  productLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#B9B8C8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxActive: {
    backgroundColor: '#1B238B',
    borderColor: '#1B238B',
  },
  productName: {
    fontSize: 15,
    color: '#23283A',
    marginLeft: 10,
  },
  productPrice: {
    fontSize: 13,
    color: '#6D7286',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
    marginTop: -4,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderTopWidth: 1,
    borderTopColor: '#EDE9F4',
  },
  qtyIcon: {
    marginRight: 8,
  },
  qtyInput: {
    flex: 1,
    fontSize: 15,
    color: '#23283A',
  },
  qtyUnit: {
    fontSize: 13,
    color: '#8A92B8',
    marginLeft: 8,
  },
  // Payment type
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentButton: {
    width: '47%',
    height: 68,
    borderRadius: 16,
    backgroundColor: '#E7E3EC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentButtonActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#101A79',
  },
  paymentText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4B4E60',
    marginLeft: 8,
  },
  paymentTextActive: {
    fontSize: 16,
    fontWeight: '800',
    color: '#101A79',
    marginLeft: 8,
  },
  // Summary banner
  summaryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    backgroundColor: '#EEF1FF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#51608C',
    marginRight: 6,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#101A79',
    marginRight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0ECF5',
    marginBottom: 20,
  },
  // Buyer info section
  infoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    marginLeft: 8,
    fontSize: 17,
    fontWeight: '800',
    color: '#101A79',
  },
  textInput: {
    height: 58,
    borderRadius: 14,
    backgroundColor: '#E7E3EC',
    paddingHorizontal: 18,
    color: '#23283A',
    fontSize: 16,
    marginBottom: 16,
  },
  textInputDisabled: {
    opacity: 0.5,
  },
  // Submit button
  submitButton: {
    height: 72,
    borderRadius: 16,
    backgroundColor: '#191E8D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#191E8D',
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: {width: 0, height: 8},
    elevation: 6,
    marginBottom: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  submitText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  // Action buttons
  sheetActions: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: '#F5F7FF',
    alignItems: 'center',
    marginRight: 8,
  },
  cancelBtnFull: {
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: '#F5F7FF',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6F759B',
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: '#1D2A74',
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  errorText: {
    color: '#E43A3A',
    fontSize: 12,
    marginTop: 4,
  },
  // Loading / empty inside modal
  centeredLoader: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  loaderText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6F759B',
  },
  emptyNotice: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyNoticeText: {
    fontSize: 14,
    color: '#E43A3A',
    textAlign: 'center',
    marginVertical: 12,
    lineHeight: 22,
  },
  // Seller management modal
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#F0F0FB',
    borderRadius: 24,
    padding: 6,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
  },
  tabText: {
    fontSize: 14,
    color: '#8A92B8',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#1D2A74',
    fontWeight: '700',
  },
  sellerList: {
    maxHeight: 280,
  },
  sellerRow: {
    backgroundColor: '#F8F9FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  sellerViewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sellerEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1D2A74',
    flex: 1,
  },
  sellerBtns: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // View details
  detailSection: {
    backgroundColor: '#F8F9FF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  detailSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1D2A74',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0FF',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6F759B',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D2A74',
  },
  productTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#EEF0FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 4,
  },
  productTableCell: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1D2A74',
  },
  productTableRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 2,
  },
  productTableValue: {
    fontSize: 13,
    color: '#22263F',
  },
});
