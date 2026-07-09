import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5CDA5", 
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#5c3d2e", 
  },
  subtitle: {
    fontSize: 16,
    color: "#5c3d2e",
    marginBottom: 40,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },

  
  loginBtn: {
    backgroundColor: "#8b4513", 
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 30,
    marginBottom: 20,
  },
  loginText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  
  registerBtn: {
    borderWidth: 2,
    borderColor: "#8b4513",
    paddingVertical: 12,
    paddingHorizontal: 70,
    borderRadius: 30,
  },
  registerText: {
    color: "#8b4513",
    fontSize: 16,
    fontWeight: "600",
  },
});
