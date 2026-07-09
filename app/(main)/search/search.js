import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./searchstyles.js";
import { API_BASE_URL } from "../../../src/config/ApiConfig.js";

export default function SearchPage() {
  const router = useRouter();

  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [personInfo, setPersonInfo] = useState(null);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Needed", "We need gallery access to identify faces.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      resetSearchState();
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Needed", "We need camera access to take a photo.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      resetSearchState();
    }
  };

  const resetSearchState = () => {
    setHasSearched(false);
    setPersonInfo(null);
    setResults([]);
  };

  const clearPhoto = () => {
    setPhoto(null);
    resetSearchState();
  };

  const handleSearch = async () => {
    if (!photo) {
      Alert.alert("No Photo", "Please upload a photo first.");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) throw new Error("Session expired. Please log in again.");

      const formData = new FormData();
      formData.append("file", {
        uri: photo,
        name: `search_${Date.now()}.jpg`,
        type: "image/jpeg",
      });

      const response = await fetch(`${API_BASE_URL}/search/memory-by-face`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("The AI couldn't find a match in your memories.");
      }

      const data = await response.json();
      setResults(data);

      if (data && data.length > 0) {
        setPersonInfo({
          name: "Person Recognized",
          status: "Found in your memories",
          count: data.length,
        });
      } else {
        setPersonInfo(null);
      }
    } catch (err) {
      console.error("Search Error:", err.message);
      setPersonInfo(null);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMemory = ({ item, index }) => (
    <View style={styles.roadmapItem}>
      <View style={styles.timelineLeft}>
        <View style={styles.timelineDot} />
        {index !== results.length - 1 && <View style={styles.timelineLine} />}
      </View>

      <TouchableOpacity
        style={styles.memoryCard}
        onPress={() =>
          router.push({
            pathname: "road/road",
            params: { highlightId: item.memory_id || item.id },
          })
        }
      >
        <Text style={styles.memoryDate}>{item.memory_date || "Past Event"}</Text>
        <Text style={styles.memoryTitle}>{item.title}</Text>
        {item.description && <Text style={styles.memoryDescription}>{item.description}</Text>}
        {item.author_name && <Text style={styles.memoryAuthor}>By: {item.author_name}</Text>}
        {item.media_links?.[0]?.media?.file_path && (
          <Image
            source={{
              uri: `${API_BASE_URL.replace("/api/v1", "")}/${item.media_links[0].media.file_path.replace(/^\//, "")}`,
            }}
            style={styles.memoryThumbnail}
          />
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#D8C4A8', backgroundColor: '#7A4A2E', paddingTop: 40, paddingBottom: 5 }}>
        <View style={{ flex: 1, alignItems: 'flex-start' }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
            <Ionicons name="arrow-back" size={28} color="#F5E6D3" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 3, alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: '600', color: '#F5E6D3' }}>Silah</Text>
          <Text style={{ fontSize: 18, color: '#D8C4A8', marginTop: 4 }}>Search by Person</Text>
        </View>
        <View style={{ flex: 1 }} />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item, index) => item.memory_id?.toString() || index.toString()}
        renderItem={renderMemory}
        ListHeaderComponent={
          <View style={{ paddingBottom: 10 }}>
            <View style={styles.photoSection}>
              {!photo ? (
                <View style={[styles.uploadButton, { overflow: 'hidden', paddingBottom: 0 }]}>
                  <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 20 }}>
                    <Ionicons name="person-add-outline" size={50} color="#795548" />
                    <Text style={[styles.uploadButtonText, { marginTop: 10 }]}>Search Person</Text>
                  </View>
                  
                  {/* Transparent Dim Layout for choices */}
                  <View style={{ 
                    flexDirection: 'row', 
                    backgroundColor: 'rgba(0,0,0,0.05)', 
                    borderTopWidth: 1, 
                    borderTopColor: '#E0E0E0',
                    width: '100%'
                  }}>
                    <TouchableOpacity 
                      onPress={takePhoto}
                      style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderRightWidth: 1, borderRightColor: '#E0E0E0' }}
                    >
                      <Ionicons name="camera" size={20} color="#795548" />
                      <Text style={{ marginLeft: 8, fontWeight: '600', color: '#795548' }}>Camera</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      onPress={pickPhoto}
                      style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15 }}
                    >
                      <Ionicons name="image" size={20} color="#795548" />
                      <Text style={{ marginLeft: 8, fontWeight: '600', color: '#795548' }}>Album</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.previewContainer}>
                  <Image source={{ uri: photo }} style={styles.photoPreview} resizeMode="cover" />
                  <TouchableOpacity style={styles.closeButton} onPress={clearPhoto}>
                    <Ionicons name="close-circle" size={32} color="#D32F2F" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[styles.searchButton, (!photo || isLoading) && { opacity: 0.6 }]}
              onPress={handleSearch}
              disabled={!photo || isLoading}
            >
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.searchButtonText}>Search Memories</Text>}
            </TouchableOpacity>

            {personInfo && (
              <View style={styles.personCard}>
                <Text style={styles.personName}>{personInfo.name}</Text>
                <View style={styles.infoRow}>
                  <Ionicons name="people-outline" size={16} color="#8D6E63" />
                  <Text style={styles.infoDetail}> {personInfo.status}</Text>
                </View>
                <Text style={styles.roadmapHeader}>Memory Road Map</Text>
              </View>
            )}

            {!isLoading && hasSearched && results.length === 0 && (
              <View style={{ padding: 40, alignItems: "center" }}>
                <Ionicons name="alert-circle-outline" size={48} color="#D32F2F" />
                <Text style={styles.noRecognition}>No memories found for this face.</Text>
              </View>
            )}
          </View>
        }
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </SafeAreaView>
  );
}