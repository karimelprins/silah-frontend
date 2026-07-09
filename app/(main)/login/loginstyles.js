import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#F7E9D7",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
},
title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#4C2A13",
    marginBottom: 5,
},
subtitle: {
    fontSize: 14,
    color: "#7A5C3D",
    marginBottom: 40,
},
image: {
    width: 200,
    height: 200,
    marginBottom: 40,
},
input: {
    width: "100%",
    height: 45,
    borderWidth: 1.5,
    borderColor: "#4C2A13",
    borderRadius: 25,
    paddingHorizontal: 15,
    backgroundColor: "#FFF9F3",
    marginBottom: 15,
},
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: -10, 
        marginBottom: 5,
        alignSelf: 'flex-start',
        marginLeft: 15,
    },
    
    generalErrorText: {
        color: 'red',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        width: '70%', 
    },
loginBtn: {
    backgroundColor: "#4C2A13",
    width: "100%",
    height: 45,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
},
loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
},
bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },
  bottomText: {
    color: "#4C2A13",
    fontSize: 14,
  },

});