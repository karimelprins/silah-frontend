import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import loginstyles  from "../(main)/login/loginstyles";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSendCode = () => {
    if (!email.trim()) return;

    // المفروض هنا تبعت API ترسل الكود للإيميل
    router.push({
      pathname: "/verifyCode",
      params: { email },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter your email to receive a code</Text>

      <TextInput
        placeholder="Enter Your Email..."
        placeholderTextColor="#888"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.loginBtn} onPress={handleSendCode}>
        <Text style={styles.loginText}>Send Code</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.bottomText}>Back to Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
