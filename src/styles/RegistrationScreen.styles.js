import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  brandArea: {
    alignItems: 'center',
    marginBottom: 36,
  },
  brandTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#2E3192',
    letterSpacing: 3,
  },
  brandSubtitle: {
    fontSize: 16,
    color: '#6F759B',
    marginTop: 6,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: 6},
    elevation: 6,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#17173C',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6F759B',
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F7FC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E4E9F5',
    paddingHorizontal: 14,
    marginBottom: 6,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#17173C',
  },
  inputError: {
    borderColor: '#FF4444',
  },
  error: {
    color: '#FF4444',
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
  },
  submissionError: {
    color: '#FF4444',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#2E3192',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 18,
    elevation: 4,
    shadowColor: '#2E3192',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 15,
    color: '#6F759B',
  },
  footerLink: {
    color: '#2E3192',
    fontWeight: '700',
  },
});
