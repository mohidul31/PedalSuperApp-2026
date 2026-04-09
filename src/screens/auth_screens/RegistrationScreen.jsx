import * as Yup from 'yup';

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';

import {Formik} from 'formik';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import api from '../../api';
import {useNavigation} from '@react-navigation/native';

const RegistrationScreen = () => {
  const navigation = useNavigation();
  const [submissionError, setSubmissionError] = useState('');

  const handleSignUp = async values => {
    try {
      setSubmissionError(''); // Clear any previous errors
      const {name, phoneNumber, email} = values;
      const response = await api.post('/api/User', {
        name: name,
        phone: phoneNumber,
        email: email,
      });
      if (response.data.success) {
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Successfully Registered. Now Please Login',
          visibilityTime: 2000, // Duration in milliseconds
        });
        navigation.navigate('Login');
      } else {
        setSubmissionError(
          'This number is already registered. Please login with the number',
        );
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
      .matches(
        /^01[3-9][0-9]{8}$/,
        'Must be a valid Bangladeshi number (e.g., 01712345678)',
      )
      .required('Phone number is required'),
    email: Yup.string().email('Invalid email address'),
  });

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.header}>Create Account</Text>
            <Text style={styles.subheader}>Join us with your details</Text>

            <Formik
              initialValues={{name: '', phoneNumber: '', email: ''}}
              validationSchema={validationSchema}
              onSubmit={handleSignUp}>
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
                        touched.name && errors.name && styles.inputError,
                      ]}
                      placeholder="Full Name"
                      placeholderTextColor="#8b9cb5"
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      value={values.name}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                    {touched.name && errors.name && (
                      <Text style={styles.error}>{errors.name}</Text>
                    )}
                  </View>

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

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={[
                        styles.input,
                        touched.email && errors.email && styles.inputError,
                      ]}
                      placeholder="Email Address (Optional)"
                      placeholderTextColor="#8b9cb5"
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    {touched.email && errors.email && (
                      <Text style={styles.error}>{errors.email}</Text>
                    )}
                  </View>

                  {submissionError ? (
                    <Text style={styles.submissionError}>
                      {submissionError}
                    </Text>
                  ) : null}

                  <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting}>
                    <LinearGradient
                      colors={['#00d4ff', '#007bdf']}
                      style={styles.button}>
                      <Text style={styles.buttonText}>
                        {isSubmitting ? 'Registering...' : 'Register'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}
            </Formik>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>
                Already have an account?{' '}
                <Text style={styles.loginText} onPress={handleLoginPress}>
                  Login
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    padding: 30,
    alignItems: 'center',
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
  submissionError: {
    color: '#ff4444',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '500',
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
  footerContainer: {
    marginTop: 30,
  },
  footerText: {
    color: '#d1d8e0',
    fontSize: 16,
  },
  loginText: {
    color: '#00d4ff',
    fontWeight: '600',
  },
});

export default RegistrationScreen;
