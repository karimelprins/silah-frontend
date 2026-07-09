import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './remindersStyles';
import { useRouter, useFocusEffect } from 'expo-router'; 
import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_BASE_URL } from "../../../src/config/ApiConfig.js";

export default function PatientRemindersPage() {
    const router = useRouter();
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            fetchReminders();
        }, [])
    );

    const fetchReminders = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("access_token");

           
            const today = new Date();
            today.setHours(0, 0, 0, 0); 

            const response = await fetch(`${API_BASE_URL}/reminders/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Server returned status: ${response.status}`);
            }

            const data = await response.json();

            let rawReminders = [];
            if (Array.isArray(data)) {
                rawReminders = data;
            } else if (data && Array.isArray(data.reminders)) {
                rawReminders = data.reminders;
            } else if (data && Array.isArray(data.data)) {
                rawReminders = data.data;
            }

            const formattedReminders = rawReminders
                .filter(item => {
                    const reminderDate = new Date(item.date);
                    reminderDate.setHours(0, 0, 0, 0);
                    
                    return !isNaN(reminderDate) && reminderDate >= today;
                })
                .map((item, index) => {
                    const dateObj = new Date(item.date);
                    const formattedDate = dateObj.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    });

                    return {
                        id: item.reminder_id ? String(item.reminder_id) : String(index),
                        title: item.title,
                        date: formattedDate,
                        type: item.type === 'URGENT' ? 'Urgent' : 'Not Urgent',
                        description: item.description,
                    };
                });

            setReminders(formattedReminders);
        } catch (error) {
            console.error("Error fetching reminders:", error);
            setReminders([]);
        } finally {
            setLoading(false);
        }
    };

    const renderReminderItem = ({ item }) => (
        <View style={[styles.reminderCard, item.type === 'Urgent' && styles.urgentCard]}>
            <View style={styles.cardHeader}>
                <Text style={styles.reminderTitle}>{item.title}</Text>
                {item.type === 'Urgent' && (
                    <View style={styles.urgentBadge}>
                        <Text style={styles.urgentText}>URGENT</Text>
                    </View>
                )}
            </View>
            <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={16} color="#8A7B6A" />
                <Text style={styles.reminderDate}>{item.date}</Text>
            </View>
            <Text style={styles.reminderDescription}>{item.description}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={[styles.header, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#D8C4A8', backgroundColor: '#7A4A2E', paddingTop: 40, paddingBottom: 5 }]}>
                <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
                        <Ionicons name="arrow-back" size={28} color="#F5E6D3" />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: '600', color: '#F5E6D3', textAlign: 'center' }}>Silah</Text>
                    <Text style={{ fontSize: 18, color: '#D8C4A8', marginTop: 4, textAlign: 'center' }}>My Reminders</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }} />
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#8A7B6A" />
                </View>
            ) : (
                <FlatList
                    data={reminders}
                    keyExtractor={(item) => item.id}
                    renderItem={renderReminderItem}
                    contentContainerStyle={[styles.listContent, { paddingBottom: 20 }]}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 40, color: '#8A7B6A' }}>
                            You have no upcoming reminders.
                        </Text>
                    }
                />
            )}
        </View>
    );
}