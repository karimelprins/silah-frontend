import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Modal
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { styles } from "./familyHomePagestyles";
import { API_BASE_URL } from "../../../../src/config/ApiConfig.js";

import Navbar from "../../../components/FamilyNavbar.js";

const { width } = Dimensions.get("window");

export default function FamilyHomePage() {
  const router = useRouter();

  const [patientData, setPatientData] = useState({
    engagement_score: 0,
    last_activity: "just now",
    full_name: "Patient",
  });
  const [linkedPatientName, setLinkedPatientName] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSwitchConfirm, setShowSwitchConfirm] = useState(false);

  const settingsAnim = useRef(new Animated.Value(0)).current;

  const fetchPatientData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) return router.replace("/login/login");

      const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };

      const [engagementResponse, linkedResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/usage/engagement-from-chat`, { headers }),
        fetch(`${API_BASE_URL}/user/linked-patient`, { headers }),
      ]);

      const engagementData = await engagementResponse.json();
      const linkedData = await linkedResponse.json();

      if (engagementResponse.ok) {
        setPatientData({
          engagement_score: typeof engagementData.engagement_score === "number" ? engagementData.engagement_score : 0,
          last_activity: engagementData.last_activity || "just now",
          full_name: engagementData.full_name || "Patient",
        });
      }

      if (linkedResponse.ok) {
        setLinkedPatientName(linkedData.patient_name || "your loved one");
      }
    } catch (error) {
      console.error("Network Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => { fetchPatientData(); }, [fetchPatientData]);

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

  const toggleSettings = () => {
    if (settingsOpen) {
      Animated.timing(settingsAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => setSettingsOpen(false));
    } else {
      setSettingsOpen(true);
      Animated.spring(settingsAnim, { toValue: 1, friction: 8, useNativeDriver: true }).start();
    }
  };

  const settingsTransform = {
    transform: [{ translateX: settingsAnim.interpolate({ inputRange: [0, 1], outputRange: [width * 0.7, 0] }) }]
  };

  const getEngagementColor = (score) => {
    const numScore = Number(score) || 0;
    if (numScore >= 75) return "#606C38"; 
    if (numScore >= 45) return "#7A4A2E"; 
    return "#BC6C25"; 
  };

  const getEngagementText = (score) => {
    const numScore = Number(score) || 0;
    if (numScore >= 90) return "Very Highly Engaged";
    if (numScore >= 75) return "Highly Engaged";
    if (numScore >= 45) return "Moderately Engaged";
    return "Low Engagement";
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#4C2A13" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Logout Modal */}
      <Modal visible={showLogoutConfirm} transparent animationType="fade">
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <Ionicons name="log-out" size={45} color="#d32f2f" />
            <Text style={styles.confirmTitle}>Logout</Text>
            <Text style={styles.confirmSubtitle}>Are you sure you want to end your session?</Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowLogoutConfirm(false)}>
                <Text style={styles.cancelBtnText}>Stay</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: "#d32f2f" }]} onPress={executeLogout}>
                <Text style={styles.confirmBtnText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Switch Account Modal */}
      <Modal visible={showSwitchConfirm} transparent animationType="fade">
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <Ionicons name="swap-horizontal" size={45} color="#7A4A2E" />
            <Text style={styles.confirmTitle}>Switch Account</Text>
            <Text style={styles.confirmSubtitle}>Go back to the login screen?</Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowSwitchConfirm(false)}>
                <Text style={styles.cancelBtnText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: "#7A4A2E" }]} onPress={executeSwitch}>
                <Text style={styles.confirmBtnText}>Switch</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Side Menu */}
      {settingsOpen && (
        <Animated.View style={[styles.sideTabsContainer, { right: 0, zIndex: 1000 }, settingsTransform]}>
          <TouchableOpacity
            style={[styles.tabItem, styles.rightTabItem]}
            onPress={() => { toggleSettings(); setShowSwitchConfirm(true); }}
          >
            <Ionicons name="swap-horizontal-outline" size={22} color="#FFF" />
            <Text style={styles.tabLabel}>Switch Account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabItem, styles.rightTabItem, { backgroundColor: "rgba(211, 47, 47, 0.85)" }]}
            onPress={() => { toggleSettings(); setShowLogoutConfirm(true); }}
          >
            <Ionicons name="log-out-outline" size={22} color="#FFF" />
            <Text style={styles.tabLabel}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Header */}
      <View style={styles.topHeader}>
        <View style={{ width: 40 }} />
        <View style={styles.logoRow}>
          <Text style={styles.logoText}>Silah</Text>
          <MaterialCommunityIcons name="leaf" size={20} color="#606C38" style={{ marginLeft: 5 }} />
        </View>
        <TouchableOpacity onPress={toggleSettings}>
          <Ionicons name={settingsOpen ? "close" : "settings-sharp"} size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchPatientData} />}
      >
        <View style={styles.profileContainer}>
          {/* Removed the entire imageWrapper View from here */}
          <Text style={styles.patientNameText}>
            {linkedPatientName ? `Check up on ${linkedPatientName}` : "Check up on your loved one"}
          </Text>
        </View>

        {/* Engagement Card */}
        <View style={styles.engagementCard}>
          <Text style={styles.cardLabel}>CURRENT ENGAGEMENT LEVEL</Text>
          <View style={[styles.outerRing, { borderColor: getEngagementColor(patientData?.engagement_score) }]}>
            <Text style={styles.percentageText}>{Number(patientData?.engagement_score) || 0}%</Text>
            <MaterialCommunityIcons name="leaf" size={16} color="#D4C3A3" />
          </View>
          <Text style={styles.engagementStatus}>{getEngagementText(patientData?.engagement_score)}</Text>
          <Text style={styles.updateText}>Activity updated {patientData?.last_activity || "just now"}</Text>
        </View>
      </ScrollView>

      <Navbar activeTab="home" />
    </SafeAreaView>
  );
}