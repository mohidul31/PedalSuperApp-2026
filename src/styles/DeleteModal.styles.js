import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 28,
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#FCE8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1D2A74',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#6F759B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F5F7FF',
  },
  cancelText: {
    color: '#1D2A74',
    fontSize: 15,
    fontWeight: '700',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#E43A3A',
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
