import * as Yup from 'yup';

import {
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
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
import styles from '../../styles/LoginScreen.styles';

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

export default LoginScreen;
