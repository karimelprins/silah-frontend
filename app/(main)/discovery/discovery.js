import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import PatientNavbar from "../../components/PatientNavbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../../src/config/ApiConfig";

const STORAGE_KEY = "@silah_discovery_cards";

export default function DiscoveryPage() {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshingCardId, setRefreshingCardId] = useState(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setCards(JSON.parse(saved));
        }
      } catch (e) {
        console.error("Failed to load cached cards", e);
      }

      fetchLifeStory();
      setHasInitialized(true);
    };

    initializeData();
  }, []);

  useEffect(() => {
    const saveCards = async () => {
      if (!hasInitialized) return;
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
      } catch (e) {
        console.error("Failed to save cards", e);
      }
    };
    saveCards();
  }, [cards, hasInitialized]);

  const fetchLifeStory = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("access_token");
      const res = await fetch(`${API_BASE_URL}/ai/life-story`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.cards && Array.isArray(data.cards)) {
          const newFetchedCards = data.cards.map((card) => ({
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            topic: card.topic || "Daily Discovery",
            title: card.title || "Did you know?",
            info: card.info || "No information available.",
          }));

          setCards((prevCards) => {
            const existingTopicsMap = new Map(
              prevCards.map((c) => [c.topic, c]),
            );

            newFetchedCards.forEach((newCard) => {
              if (existingTopicsMap.has(newCard.topic)) {
                const existing = existingTopicsMap.get(newCard.topic);
                existingTopicsMap.set(newCard.topic, {
                  ...existing,
                  title: newCard.title,
                  info: newCard.info,
                });
              } else {
                existingTopicsMap.set(newCard.topic, newCard);
              }
            });

            return Array.from(existingTopicsMap.values());
          });
        }
      }
    } catch (e) {
      console.error("FETCH DISCOVERY ERROR", e);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSingleCard = async (cardId, currentTopic) => {
    setRefreshingCardId(cardId);
    try {
      const token = await AsyncStorage.getItem("access_token");
      const res = await fetch(`${API_BASE_URL}/ai/life-story`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.cards && Array.isArray(data.cards)) {
          const newStory = data.cards.find((c) => c.topic === currentTopic);

          if (newStory) {
            setCards((prevCards) =>
              prevCards.map((card) =>
                card.id === cardId
                  ? { ...card, title: newStory.title, info: newStory.info }
                  : card,
              ),
            );
          }
        }
      }
    } catch (e) {
      console.error("REFRESH ERROR", e);
    } finally {
      setRefreshingCardId(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerCenterContainer}>
            <Text style={styles.headerTitle}>Silah</Text>
            <Text style={styles.headerSubtitle}>
              Your journey, one memory at a time.
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {isLoading && cards.length === 0 ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#7A4A2E" />
              <Text style={styles.loaderText}>Finding your stories...</Text>
            </View>
          ) : (
            cards.map((card) => {
              const isThisCardRefreshing = refreshingCardId === card.id;

              return (
                <View key={card.id} style={styles.card}>
                  <View
                    style={[
                      styles.cardHeader,
                      isThisCardRefreshing && { opacity: 0.5 },
                    ]}
                  >
                    <Image
                      source={require("../../../assets/map.jpg")}
                      style={styles.cardImage}
                    />
                    <View style={styles.cardHeaderText}>
                      <Text style={styles.topicLabel}>TOPIC:</Text>
                      <Text style={styles.topicText}>{card.topic}</Text>
                      <Text style={styles.titleLabel}>TITLE:</Text>
                      <Text style={styles.titleText}>{card.title}</Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.infoContainer,
                      isThisCardRefreshing && { opacity: 0.5 },
                    ]}
                  >
                    <Text style={styles.infoLabel}>INFORMATION:</Text>
                    <Text style={styles.infoText}>{card.info}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={() => refreshSingleCard(card.id, card.topic)}
                    disabled={refreshingCardId !== null}
                  >
                    {isThisCardRefreshing ? (
                      <ActivityIndicator size="small" color="#7A4A2E" />
                    ) : (
                      <FontAwesome name="refresh" size={18} color="#795548" />
                    )}
                  </TouchableOpacity>
                </View>
              );
            })
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
        <PatientNavbar activeTab="discovery" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F7F4EB" },
  container: { flex: 1 },
  header: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#D8C4A8",
    backgroundColor: "#7A4A2E",
    paddingTop: 48,
    paddingBottom: 25,
  },
  headerCenterContainer: { alignItems: "center" },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#F5E6D3",
    textAlign: "center",
  },
  headerSubtitle: { fontSize: 18, color: "#D8C4A8", marginTop: 4 },
  scrollContent: { padding: 16, flexGrow: 1 },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  loaderText: { marginTop: 10, color: "#7A4A2E", fontWeight: "600" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: "#7A4A2E",
    elevation: 4,
  },
  cardHeader: { flexDirection: "row", marginBottom: 15 },
  cardImage: { width: 70, height: 70, borderRadius: 12 },
  cardHeaderText: { flex: 1, marginLeft: 15, justifyContent: "center" },
  topicLabel: { fontSize: 10, color: "#8B5A2B", fontWeight: "bold" },
  topicText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5A3A1E",
    textTransform: "capitalize",
  },
  titleLabel: {
    fontSize: 10,
    color: "#8B5A2B",
    fontWeight: "bold",
    marginTop: 5,
  },
  titleText: { fontSize: 14, fontWeight: "bold", color: "#5A3A1E" },
  infoContainer: { marginTop: 5 },
  infoLabel: { fontSize: 10, color: "#8B5A2B", fontWeight: "bold" },
  infoText: { fontSize: 14, lineHeight: 20, color: "#5A3A1E", marginTop: 5 },
  refreshButton: { position: "absolute", bottom: 15, right: 15 },
});
