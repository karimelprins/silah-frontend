import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  StatusBar,
  Dimensions,
  Image,
  RefreshControl,
  Modal,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../../../src/config/ApiConfig.js";
import PatientNavbar from "../../../components/PatientNavbar.js";

const { width } = Dimensions.get("window");

const FeatureCard = ({ iconName, label, subtitle, onPress, iconBgColor, iconColor }) => (
  <TouchableOpacity style={styles.featureCard} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
      <FontAwesome name={iconName} size={26} color={iconColor || "#7A4A2E"} />
    </View>
    <View style={styles.cardTextContent}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color="#D4C3A3" />
  </TouchableOpacity>
);

export default function HomeScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userName, setUserName] = useState("User");

  

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmType, setConfirmType] = useState("");

  const settingsAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  const getDayName = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const toggleSettings = () => {
    if (settingsOpen) {
      Animated.timing(settingsAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => setSettingsOpen(false));
    } else {
      setSettingsOpen(true);
      Animated.spring(settingsAnim, { toValue: 1, friction: 8, useNativeDriver: true }).start();
    }
  };

  const requestAction = (type) => {
    setConfirmType(type);
    setConfirmVisible(true);
    if (settingsOpen) toggleSettings();
  };

  const handleConfirmAction = async () => {
    setConfirmVisible(false);
    await AsyncStorage.clear();

    if (confirmType === 'switch') {
      router.replace("/login/login");
    } else {
      router.replace("/intro/intro");
    }
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) return router.replace("/intro/intro");

      const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };
      const [notifRes, userRes] = await Promise.all([
        fetch(`${API_BASE_URL}/notifications/unread-count`, { method: "GET", headers }),
        fetch(`${API_BASE_URL}/user/linked-patient`, { method: "GET", headers })
      ]);

      const notifData = await notifRes.json();
      const userData = await userRes.json();

      if (userRes.ok && userData.patient_name) setUserName(userData.patient_name);
      setUnreadCount(notifData.unread_count || 0);
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    fetchDashboardData();
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.4, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, [fetchDashboardData]);

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#4C2A13" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Modal transparent visible={confirmVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmCard}>
            <View style={styles.confirmIconCircle}>
              <Ionicons name={confirmType === 'logout' ? "log-out" : "people"} size={30} color="#BC6C25" />
            </View>
            <Text style={styles.confirmTitle}>{confirmType === 'logout' ? 'Logging Out?' : 'Switch Account?'}</Text>
            <Text style={styles.confirmSub}>
              Are you sure you want to {confirmType === 'logout' ? 'leave the app' : 'log in to a different account'}?
            </Text>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmAction}>
              <Text style={styles.confirmBtnText}>Yes, Proceed</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelLink} onPress={() => setConfirmVisible(false)}>
              <Text style={styles.cancelLinkText}>Not now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {settingsOpen && (
        <Animated.View style={[styles.sideTabsContainer, {
          transform: [{ translateX: settingsAnim.interpolate({ inputRange: [0, 1], outputRange: [width * 0.7, 0] }) }]
        }]}>
          <TouchableOpacity style={styles.tabItem} onPress={() => requestAction('switch')}>
            <MaterialCommunityIcons name="account-switch-outline" size={22} color="#FEFAE0" />
            <Text style={styles.tabLabel}>Switch Account</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => requestAction('logout')}>
            <Ionicons name="log-out-outline" size={22} color="#F28B82" />
            <Text style={[styles.tabLabel, { color: '#F28B82' }]}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <View style={styles.topHeader}>
        <View style={styles.logoRow}>
          <Text style={styles.logoText}>Silah</Text>
          <MaterialCommunityIcons name="leaf" size={20} color="#BC6C25" style={{ marginLeft: 5 }} />
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={{ marginRight: 18 }} onPress={() => router.push("notification/notification")}>
            <Ionicons name="notifications-outline" size={26} color="#fff" />
            {unreadCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{unreadCount}</Text></View>}
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleSettings}>
            <Ionicons name={settingsOpen ? "close" : "settings-sharp"} size={26} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchDashboardData} />}
      >
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingTitle}>Hello, {userName}</Text>
          <Text style={styles.dayText}>It's a beautiful {getDayName()}, let's have fun!</Text>
          <View style={styles.divider} />
        </View>

        <FeatureCard label="Search by Face" subtitle="Identify your loved ones" iconName="user-circle-o" iconBgColor="#FAEDCD" iconColor="#BC6C25" onPress={() => router.push("search/search")} />
        <FeatureCard label="Memory Road" subtitle="Look at your family photos" iconName="image" iconBgColor="#FAD2E1" iconColor="#D62828" onPress={() => router.push("road/road")} />

        <FeatureCard
          label="Reminders"
          subtitle="Don't miss your tasks"
          iconName="calendar"
          iconBgColor="#E8E4D9"
          iconColor="#795548"
          onPress={() => router.push("/reminders/patientRemindersPage")}
        />

        <View style={styles.flashbackSection}>
          <Text style={styles.flashbackTag}>FLASHBACK</Text>
          <TouchableOpacity style={styles.fbCard} onPress={() => router.push("onThisDay/thisday")}>
            <View style={styles.fbImageBox}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=500' }} style={styles.fbImage} />
            </View>
            <View style={styles.fbFooter}>
              <View>
                <Text style={styles.fbTitle}>On This Day</Text>
                <Text style={styles.fbSub}>Explore memories</Text>
              </View>
              <Animated.View style={[styles.fbPlayBtn, { opacity: glowAnim }]}>
                <Ionicons name="play" size={14} color="#FEFAE0" />
              </Animated.View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <PatientNavbar activeTab="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FEFAE0" },
  topHeader: { flexDirection: "row",backgroundColor: "#7A4A2E", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, height: 108, paddingTop: 40 ,marginBottom:15},
  logoRow: { flexDirection: "row", alignItems: "center" },
  logoText: { fontSize: 26, fontWeight: "bold", color: "#fff" },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  badge: { position: 'absolute', right: -4, top: -4, backgroundColor: '#D62828', width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 110 },
  greetingContainer: { alignItems: 'center', marginTop: 10, marginBottom: 25 },
  greetingTitle: { fontSize: 28, fontWeight: 'bold', color: '#4C2A13' },
  dayText: { fontSize: 16, color: '#A98467', marginTop: 4 },
  divider: { height: 3, width: 60, backgroundColor: '#D4A373', marginTop: 12, borderRadius: 2 },
  featureCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 25, padding: 18, marginBottom: 15, elevation: 3 },
  iconContainer: { width: 55, height: 55, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  cardTextContent: { flex: 1, marginLeft: 15 },
  cardLabel: { fontSize: 18, fontWeight: 'bold', color: '#4C2A13' },
  cardSubtitle: { fontSize: 14, color: '#A98467' },
  flashbackSection: { marginTop: 20 },
  flashbackTag: { fontSize: 11, fontWeight: 'bold', color: '#D4A373', marginBottom: 10, letterSpacing: 1.5 },
  fbCard: { backgroundColor: '#FFF', borderRadius: 28, overflow: 'hidden', elevation: 4 },
  fbImageBox: { height: 140, backgroundColor: '#FAEDCD', padding: 8 },
  fbImage: { width: '100%', height: '100%', borderRadius: 20 },
  fbFooter: { padding: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fbTitle: { fontSize: 18, fontWeight: 'bold', color: '#4C2A13' },
  fbSub: { fontSize: 14, color: '#A98467' },
  fbPlayBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#BC6C25', justifyContent: 'center', alignItems: 'center' },
  sideTabsContainer: { position: "absolute", top: 110, right: 0, width: width * 0.6, backgroundColor: "#4C2A13", borderTopLeftRadius: 25, borderBottomLeftRadius: 25, paddingVertical: 10, zIndex: 1000 },
  tabItem: { flexDirection: "row", alignItems: "center", paddingVertical: 18, paddingHorizontal: 20 },
  tabLabel: { color: "#FEFAE0", fontSize: 15, fontWeight: "600", marginLeft: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  confirmCard: { width: width * 0.8, backgroundColor: '#FFF', borderRadius: 30, padding: 25, alignItems: 'center' },
  confirmIconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#FEFAE0', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  confirmTitle: { fontSize: 20, fontWeight: 'bold', color: '#4C2A13' },
  confirmSub: { fontSize: 14, color: '#A98467', textAlign: 'center', marginTop: 8, marginBottom: 20 },
  confirmBtn: { backgroundColor: '#BC6C25', width: '100%', paddingVertical: 14, borderRadius: 15, alignItems: 'center' },
  confirmBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  cancelLink: { marginTop: 15 },
  cancelLinkText: { color: '#D62828', fontWeight: '600' }
});