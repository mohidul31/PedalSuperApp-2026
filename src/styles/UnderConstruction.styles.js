import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#EEF0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1D2A74',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6F759B',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#8A92B8',
    textAlign: 'center',
    lineHeight: 22,
  },
});
