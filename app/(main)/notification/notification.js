import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl, 
  DeviceEventEmitter 
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../../src/config/ApiConfig.js";
import styles, { COLORS } from './notificationstyles';

const NotificationScreen = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await response.json();
      let data = Array.isArray(result) ? result : (result.notifications || []);

      data.sort((a, b) => {
        if (a.is_read === b.is_read) return 0;
        return a.is_read ? 1 : -1;
      });

      setNotifications(data);
    } catch (e) {
      console.error("Connection Error:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationPress = async (item) => {
    if (!item.is_read) {
      setNotifications(prev => 
        prev.map(n => n.id === item.id ? { ...n, is_read: true } : n)
      );

      DeviceEventEmitter.emit('notificationRead');

      try {
        const token = await AsyncStorage.getItem("access_token");
        await fetch(`${API_BASE_URL}/notifications/mark-read`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ notification_id: item.id })
        });
      } catch (e) {
        console.error("Failed to update read status in backend:", e);
      }
    }

    if (item.type === 'reminder') {
      router.push("reminders/patientRemindersPage");
    } else if (item.type === 'memory_upload') {
      router.push({
        pathname: "road/road",
        params: { highlightId: item.memory_id }
      });
    } else if (item.type === 'on_this_day') {
      router.push("onThisDay/thisday");
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={{ position: 'absolute', left: 20, top: 40, zIndex: 10 }}
        >
          <Icon name="chevron-left" size={20} color={COLORS.textHeader} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.textHeader} style={{ marginTop: 50 }} />
        ) : notifications.length > 0 ? (
          notifications.map((item, index) => {
            const isUnread = !item.is_read;
            const iconName = item.type === 'reminder' ? 'clock-o' : 
                             (item.type === 'memory_upload' ? 'cloud-upload' : 'calendar');

            return (
              <TouchableOpacity
                key={item.id || index}
                onPress={() => handleNotificationPress(item)}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.card, 
                  isUnread ? styles.unreadCard : styles.readCard
                ]}>
                  <View style={styles.iconContainer}>
                    <Icon 
                      name={iconName} 
                      color={isUnread ? "white" : "#4A3F35"} 
                      size={24} 
                    />
                  </View>

                  <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: isUnread ? "white" : "#4A3F35" }]}>
                      {item.type === 'memory_upload' 
                        ? `New Memory from ${item.uploader_name || 'Family'}` 
                        : (item.title || 'Notification')}
                    </Text>

                    <Text style={[
                      styles.description, 
                      { color: isUnread ? "white" : "#4A3F35", opacity: isUnread ? 0.9 : 0.7 }
                    ]}>
                      {item.message || item.desc}
                    </Text>
                  </View>

                  <Icon 
                    name="chevron-right" 
                    size={12} 
                    color={isUnread ? "white" : "#4A3F35"} 
                    style={{ opacity: 0.5, marginLeft: 10 }} 
                  />
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={{ alignItems: 'center', marginTop: 100 }}>
            <Icon name="bell-slash-o" size={50} color="#D4C3A3" />
            <Text style={{ color: '#795548', marginTop: 10, fontSize: 16 }}>No new notifications</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationScreen;