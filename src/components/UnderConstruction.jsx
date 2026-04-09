import {Button, Icon} from '@rneui/themed';
import React from 'react';
import {View, Text} from 'react-native';
import {underConstructionStyle} from '../styles/underConstructionStyle';

export default function UnderConstruction({title}) {
  return (
    <View style={underConstructionStyle.container}>
      <Text style={underConstructionStyle.screenTitle}>{title}</Text>
      <Icon name="construction" type="material" size={100} color="#f39c12" />

      {/* Text */}
      <Text style={underConstructionStyle.title}>Under Construction 🚧</Text>
      <Text style={underConstructionStyle.subtitle}>
        We are working hard to bring something amazing for you!
      </Text>

      {/* Back Button */}
      {/* <Button
        title="Back to Home"
        buttonStyle={underConstructionStyle.button}
        onPress={() => navigation.navigate('Home')}
        icon={
          <Icon
            name="HomeScreen"
            type="material"
            color="#fff"
            size={20}
            style={{marginRight: 10}}
          />
        }
      /> */}
    </View>
  );
}
