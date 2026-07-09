import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Audio } from "expo-av";
import Icon from "react-native-vector-icons/MaterialIcons";
import { API_BASE_URL } from "../../../src/config/ApiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./chatPagestyles";
import PatientNavbar from "../../components/PatientNavbar.js";

export default function ChatPage() {
  const router = useRouter();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const flatListRef = useRef(null);
  const soundRef = useRef(null);
  const recordingRef = useRef(null);

  const conversationIdRef = useRef(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const fetchFullHistory = async () => {
      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem("access_token");
        const res = await fetch(`${API_BASE_URL}/chat/all-history`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        if (res.ok) {
          const history = await res.json();
          const formatted = history.map((msg, index) => ({
            id: `history-${index}-${msg.timestamp}`,
            role: msg.role,
            content: msg.content,
            audio_data: null,
          }));

          if (formatted.length > 0) {
            setMessages(formatted);
          } else {
            setMessages([{
              id: "welcome",
              role: "assistant",
              content: "Hello! I'm Silah. What would you like to talk about today?",
            }]);
          }
        }
      } catch (e) {
        console.error("LOAD HISTORY ERROR", e);
        Alert.alert("Error", "Could not load chat history.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFullHistory();

    return () => {
      if (soundRef.current) soundRef.current.unloadAsync();
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 200);
  }, [messages]);

  const startRecording = async () => {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) {
        Alert.alert("Permission denied", "Microphone access is required");
        return;
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      recordingRef.current = recording;
      setIsRecording(true);
    } catch (e) {
      console.error("START RECORD ERROR", e);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recordingRef.current || isLoading) return;
      const recording = recordingRef.current;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      recordingRef.current = null;
      setIsRecording(false);

      if (!uri) return;

      setMessages((prev) => [...prev, { id: "voice-" + Date.now(), role: "user", content: "🎤 Voice message sent" }]);
      
      setIsLoading(true);
      const token = await AsyncStorage.getItem("access_token");
      const formData = new FormData();
      
      formData.append("conversation_id", conversationIdRef.current);
      formData.append("audio", { uri, name: "voice.m4a", type: "audio/m4a" });

      const res = await fetch(`${API_BASE_URL}/chat/ai`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      setMessages((prev) => [...prev, {
        id: "ai-" + Date.now(),
        role: "assistant",
        content: data.ai_text,
        audio_data: data.audio_base64,
      }]);

      if (data.audio_base64) playBase64Audio(data.audio_base64);
    } catch (e) {
      console.error("VOICE SEND ERROR", e);
    } finally {
      setIsLoading(false);
    }
  };

  const playBase64Audio = async (base64) => {
    if (!base64) return;
    try {
      if (soundRef.current) await soundRef.current.unloadAsync();
      const { sound } = await Audio.Sound.createAsync({ uri: `data:audio/mp3;base64,${base64}` });
      soundRef.current = sound;
      await sound.playAsync();
    } catch (e) {
      console.error("PLAY AUDIO ERROR", e);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;
    const text = inputText.trim();
    setInputText("");

    setMessages((prev) => [...prev, { id: "user-" + Date.now(), role: "user", content: text }]);
    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem("access_token");
      const formData = new FormData();
      
      formData.append("conversation_id", conversationIdRef.current);
      formData.append("message", text);

      const res = await fetch(`${API_BASE_URL}/chat/ai`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      setMessages((prev) => [...prev, {
        id: "ai-" + Date.now(),
        role: "assistant",
        content: data.ai_text,
        audio_data: data.audio_base64,
      }]);

      if (data.audio_base64) playBase64Audio(data.audio_base64);
    } catch (e) {
      console.error("TEXT SEND ERROR", e);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.role === "user";
    return (
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
        <Text style={styles.messageText}>{item.content}</Text>
        {!isUser && item.audio_data && (
          <TouchableOpacity onPress={() => playBase64Audio(item.audio_data)}>
            <Ionicons name="volume-medium-outline" size={20} color="#795548" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <ImageBackground 
      source={require("../../../assets/gemi.jpg")} 
      style={{ flex: 1 }} 
      resizeMode="cover"
    >
      <KeyboardAvoidingView 
        style={[styles.container, { backgroundColor: 'transparent' }]} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
      >
        <View style={[styles.header, { justifyContent: 'center' }]}>
          <View style={styles.headerCenterContainer}>
            <Text style={styles.headerTitle}>Silah</Text>
            <Text style={styles.headerSubtitle}>Your Daily Conversation</Text>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          style={{ backgroundColor: 'transparent' }} 
          contentContainerStyle={[styles.messagesContainer, { paddingBottom: 10, backgroundColor: 'transparent' }]}
        />

        {isLoading && <ActivityIndicator style={{ margin: 10 }} color="#795548" />}

        <View style={[styles.inputContainer, { marginBottom: 60, backgroundColor: 'transparent' }]}>
          <TouchableOpacity
            onPress={async () => (isRecording ? await stopRecording() : await startRecording())}
            style={[styles.micButton, { backgroundColor: isRecording ? "#FF4444" : "#795548" }]}
          >
            <Ionicons name="mic" size={24} color="#fff" />
          </TouchableOpacity>

          <TextInput
style={[
              styles.textInput, 
              { 
                backgroundColor: '#FFFFFF', 
                borderRadius: 20,           
                paddingHorizontal: 15,     
              }
            ]}            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor="#A0A0A0"
          />

          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Icon name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <PatientNavbar activeTab="chat" /> 
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}





