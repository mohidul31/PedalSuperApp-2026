import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useRef, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import LinearGradient from 'react-native-linear-gradient';

const ProvideOTPScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber } = route.params || {};

  const [otp, setOtp] = useState(['', '', '', '', '', '']); // Array for 6 digits
  const inputRefs = useRef([]); // Refs for focusing each input

  const handleVerifyOTP = () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Error', 'Please enter a complete 6-digit OTP');
      return;
    }
    Alert.alert('Success', 'OTP verified successfully!'+otpString, [
      { text: 'OK', onPress: () => navigation.navigate('HomeStack') }
    ]);
  };

  const handleResendOTP = () => {
    Alert.alert('Success', `OTP resent to ${phoneNumber || 'your phone number'}`);
  };

  const handleChangeText = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move focus to next input if a digit is entered
    if (text && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    // Move focus to previous input if deleting
    if (!text && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.formContainer}>
          <Text style={styles.header}>Verify OTP</Text>
          <Text style={styles.subheader}>
            Enter the 6-digit code sent to {phoneNumber || 'your phone'}
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={styles.otpInput}
                placeholder="-"
                placeholderTextColor="#8b9cb5"
                onChangeText={(text) => handleChangeText(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                value={digit}
                keyboardType="numeric"
                maxLength={1}
                autoCapitalize="none"
                autoCorrect={false}
                textAlign="center"
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleVerifyOTP}
          >
            <LinearGradient
              colors={['#00d4ff', '#007bff']}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Verify</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              Didn’t receive the code?{' '}
              <Text 
                style={styles.resendText} 
                onPress={handleResendOTP}
              >
                Resend OTP
              </Text>
            </Text>
          </View>
        </View>
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    fontSize: 20,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    textAlign: 'center',
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
    shadowOffset: { width: 0, height: 4 },
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
  resendText: {
    color: '#00d4ff',
    fontWeight: '600',
  },
});

export default ProvideOTPScreen;