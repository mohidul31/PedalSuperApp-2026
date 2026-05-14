import {
  ActivityIndicator,
  Modal,
  RefreshControl,
  ScrollView,
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
import styles from '../../styles/SellScreen.styles';

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

