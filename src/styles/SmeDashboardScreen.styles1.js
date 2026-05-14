import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F8F6FD',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  hero: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111B74',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#5B6079',
    lineHeight: 22,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    shadowColor: '#ABB1D5',
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 6},
    elevation: 5,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  cardIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignItems: 'center',
  },
  cardBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#157A10',
  },
  cardLabel: {
    fontSize: 13,
    color: '#4F5369',
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111B74',
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111B74',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 28,
    shadowColor: '#B3B7D5',
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 6},
    elevation: 4,
  },
  summaryRow: {
    minHeight: 64,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#EAE6F4',
  },
  summaryLabel: {
    fontSize: 15,
    color: '#22263F',
  },
  summaryLabelStrong: {
    fontWeight: '800',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  alertCard: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertDanger: {
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: '#F6CACA',
  },
  alertWarning: {
    backgroundColor: '#FFF5DE',
    borderWidth: 1,
    borderColor: '#F3D48A',
  },
  alertIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  alertDangerIconWrap: {
    backgroundColor: '#D51D1D',
  },
  alertWarningIconWrap: {
    backgroundColor: '#FFC107',
  },
  alertBody: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F1C23',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 13,
    color: '#655D48',
  },
  alertTitleDanger: {
    fontSize: 15,
    fontWeight: '800',
    color: '#C51B1B',
    marginBottom: 4,
  },
  alertTextDanger: {
    fontSize: 13,
    color: '#D65252',
  },
});
