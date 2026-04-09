import {FlatList, TextInput, TouchableOpacity, View} from 'react-native';
import {Header, Icon, Text} from '@rneui/themed';

import {COLORS} from '../../styles/colors';
import LinearGradient from 'react-native-linear-gradient';
import React from 'react';
import Toast from 'react-native-toast-message';
import {homeMenuStyles} from '../../styles/homeMenuStyles';
import menuItems from '../../data/menuItems';
import {useNavigation} from '@react-navigation/native';

export default function HomeScreen({navigation}) {
  return (
    <>
      <Header
        barStyle="default"
        centerComponent={{
          text: '🚴 Pedal Superapp',
          style: {
            color: COLORS.WHITE,
            fontSize: 22,
            fontWeight: 'bold',
            letterSpacing: 1,
          },
        }}
        leftComponent={{
          icon: 'menu',
          color: COLORS.WHITE,
          onPress: () => navigation.openDrawer(),
        }}
        rightComponent={{
          text: 'Beta',
          style: {
            color: 'black',
            fontSize: 14,
            fontWeight: 'bold',
            backgroundColor: 'cyan',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
          },
        }}
        placement="center"
        backgroundColor={COLORS.PRIMARY}
      />
      <LinearGradient
        colors={['#F5F7FA', '#E8ECF4']}
        style={homeMenuStyles.container}>
        <TextInput
          placeholder="🔍 অনুসন্ধান করুন"
          style={homeMenuStyles.searchBar}
          placeholderTextColor="#999"
        />

        <FlatList
          data={menuItems}
          keyExtractor={item => item.title}
          numColumns={3}
          renderItem={({item}) => (
            <MenuCard
              title={item.title}
              icon={item.icon}
              type={item.type}
              screen={item.screen}
            />
          )}
        />
      </LinearGradient>
    </>
  );
}

const MenuCard = ({title, icon, type, screen}) => {
  const navigation = useNavigation();
  const isDisabled = !screen;

  return (
    <View style={homeMenuStyles.cardWrapper}>
      <TouchableOpacity
        activeOpacity={isDisabled ? 1 : 0.7}
        style={[
          homeMenuStyles.card,
          isDisabled && homeMenuStyles.disabledCard,
        ]}
        onPress={() => {
          if (isDisabled) {
            Toast.show({
              type: 'error',
              position: 'bottom',
              text1: '🚧 This feature is under development',
              visibilityTime: 2000,
            });
          } else {
            navigation.navigate(screen);
          }
        }}>
        <Icon name={icon} type={type} size={32} color="#fff" />
      </TouchableOpacity>
      <Text style={homeMenuStyles.text}>{title}</Text>
    </View>
  );
};
