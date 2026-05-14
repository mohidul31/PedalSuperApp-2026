import {SceneMap, TabView} from 'react-native-tab-view';
import {SafeAreaView} from 'react-native';
import React, {useState} from 'react';
import {useWindowDimensions} from 'react-native';

import SMEDashboardScreen from './SMEDashboardScreen';
import ScreenHeader from '../../components/common/ScreenHeader';
import SegmentedTabBar from '../../components/common/SegmentedTabBar';
import SellScreen from './SellScreen';
import StockManagerScreen from './StockManagerScreen';
import styles from '../../styles/SmeManagerLandingScreen.styles';

const renderScene = SceneMap({
  home: SMEDashboardScreen,
  sell: SellScreen,
  stockManager: StockManagerScreen,
});

const routes = [
  {key: 'home', title: 'হোম'},
  {key: 'sell', title: 'বিক্রয়'},
  {key: 'stockManager', title: 'স্টক ম্যানেজার'},
];

export default function SmeManagerLandingScreen({navigation}) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader navigation={navigation} />
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        renderTabBar={props => <SegmentedTabBar {...props} />}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        lazy={true}
        swipeEnabled={true}
      />
    </SafeAreaView>
  );
}
