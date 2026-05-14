import {SceneMap, TabView} from 'react-native-tab-view';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {Icon} from '@rneui/themed';
import IncomePlanScreen from './IncomePlanScreen';
import MyBudgetScreen from './MyBudgetScreen';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useState} from 'react';
import {useWindowDimensions} from 'react-native';

const renderScene = SceneMap({
  myBudget: MyBudgetScreen,
  incomePlan: IncomePlanScreen,
});

const routes = [
  {key: 'myBudget', title: 'আমার বাজেট'},
  {key: 'incomePlan', title: 'আয় পরিকল্পনা'},
];

export default function BudgetPlannerLandingScreen({navigation}) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const renderTabBar = props => (
    <View style={styles.toggleRow}>
      {props.navigationState.routes.map((route, i) => {
        const isActive = props.navigationState.index === i;
        return (
          <TouchableOpacity
            key={route.key}
            style={[
              styles.toggleTab,
              isActive ? styles.toggleTabActive : styles.toggleTabInactive,
            ]}
            onPress={() => props.jumpTo(route.key)}>
            <Text
              style={[styles.toggleText, isActive && styles.toggleTextActive]}>
              {route.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu" type="material" size={26} color="#2E3192" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PEDAL</Text>
        <TouchableOpacity onPress={() => navigation.navigate('HomeStack')}>
          <Icon name="home" type="material" size={26} color="#2E3192" />
        </TouchableOpacity>
      </View>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        lazy={true}
        swipeEnabled={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F8F9FF',
  },
  headerTitle: {
    color: '#2E3192',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#F0F0FB',
    borderRadius: 24,
    padding: 6,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  toggleTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  toggleTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 6},
    elevation: 3,
  },
  toggleTabInactive: {
    backgroundColor: 'transparent',
  },
  toggleText: {
    fontSize: 14,
    color: '#8A92B8',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#1D2A74',
    fontWeight: '700',
  },
});
