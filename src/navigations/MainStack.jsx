import {Text, View} from 'react-native';

import BudgetPlannerLandingScreen from '../screens/app_screens/budget_planner/BudgetPlannerLandingScreen';
import CustomDrawer from './CustomDrawer';
import HomeTabs from './HomeTabs';
import React from 'react';
import SmeManagerLandingScreen from '../screens/app_screens/sme_manager/SmeManagerLandingScreen';
import UnderConstruction from '../components/UnderConstruction';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const SmeManagerStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="SMELanding" component={SmeManagerLandingScreen} />
  </Stack.Navigator>
);

const BudgetPlanStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="BudgetLanding" component={BudgetPlannerLandingScreen} />
  </Stack.Navigator>
);

export default function MainStack() {
  return (
    <Drawer.Navigator
      initialRouteName="HomeStack"
      screenOptions={{headerShown: false}}
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen name="HomeStack" component={HomeTabs} />
      <Drawer.Screen name="BudgetPlanStack" component={BudgetPlanStack} />
      <Drawer.Screen name="SmeManagerStack" component={SmeManagerStack} />
      <Drawer.Screen name="UnderConstruction" component={UnderConstruction} />
    </Drawer.Navigator>
  );
}
