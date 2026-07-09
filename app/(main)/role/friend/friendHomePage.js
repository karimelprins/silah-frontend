import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Dimensions
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { styles } from './friendHomePagestyles';
import { API_BASE_URL } from "../../../../src/config/ApiConfig.js";
import FriendNavbar from "../../../components/friendNavbar.js"; 

const { width } = Dimensions.get('window');

export default function FriendHomePage() {
  const router = useRouter();

  const [patientName, setPatientName] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSwitchConfirm, setShowSwitchConfirm] = useState(false);

  const settingsAnim = useRef(new Animated.Value(0)).current;
  const leafAnim = useRef(new Animated.Value(1)).current; 

  const fetchFriendDashboard = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) return router.replace("/login/login");

      const headers = { 
        Authorization: `Bearer ${token}`, 
        Accept: 'application/json' 
      };

      const response = await fetch(`${API_BASE_URL}/user/linked-patient`, {
        method: 'GET',
        headers: headers,
      });

      const data = await response.json();
      if (response.ok) {
        setPatientName(data.patient_name || "your friend");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    fetchFriendDashboard();
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(leafAnim, { toValue: 1.2, duration: 2000, useNativeDriver: true }),
        Animated.timing(leafAnim, { toValue: 1, duration: 2000, useNativeDriver: true })
      ])
    ).start();
  }, [fetchFriendDashboard]);

  const toggleSettings = () => {
    if (settingsOpen) {
      Animated.timing(settingsAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => setSettingsOpen(false));
    } else {
      setSettingsOpen(true);
      Animated.spring(settingsAnim, { toValue: 1, friction: 8, useNativeDriver: true }).start();
    }
  };

  const settingsTransform = {
    transform: [{ translateX: settingsAnim.interpolate({ inputRange: [0, 1], outputRange: [width * 0.7, 0] }) }],
  };

  const executeLogout = async () => {
    await AsyncStorage.clear();
    setShowLogoutConfirm(false);
    router.replace("/");
  };

  const executeSwitch = async () => {
    await AsyncStorage.removeItem("access_token");
    setShowSwitchConfirm(false);
    router.replace("login/login");
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#4C2A13" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {settingsOpen && (
        <Animated.View style={[styles.sideTabsContainer, settingsTransform, { zIndex: 1000 }]}>
          <TouchableOpacity style={styles.tabItem} onPress={() => { toggleSettings(); setShowSwitchConfirm(true); }}>
            <Ionicons name="swap-horizontal-outline" size={22} color="#FFF" />
            <Text style={styles.tabLabel}>Switch Account</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabItem, { backgroundColor: 'rgba(211, 47, 47, 0.8)' }]} onPress={() => { toggleSettings(); setShowLogoutConfirm(true); }}>
            <Ionicons name="log-out-outline" size={22} color="#FFF" />
            <Text style={styles.tabLabel}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Confirmation Modals */}
      <Modal visible={showLogoutConfirm} transparent animationType="fade">
        <View style={styles.confirmOverlay}><View style={styles.confirmBox}>
          <Text style={styles.confirmTitle}>Logout</Text>
          <Text style={styles.confirmSubtitle}>Are you sure you want to log out?</Text>
          <View style={styles.confirmButtons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowLogoutConfirm(false)}><Text>Cancel</Text></TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={executeLogout}><Text style={{color:'#FFF'}}>Logout</Text></TouchableOpacity>
          </View>
        </View></View>
      </Modal>

      <Modal visible={showSwitchConfirm} transparent animationType="fade">
        <View style={styles.confirmOverlay}><View style={styles.confirmBox}>
          <Text style={styles.confirmTitle}>Switch Account</Text>
          <View style={styles.confirmButtons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowSwitchConfirm(false)}><Text>Cancel</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.confirmBtn, {backgroundColor: '#7A4A2E'}]} onPress={executeSwitch}><Text style={{color:'#FFF'}}>Switch</Text></TouchableOpacity>
          </View>
        </View></View>
      </Modal>

      <View style={styles.header}>
        <View style={{ width: 30 }} /> 
        <View style={styles.logoContainer}>
          <Text style={styles.silahLogo}>Silah</Text>
          <Animated.View style={{ transform: [{ scale: leafAnim }] }}>
            <MaterialCommunityIcons name="leaf" size={24} color="#606C38" />
          </Animated.View>
        </View>
        <TouchableOpacity onPress={toggleSettings}>
          <Ionicons name={settingsOpen ? "close" : "settings-outline"} size={28} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.content, { flexGrow: 1, justifyContent: 'center' }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchFriendDashboard(); }} />}
      >
        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.welcomeText, { textAlign: 'center', marginBottom: 40 }]}>
            Help <Text style={styles.highlightText}>{patientName || "your friend"}</Text> to {"\n"}recall memories!
          </Text>

          <TouchableOpacity 
            style={[styles.actionButton, { 
              flexDirection: 'column', 
              height: 200, 
              width: width * 0.85, 
              justifyContent: 'center', 
              alignItems: 'center',
              elevation: 5,
              shadowOpacity: 0.2
            }]} 
            onPress={() => router.push("/(main)/upload/Frienduploadmemory")}
          >
            <View style={[styles.iconCircle, { width: 90, height: 90, borderRadius: 45, marginBottom: 15 }]}>
              <Ionicons name="camera" size={45} color="#4C2A13" />
            </View>
            <Text style={[styles.actionButtonText, { fontSize: 20, fontWeight: '700' }]}>Upload Memory</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <FriendNavbar activeTab="home" />
    </SafeAreaView>
  );
}