import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, Image, ScrollView, SafeAreaView, TouchableOpacity,
  ActivityIndicator, RefreshControl, StatusBar, TextInput, Alert, StyleSheet, Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { API_BASE_URL } from "../../../src/config/ApiConfig.js";
import Navbar from "../../components/FamilyNavbar.js";

export default function FamilyProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [editBuffer, setEditBuffer] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);


  const [profileStatus, setProfileStatus] = useState("");
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });


  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

  const fetchProfileData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) return router.replace("/login/login");
      const res = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "GET",
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
      });
      const data = await res.json();
      if (res.ok) {
        const mapped = {
          ...data,
          full_name: data.full_name || data.patient_name || "",
          profile_pic: data.profile_pic || data.photo_url || null,
          phone_number: data.phone_number || data.phone || ""
        };
        setUserData(mapped);
        setEditBuffer(mapped);
      }
    } catch (error) { console.error(error); } finally { setLoading(false); setRefreshing(false); }
  }, [router]);

  useEffect(() => { fetchProfileData(); }, [fetchProfileData]);

  const pickImage = async () => {
    if (!isEditing) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.5,
    });
    if (!result.canceled) setEditBuffer({ ...editBuffer, profile_pic: result.assets[0].uri });
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const formData = new FormData();
      formData.append('full_name', editBuffer.full_name || "");
      formData.append('phone_number', editBuffer.phone_number || "");

      if (editBuffer.profile_pic && editBuffer.profile_pic !== userData.profile_pic) {
        const filename = editBuffer.profile_pic.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        formData.append('photo', { uri: editBuffer.profile_pic, name: filename, type });
      }

      const response = await fetch(`${API_BASE_URL}/user/update-profile`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        setUserData(editBuffer);
        setIsEditing(false);
        setProfileStatus("Profile updated successfully!");
        setTimeout(() => setProfileStatus(""), 3000); // Hide after 3 seconds
      }
    } catch (error) {
      setProfileStatus("Update failed. Try again.");
      setTimeout(() => setProfileStatus(""), 3000);
    }
  };

  const handleChangePassword = async () => {
    setStatusMessage({ text: "", type: "" });

    if (newPassword !== confirmPassword) {
      return setStatusMessage({ text: "Passwords do not match.", type: "error" });
    }
    if (!passwordRegex.test(newPassword)) {
      return setStatusMessage({ text: "Password requirements not met.", type: "error" });
    }

    try {
      const token = await AsyncStorage.getItem("access_token");
      const response = await fetch(`${API_BASE_URL}/user/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword
        })
      });

      const result = await response.json();

      if (response.ok) {
        setStatusMessage({ text: "Password updated successfully!", type: "success" });
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
        setTimeout(() => { setPasswordModalVisible(false); setStatusMessage({ text: "", type: "" }); }, 2000);
      } else {
        console.log("Server Error:", result);
        setStatusMessage({ text: result.detail || "Current password is wrong", type: "error" });
      }
    } catch (error) {
      setStatusMessage({ text: "Network failed.", type: "error" });
    }
  };

  if (loading && !refreshing) return <View style={styles.loader}><ActivityIndicator size="large" color="#795548" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}><Text style={styles.headerTitle}>Silah</Text></View>
      <ScrollView contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchProfileData} />}>

        {/* Profile Header */}
        <View style={styles.profileHeaderBlock}>
          <TouchableOpacity onPress={pickImage}>
            <View style={styles.imagePlaceholder}>
              {editBuffer?.profile_pic ? <Image source={{ uri: editBuffer.profile_pic }} style={styles.profileImage} /> : <Ionicons name="person" size={50} color="#B4A594" />}
              {isEditing && <View style={styles.cameraOverlay}><Ionicons name="camera" size={24} color="white" /></View>}
            </View>
          </TouchableOpacity>
        </View>

        {/* Personal Details */}
        <View style={styles.detailsBlock}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Personal Details</Text>
            <TouchableOpacity onPress={() => isEditing ? handleSave() : setIsEditing(true)} style={styles.innerEditBtn}>
              <Ionicons name={isEditing ? "save-outline" : "create-outline"} size={14} color="#FFF" />
              <Text style={styles.innerEditBtnText}>{isEditing ? "Save" : "Edit"}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.fieldLabel}>Full Name</Text>
          <View style={[styles.inputContainer, isEditing && styles.activeInput]}>
            <TextInput editable={isEditing} value={editBuffer?.full_name} style={styles.fieldValue} onChangeText={(val) => setEditBuffer({ ...editBuffer, full_name: val })} />
          </View>

          <View style={styles.row}>
            <View style={{ flex: 2 }}>
              <Text style={styles.fieldLabel}>Phone</Text>
              <View style={[styles.inputContainer, isEditing && styles.activeInput]}>
                <TextInput editable={isEditing} value={editBuffer?.phone_number} style={styles.fieldValue} keyboardType="phone-pad" onChangeText={(val) => setEditBuffer({ ...editBuffer, phone_number: val })} />
              </View>
            </View>
          </View>

          {/* Profile Success Message */}
          {profileStatus !== "" && (
            <Text style={styles.profileStatusText}>{profileStatus}</Text>
          )}
        </View>

        {/* Account Connections & Security */}
        <Text style={styles.sectionTitle}>ACCOUNT & SECURITY</Text>
        <View style={[styles.detailsBlock, { backgroundColor: '#F0EFE9' }]}>
          <Text style={styles.fieldLabel}>Email</Text><Text style={styles.fieldValue}>{userData?.email || "N/A"}</Text>
          <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Connected Patient</Text>
          <View style={styles.lockedRow}><Ionicons name="link" size={16} color="#795548" /><Text style={[styles.fieldValue, { marginLeft: 8 }]}>{userData?.connected_patient_name || "No patient linked"}</Text></View>

          <TouchableOpacity style={{ marginTop: 20 }} onPress={() => setPasswordModalVisible(true)}>
            <Text style={{ color: '#795548', fontWeight: 'bold', textDecorationLine: 'underline' }}>Change Password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Password Modal */}
      <Modal visible={passwordModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.cardTitle, { marginBottom: 20 }]}>Change Password</Text>

            <Text style={styles.inputLabel}>Current Password</Text>
            <TextInput style={styles.inputContainer} placeholder="Enter current password" secureTextEntry value={currentPassword} onChangeText={setCurrentPassword} />

            <Text style={styles.inputLabel}>New Password</Text>
            <TextInput
              style={[styles.inputContainer, newPassword.length > 0 && !passwordRegex.test(newPassword) && { borderColor: 'red', borderWidth: 1 }]}
              placeholder="Enter new password" secureTextEntry value={newPassword} onChangeText={setNewPassword}
            />
            {newPassword.length > 0 && !passwordRegex.test(newPassword) && (
              <Text style={styles.errorText}>8+ chars, Uppercase, Lowercase & Number</Text>
            )}

            <Text style={styles.inputLabel}>Confirm New Password</Text>
            <TextInput style={styles.inputContainer} placeholder="Re-type new password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
            {confirmPassword.length > 0 && (
              <Text style={[styles.matchText, { color: newPassword === confirmPassword ? '#606C38' : 'red' }]}>
                {newPassword === confirmPassword ? "Passwords match ✓" : "Passwords do not match ✗"}
              </Text>
            )}

            {statusMessage.text !== "" && (
              <View style={[styles.statusBox, statusMessage.type === 'success' ? styles.successBox : styles.errorBox]}>
                <Text style={statusMessage.type === 'success' ? styles.successText : styles.errorMsgText}>
                  {statusMessage.text}
                </Text>
              </View>
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <TouchableOpacity onPress={() => { setPasswordModalVisible(false); setStatusMessage({ text: "", type: "" }); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }}>
                <Text style={{ color: '#B4A594', fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleChangePassword}>
                <Text style={{ color: '#795548', fontWeight: 'bold' }}>Update Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Navbar activeTab="profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F4EB' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  header: { height: 100, backgroundColor: "#4C2A13", alignItems: "center", justifyContent: "center", paddingTop: 30 },
  headerTitle: { color: "#FFF", fontSize: 26, fontWeight: "bold", letterSpacing: 2 },
  profileHeaderBlock: { alignItems: 'center', marginTop: 25, marginBottom: 20 },
  imagePlaceholder: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#E8E4D9', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFF', elevation: 3, overflow: 'hidden' },
  profileImage: { width: '100%', height: '100%' },
  cameraOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  detailsBlock: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#4C2A13' },
  innerEditBtn: { backgroundColor: '#795548', flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 15, borderRadius: 15 },
  innerEditBtnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold', marginLeft: 5 },
  fieldLabel: { fontSize: 11, color: '#B4A594', marginBottom: 5, fontWeight: '700', textTransform: 'uppercase' },
  inputContainer: { backgroundColor: '#F7F4EB', borderRadius: 10, paddingHorizontal: 12, height: 45, justifyContent: 'center', marginBottom: 12 },
  activeInput: { borderWidth: 1, borderColor: '#606C38', backgroundColor: '#FFF' },
  fieldValue: { fontSize: 15, color: '#4C2A13', fontWeight: '500' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#B4A594', marginTop: 30, marginBottom: 10, marginLeft: 5 },
  lockedRow: { flexDirection: 'row', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', padding: 20, borderRadius: 20 },
  inputLabel: { fontSize: 12, color: '#795548', fontWeight: '600', marginBottom: 5, marginLeft: 2 },
  errorText: { fontSize: 10, color: 'red', marginTop: -10, marginBottom: 10, marginLeft: 5 },
  matchText: { fontSize: 11, marginTop: -8, marginBottom: 10, marginLeft: 5, fontWeight: '600' },
  statusBox: { padding: 10, borderRadius: 8, marginBottom: 15, alignItems: 'center' },
  successBox: { backgroundColor: '#E8F5E9' },
  errorBox: { backgroundColor: '#FFEBEE' },
  successText: { color: '#2E7D32', fontSize: 13, fontWeight: '600' },
  errorMsgText: { color: '#C62828', fontSize: 13, fontWeight: '600' },
  profileStatusText: { color: '#2E7D32', fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginTop: 10 }
});