import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./introstyles";

export default function Intro() {
  const router = useRouter();

  const [loginPressed, setLoginPressed] = useState(false);
  const [registerPressed, setRegisterPressed] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Silah</Text>
      <Text style={styles.subtitle}>Because no one should feel alone</Text>

      <Image source={require("../../../assets/p-removebg-preview.png")} style={styles.image} />

      
      <TouchableOpacity
        style={[
          styles.loginBtn,
          loginPressed && { backgroundColor: "#e8a84a" },
        ]}
        onPressIn={() => setLoginPressed(true)}
        onPressOut={() => setLoginPressed(false)}
        onPress={() => router.push("login/login")}
      >
        <Text style={[styles.loginText, loginPressed && { color: "#000" }]}>
          Log In
        </Text>
      </TouchableOpacity>

      
      <TouchableOpacity
        style={[
          styles.registerBtn,
          registerPressed && { backgroundColor: "#7a5a42" },
        ]}
        onPressIn={() => setRegisterPressed(true)}
        onPressOut={() => setRegisterPressed(false)}
        onPress={() => router.push("register/register")}
      >
        <Text
          style={[
            styles.registerText,
            registerPressed && { color: "#000" }, 
          ]}
        >
          Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}
