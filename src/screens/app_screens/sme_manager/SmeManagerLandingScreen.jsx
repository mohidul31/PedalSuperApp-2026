import {useState} from 'react';
import {Header} from '@rneui/themed';
import {TabView, SceneMap} from 'react-native-tab-view';
import {useWindowDimensions} from 'react-native';
import SellScreen from './SellScreen';
import StockManagerScreen from './StockManagerScreen';
import CustomTabBar from '../../../components/CustomTabBar';
import {COLORS} from '../../../styles/colors';
import SMEDashboardScreen from './SMEDashboardScreen';

const renderScene = SceneMap({
  home: SMEDashboardScreen,
  sell: SellScreen,
  stockManager: StockManagerScreen,
});

const routes = [
  {key: 'home', title: 'হোম', icon: 'home'},
  {key: 'sell', title: 'বিক্রয়', icon: 'cart'},
  {key: 'stockManager', title: 'স্টক ম্যানেজার', icon: 'logo-ionic'},
];

export default function SmeManagerLandingScreen({navigation}) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  return (
    <>
      <Header
        barStyle="default"
        centerComponent={{
          text: 'হিসাব রক্ষণ অ্যাপ',
          style: {color: COLORS.WHITE, fontSize: 20, fontWeight: 'bold'},
        }}
        leftComponent={{
          icon: 'menu',
          color: COLORS.WHITE,
          onPress: () => navigation.openDrawer(),
        }}
        placement="center"
        rightComponent={{
          icon: 'home',
          color: COLORS.WHITE,
          onPress: () => navigation.navigate('HomeStack'),
        }}
        backgroundColor={COLORS.PRIMARY}
      />
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        renderTabBar={CustomTabBar}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        lazy={true}
        swipeEnabled={true}
      />
    </>
  );
}
