import {SceneMap, TabView} from 'react-native-tab-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, {useState} from 'react';
import {useWindowDimensions} from 'react-native';

import IncomePlanScreen from './IncomePlanScreen';
import MyBudgetScreen from './MyBudgetScreen';
import ScreenHeader from '../../components/common/ScreenHeader';
import SegmentedTabBar from '../../components/common/SegmentedTabBar';
import styles from '../../styles/BudgetPlannerLandingScreen.styles';

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
