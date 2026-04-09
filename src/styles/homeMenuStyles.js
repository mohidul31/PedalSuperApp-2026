import {COLORS} from './colors';
import {StyleSheet} from 'react-native';

export const homeMenuStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  searchBar: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 15,
    marginBottom: 20,
    fontSize: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
  },
  cardWrapper: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
  },
  card: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY,
    shadowColor: '#000',
    elevation: 6,
    shadowOpacity: 0.2,
    shadowOffset: {width: 1, height: 3},
    shadowRadius: 6,
  },
  disabledCard: {
    backgroundColor: '#A9A9A9',
    opacity: 0.6,
  },
  text: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});
