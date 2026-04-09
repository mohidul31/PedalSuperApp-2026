import {SceneMap, TabView} from 'react-native-tab-view';

import {COLORS} from '../../../styles/colors';
import CustomTabBar from '../../../components/CustomTabBar';
import {Header} from '@rneui/themed';
import IncomePlanScreen from './IncomePlanScreen';
import MyBudgetScreen from './MyBudgetScreen';
import SummaryScreen from './SummaryScreen';
import {useState} from 'react';
import {useWindowDimensions} from 'react-native';

const renderScene = SceneMap({
  myBudget: MyBudgetScreen,
  incomePlan: IncomePlanScreen,
  summary: SummaryScreen,
});

const routes = [
  {key: 'myBudget', title: 'আমার বাজেট', icon: 'home'},
  {key: 'incomePlan', title: 'আয় পরিকল্পনা', icon: 'cart'},
  {key: 'summary', title: 'সামারি', icon: 'logo-ionic'},
];

export default function BudgetPlannerLandingScreen({navigation}) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  return (
    <>
      <Header
        barStyle="default"
        centerComponent={{
          text: 'গ্রামীণ বাজেট সহায়ক',
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
