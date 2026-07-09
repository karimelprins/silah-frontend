import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "../../../src/config/ApiConfig.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OnThisDay() {
  const router = useRouter();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  const todayDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");

      const response = await fetch(`${API_BASE_URL}/memories/on-this-day`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (Array.isArray(data)) {
        setMemories(data);
      } else if (data && Array.isArray(data.memories)) {
        setMemories(data.memories);
      } else {
        setMemories([]);
      }
    } catch (e) {
      console.error("Error fetching memories:", e);
      setMemories([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const MemoryItem = ({ item }) => {
    const dateStr = formatDate(item.memory_date);
    const hasMedia = item.media_files && item.media_files.length > 0;
    const imageUrl = hasMedia
      ? `${API_BASE_URL}${item.media_files[0].file_path}`
      : null;

    return (
      // Changed from TouchableOpacity to a static View wrapper
      <View style={styles.card}>
        <Image
          source={
            imageUrl ? { uri: imageUrl } : require("../../../assets/new1.png")
          }
          style={styles.memoryImage}
        />

        <View style={styles.textContainer}>
          <View style={styles.cardHeader}>
            <Text style={styles.dateText}>{dateStr}</Text>
          </View>

          <Text style={styles.titleText} numberOfLines={1}>
            {item.title || "Untitled Memory"}
          </Text>

          {item.description ? (
            <Text style={styles.descriptionText} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}

          <View style={styles.authorContainer}>
            <Ionicons name="person-circle-outline" size={16} color="#795548" />
            <Text style={styles.authorText}>
              {" "}
              {item.author_name || "Unknown Author"}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerSilah}>Silah</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.pageTitle}>On This Day</Text>
        <Text style={styles.pageSubtitle}>{todayDate}</Text>

        {loading ? (
          <ActivityIndicator color="#7A4A2E" size="large" />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {memories.length > 0 ? (
              <View style={styles.listContainer}>
                {memories.map((m, i) => (
                  <MemoryItem key={m.memory_id || i} item={m} />
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>No memories found for today.</Text>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F4EB" },
  header: {
    backgroundColor: "#7A4A2E",
    padding: 20,
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  headerSilah: {
    color: "#FFF",
    fontSize: 22,
    marginLeft: "35%",
    fontWeight: "bold",
  },
  content: { flex: 1, padding: 20 },
  pageTitle: {
    fontSize: 32,
    color: "#4A3B2F",
    textAlign: "center",
    fontWeight: "bold",
  },
  pageSubtitle: {
    fontSize: 18,
    color: "#4A3B2F",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#795548",
    fontSize: 16,
  },
  listContainer: { paddingBottom: 20 },
  card: {
    flexDirection: "row",
    backgroundColor: "#FDF5E6",
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#D4C3A3",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  memoryImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: "#E0E0E0",
  },
  textContainer: { marginLeft: 12, flex: 1, justifyContent: "center" },
  cardHeader: { marginBottom: 4 },
  dateText: {
    fontSize: 12,
    color: "#A38A75",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  titleText: {
    fontSize: 18,
    color: "#4A3B2F",
    fontWeight: "bold",
    marginBottom: 4,
  },
  descriptionText: { fontSize: 14, color: "#6D5D50", marginBottom: 8 },
  authorContainer: { flexDirection: "row", alignItems: "center" },
  authorText: { fontSize: 12, color: "#795548", fontWeight: "500" },
});