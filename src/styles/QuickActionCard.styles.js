import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  card: {
    width: '48%',
    minHeight: 104,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    elevation: 3,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#17173C',
  },
});
