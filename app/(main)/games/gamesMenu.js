import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from "expo-router";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import PatientNavbar from '../../components/PatientNavbar.js';

const { width } = Dimensions.get('window');

const GameCard = ({ title, icon, color, onPress }) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: color }]} onPress={onPress}>
        <View style={styles.iconContainer}>
            <Icon name={icon} size={40} color="#FFF" />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Ionicons name="play-circle" size={30} color="rgba(255,255,255,0.8)" style={styles.playIcon} />
    </TouchableOpacity>
);

export default function GamesMenu() {
    const router = useRouter();

    const games = [
        { id: 1, title: "Memory Match", icon: "th-large", color: "#FFB74D", route: "games/memoryMatch" },
        { id: 2, title: "Sudoku", icon: "table", color: "#4DB6AC", route: "games/sudoku" },
        { id: 3, title: "Word Puzzle", icon: "font", color: "#BA68C8", route: "games/wordPuzzle" },
        { id: 4, title: "Sequence", icon: "sort-numeric-asc", color: "#64B5F6", route: "games/sequence" },
        { id: 5, title: "Math Challenge", icon: "calculator", color: "#E57373", route: "games/mathChallenge" },
        { id: 6, title: "Puzzle", icon: "image", color: "#8E24AA", route: "games/puzzle" },
    ];

    const handleGamePress = (game) => {
        if (game.route) {
            router.push(game.route);
        } else {
            alert(`Starting ${game.title}! (Game implementation coming soon)`);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F7F4EB' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#D8C4A8', backgroundColor: '#7A4A2E', paddingTop: 40, paddingBottom: 5 }}>
                <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
                </View>
                <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: '600', color: '#F5E6D3', textAlign: 'center' }}>Silah</Text>
                    <Text style={{ fontSize: 18, color: '#D8C4A8', marginTop: 4, textAlign: 'center' }}>Mind Games</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }} />
            </View>
            <ScrollView style={styles.container}>

                <Text style={styles.subtitle}>Keep your mind sharp with these fun activities!</Text>

                <View style={styles.grid}>
                    {games.map((game) => (
                        <GameCard
                            key={game.id}
                            title={game.title}
                            icon={game.icon}
                            color={game.color}
                            onPress={() => handleGamePress(game)}
                        />
                    ))}
                </View>
            </ScrollView>
            <PatientNavbar activeTab="games" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#795548',
    },
    subtitle: {
        fontSize: 16,
        color: '#8D6E63',
        textAlign: 'center',
        marginBottom: 30,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        aspectRatio: 1,
        borderRadius: 20,
        padding: 15,
        marginBottom: 15,
        justifyContent: 'space-between',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    iconContainer: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 10,
        borderRadius: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 10,
    },
    playIcon: {
        alignSelf: 'flex-end',
    }
});
