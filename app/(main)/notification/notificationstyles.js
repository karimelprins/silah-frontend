import { StyleSheet } from 'react-native';

export const COLORS = {
  bg: '#E6D5B8',
  textHeader: '#4A3F35',
  cardCycle: ['#BD5E44', '#8E9775', '#7D8A6F', '#9B7E51', '#A6957D'],
  white: '#FFFFFF',
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
  },
 headerTitle: {
  fontSize: 32, 
  fontFamily: 'serif', 
  color: COLORS.textHeader,
  fontWeight: '600',
},
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    minHeight: 110,
  },
  iconContainer: {
    width: 45,
    marginRight: 12,
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
  },
  description: {
    color: COLORS.white,
    fontSize: 14,
    opacity: 0.9,
    marginTop: 4,
  },
  timeText: {
    color: COLORS.white,
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 8,
    opacity: 0.7,
  },
  thumbnail: {
    width: 65,
    height: 65,
    borderRadius: 12,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  rightIconPlaceholder: {
    opacity: 0.4,
    marginLeft: 10,
  },
  unreadCard: {
    backgroundColor: '#7A4A2E', 
    elevation: 4,
    borderWidth: 0,
  },
  readCard: {
    backgroundColor: '#FFFFFF', 
    borderWidth: 1.5,
    borderColor: '#7A4A2E', 
    elevation: 2,
  },
});