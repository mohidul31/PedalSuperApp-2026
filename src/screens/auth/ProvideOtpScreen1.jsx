import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import styles from '../../styles/ProvideOtpScreen.styles';

const ProvideOtpScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {phoneNumber} = route.params || {};

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleVerifyOTP = () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Error', 'Please enter a complete 6-digit OTP');
      return;
    }
    Alert.alert('Success', 'OTP verified successfully! ' + otpString, [
      {text: 'OK', onPress: () => navigation.navigate('HomeStack')},
    ]);
  };

  const handleResendOTP = () => {
    Alert.alert('Success', `OTP resent to ${phoneNumber || 'your phone number'}`);
  };

  const handleChangeText = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) inputRefs.current[index + 1].focus();
    if (!text && index > 0) inputRefs.current[index - 1].focus();
  };

  const handleKeyPress = ({nativeEvent}, index) => {
    if (nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <View style={styles.inner}>
          <View style={styles.brandArea}>
            <Text style={styles.brandTitle}>PEDAL</Text>
            <Text style={styles.brandSubtitle}>OTP যাচাই করুন</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>কোড প্রবেশ করুন</Text>
            <Text style={styles.cardSubtitle}>
              {phoneNumber || 'আপনার ফোনে'} পাঠানো ৬-সংখ্যার কোডটি দিন
            </Text>

            <View style={styles.otpRow}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => (inputRefs.current[index] = ref)}
                  style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                  placeholder="—"
                  placeholderTextColor="#C0C8E0"
                  onChangeText={text => handleChangeText(text, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
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
              style={styles.button}
              onPress={handleVerifyOTP}
              activeOpacity={0.85}>
              <Text style={styles.buttonText}>যাচাই করুন</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              কোড পাননি?{' '}
              <Text style={styles.footerLink} onPress={handleResendOTP}>
                পুনরায় পাঠান
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProvideOtpScreen;
