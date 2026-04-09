import {StyleSheet} from 'react-native';
import {COLORS} from './colors';

export const tabStyles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.WHITE_SMOKE,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  tabItemFocused: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.PRIMARY,
  },
  tabLabel: {
    fontSize: 12,
    color: COLORS.GRAY,
    marginTop: 4,
  },
  tabLabelFocused: {
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
});
