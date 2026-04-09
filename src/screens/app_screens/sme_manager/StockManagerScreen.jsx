import * as Yup from 'yup';

import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Row, Rows, Table} from 'react-native-table-component';

import {COLORS} from '../../../styles/colors';
import DeleteModal from '../../../components/DeleteModal';
import {FAB} from '@rneui/themed';
import {Formik} from 'formik';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NoDataFound from '../../../components/NoDataFound';
import {Picker} from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import api from '../../../api';

export default function StockManagerScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const tableHead = ['নাম', 'পরিমাণ', 'বিক্রয় মূল্য', 'স্টক', 'অ্যাকশন'];
  const units = ['পিস', 'কেজি', 'লিটার', 'মিটার', 'ডজন'];

  const showToast = (message, type = 'success') => {
    Toast.show({
      type,
      text1: message,
      position: 'bottom',
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('api/product');
      const fetchedProducts = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
    } catch (error) {
      setProducts([]);
      setFilteredProducts([]);
      showToast('পণ্য লোড করতে ব্যর্থ', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredProducts(products);
  };

  const handleReload = () => {
    fetchProducts();
    setSearchQuery('');
  };

  const handleAddStock = () => {
    setEditingIndex(null);
    setModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteIndex !== null) {
      try {
        const productId = products[deleteIndex].id;
        await api.delete(`/api/product/${productId}`);
        const updated = [...products];
        updated.splice(deleteIndex, 1);
        setProducts(updated);
        setFilteredProducts(updated);
        showToast('পণ্যটি মুছে ফেলা হয়েছে');
      } catch (error) {
        showToast('পণ্য মুছতে ব্যর্থ', 'error');
      }
      setDeleteIndex(null);
      setDeleteModalVisible(false);
    }
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setDeleteModalVisible(true);
  };

  const handleEdit = (index) => {
    if (index >= 0 && index < products.length) {
      setEditingIndex(index);
      setModalVisible(true);
    } else {
      showToast('সম্পাদনা করতে ব্যর্থ', 'error');
    }
  };

  const tableData = filteredProducts.map((item, index) => [
    item.name || '-',
    `${item.purchaseQuantity || 0} ${item.unit || ''}`,
    item.sellingRate || 0,
    item.stockQty || 0,
    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
      <Pressable onPress={() => handleEdit(index)} style={{marginRight: 10}}>
        <Ionicons name="create-outline" size={20} color={COLORS.PRIMARY} />
      </Pressable>
      <Pressable onPress={() => handleDelete(index)}>
        <Ionicons name="trash-outline" size={20} color="red" />
      </Pressable>
    </View>,
  ]);

  const handleSubmitForm = async (values) => {
    try {
      const payload = {
        name: values.name,
        brand: values.brand || '',
        purchaseQuantity: parseFloat(values.purchaseQuantity) || 0,
        unit: values.unit,
        purchaseRate: parseFloat(values.purchaseRate) || 0,
        sellingRate: parseFloat(values.sellingRate) || 0,
      };

      if (editingIndex !== null && products[editingIndex]) {
        const productId = products[editingIndex].id;
        payload.id = productId;
        const response = await api.put(`/api/product/${productId}`, payload);
        const updatedProducts = [...products];
        if (response.data.success) {
          updatedProducts[editingIndex] = response.data.data;
          setProducts(updatedProducts);
          setFilteredProducts(updatedProducts);
          showToast('পণ্য আপডেট করা হয়েছে');
        } else {
          showToast('Failed to update', 'error');
        }
      } else {
        const response = await api.post('/api/product', payload);
        const updatedProducts = [...products, response.data.data];
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
        showToast('নতুন পণ্য যোগ করা হয়েছে');
      }
      setModalVisible(false);
      setEditingIndex(null);
    } catch (error) {
      showToast('পণ্য সংরক্ষণে ব্যর্থ', 'error');
    }
  };

  const getInitialValues = () => {
    if (editingIndex !== null && products[editingIndex]) {
      const product = products[editingIndex];
      return {
        name: product.name || '',
        brand: product.brand || '',
        purchaseQuantity: product.purchaseQuantity
          ? String(product.purchaseQuantity)
          : '',
        unit: product.unit || units[0],
        purchaseRate: product.purchaseRate ? String(product.purchaseRate) : '',
        sellingRate: product.sellingRate ? String(product.sellingRate) : '',
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
    <View style={{flex: 1, padding: 10}}>
      <View style={styles.headerContainer}>
        <Text style={styles.totalCount}>মোট পণ্য: {filteredProducts.length}</Text>
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

      {/* Search Box with Clear Icon */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="পণ্যের নাম দিয়ে অনুসন্ধান করুন"
          placeholderTextColor={COLORS.PLACEHOLDER_TEXT}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={clearSearch} style={styles.clearIcon}>
            <Ionicons name="close-circle" size={24} color="gray" />
          </Pressable>
        )}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>পণ্য লোড হচ্ছে...</Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <NoDataFound title="পণ্য" />
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
        title="পণ্য যোগ করুন"
        icon={{name: 'add', color: 'white'}}
        color={COLORS.PRIMARY}
        placement="right"
        style={{marginBottom: 50}}
        onPress={handleAddStock}
      />

      {/* Add/Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setEditingIndex(null);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {editingIndex !== null ? 'পণ্য আপডেট করুন' : 'নতুন পণ্য যোগ করুন'}
            </Text>
            <Formik
              initialValues={getInitialValues()}
              enableReinitialize={true}
              validationSchema={Yup.object({
                name: Yup.string().required('পণ্যের নাম আবশ্যক'),
                purchaseQuantity: Yup.number().required('পরিমাণ আবশ্যক'),
                unit: Yup.string().required('ইউনিট আবশ্যক'),
                purchaseRate: Yup.number().required('ক্রয় মূল্য আবশ্যক'),
                sellingRate: Yup.number().required('বিক্রয় মূল্য আবশ্যক'),
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
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="পণ্যের নাম"
                    placeholderTextColor={COLORS.PLACEHOLDER_TEXT}
                    value={values.name}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                  />
                  {touched.name && errors.name && (
                    <Text style={styles.error}>{errors.name}</Text>
                  )}

                  <View style={styles.quantityContainer}>
                    <TextInput
                      style={[styles.input, styles.quantityInput]}
                      placeholder="পরিমাণ"
                      placeholderTextColor={COLORS.PLACEHOLDER_TEXT} 
                      value={values.purchaseQuantity}
                      onChangeText={handleChange('purchaseQuantity')}
                      onBlur={handleBlur('purchaseQuantity')}
                      keyboardType="numeric"
                    />
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={values.unit}
                        style={styles.unitPicker}
                        onValueChange={(itemValue) =>
                          setFieldValue('unit', itemValue)
                        }
                        mode="dropdown">
                        {units.map((unit) => (
                          <Picker.Item key={unit} label={unit} value={unit} color="black" />
                        ))}
                      </Picker>
                    </View>
                  </View>
                  {touched.purchaseQuantity && errors.purchaseQuantity && (
                    <Text style={styles.error}>{errors.purchaseQuantity}</Text>
                  )}
                  {touched.unit && errors.unit && (
                    <Text style={styles.error}>{errors.unit}</Text>
                  )}

                  <TextInput
                    style={styles.input}
                    placeholder="ক্রয় মূল্য"
                    placeholderTextColor={COLORS.PLACEHOLDER_TEXT} 
                    value={values.purchaseRate}
                    onChangeText={handleChange('purchaseRate')}
                    onBlur={handleBlur('purchaseRate')}
                    keyboardType="numeric"
                  />
                  {touched.purchaseRate && errors.purchaseRate && (
                    <Text style={styles.error}>{errors.purchaseRate}</Text>
                  )}

                  <TextInput
                    style={styles.input}
                    placeholder="বিক্রয় মূল্য"
                    placeholderTextColor={COLORS.PLACEHOLDER_TEXT} 
                    value={values.sellingRate}
                    onChangeText={handleChange('sellingRate')}
                    onBlur={handleBlur('sellingRate')}
                    keyboardType="numeric"
                  />
                  {touched.sellingRate && errors.sellingRate && (
                    <Text style={styles.error}>{errors.sellingRate}</Text>
                  )}

                  <TextInput
                    style={styles.input}
                    placeholder="ব্র্যান্ড (ঐচ্ছিক)"
                    placeholderTextColor={COLORS.PLACEHOLDER_TEXT} 
                    value={values.brand}
                    onChangeText={handleChange('brand')}
                    onBlur={handleBlur('brand')}
                  />

                  <View style={styles.buttonContainer}>
                    <Pressable
                      style={[styles.button, {backgroundColor: 'gray'}]}
                      onPress={() => {
                        setModalVisible(false);
                        setEditingIndex(null);
                      }}>
                      <Text style={{color: 'white'}}>বাতিল</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.button, {backgroundColor: COLORS.PRIMARY}]}
                      onPress={handleSubmit}>
                      <Text style={{color: 'white'}}>
                        {editingIndex !== null ? 'আপডেট' : 'সংরক্ষণ করুন'}
                      </Text>
                    </Pressable>
                  </View>
                </>
              )}
            </Formik>
          </View>
        </View>
      </Modal>

      <DeleteModal
        visible={deleteModalVisible}
        onClose={() => {
          setDeleteModalVisible(false);
        }}
        onConfirm={handleDeleteConfirm}
        message="আপনি এই পণ্যটি মুছে ফেলতে চান?"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    paddingRight: 40, // Space for the clear icon
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  clearIcon: {
    position: 'absolute',
    right: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  quantityInput: {
    flex: 1,
    marginRight: 10,
    height: 50,
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
  },
  unitPicker: {
    height: 50,
    width: '100%',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  head: {
    height: 50,
    backgroundColor: COLORS.PRIMARY,
  },
  headText: {
    margin: 6,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  text: {
    margin: 6,
    textAlign: 'center',
    color: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});