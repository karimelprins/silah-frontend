import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./lifestorystyles"; 
import { API_BASE_URL } from "../../../src/config/ApiConfig.js";
import Navbar from "../../components/FamilyNavbar.js";

export default function FamilyLifeStory() {
  const [patientName, setPatientName] = useState("your loved one");
  const [existingKeywords, setExistingKeywords] = useState([]); 
  const [newKeywords, setNewKeywords] = useState([]); 
  const [inputText, setInputText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const brownColor = "#4C2A13";

  const fetchData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };

      const [nameRes, storyRes] = await Promise.all([
        fetch(`${API_BASE_URL}/user/linked-patient`, { headers }),
        fetch(`${API_BASE_URL}/life-story`, { headers })
      ]);

      if (nameRes.ok) {
        const nameData = await nameRes.json();
        setPatientName(nameData.patient_name || "your loved one");
      }

      if (storyRes.ok) {
        const storyData = await storyRes.json();
        if (storyData.content) {
          const words = storyData.content.split(",").map(w => w.trim());
          setExistingKeywords(words);
        }
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddKeyword = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const lowerInput = trimmed.toLowerCase();
    const isDuplicate = 
      existingKeywords.some(kw => kw.toLowerCase() === lowerInput) || 
      newKeywords.some(kw => kw.toLowerCase() === lowerInput);

    if (isDuplicate) {
      setErrorText("It's already there!");
    } else {
      setNewKeywords([...newKeywords, trimmed]);
      setInputText("");
      setErrorText("");
    }
  };

  const handleInputChange = (text) => {
    setInputText(text);
    if (errorText) setErrorText(""); 
  };

  const submitStory = async () => {
    if (newKeywords.length === 0) return;
    try {
      setIsSubmitting(true);
      const token = await AsyncStorage.getItem("access_token");
      const allContent = [...existingKeywords, ...newKeywords].join(", ");
      const response = await fetch(`${API_BASE_URL}/life-story`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: allContent }),
      });

      if (response.ok) {
        Alert.alert("Success", "Life story updated!");
        setExistingKeywords([...existingKeywords, ...newKeywords]);
        setNewKeywords([]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save keywords.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#FDFBFA" }}>
        <ActivityIndicator size="large" color={brownColor} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.customHeader}>
        <Text style={styles.headerTitle}>Life Story</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.descriptionText}>
          Describe {patientName} best.. their interests, hobbies and important aspects in life.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Add Keywords</Text>
          <View style={styles.tagCloud}>
            {existingKeywords.map((word, i) => (
              <View key={`old-${i}`} style={[styles.tag, styles.existingTag]}>
                <Text style={styles.existingTagText}>{word}</Text>
                <Ionicons name="lock-closed" size={12} color="#B4A594" style={{marginLeft: 5}}/>
              </View>
            ))}
            {newKeywords.map((word, i) => (
              <View key={`new-${i}`} style={styles.tag}>
                <Text style={styles.tagText}>{word}</Text>
                <TouchableOpacity onPress={() => setNewKeywords(newKeywords.filter((_, idx) => idx !== i))}>
                  <Ionicons name="close-circle" size={18} color={brownColor} style={{marginLeft: 5}}/>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Add interests, hobbies..."
              value={inputText}
              onChangeText={handleInputChange}
              onSubmitEditing={handleAddKeyword}
            />
            {inputText.length > 0 && (
              <TouchableOpacity 
                onPress={() => { setInputText(""); setErrorText(""); }} 
                style={{paddingRight: 10}}
              >
                <Ionicons name="close" size={20} color="#B4A594" />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.addButton} onPress={handleAddKeyword}>
              <Ionicons name="add" size={28} color="#FFF" />
            </TouchableOpacity>
          </View>

          {errorText ? <Text style={styles.errorLabel}>{errorText}</Text> : null}

          {newKeywords.length > 0 && (
            <TouchableOpacity style={styles.saveButton} onPress={submitStory} disabled={isSubmitting}>
              {isSubmitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveText}>Save Changes</Text>}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <Navbar activeTab="lifestory" />
    </SafeAreaView>
  );
}