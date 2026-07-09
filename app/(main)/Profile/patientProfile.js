import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Image, ActivityIndicator, Alert, Platform, Modal, StatusBar
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../../src/config/ApiConfig.js";
import PatientNavbar from "../../components/PatientNavbar.js";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    full_name: "",
    phone_number: "",
    email: "", 
    profile_photo: null,
  });

  const [originalData, setOriginalData] = useState(null);
  const [community, setCommunity] = useState([]);

  const [profileStatus, setProfileStatus] = useState("");
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) return router.replace("/login/login");

      const res = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      
      const data = await res.json();
      if (res.ok) {
        const mappedData = {
          full_name: data.full_name || data.patient_name || "",
          phone_number: data.phone_number || data.phone || "",
          email: data.email || "", 
          profile_photo: data.profile_pic || data.photo_url || null,
        };
        setProfileData(mappedData);
        setOriginalData(mappedData);
        setCommunity(data.community_members || []); 
      }
    } catch (error) {
      console.error("Profile Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setStatusMessage({ text: "", type: "" });

    if (newPassword !== confirmPassword) {
      return setStatusMessage({ text: "Passwords do not match.", type: "error" });
    }
    if (!passwordRegex.test(newPassword)) {
      return setStatusMessage({ text: "Requirement: 8+ chars, Uppercase, Lowercase & Number", type: "error" });
    }

    try {
      const token = await AsyncStorage.getItem("access_token");
      const response = await fetch(`${API_BASE_URL}/user/change-password`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword, confirm_password: confirmPassword })
      });

      const result = await response.json();

      if (response.ok) {
        setStatusMessage({ text: "Password changed successfully!", type: "success" });
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
        setTimeout(() => { 
          setPasswordModalVisible(false); 
          setStatusMessage({ text: "", type: "" }); 
        }, 2000);
      } else {
        console.log("Server Error:", result);
        setStatusMessage({ text: result.detail || "Incorrect current password", type: "error" });
      }
    } catch (error) { 
      setStatusMessage({ text: "Network failed.", type: "error" }); 
    }
  };

  const handleCancel = () => {
    setProfileData(originalData); 
    setIsEditing(false);
    setProfileStatus("");
  };

  const handlePickImage = async () => {
    if (!isEditing) return;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        setProfileStatus("Gallery access denied.");
        return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfileData({ ...profileData, profile_photo: result.assets[0].uri });
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("access_token");
      const formData = new FormData();
      formData.append('full_name', profileData.full_name);
      formData.append('phone_number', profileData.phone_number);

      if (profileData.profile_photo && profileData.profile_photo !== originalData.profile_photo) {
        const filename = profileData.profile_photo.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        formData.append('photo', { uri: profileData.profile_photo, name: filename, type });
      }

      const res = await fetch(`${API_BASE_URL}/user/update-profile`, {
        method: "PUT", 
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setOriginalData(profileData);
        setIsEditing(false);
        setProfileStatus("Profile updated successfully!");
        setTimeout(() => setProfileStatus(""), 3000);
      } else {
        setProfileStatus("Update failed on server.");
      }
    } catch (error) {
      setProfileStatus("Save failed. Network error.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#4C2A13" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 130 }}>
        <View style={styles.header}>
          <View style={{ width: 24 }} /> 
          <Text style={styles.headerTitle}>My Profile</Text>
          {!isEditing ? (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          ) : ( <View style={{ width: 40 }} /> )}
        </View>

        <View style={styles.photoSection}>
          <TouchableOpacity onPress={handlePickImage} disabled={!isEditing}>
            <Image 
              source={{ uri: profileData.profile_photo || `https://ui-avatars.com/api/?name=${profileData.full_name}&background=FAEDCD&color=4C2A13` }} 
              style={styles.profileImg} 
            />
            {isEditing && (
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={18} color="#FFF" />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.userName}>{profileData.full_name || "Patient Name"}</Text>
        </View>

        <View style={styles.infoCard}>
          <InfoRow label="Full Name" value={profileData.full_name} isEditing={isEditing} 
            onChange={(text) => setProfileData({...profileData, full_name: text})} icon="account" />
          <InfoRow label="Phone" value={profileData.phone_number} isEditing={isEditing} keyboard="phone-pad"
            onChange={(text) => setProfileData({...profileData, phone_number: text})} icon="phone" />          
          
          <View style={[styles.row, { opacity: 0.6, borderBottomWidth: 0 }]}>
            <MaterialCommunityIcons name="email-lock" size={20} color="#BC6C25" style={{ marginRight: 15 }} />
            <View>
              <Text style={styles.labelText}>Email (Unchangeable)</Text>
              <Text style={styles.valueText}>{profileData.email}</Text>
            </View>
          </View>

          <TouchableOpacity style={{ marginTop: 10 }} onPress={() => setPasswordModalVisible(true)}>
             <Text style={{ color: '#BC6C25', fontWeight: 'bold', textDecorationLine: 'underline' }}>Change Password</Text>
          </TouchableOpacity>

          {profileStatus !== "" && (
            <Text style={styles.profileStatusText}>{profileStatus}</Text>
          )}

          {isEditing && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveFullBtn} onPress={saveProfile}>
                <Text style={styles.saveFullBtnText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelFullBtn} onPress={handleCancel}>
                <Text style={styles.cancelFullBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.communityHeader}>
          <Text style={styles.sectionTitle}>My Community</Text>
          <MaterialCommunityIcons name="account-group" size={24} color="#BC6C25" />
        </View>

        {community.map((member, index) => {
          const imageUrl = member.profile_pic 
            ? (member.profile_pic.startsWith('http') ? member.profile_pic : `${API_BASE_URL}${member.profile_pic}`)
            : `https://ui-avatars.com/api/?name=${member.full_name}&background=FAEDCD&color=4C2A13`;

          return (
            <View key={index} style={styles.memberCard}>
              <Image source={{ uri: imageUrl }} style={styles.memberImg} />
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.full_name}</Text>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{member.role ? member.role.replace("_", " ") : "Family"}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {        }
      <Modal visible={passwordModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.cardTitle}>Change Password</Text>
            
            <Text style={styles.modalLabel}>Current Password</Text>
            <TextInput style={styles.inputStyle} placeholder="Current Password" secureTextEntry value={currentPassword} onChangeText={setCurrentPassword} />
            
            <Text style={styles.modalLabel}>New Password</Text>
            <TextInput 
              style={[styles.inputStyle, newPassword.length > 0 && !passwordRegex.test(newPassword) && { borderBottomColor: 'red' }]} 
              placeholder="New Password" 
              secureTextEntry 
              value={newPassword}
              onChangeText={setNewPassword} 
            />
            {newPassword.length > 0 && !passwordRegex.test(newPassword) && (
              <Text style={styles.errorHint}>8+ chars, Uppercase, Lowercase & Number</Text>
            )}

            <Text style={styles.modalLabel}>Confirm New Password</Text>
            <TextInput style={styles.inputStyle} placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
            {confirmPassword.length > 0 && (
              <Text style={[styles.matchHint, { color: newPassword === confirmPassword ? '#606C38' : 'red' }]}>
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
                <Text style={{ color: '#D62828', fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleChangePassword}>
                <Text style={{ color: '#BC6C25', fontWeight: 'bold' }}>Update Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <PatientNavbar activeTab="profile" />
    </View>
  );
}

const InfoRow = ({ label, value, isEditing, onChange, keyboard, icon }) => (
  <View style={styles.row}>
    <MaterialCommunityIcons name={icon} size={20} color="#BC6C25" style={{ marginRight: 15 }} />
    <View style={{ flex: 1 }}>
      <Text style={styles.labelText}>{label}</Text>
      {isEditing ? (
        <TextInput style={styles.input} value={value} onChangeText={onChange} keyboardType={keyboard || "default"} />
      ) : (
        <Text style={styles.valueText}>{value || "---"}</Text>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FEFAE0" },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#4C2A13' },
  editBtnText: { color: '#BC6C25', fontWeight: 'bold', fontSize: 16 },
  photoSection: { alignItems: 'center', marginBottom: 25 },
  profileImg: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#FFF' },
  cameraIcon: { position: 'absolute', bottom: 5, right: 5, backgroundColor: '#BC6C25', padding: 8, borderRadius: 20 },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#4C2A13', marginTop: 15 },
  infoCard: { backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 30, padding: 25, elevation: 4 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#FDFCF0', paddingBottom: 10 },
  labelText: { fontSize: 11, color: '#A98467', textTransform: 'uppercase' },
  valueText: { fontSize: 16, color: '#4C2A13', fontWeight: '700', marginTop: 4 },
  input: { borderBottomWidth: 1, borderBottomColor: '#BC6C25', fontSize: 16, color: '#4C2A13', fontWeight: '700' },
  buttonContainer: { marginTop: 20 },
  saveFullBtn: { backgroundColor: '#BC6C25', padding: 15, borderRadius: 15, alignItems: 'center', marginBottom: 10 },
  saveFullBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  cancelFullBtn: { padding: 10, alignItems: 'center' },
  cancelFullBtnText: { color: '#D62828', fontWeight: '600', fontSize: 14 },
  communityHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30, marginTop: 35, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#4C2A13', marginRight: 10 },
  memberCard: { flexDirection: 'row', backgroundColor: '#FFF', marginHorizontal: 20, marginBottom: 12, padding: 15, borderRadius: 25, alignItems: 'center', elevation: 2 },
  memberImg: { width: 65, height: 65, borderRadius: 32.5, backgroundColor: '#FAEDCD' },
  memberInfo: { marginLeft: 15, flex: 1 },
  memberName: { fontSize: 17, fontWeight: 'bold', color: '#4C2A13' },
  tag: { backgroundColor: '#FAD2E1', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 15, marginVertical: 5 },
  tagText: { fontSize: 11, color: '#D62828', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', padding: 25, borderRadius: 30 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#4C2A13', marginBottom: 20 },
  modalLabel: { fontSize: 12, color: '#BC6C25', fontWeight: '600', marginBottom: 2 },
  inputStyle: { borderBottomWidth: 1, borderBottomColor: '#BC6C25', marginBottom: 15, padding: 8, fontSize: 15, color: '#4C2A13' },
  profileStatusText: { color: '#606C38', fontSize: 13, fontWeight: 'bold', textAlign: 'center', marginTop: 15 },
  errorHint: { fontSize: 10, color: 'red', marginTop: -12, marginBottom: 10 },
  matchHint: { fontSize: 11, marginTop: -10, marginBottom: 10, fontWeight: '600' },
  statusBox: { padding: 10, borderRadius: 10, marginBottom: 15, alignItems: 'center' },
  successBox: { backgroundColor: '#E8F5E9' },
  errorBox: { backgroundColor: '#FFEBEE' },
  successText: { color: '#2E7D32', fontWeight: '600' },
  errorMsgText: { color: '#C62828', fontWeight: '600' }
});