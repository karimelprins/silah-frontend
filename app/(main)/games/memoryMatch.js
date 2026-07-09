import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, Modal } from 'react-native';
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import SuccessModal from '../../components/SuccessModal';

const { width } = Dimensions.get('window');

const CARD_PAIRS = [
    { id: 1, icon: 'paw', color: '#8D6E63' },
    { id: 2, icon: 'anchor', color: '#29B6F6' },
    { id: 3, icon: 'tree', color: '#66BB6A' },
    { id: 4, icon: 'star', color: '#FFCA28' },
    { id: 5, icon: 'heart', color: '#EF5350' },
    { id: 6, icon: 'music', color: '#AB47BC' },
    { id: 7, icon: 'car', color: '#FFA726' },
    { id: 8, icon: 'bolt', color: '#FFFF00' },
];

export default function MemoryMatch() {
    const router = useRouter();
    const [cards, setCards] = useState([]);
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [matches, setMatches] = useState([]);
    const [moves, setMoves] = useState(0);

    const [showHelp, setShowHelp] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
        const shuffledCards = [...CARD_PAIRS, ...CARD_PAIRS]
            .sort(() => Math.random() - 0.5)
            .map((card, index) => ({ ...card, uid: index })); 

        setCards(shuffledCards);
        setFlippedIndices([]);
        setMatches([]);
        setMoves(0);
    };

    const handleCardPress = (index) => {
        if (matches.includes(cards[index].id) || flippedIndices.includes(index) || flippedIndices.length === 2) {
            return;
        }

        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(prev => prev + 1);
            const [firstIndex, secondIndex] = newFlipped;

            if (cards[firstIndex].id === cards[secondIndex].id) {
                setMatches(prev => [...prev, cards[firstIndex].id]);
                setFlippedIndices([]);

                if (matches.length + 1 === CARD_PAIRS.length) {
                    setTimeout(() => setShowSuccess(true), 500);
                }
            } else {
                setTimeout(() => setFlippedIndices([]), 1000);
            }
        }
    };

    return (
        <View style={styles.container}>
            {/* Help Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showHelp}
                onRequestClose={() => setShowHelp(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>How to Play</Text>
                        <Text style={styles.modalText}>
                            1. Tap a card to flip it over.{'\n'}
                            2. Tap another card to find its match.{'\n'}
                            3. If they match, they stay face up.{'\n'}
                            4. If not, they flip back over.{'\n'}
                            5. Find all pairs to win!
                        </Text>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setShowHelp(false)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <Ionicons name="arrow-back" size={24} color="#795548" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Memory Match</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={() => setShowHelp(true)} style={styles.iconButton}>
                        <Ionicons name="help-circle-outline" size={28} color="#795548" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={initializeGame} style={styles.iconButton}>
                        <Ionicons name="refresh" size={24} color="#795548" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.gameInfo}>
                <Text style={styles.infoText}>Moves: {moves}</Text>
                <Text style={styles.infoText}>Pairs Left: {CARD_PAIRS.length - matches.length}</Text>
            </View>

            <View style={styles.grid}>
                {cards.map((card, index) => {
                    const isFlipped = flippedIndices.includes(index) || matches.includes(card.id);
                    return (
                        <TouchableOpacity
                            key={card.uid}
                            style={[styles.card, isFlipped ? { backgroundColor: card.color } : styles.cardBack]}
                            onPress={() => handleCardPress(index)}
                            activeOpacity={0.8}
                        >
                            {isFlipped ? (
                                <Icon name={card.icon} size={30} color="#FFF" />
                            ) : (
                                <Icon name="question" size={30} color="#A1887F" />
                            )}
                        </TouchableOpacity>
                    )
                })}
            </View>

            <SuccessModal
                visible={showSuccess}
                onClose={() => {
                    setShowSuccess(false);
                    initializeGame();
                }}
                title="Amazing Memory!"
                subtitle={`You matched all pairs in ${moves} moves.`}
                buttonText="Play Again"
                iconName="bulb"
                primaryColor="#66BB6A"
                secondaryColor="#E8F5E9"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F4EB',
        padding: 20,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#795548',
    },
    headerRight: {
        flexDirection: 'row',
    },
    iconButton: {
        padding: 5,
        marginLeft: 10,
    },
    gameInfo: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    infoText: {
        fontSize: 18,
        color: '#8D6E63',
        fontWeight: '500',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    card: {
        width: width / 4 - 20,
        height: width / 4 - 20,
        margin: 5,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
    },
    cardBack: {
        backgroundColor: '#D7CCC8',
    },
    // Modal Styles
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#5D4037',
        marginBottom: 15,
    },
    modalText: {
        fontSize: 16,
        color: '#4E342E',
        lineHeight: 24,
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#795548',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 20,
    },
    closeButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
