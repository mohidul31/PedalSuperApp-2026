import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  wrapper: {
    backgroundColor: '#F8F9FF',
    paddingTop: 4,
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'flex-end',
    shadowColor: '#2E3192',
    shadowOpacity: 0.14,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 6},
    elevation: 14,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  iconBox: {
    width: 42,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxActive: {
    backgroundColor: '#2E3192',
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: '#A0A8C0',
  },
  labelActive: {
    color: '#2E3192',
    fontWeight: '700',
  },
  centerTab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  centerBtn: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    shadowColor: '#2E3192',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    elevation: 10,
  },
});
