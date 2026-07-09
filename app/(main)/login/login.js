import { useRouter } from "expo-router";
import { useState } from "react"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal
} from "react-native";
import { styles } from "./loginstyles";
import { API_BASE_URL } from "../../../src/config/ApiConfig.js";

const ROLES = {
  PATIENT: "PATIENT",
  FAMILY_MEMBER: "FAMILY_MEMBER",
  FRIEND: "FRIEND",
};

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [generalError, setGeneralError] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const handleLogin = async () => {
    setGeneralError("");

    if (!email.trim() || !password) {
      setGeneralError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Attempting login with:", API_BASE_URL); 

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Invalid credentials");
      }

      if (data.access_token) {
  await AsyncStorage.setItem("access_token", data.access_token);
} 
await AsyncStorage.setItem("SILAH_CURRENT_USER", JSON.stringify(data));

      const { role } = data;
      const homeRoute = {
        [ROLES.PATIENT]: "role/patient/patientHomePage",
        [ROLES.FAMILY_MEMBER]: "role/family/familyHomePage",
        [ROLES.FRIEND]: "role/friend/friendHomePage",
      }[role] || "role/patient/patientHomePage";

      router.replace(homeRoute);

    } catch (err) {
      console.error("Login failed:", err);
      
      setGeneralError(err.message || "Network error. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <Modal
        visible={showForgotModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowForgotModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)', 
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 30,
            borderRadius: 20,
            width: '85%',
            alignItems: 'center',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#4A3F35', marginBottom: 10 }}>
              Need Help?
            </Text>
            
            <Text style={{ textAlign: 'center', color: '#777', fontSize: 15, marginBottom: 5 }}>
              To reset your password, please reach out to our support team:
            </Text>

            <Text style={{ 
              color: '#606C38', 
              fontWeight: 'bold', 
              fontSize: 16, 
              marginVertical: 15,
              textDecorationLine: 'underline' 
            }}>
              silah2026@gmail.com
            </Text>

            <TouchableOpacity 
              onPress={() => setShowForgotModal(false)}
              style={{
                backgroundColor: '#4A3F35',
                paddingVertical: 12,
                paddingHorizontal: 40,
                borderRadius: 25,
                marginTop: 10
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      
      
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Silah</Text>
        <Text style={styles.subtitle}>Because No One Should Feel Alone.</Text>
        <Image source={require("../../../assets/lg.png")} style={styles.image} />

        <TextInput
          placeholder="Enter Your Email..."
          placeholderTextColor="#888"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Enter Your Password"
          placeholderTextColor="#888"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />

        
        {generalError ? (
          <Text style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>
            {generalError}
          </Text>
        ) : null}

        <TouchableOpacity
          style={[styles.loginBtn, isLoading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginText}>Log In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.bottomRow}>
          <TouchableOpacity onPress={() => setShowForgotModal(true)}>
            <Text style={styles.bottomText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("register/register")}>
            <Text style={styles.bottomText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}