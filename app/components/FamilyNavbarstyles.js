import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#FDFBFA',
    height: 90,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
    borderTopWidth: 1,
    borderColor: '#EEE',
    elevation: 20,
  },
  tabButton: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  tabLabelBottom: { 
    fontSize: 9, 
    fontWeight: 'bold', 
    marginTop: 4 
  },
  uploadBtnContainer: { 
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: -45,
    zIndex: 10,
  },
  uploadCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  uploadText: { 
    fontSize: 10, 
    fontWeight: 'bold', 
    marginTop: 4 
  },
});