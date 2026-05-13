import * as Yup from 'yup';

import {
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useRef, useState} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../../context/AuthContext.js';
import {Formik} from 'formik';
import {Icon} from '@rneui/themed';
import Toast from 'react-native-toast-message';
import api from '../../api/index.js';
import {useNavigation} from '@react-navigation/native';

const VALID_REFERENCE_CODES = ['Pedal2024', 'Pedalapp24', 'Pedalapp25'];

const LoginScreen = () => {
  const navigation = useNavigation();
  const {setIsAuthenticated} = useContext(AuthContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [referenceCode, setReferenceCode] = useState('');
  const [referenceError, setReferenceError] = useState('');
  const pendingValuesRef = useRef(null);

  const handleLogin = async values => {
    try {
      const {phoneNumber} = values;
      const response = await api.post('/token', {phone: phoneNumber});

      if (response.data.statusCode === 200) {
        const {access_token, refresh_token, username, userEmail} = response.data;
        await AsyncStorage.setItem('access_token', access_token);
        await AsyncStorage.setItem('refresh_token', refresh_token);
        if (username) await AsyncStorage.setItem('user_name', username);
        if (userEmail) await AsyncStorage.setItem('user_email', userEmail);
        if (phoneNumber) await AsyncStorage.setItem('user_phone', phoneNumber);
        setIsAuthenticated(true);
        Toast.show({type: 'success', position: 'bottom', text1: 'Successfully Logged in.', visibilityTime: 2000});
      } else if (response.data.statusCode === 401) {
        navigation.navigate('Registration');
        Toast.show({type: 'success', position: 'bottom', text1: 'You are not a registered user. Please register first', visibilityTime: 2000});
      } else {
        Toast.show({type: 'error', position: 'bottom', text1: 'Something went wrong. Please try again.', visibilityTime: 2000});
      }
    } catch (error) {
      Toast.show({type: 'error', position: 'bottom', text1: error.message, visibilityTime: 2000});
    }
  };

  const openReferenceModal = (values, {setSubmitting} = {}) => {
    if (setSubmitting) setSubmitting(false);
    pendingValuesRef.current = values;
    setReferenceCode('');
    setReferenceError('');
    setModalVisible(true);
  };

  const handleReferenceSubmit = () => {
    if (VALID_REFERENCE_CODES.includes(referenceCode.trim())) {
      setModalVisible(false);
      handleLogin(pendingValuesRef.current);
    } else {
      setReferenceError('Invalid reference code. Please try again.');
    }
  };

  const validationSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .matches(/^01[3-9][0-9]{8}$/, 'Must be a valid Bangladeshi number (e.g., 01712345678)')
      .required('Phone number is required'),
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <View style={styles.inner}>
          <View style={styles.brandArea}>
            <Text style={styles.brandTitle}>PEDAL</Text>
            <Text style={styles.brandSubtitle}>স্বাগতম আপনাকে</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>লগইন করুন</Text>
            <Text style={styles.cardSubtitle}>আপনার ফোন নম্বর দিয়ে প্রবেশ করুন</Text>

            <Formik
              initialValues={{phoneNumber: ''}}
              validationSchema={validationSchema}
              onSubmit={openReferenceModal}>
              {({handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting}) => (
                <>
                  <View style={styles.inputWrapper}>
                    <Icon name="phone" type="material" size={18} color="#6F759B" style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, touched.phoneNumber && errors.phoneNumber && styles.inputError]}
                      placeholder="01XXXXXXXXX"
                      placeholderTextColor="#A0A8C0"
                      onChangeText={handleChange('phoneNumber')}
                      onBlur={handleBlur('phoneNumber')}
                      value={values.phoneNumber}
                      keyboardType="phone-pad"
                      maxLength={11}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                  {touched.phoneNumber && errors.phoneNumber && (
                    <Text style={styles.error}>{errors.phoneNumber}</Text>
                  )}

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting}
                    activeOpacity={0.85}>
                    <Text style={styles.buttonText}>
                      {isSubmitting ? 'অপেক্ষা করুন...' : 'লগইন করুন'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              নতুন ব্যবহারকারী?{' '}
              <Text style={styles.footerLink} onPress={() => navigation.navigate('Registration')}>
                সাইন আপ করুন
              </Text>
            </Text>
          </View>

          <Text style={styles.betaText}>Beta Version</Text>
        </View>
      </KeyboardAvoidingView>

      {/* Reference Code Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.modalContainer}>
            <View style={styles.modalHandle} />

            <View style={styles.modalIconWrapper}>
              <Text style={styles.modalIcon}>🔑</Text>
            </View>

            <Text style={styles.modalTitle}>রেফারেন্স কোড</Text>
            <Text style={styles.modalHint}>আপনার রেফারেন্স কোডটি প্রবেশ করুন</Text>

            <View style={styles.modalInputWrapper}>
              <TextInput
                style={[styles.modalInput, referenceError ? styles.inputError : null]}
                placeholder="Reference Code"
                placeholderTextColor="#A0A8C0"
                value={referenceCode}
                onChangeText={text => {
                  setReferenceCode(text);
                  setReferenceError('');
                }}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {referenceCode.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => {setReferenceCode(''); setReferenceError('');}}>
                  <Text style={styles.clearButtonText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {referenceError ? (
              <View style={styles.errorRow}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.error}>{referenceError}</Text>
              </View>
            ) : null}

            <TouchableOpacity style={styles.modalButton} onPress={handleReferenceSubmit} activeOpacity={0.85}>
              <Text style={styles.buttonText}>লগইন করুন</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancelText}>বাতিল করুন</Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Contact for Reference Code</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.contactRow}>
              <Text style={styles.contactIcon}>🏢</Text>
              <Text style={styles.contactLabel}>নিকটস্থ ব্রাঞ্চে যোগাযোগ করুন</Text>
            </View>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>অথবা</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.contactCard}
              onPress={() => Linking.openURL('tel:01774455906')}
              activeOpacity={0.7}>
              <View style={styles.contactCardLeft}>
                <Text style={styles.contactIcon}>📞</Text>
                <View>
                  <Text style={styles.contactLabel}>নিচের নাম্বার এ যোগাযোগ</Text>
                  <Text style={styles.contactNumber}>01774455906</Text>
                </View>
              </View>
              <Text style={styles.contactArrow}>›</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  keyboardView: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  brandArea: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brandTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#2E3192',
    letterSpacing: 3,
  },
  brandSubtitle: {
    fontSize: 16,
    color: '#6F759B',
    marginTop: 6,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: 6},
    elevation: 6,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#17173C',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6F759B',
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F7FC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E4E9F5',
    paddingHorizontal: 14,
    marginBottom: 6,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#17173C',
  },
  inputError: {
    borderColor: '#FF4444',
  },
  error: {
    color: '#FF4444',
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#2E3192',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 18,
    elevation: 4,
    shadowColor: '#2E3192',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  footerText: {
    fontSize: 15,
    color: '#6F759B',
  },
  footerLink: {
    color: '#2E3192',
    fontWeight: '700',
  },
  betaText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#B0B8D0',
    fontStyle: 'italic',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 36,
    paddingTop: 12,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  modalHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDE3EC',
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalIconWrapper: {
    alignSelf: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 50,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalIcon: {
    fontSize: 28,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#17173C',
    textAlign: 'center',
    marginBottom: 6,
  },
  modalHint: {
    fontSize: 14,
    color: '#6F759B',
    textAlign: 'center',
    marginBottom: 22,
  },
  modalInputWrapper: {
    position: 'relative',
    width: '100%',
    marginBottom: 6,
  },
  modalInput: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    paddingRight: 44,
    backgroundColor: '#F4F7FC',
    borderRadius: 14,
    fontSize: 16,
    color: '#17173C',
    borderWidth: 1.5,
    borderColor: '#E4E9F5',
  },
  clearButton: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    padding: 4,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#A0A8C0',
    fontWeight: '600',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    marginLeft: 2,
  },
  errorIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  modalButton: {
    backgroundColor: '#2E3192',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 18,
    elevation: 4,
    shadowColor: '#2E3192',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
  },
  modalCancelButton: {
    marginTop: 12,
    alignItems: 'center',
    padding: 10,
  },
  modalCancelText: {
    color: '#A0A8C0',
    fontSize: 15,
    fontWeight: '500',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8EDF5',
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
    color: '#A0A8C0',
    fontWeight: '500',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#C7D0F0',
  },
  contactCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  contactLabel: {
    fontSize: 13,
    color: '#6F759B',
    marginBottom: 2,
  },
  contactNumber: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2E3192',
    letterSpacing: 0.5,
  },
  contactArrow: {
    fontSize: 26,
    color: '#2E3192',
    fontWeight: '300',
  },
});

export default LoginScreen;
