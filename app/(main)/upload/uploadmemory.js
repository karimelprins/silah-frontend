import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  TextInput,
  Platform,
  Modal,
  TouchableWithoutFeedback, 
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

import { styles } from "./uploadstyles";
import { API_BASE_URL } from "../../../src/config/ApiConfig.js";
import Navbar from "../../components/FamilyNavbar.js";

export default function UploadMemory() {
  const router = useRouter();
  
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [memoryType, setMemoryType] = useState("GENERAL"); 
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [memoryDate, setMemoryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [patientData, setPatientData] = useState({ name: "your loved one", id: null });
  const [authorId, setAuthorId] = useState(null);

  const memoryOptions = ["HOBBY", "EVENT", "GENERAL"];

  useEffect(() => {
    const getInitialData = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        const response = await fetch(`${API_BASE_URL}/user/patient-info`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setPatientData({ name: data.full_name || "your loved one", id: data.id });
          setAuthorId(data.current_user_id); 
        }
      } catch (error) { console.error(error); }
    };
    getInitialData();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "We need camera roll permissions to upload memories.");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!image || !title.trim() || !description.trim()) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return; 
    }
    setUploading(true);
    try {
      const token = await AsyncStorage.getItem("access_token");
      const formData = new FormData();
      const uriParts = image.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append("files", {
        uri: Platform.OS === "ios" ? image.replace("file://", "") : image,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });
      formData.append("patient_id", String(patientData.id));
      formData.append("author_id", String(authorId));
      formData.append("title", title);
      formData.append("description", description);
      formData.append("memory_type", memoryType);
      formData.append("memory_date", memoryDate.toISOString().split('T')[0]);

      const response = await fetch(`${API_BASE_URL}/memory/upload/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        Alert.alert("Success", "Memory uploaded!");
        router.replace("/role/family/familyHomePage");
      }
    } catch (e) {
      Alert.alert("Error", "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const getBorderStyle = (fieldName) => ({
    borderColor: focusedField === fieldName ? '#7A4A2E' : '#D4C3A3',
    borderWidth: focusedField === fieldName ? 2 : 1,
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: '#FFF', fontSize: 24, fontWeight: 'bold' }}>Silah</Text>
            <MaterialCommunityIcons name="leaf" size={20} color="#606C38" style={{ marginLeft: 5 }} />
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View style={styles.patientLabel}>
                <Text style={styles.patientLabelText}>Create Memory for {String(patientData.name)}</Text>
            </View>
        </View>

        <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <View style={{ alignItems: 'center' }}>
              <MaterialCommunityIcons name="camera-plus" size={60} color="#FFF" />
              <Text style={styles.uploadBoxTitle}>Add Photo/Video</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <Text style={styles.inputLabel}>Title</Text>
          <TextInput 
            style={[styles.input, getBorderStyle('title')]} 
            placeholder="e.g., Graduation Day" 
            onFocus={() => setFocusedField('title')}
            onBlur={() => setFocusedField(null)}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.inputLabel}>Story</Text>
          <TextInput 
            style={[styles.input, { height: 100 }, getBorderStyle('description')]} 
            multiline
            placeholder="What happened?..." 
            onFocus={() => setFocusedField('description')}
            onBlur={() => setFocusedField(null)}
            value={description}
            onChangeText={setDescription}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', zIndex: 10 }}>
            <View style={{ width: '48%' }}>
              <Text style={styles.inputLabel}>Date</Text>
              <TouchableOpacity 
                style={[styles.datePickerBtn, getBorderStyle('date')]} 
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: '#4C2A13' }}>{memoryDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
            </View>

            <View style={{ width: '48%' }}>
              <Text style={styles.inputLabel}>Type</Text>
              <TouchableOpacity 
                style={[styles.input, getBorderStyle('type'), { justifyContent: 'center' }]} 
                onPress={() => setShowTypePicker(true)}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: '#4C2A13', fontSize: 13 }}>{memoryType}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={18} color="#7A4A2E" />
                </View>
              </TouchableOpacity>

              {/* --- COMPACT SIDE DROPDOWN --- */}
              <Modal visible={showTypePicker} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={() => setShowTypePicker(false)}>
                  <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.1)' }}>
                    {/* Positioned relatively near the input box area */}
                    <View style={{ 
                        position: 'absolute', 
                        top: '65%', 
                        right: '5%', 
                        width: 140,
                        backgroundColor: '#F7F4EB',
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: '#D4C3A3',
                        elevation: 5,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                    }}>
                        {memoryOptions.map((option) => (
                          <TouchableOpacity 
                            key={option} 
                            style={{ 
                                padding: 12, 
                                borderBottomWidth: option !== "GENERAL" ? 1 : 0, 
                                borderBottomColor: '#EEE1C5' 
                            }}
                            onPress={() => {
                              setMemoryType(option);
                              setShowTypePicker(false);
                            }}
                          >
                            <Text style={{ 
                                color: memoryType === option ? '#7A4A2E' : '#4A3B2F',
                                fontWeight: memoryType === option ? 'bold' : 'normal',
                                fontSize: 13
                            }}>
                                {option}
                            </Text>
                          </TouchableOpacity>
                        ))}
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            </View>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker 
            value={memoryDate} 
            mode="date" 
            onChange={(e, d) => { setShowDatePicker(false); if(d) setMemoryDate(d); }} 
          />
        )}

        <TouchableOpacity
          activeOpacity={0.6}
          style={[styles.mainBtn, (!image || !title || !description) && { backgroundColor: '#A89F91' }]}
          onPress={handleUpload}
          disabled={uploading}
        >
          {uploading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.mainBtnText}>Upload Memory</Text>}
        </TouchableOpacity>

        <TouchableOpacity 
           style={{ marginTop: 15, marginBottom: 30, alignItems: 'center' }} 
           onPress={() => { setImage(null); setTitle(""); setDescription(""); setMemoryType("GENERAL"); }}
        >
          <Text style={{ color: '#BC6C25', textDecorationLine: 'underline' }}>Clear Form</Text>
        </TouchableOpacity>
      </ScrollView>

      <Navbar activeTab="upload" />
    </SafeAreaView>
  );
}