import * as Yup from 'yup';

import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';

import {Formik} from 'formik';
import {Icon} from '@rneui/themed';
import Toast from 'react-native-toast-message';
import api from '../../api';
import {useNavigation} from '@react-navigation/native';

const RegistrationScreen = () => {
  const navigation = useNavigation();
  const [submissionError, setSubmissionError] = useState('');

  const handleSignUp = async values => {
    try {
      setSubmissionError('');
      const {name, phoneNumber, email} = values;
      const response = await api.post('/api/User', {
        name,
        phone: phoneNumber,
        email,
      });
      if (response.data.success) {
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Successfully Registered. Now Please Login',
          visibilityTime: 2000,
        });
        navigation.navigate('Login');
      } else {
        setSubmissionError('This number is already registered. Please login with the number');
      }
    } catch (error) {
      setSubmissionError('Registration failed. Please try again');
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .required('Name is required'),
    phoneNumber: Yup.string()
      .matches(/^01[3-9][0-9]{8}$/, 'Must be a valid Bangladeshi number (e.g., 01712345678)')
      .required('Phone number is required'),
    email: Yup.string().email('Invalid email address'),
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.brandArea}>
            <Text style={styles.brandTitle}>PEDAL</Text>
            <Text style={styles.brandSubtitle}>একাউন্ট তৈরি করুন</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>নিবন্ধন করুন</Text>
            <Text style={styles.cardSubtitle}>আপনার তথ্য দিয়ে সাইন আপ করুন</Text>

            <Formik
              initialValues={{name: '', phoneNumber: '', email: ''}}
              validationSchema={validationSchema}
              onSubmit={handleSignUp}>
              {({handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting}) => (
                <>
                  <View style={styles.inputWrapper}>
                    <Icon name="person" type="material" size={18} color="#6F759B" style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, touched.name && errors.name && styles.inputError]}
                      placeholder="পূর্ণ নাম"
                      placeholderTextColor="#A0A8C0"
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      value={values.name}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  </View>
                  {touched.name && errors.name && (
                    <Text style={styles.error}>{errors.name}</Text>
                  )}

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

                  <View style={styles.inputWrapper}>
                    <Icon name="email" type="material" size={18} color="#6F759B" style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, touched.email && errors.email && styles.inputError]}
                      placeholder="ইমেইল (ঐচ্ছিক)"
                      placeholderTextColor="#A0A8C0"
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                  {touched.email && errors.email && (
                    <Text style={styles.error}>{errors.email}</Text>
                  )}

                  {submissionError ? (
                    <Text style={styles.submissionError}>{submissionError}</Text>
                  ) : null}

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting}
                    activeOpacity={0.85}>
                    <Text style={styles.buttonText}>
                      {isSubmitting ? 'নিবন্ধন হচ্ছে...' : 'নিবন্ধন করুন'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              ইতিমধ্যে একাউন্ট আছে?{' '}
              <Text style={styles.footerLink} onPress={() => navigation.navigate('Login')}>
                লগইন করুন
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  brandArea: {
    alignItems: 'center',
    marginBottom: 36,
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
  submissionError: {
    color: '#FF4444',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '500',
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
  },
  footerText: {
    fontSize: 15,
    color: '#6F759B',
  },
  footerLink: {
    color: '#2E3192',
    fontWeight: '700',
  },
});

export default RegistrationScreen;
