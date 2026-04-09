import {Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function SplashScreen() {
  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Hello, Pedal App Splash Screen</Text>
    </SafeAreaView>
  );
}
