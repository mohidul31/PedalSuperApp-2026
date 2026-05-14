import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  spinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  subText: {
    fontSize: 16,
    color: '#d1d8e0',
    fontStyle: 'italic',
  },
  circleTopLeft: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circleBottomRight: {
    position: 'absolute',
    bottom: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  betaContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  betaText: {
    fontSize: 12,
    color: '#ffffffaa',
    fontStyle: 'italic',
  },
});
