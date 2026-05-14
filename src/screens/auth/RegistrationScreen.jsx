import * as Yup from 'yup';

import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
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
import styles from '../../styles/RegistrationScreen.styles';

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

export default RegistrationScreen;
