import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: '#F0F0FB',
    borderRadius: 24,
    padding: 6,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 6},
    elevation: 3,
  },
  tabInactive: {
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 14,
    color: '#8A92B8',
    fontWeight: '600',
  },
  labelActive: {
    color: '#1D2A74',
    fontWeight: '700',
  },
});
