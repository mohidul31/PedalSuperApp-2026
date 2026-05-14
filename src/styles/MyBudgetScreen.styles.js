import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F6F7FF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#8A92B8',
    marginBottom: 6,
    letterSpacing: 1,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1D2A74',
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: {width: 0, height: 8},
    elevation: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  cardHeaderLeft: {
    flex: 1,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1D2A74',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6F759B',
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusActive: {
    backgroundColor: '#E9F9EE',
  },
  statusComplete: {
    backgroundColor: '#F3F5FF',
  },
  statusPending: {
    backgroundColor: '#FFF7DF',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D2A74',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  metricLabel: {
    fontSize: 12,
    color: '#8A92B8',
    marginBottom: 6,
  },
  metricLabelRight: {
    textAlign: 'right',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1D2A74',
  },
  metricValueGreen: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1B792E',
    textAlign: 'right',
  },
  progressRow: {
    marginBottom: 14,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#EEF0FF',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: 10,
    backgroundColor: '#1B792E',
    borderRadius: 999,
  },
  progressInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressInfo: {
    fontSize: 12,
    color: '#8A92B8',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  deleteButtonText: {
    fontSize: 14,
    color: '#6c757d',
  },
  detailButton: {
    paddingVertical: 8,
  },
  detailButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D2A74',
  },
});
