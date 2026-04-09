import * as Yup from 'yup';

import {
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
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
import LinearGradient from 'react-native-linear-gradient';
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
      const response = await api.post('/token', {
        phone: phoneNumber,
      });

      if (response.data.statusCode === 200) {
        const {access_token, refresh_token, username, userEmail} =
          response.data;

        await AsyncStorage.setItem('access_token', access_token);
        await AsyncStorage.setItem('refresh_token', refresh_token);
        if (username) await AsyncStorage.setItem('user_name', username);
        if (userEmail) await AsyncStorage.setItem('user_email', userEmail);
        if (phoneNumber) await AsyncStorage.setItem('user_phone', phoneNumber);

        setIsAuthenticated(true);

        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Successfully Logged in.',
          visibilityTime: 2000,
        });
      } else if (response.data.statusCode === 401) {
        navigation.navigate('Registration');
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'You are not a registered user. Please register first',
          visibilityTime: 2000,
        });
      } else {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Something went wrong. Please try again.',
          visibilityTime: 2000,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: error.message,
        visibilityTime: 2000,
      });
    }
  };

  // Called when Login button is pressed — opens modal instead of logging in directly
  const openReferenceModal = (values, {setSubmitting} = {}) => {
    if (setSubmitting) setSubmitting(false); // prevent Formik from staying in "Sending..." state
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
      .matches(
        /^01[3-9][0-9]{8}$/,
        'Must be a valid Bangladeshi number (e.g., 01712345678)',
      )
      .required('Phone number is required'),
  });

  const handleSignUpPress = () => {
    navigation.navigate('Registration');
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <View style={styles.formContainer}>
          <Text style={styles.header}>Welcome</Text>
          <Text style={styles.subheader}>
            Sign in with your Bangladeshi phone
          </Text>

          <Formik
            initialValues={{phoneNumber: ''}}
            validationSchema={validationSchema}
            onSubmit={openReferenceModal}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      touched.phoneNumber &&
                        errors.phoneNumber &&
                        styles.inputError,
                    ]}
                    placeholder="01XXXXXXXXX"
                    placeholderTextColor="#8b9cb5"
                    onChangeText={handleChange('phoneNumber')}
                    onBlur={handleBlur('phoneNumber')}
                    value={values.phoneNumber}
                    keyboardType="phone-pad"
                    maxLength={11}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {touched.phoneNumber && errors.phoneNumber && (
                    <Text style={styles.error}>{errors.phoneNumber}</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting}>
                  <LinearGradient
                    colors={['#00d4ff', '#007bff']}
                    style={styles.button}>
                    <Text style={styles.buttonText}>
                      {isSubmitting ? 'Sending...' : 'Login'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Guest login button */}
                {/* <TouchableOpacity
                  style={styles.guestButtonContainer}
                  onPress={() => openReferenceModal({phoneNumber: '01700000000'})}>
                  <LinearGradient
                    colors={['#ffffff', '#dfefff']}
                    style={styles.guestButton}>
                    <Text style={styles.guestButtonText}>Continue as Guest</Text>
                  </LinearGradient>
                </TouchableOpacity> */}
              </>
            )}
          </Formik>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              New user?{' '}
              <Text style={styles.signupText} onPress={handleSignUpPress}>
                Sign Up
              </Text>
            </Text>
          </View>
          <View style={styles.betaContainer}>
            <Text style={styles.betaText}>Beta Version</Text>
          </View>
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

            {/* Drag handle */}
            <View style={styles.modalHandle} />

            {/* Icon */}
            <View style={styles.modalIconWrapper}>
              <Text style={styles.modalIcon}>🔑</Text>
            </View>

            <Text style={styles.modalTitle}>রেফারেন্স কোড</Text>
            <Text style={styles.modalHint}>
              আপনার রেফারেন্স কোডটি প্রবেশ করুন
            </Text>

            {/* Input */}
            <View style={styles.modalInputWrapper}>
              <TextInput
                style={[
                  styles.modalInput,
                  referenceError ? styles.inputError : null,
                ]}
                placeholder="Reference Code"
                placeholderTextColor="#aab8cc"
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
                  onPress={() => {
                    setReferenceCode('');
                    setReferenceError('');
                  }}>
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

            {/* Login button */}
            <TouchableOpacity
              style={styles.modalSubmitButton}
              onPress={handleReferenceSubmit}>
              <LinearGradient
                colors={['#00d4ff', '#007bff']}
                style={styles.button}>
                <Text style={styles.buttonText}>লগইন করুন</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Cancel */}
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancelText}>বাতিল করুন</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Contact for Reference Code</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Branch info - non tappable */}
            <View style={styles.contactRow}>
              <Text style={styles.contactCardIcon}>🏢</Text>
              <Text style={styles.contactCardLabel}>নিকটস্থ ব্রাঞ্চে যোগাযোগ করুন</Text>
            </View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>অথবা</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Phone number - tappable */}
            <TouchableOpacity
              style={styles.contactCard}
              onPress={() => Linking.openURL('tel:01774455906')}
              activeOpacity={0.7}>
              <View style={styles.contactCardLeft}>
                <Text style={styles.contactCardIcon}>📞</Text>
                <View>
                  <Text style={styles.contactCardLabel}>নিচের নাম্বার এ যোগাযোগ</Text>
                  <Text style={styles.contactCardNumber}>01774455906</Text>
                </View>
              </View>
              <Text style={styles.contactCardArrow}>›</Text>
            </TouchableOpacity>

          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  header: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 18,
    color: '#d1d8e0',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  error: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  guestButtonContainer: {
    width: '100%',
    marginTop: 12,
  },
  guestButton: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cfe6ff',
  },
  guestButtonText: {
    color: '#0077cc',
    fontSize: 16,
    fontWeight: '600',
  },
  footerContainer: {
    marginTop: 30,
  },
  footerText: {
    color: '#d1d8e0',
    fontSize: 16,
  },
  signupText: {
    color: '#00d4ff',
    fontWeight: '600',
  },
  betaContainer: {
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  betaText: {
    fontSize: 12,
    color: '#ffffffaa',
    fontStyle: 'italic',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 36,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },
  modalHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#dde3ec',
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalIconWrapper: {
    alignSelf: 'center',
    backgroundColor: '#eef5ff',
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
    fontWeight: '700',
    color: '#192f6a',
    textAlign: 'center',
    marginBottom: 6,
  },
  modalHint: {
    fontSize: 14,
    color: '#7a8ea8',
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
    padding: 15,
    paddingRight: 44,
    backgroundColor: '#f4f7fc',
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1.5,
    borderColor: '#dde6f5',
  },
  clearButton: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#aab8cc',
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
  modalSubmitButton: {
    width: '100%',
    marginTop: 18,
  },
  modalCancelButton: {
    marginTop: 12,
    alignItems: 'center',
    padding: 10,
  },
  modalCancelText: {
    color: '#9aaabb',
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
    backgroundColor: '#e8edf5',
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 13,
    color: '#aab8cc',
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
    backgroundColor: '#f0f7ff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#cfe2ff',
  },
  contactCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactCardIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  contactCardLabel: {
    fontSize: 13,
    color: '#5a7a9a',
    marginBottom: 2,
  },
  contactCardNumber: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0077cc',
    letterSpacing: 0.5,
  },
  contactCardArrow: {
    fontSize: 26,
    color: '#0077cc',
    fontWeight: '300',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default LoginScreen;