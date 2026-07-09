import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styles } from "./remindersStyles";
import Navbar from "../../components/FamilyNavbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../../src/config/ApiConfig.js";

export default function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [newReminder, setNewReminder] = useState({
    title: "",
    date: "", 
    type: "Not Urgent",
    description: "",
  });

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");

      const response = await fetch(`${API_BASE_URL}/reminders/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      
      const formattedReminders = (Array.isArray(data) ? data : data.reminders || []).map((item) => {
        const dateObj = new Date(item.date);
        
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        
        const simpleDate = isNaN(dateObj) ? "Invalid Date" : `${year}/${month}/${day}`;

        return {
          id: String(item.reminder_id),
          title: item.title,
          date: simpleDate,
          type: item.type === "URGENT" ? "Urgent" : "Not Urgent",
          description: item.description,
        };
      });

      setReminders(formattedReminders);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReminder = async () => {
    if (!newReminder.title || !newReminder.date) {
      Alert.alert("Error", "Please provide a Title and select a Date");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("access_token");

      const datePart = newReminder.date.replace(/\//g, "-");
      const isoDateTime = `${datePart}T00:00:00`; 

      const body = {
        title: newReminder.title,
        date: isoDateTime,
        type: newReminder.type === "Urgent" ? "URGENT" : "NOT_URGENT",
        description: newReminder.description || "",
      };

      const url = isEditing 
        ? `${API_BASE_URL}/reminders/${editingId}` 
        : `${API_BASE_URL}/reminders/create`;
      
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        const msg = Array.isArray(result.detail) ? result.detail[0].msg : result.detail;
        throw new Error(msg || "Error saving reminder");
      }

      await fetchReminders();
      closeModal();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleDeleteReminder = (id) => {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("access_token");
            await fetch(`${API_BASE_URL}/reminders/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            await fetchReminders();
          } catch (error) {
            Alert.alert("Error", "Could not delete");
          }
        },
      },
    ]);
  };

  const handleEditPress = (item) => {
    setNewReminder({
      title: item.title,
      date: item.date, 
      type: item.type,
      description: item.description,
    });
    setEditingId(item.id);
    setIsEditing(true);
    setModalVisible(true);
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setNewReminder({ title: "", date: "", type: "Not Urgent", description: "" });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setIsEditing(false);
    setEditingId(null);
    setShowDatePicker(false);
    setNewReminder({ title: "", date: "", type: "Not Urgent", description: "" });
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      
      setNewReminder({ ...newReminder, date: `${year}/${month}/${day}` });
      
      if (Platform.OS === "ios") setShowDatePicker(false); 
    } else {
      setShowDatePicker(false);
    }
  };

  const getPickerDate = () => {
    if (newReminder.date) {
      return new Date(newReminder.date.replace(/\//g, "-"));
    }
    return new Date();
  };

  const renderReminderItem = ({ item }) => (
    <View style={[styles.reminderCard, item.type === "Urgent" && styles.urgentCard]}>
      <View style={styles.cardHeader}>
        <Text style={styles.reminderTitle}>{item.title}</Text>
        {item.type === "Urgent" && (
          <View style={styles.urgentBadge}><Text style={styles.urgentText}>URGENT</Text></View>
        )}
      </View>
      <View style={styles.dateRow}>
        <Ionicons name="calendar-outline" size={16} color="#8A7B6A" />
        <Text style={styles.reminderDate}>{item.date}</Text>
      </View>
      <Text style={styles.reminderDescription}>{item.description}</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleEditPress(item)}>
          <Ionicons name="pencil" size={18} color="#7A4A2E" />
          <Text style={[styles.actionText, styles.editBtn]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteReminder(item.id)}>
          <Ionicons name="trash" size={18} color="#d32f2f" />
          <Text style={[styles.actionText, styles.deleteBtn]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Reminders</Text></View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#8A7B6A" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          renderItem={renderReminderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
        <Ionicons name="add" size={35} color="#FFF" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{isEditing ? "Edit Reminder" : "New Reminder"}</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Title</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g. Doctor Appointment"
                  placeholderTextColor="#B4A594"
                  value={newReminder.title} 
                  onChangeText={(t) => setNewReminder({...newReminder, title: t})} 
                />
              </View>
              
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Date</Text>
                <TouchableOpacity 
                  style={[styles.input, { justifyContent: "center" }]} 
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={{ color: newReminder.date ? "#000" : "#B4A594" }}>
                    {newReminder.date || "Tap to select a date"}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={getPickerDate()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Type</Text>
                <View style={styles.typeSelector}>
                  <TouchableOpacity 
                    style={[styles.typeButton, newReminder.type === "Urgent" && styles.activeTypeButton]}
                    onPress={() => setNewReminder({...newReminder, type: "Urgent"})}
                  >
                    <Text style={newReminder.type === "Urgent" ? styles.activeTypeText : styles.typeButtonText}>Urgent</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.typeButton, newReminder.type === "Not Urgent" && styles.activeTypeButton]}
                    onPress={() => setNewReminder({...newReminder, type: "Not Urgent"})}
                  >
                    <Text style={newReminder.type === "Not Urgent" ? styles.activeTypeText : styles.typeButtonText}>Not Urgent</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput 
                  style={[styles.input, styles.textArea]} 
                  multiline 
                  placeholder="Additional details..."
                  placeholderTextColor="#B4A594"
                  value={newReminder.description} 
                  onChangeText={(t) => setNewReminder({...newReminder, description: t})} 
                />
              </View>
              
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleSaveReminder}>
                <Text style={[styles.btnText, styles.submitBtnText]}>{isEditing ? "Save" : "Add"}</Text>
              </TouchableOpacity>
            </View>
            
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <Navbar activeTab="reminders" />
    </View>
  );
}
