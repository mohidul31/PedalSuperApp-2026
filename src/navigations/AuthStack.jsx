import {Text, View} from 'react-native';

import LoginScreen from '../screens/auth_screens/LoginScreen';
import ProvideOTPScreen from '../screens/auth_screens/ProvideOTPScreen';
import React from 'react';
import RegistrationScreen from '../screens/auth_screens/RegistrationScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ProvideOTP" component={ProvideOTPScreen} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
    </Stack.Navigator>
  );
}
