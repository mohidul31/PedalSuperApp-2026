import {StyleSheet} from 'react-native';
import {COLORS} from './colors';

export const underConstructionStyle = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
      paddingHorizontal: 20,
    },
    screenTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 20,
      color: 'green',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 20,
      color: '#333',
    },
    subtitle: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginVertical: 10,
    },
    button: {
      marginTop: 20,
      backgroundColor: COLORS.PRIMARY,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
    },
  });
