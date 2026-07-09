import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const FORM_WIDTH = width * 0.8;

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F9EBD8",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#4C2A13",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#7B5E3B",
    marginBottom: 20,
    textAlign: "center",
  },

  image: {
    width: 200,
    height: 200,
    marginBottom: 40,
    marginStart:40,
  },

  inputWrapper: {
    width: FORM_WIDTH,
    marginBottom: 12,
    alignSelf: "center",
    position: "relative",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#D9B99B",
   
  },
  
  conditionalInput: {
      backgroundColor: '#FFf', 
      borderColor: '#D9B99B',
  },

  inputPassword: {
    paddingRight: 50, 
  },
  
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },

  inputError: {
    borderColor: "#E24B4B",
  },

  eyeIcon: {
    position: "absolute",
    right: 18,
    top: "50%",
    transform: [{ translateY: -10 }],
    zIndex: 2,
  },

  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
    paddingHorizontal: 15,
  },
  strengthBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ccc',
    marginHorizontal: 2,
  },
  strengthBarActive1: {
    backgroundColor: '#E24B4B', 
  },
  strengthBarActive2: {
    backgroundColor: '#FFD700', 
  },
  strengthBarActive3: {
    backgroundColor: '#606C38',
  },
  strengthText: {
    width: 60,
    fontSize: 12,
    color: '#606C38',
    textAlign: 'right',
  },

  registerBtn: {
    backgroundColor: "#4C2A13",
    borderRadius: 25,
    paddingVertical: 12,
    width: FORM_WIDTH,
    marginTop: 12,
    alignSelf: "center",
    alignItems: "center",
  },

  registerText: {
    color: "#fff",
    fontSize: 20,
  },

  link: {
    color: "#4C2A13",
    fontSize: 14,
    marginTop: 14,
    textAlign: "center",
  },
  
  dropdownInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#4A3B2F',
    textAlign: 'left',
  },

  generalErrorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
    fontWeight: '600',
  },
});