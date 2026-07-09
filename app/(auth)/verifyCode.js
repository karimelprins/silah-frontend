import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import loginstyles from "../(main)/login/loginstyles";

const API_BASE_URL = "http://your-backend-ip:8000"; // CHANGE THIS

export default function VerifyCode() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (!code.trim() || code.length !== 6) {
      Alert.alert("Invalid Code", "Please enter the 6-digit code");
      return;
    }

    setIsLoading(true);

    try {
   
      await new Promise(res => setTimeout(res, 1000));

      router.push({ pathname: "/resetPassword", params: { email } });

    } catch (err) {
      Alert.alert("Error", err.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Verify Code</Text>
      <Text style={styles.subtitle}>Enter the 6-digit code sent to: {email}</Text>

      <TextInput
        placeholder="000000"
        placeholderTextColor="#888"
        style={styles.input}
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
        textAlign="center"
        fontSize={24}
      />

      <TouchableOpacity style={styles.loginBtn} onPress={handleVerify} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.loginText}>Verify</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.bottomText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}