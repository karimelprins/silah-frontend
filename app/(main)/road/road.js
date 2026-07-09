

import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    Animated,
    Dimensions,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";

import styles from './roadstyles.js';
import MemoryCardModal from '../../components/MemoryCardModal.js';
import { API_BASE_URL } from "../../../src/config/ApiConfig.js";

const { height: screenHeight } = Dimensions.get('window');
const HEADER_HEIGHT = 80;
const ROAD_IMAGE = require('../../../assets/newww1.png');
const FLIPPED_ROAD_IMAGE = require('../../../assets/neww1.png');
const CARD_HEIGHT = 150;
const ROAD_SEGMENT_HEIGHT = 1000;

const TimelineEventCircle = React.memo(({ event, index, scrollY, onPress }) => {
    const startPos = HEADER_HEIGHT + 120 + index * (CARD_HEIGHT + 40);
    const center = screenHeight / 2 - CARD_HEIGHT / 2;

    const scale = scrollY.interpolate({
        inputRange: [startPos - center - 250, startPos - center, startPos - center + 250],
        outputRange: [0.85, 1.4, 0.85],
        extrapolate: 'clamp'
    });

    const opacity = scrollY.interpolate({
        inputRange: [startPos - center - 300, startPos - center, startPos - center + 300],
        outputRange: [0.5, 1, 0.5],
        extrapolate: 'clamp'
    });

    return (
        <TouchableOpacity onPress={() => onPress(event)} activeOpacity={0.8}>
            <Animated.View style={[styles.timelineCircleContainer, {
                alignSelf: index % 2 === 0 ? 'flex-start' : 'flex-end',
                marginLeft: index % 2 === 0 ? 30 : 0,
                marginRight: index % 2 === 1 ? 30 : 0,
                transform: [{ scale }],
                opacity: opacity,
            }]}>
                <View style={styles.pinShadowWrapper}>
                    <Ionicons name="location" size={42} color="#A3432F" />
                </View>
                <View style={styles.dateLabelBox}>
                    <Text style={styles.pinDateText}>
                        {event.memory_date?.substring(0, 4)}
                    </Text>
                    <Text style={styles.pinDateTextSmall}>
                        {event.memory_date?.substring(5, 10)}
                    </Text>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
});


const PersonFilterModal = ({ isVisible, currentTerm, onApply, onClose }) => {
    const [name, setName] = useState(currentTerm || '');
    useEffect(() => { if (isVisible) setName(currentTerm || ''); }, [isVisible, currentTerm]);

    return (
        <Modal transparent visible={isVisible} animationType="fade">
            <View style={styles.modalBackdrop}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Search by Person</Text>
                        <TextInput style={styles.textInput} placeholder="Type a name..." value={name} onChangeText={setName} />
                        <View style={styles.buttonRow}>
                            <TouchableOpacity onPress={() => { setName(''); onApply(''); onClose(); }}><Text style={{ color: '#8B735B', padding: 5 }}>Clear</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => { onApply(name); onClose(); }}><Text style={{ fontWeight: 'bold', color: '#4A3B2F', padding: 5 }}>Apply</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const DateFilterModal = ({ isVisible, currentTerm, onApply, onClose }) => {
    const [val, setVal] = useState(currentTerm || '');
    useEffect(() => { if (isVisible) setVal(currentTerm || ''); }, [isVisible, currentTerm]);

    return (
        <Modal transparent visible={isVisible} animationType="fade">
            <View style={styles.modalBackdrop}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Search Date</Text>
                        <TextInput style={styles.textInput} placeholder="YYYY-MM-DD" value={val} onChangeText={setVal} />
                        <View style={styles.buttonRow}>
                            <TouchableOpacity onPress={() => { setVal(''); onApply(''); onClose(); }}><Text style={{ color: '#8B735B', padding: 5 }}>Clear</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => { onApply(val); onClose(); }}><Text style={{ fontWeight: 'bold', color: '#4A3B2F', padding: 5 }}>Apply</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};


const Road = () => {
    const router = useRouter();
    const { highlightId } = useLocalSearchParams();
    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollRef = useRef(null);

    const [allEvents, setAllEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [personFilter, setPersonFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [selectedMemory, setSelectedMemory] = useState(null);
    const [isDateModalVisible, setIsDateModalVisible] = useState(false);
    const [isPersonModalVisible, setIsPersonModalVisible] = useState(false);

    const [displayCount, setDisplayCount] = useState(10);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("access_token");
            const resp = await fetch(`${API_BASE_URL}/memories/?limit=200`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const json = await resp.json();
            const data = Array.isArray(json) ? json : (json.results || []);
            setAllEvents(data);
        } catch (err) {
            console.error("Load error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const filteredEvents = useMemo(() => {
        let result = allEvents.filter(event => {
            const matchesPerson = personFilter ? event.author_name?.toLowerCase().includes(personFilter.toLowerCase()) : true;
            const matchesDate = dateFilter ? event.memory_date?.includes(dateFilter) : true;
            return matchesPerson && matchesDate;
        });

        return result.sort((a, b) => {
            const dateA = new Date(a.memory_date || 0);
            const dateB = new Date(b.memory_date || 0);
            return dateA - dateB;
        });
    }, [allEvents, personFilter, dateFilter]);

    const paginatedEvents = useMemo(() => {
        return filteredEvents.slice(Math.max(filteredEvents.length - displayCount, 0));
    }, [filteredEvents, displayCount]);

    const hasMoreOlderEvents = displayCount < filteredEvents.length;

    const [isPaginating, setIsPaginating] = useState(false);

    const handleLoadMore = () => {
        setIsPaginating(true);
        setDisplayCount(prev => prev + 10);

        setTimeout(() => {
            const addedHeight = 10 * (CARD_HEIGHT + 40);
            scrollRef.current?.scrollTo({ y: scrollY._value + addedHeight, animated: false });
            setTimeout(() => setIsPaginating(false), 100);
        }, 50);
    };

    useEffect(() => {
        if (highlightId && filteredEvents.length > 0) {
            const index = paginatedEvents.findIndex(m => String(m.memory_id) === String(highlightId));
            if (index !== -1) {
                const memory = paginatedEvents[index];
                setSelectedMemory(memory);

                const scrollPos = index * (CARD_HEIGHT + 40);
                setTimeout(() => {
                    scrollRef.current?.scrollTo({ y: scrollPos, animated: true });
                }, 500);
            }
        } else if (!highlightId && paginatedEvents.length > 0 && !isPaginating) {
            setTimeout(() => {
                scrollRef.current?.scrollToEnd({ animated: true });
            }, 300);
        }
    }, [highlightId, filteredEvents.length]);

    return (
        <View style={styles.mainContainer}>
            <View style={[styles.parallaxBackgroundContainer, { height: screenHeight }]}>
                {Array.from({ length: Math.ceil(screenHeight / ROAD_SEGMENT_HEIGHT) || 1 }).map((_, i) => (
                    <Image
                        key={i}
                        source={i % 2 ? FLIPPED_ROAD_IMAGE : ROAD_IMAGE}
                        style={[styles.roadSegment, { height: ROAD_SEGMENT_HEIGHT, transform: i % 2 ? [{ scaleY: -1 }] : [] }]}
                        resizeMode="cover"
                    />
                ))}
            </View>

            <Animated.ScrollView
                ref={scrollRef}
                style={styles.foregroundContainer}
                contentContainerStyle={{ paddingTop: HEADER_HEIGHT + 20, paddingBottom: 100 }}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
                scrollEventThrottle={16}
            >
                <View style={styles.scrollContent}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#4A3B2F" style={{ marginTop: 50 }} />
                    ) : (
                        <>
                            {hasMoreOlderEvents && (
                                <TouchableOpacity style={{ alignSelf: 'center', backgroundColor: '#F5E6D3', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, marginBottom: 20, zIndex: 10, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2 }} onPress={handleLoadMore}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ fontWeight: 'bold', color: '#4A3B2F', marginRight: 5 }}>Load More</Text>
                                        <Ionicons name="chevron-up" size={16} color="#4A3B2F" />
                                    </View>
                                </TouchableOpacity>
                            )}

                            {paginatedEvents.map((event, i) => (
                                <TimelineEventCircle
                                    key={`${event.memory_id || event.id}-${i}`}
                                    event={event}
                                    index={i + (displayCount % 2)} // Offset left/right if loading more changes parity
                                    scrollY={scrollY}
                                    onPress={setSelectedMemory}
                                />
                            ))}
                        </>
                    )}
                </View>
            </Animated.ScrollView>

            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20, paddingHorizontal: 15, borderBottomWidth: 1, backgroundColor: '#7A4A2E', paddingTop: 40, paddingBottom: 5 }}>
                <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 5 }}>
                        <Ionicons name="arrow-back" size={28} color="#F5E6D3" />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: '600', color: '#F5E6D3', textAlign: 'center' }}>Silah</Text>
                    <Text style={{ fontSize: 18, color: '#D8C4A8', marginTop: 4, textAlign: 'center' }}>Memory Road</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <TouchableOpacity style={[styles.headerButton, personFilter && { backgroundColor: '#A3432F' }]} onPress={() => setIsPersonModalVisible(true)}>
                        <Text style={styles.buttonText}>{personFilter ? "Filtered" : "By Person"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.headerButton, dateFilter && { backgroundColor: '#A3432F' }]} onPress={() => setIsDateModalVisible(true)}>
                        <Text style={styles.buttonText}>{dateFilter ? "Filtered" : "By Date"}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <DateFilterModal isVisible={isDateModalVisible} currentTerm={dateFilter} onApply={setDateFilter} onClose={() => setIsDateModalVisible(false)} />
            <PersonFilterModal isVisible={isPersonModalVisible} currentTerm={personFilter} onApply={setPersonFilter} onClose={() => setIsPersonModalVisible(false)} />
            <MemoryCardModal memory={selectedMemory} onClose={() => setSelectedMemory(null)} />
        </View>
    );
};

export default Road;