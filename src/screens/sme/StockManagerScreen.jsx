import * as Yup from 'yup';

import {
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
import {Formik} from 'formik';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoadingContainer from '../../components/common/LoadingContainer';
import NoDataFound from '../../components/common/NoDataFound';
import {Picker} from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import api from '../../api';
import styles from '../../styles/StockManagerScreen.styles';

export default function StockManagerScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const units = ['পিস', 'কেজি', 'লিটার', 'মিটার', 'ডজন'];

  const showToast = (message, type = 'success') => {
    Toast.show({type, text1: message, position: 'bottom'});
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('api/product');
      const fetched = Array.isArray(response.data.data) ? response.data.data : [];
      setProducts(fetched);
      setFilteredProducts(fetched);
    } catch (error) {
      setProducts([]);
      setFilteredProducts([]);
      showToast('পণ্য লোড করতে ব্যর্থ', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = query => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(p =>
          p.name.toLowerCase().includes(query.toLowerCase()),
        ),
      );
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredProducts(products);
  };

  const handleAddStock = () => {
    setEditingProduct(null);
    setModalVisible(true);
  };

  const handleEdit = product => {
    setEditingProduct(product);
    setModalVisible(true);
  };

  const handleDelete = product => {
    setDeleteProductId(product.id);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteProductId !== null) {
      try {
        await api.delete(`/api/product/${deleteProductId}`);
        const updated = products.filter(p => p.id !== deleteProductId);
        setProducts(updated);
        setFilteredProducts(updated);
        showToast('পণ্যটি মুছে ফেলা হয়েছে');
      } catch (error) {
        showToast('পণ্য মুছতে ব্যর্থ', 'error');
      }
      setDeleteProductId(null);
      setDeleteModalVisible(false);
    }
  };

  const handleSubmitForm = async values => {
    try {
      const payload = {
        name: values.name,
        brand: values.brand || '',
        purchaseQuantity: parseFloat(values.purchaseQuantity) || 0,
        unit: values.unit,
        purchaseRate: parseFloat(values.purchaseRate) || 0,
        sellingRate: parseFloat(values.sellingRate) || 0,
      };

      if (editingProduct) {
        payload.id = editingProduct.id;
        const response = await api.put(`/api/product/${editingProduct.id}`, payload);
        if (response.data.success) {
          const updated = products.map(p =>
            p.id === editingProduct.id ? response.data.data : p,
          );
          setProducts(updated);
          setFilteredProducts(updated);
          showToast('পণ্য আপডেট করা হয়েছে');
        } else {
          showToast('Failed to update', 'error');
        }
      } else {
        const response = await api.post('/api/product', payload);
        const updated = [...products, response.data.data];
        setProducts(updated);
        setFilteredProducts(updated);
        showToast('নতুন পণ্য যোগ করা হয়েছে');
      }
      setModalVisible(false);
      setEditingProduct(null);
    } catch (error) {
      showToast('পণ্য সংরক্ষণে ব্যর্থ', 'error');
    }
  };

  const getInitialValues = () => {
    if (editingProduct) {
      return {
        name: editingProduct.name || '',
        brand: editingProduct.brand || '',
        purchaseQuantity: editingProduct.purchaseQuantity
          ? String(editingProduct.purchaseQuantity)
          : '',
        unit: editingProduct.unit || units[0],
        purchaseRate: editingProduct.purchaseRate
          ? String(editingProduct.purchaseRate)
          : '',
        sellingRate: editingProduct.sellingRate
          ? String(editingProduct.sellingRate)
          : '',
      };
    }
    return {
      name: '',
      brand: '',
      purchaseQuantity: '',
      unit: units[0],
      purchaseRate: '',
      sellingRate: '',
    };
  };

  return (
    <View style={styles.page}>
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons
            name="search-outline"
            size={18}
            color="#8A92B8"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="পণ্যের নাম দিয়ে অনুসন্ধান করুন"
            placeholderTextColor="#8A92B8"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons name="close-circle" size={18} color="#8A92B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.countRow}>
        <Text style={styles.countText}>মোট পণ্য: {filteredProducts.length}</Text>
      </View>

      {isLoading && products.length === 0 ? (
        <LoadingContainer />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => {
                fetchProducts();
                setSearchQuery('');
              }}
              colors={['#1D2A74']}
            />
          }>
          {filteredProducts.length === 0 ? (
            <NoDataFound title="পণ্য" icon="cube-outline" />
          ) : (
            filteredProducts.map(item => (
              <View key={item.id} style={styles.productCard}>
                <View style={styles.cardLeft}>
                  <Text style={styles.productName}>{item.name || '-'}</Text>
                  <View style={styles.metaRow}>
                    <View style={styles.metaPill}>
                      <Text style={styles.metaLabel}>পরিমাণ</Text>
                      <Text style={styles.metaValue}>
                        {item.purchaseQuantity || 0} {item.unit || ''}
                      </Text>
                    </View>
                    <View style={styles.metaPill}>
                      <Text style={styles.metaLabel}>বিক্রয় মূল্য</Text>
                      <Text style={styles.metaValue}>৳ {item.sellingRate || 0}</Text>
                    </View>
                    <View style={[styles.metaPill, styles.stockPill]}>
                      <Text style={styles.metaLabel}>স্টক</Text>
                      <Text style={[styles.metaValue, styles.stockValue]}>
                        {item.stockQty || 0}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => handleEdit(item)}>
                    <Ionicons name="create-outline" size={18} color="#1D2A74" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(item)}>
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
        title="পণ্য যোগ করুন"
        icon={{name: 'add', color: 'white'}}
        color="#1D2A74"
        placement="right"
        style={{marginBottom: 50}}
        onPress={handleAddStock}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setEditingProduct(null);
        }}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>
              {editingProduct ? 'পণ্য আপডেট করুন' : 'নতুন পণ্য যোগ করুন'}
            </Text>
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}>
              <Formik
                initialValues={getInitialValues()}
                enableReinitialize={true}
                validationSchema={Yup.object({
                  name: Yup.string().required('পণ্যের নাম আবশ্যক'),
                  purchaseQuantity: Yup.number().required('পরিমাণ আবশ্যক'),
                  unit: Yup.string().required('ইউনিট আবশ্যক'),
                  purchaseRate: Yup.number().required('ক্রয় মূল্য আবশ্যক'),
                  sellingRate: Yup.number().required('বিক্রয় মূল্য আবশ্যক'),
                })}
                onSubmit={handleSubmitForm}>
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                  setFieldValue,
                }) => (
                  <View style={styles.formBody}>
                    <Text style={styles.fieldLabel}>পণ্যের নাম *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="পণ্যের নাম লিখুন"
                      placeholderTextColor="#8A92B8"
                      value={values.name}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                    />
                    {touched.name && errors.name && (
                      <Text style={styles.errorText}>{errors.name}</Text>
                    )}

                    <Text style={styles.fieldLabel}>পরিমাণ ও ইউনিট *</Text>
                    <View style={styles.rowInputs}>
                      <TextInput
                        style={[styles.input, styles.halfInput]}
                        placeholder="পরিমাণ"
                        placeholderTextColor="#8A92B8"
                        value={values.purchaseQuantity}
                        onChangeText={handleChange('purchaseQuantity')}
                        onBlur={handleBlur('purchaseQuantity')}
                        keyboardType="numeric"
                      />
                      <View style={styles.pickerWrap}>
                        <Picker
                          selectedValue={values.unit}
                          style={styles.picker}
                          onValueChange={val => setFieldValue('unit', val)}
                          mode="dropdown">
                          {units.map(u => (
                            <Picker.Item
                              key={u}
                              label={u}
                              value={u}
                              color="#1D2A74"
                            />
                          ))}
                        </Picker>
                      </View>
                    </View>
                    {touched.purchaseQuantity && errors.purchaseQuantity && (
                      <Text style={styles.errorText}>
                        {errors.purchaseQuantity}
                      </Text>
                    )}

                    <Text style={styles.fieldLabel}>ক্রয় মূল্য *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="ক্রয় মূল্য"
                      placeholderTextColor="#8A92B8"
                      value={values.purchaseRate}
                      onChangeText={handleChange('purchaseRate')}
                      onBlur={handleBlur('purchaseRate')}
                      keyboardType="numeric"
                    />
                    {touched.purchaseRate && errors.purchaseRate && (
                      <Text style={styles.errorText}>{errors.purchaseRate}</Text>
                    )}

                    <Text style={styles.fieldLabel}>বিক্রয় মূল্য *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="বিক্রয় মূল্য"
                      placeholderTextColor="#8A92B8"
                      value={values.sellingRate}
                      onChangeText={handleChange('sellingRate')}
                      onBlur={handleBlur('sellingRate')}
                      keyboardType="numeric"
                    />
                    {touched.sellingRate && errors.sellingRate && (
                      <Text style={styles.errorText}>{errors.sellingRate}</Text>
                    )}

                    <Text style={styles.fieldLabel}>ব্র্যান্ড (ঐচ্ছিক)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="ব্র্যান্ড"
                      placeholderTextColor="#8A92B8"
                      value={values.brand}
                      onChangeText={handleChange('brand')}
                      onBlur={handleBlur('brand')}
                    />

                    <View style={styles.sheetActions}>
                      <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={() => {
                          setModalVisible(false);
                          setEditingProduct(null);
                        }}>
                        <Text style={styles.cancelBtnText}>বাতিল</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.saveBtn}
                        onPress={handleSubmit}>
                        <Text style={styles.saveBtnText}>
                          {editingProduct ? 'আপডেট' : 'সংরক্ষণ করুন'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </Formik>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <DeleteModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteConfirm}
        message="আপনি এই পণ্যটি মুছে ফেলতে চান?"
      />
    </View>
  );
}
