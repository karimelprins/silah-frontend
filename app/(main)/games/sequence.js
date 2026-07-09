import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated, Modal } from 'react-native';
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import SuccessModal from '../../components/SuccessModal';
import ErrorModal from '../../components/ErrorModal';

const COLORS = [
    { id: 0, color: '#E53935', highlight: '#FFCDD2' }, // Red
    { id: 1, color: '#43A047', highlight: '#C8E6C9' }, // Green
    { id: 2, color: '#1E88E5', highlight: '#BBDEFB' }, // Blue
    { id: 3, color: '#FDD835', highlight: '#FFF9C4' }, // Yellow
];

export default function Sequence() {
    const router = useRouter();
    const [sequence, setSequence] = useState([]);
    const [userStep, setUserStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false); 
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showGameOver, setShowGameOver] = useState(false);

    const opacityAnims = useRef(COLORS.map(() => new Animated.Value(1))).current;

    const startGame = () => {
        setSequence([]);
        setUserStep(0);
        setScore(0);
        setGameOver(false);
        addToSequence([]);
    };

    const addToSequence = (currentSeq) => {
        const nextColorId = Math.floor(Math.random() * 4);
        const newSeq = [...currentSeq, nextColorId];
        setSequence(newSeq);
        playSequence(newSeq);
    };

    const playSequence = async (seq) => {
        setIsPlaying(true);
        setUserStep(0);

        await new Promise(r => setTimeout(r, 800));

        for (let i = 0; i < seq.length; i++) {
            await flashButton(seq[i]);
            await new Promise(r => setTimeout(r, 400)); // Gap between flashes
        }

        setIsPlaying(false);
    };

    const flashButton = (id) => {
        return new Promise(resolve => {
            // Animate opacity or scale
            Animated.sequence([
                Animated.timing(opacityAnims[id], {
                    toValue: 0.3, // Dim
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnims[id], {
                    toValue: 1, // Normal
                    duration: 150,
                    useNativeDriver: true,
                })
            ]).start(() => resolve());
        });
    };

    const handlePress = async (id) => {
        if (isPlaying || gameOver) return;

      
        flashButton(id);

        if (id === sequence[userStep]) {
            // Correct
            if (userStep + 1 === sequence.length) {
                
                setScore(prev => prev + 1);
                setShowSuccess(true);
            } else {
                setUserStep(prev => prev + 1);
            }
        } else {
            
            setGameOver(true);
            setShowGameOver(true);
        }
    };

    useEffect(() => {
        
        startGame();
    }, []);

    return (
        <View style={styles.container}>
            {       }
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
                            1. Watch the sequence of lights.{'\n'}
                            2. Repeat the pattern by tapping the buttons.{'\n'}
                            3. The sequence gets longer every round.{'\n'}
                            4. If you make a mistake, it's Game Over!
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
                <Text style={styles.headerTitle}>Sequence</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={() => setShowHelp(true)} style={styles.iconButton}>
                        <Ionicons name="help-circle-outline" size={28} color="#795548" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={startGame} style={styles.iconButton}>
                        <Ionicons name="refresh" size={24} color="#795548" />
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.infoText}>{isPlaying ? "Watch the Pattern..." : "Your Turn!"}</Text>
            <Text style={styles.scoreText}>Round: {score + 1}</Text>

            <View style={styles.gameBoard}>
                {        }
                <View style={styles.row}>
                    <TouchableOpacity activeOpacity={1} onPress={() => handlePress(0)}>
                        <Animated.View style={[styles.button, { backgroundColor: COLORS[0].color, opacity: opacityAnims[0] }]} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => handlePress(1)}>
                        <Animated.View style={[styles.button, { backgroundColor: COLORS[1].color, opacity: opacityAnims[1] }]} />
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity activeOpacity={1} onPress={() => handlePress(2)}>
                        <Animated.View style={[styles.button, { backgroundColor: COLORS[2].color, opacity: opacityAnims[2] }]} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => handlePress(3)}>
                        <Animated.View style={[styles.button, { backgroundColor: COLORS[3].color, opacity: opacityAnims[3] }]} />
                    </TouchableOpacity>
                </View>

                {         }
                <View style={styles.centerCircle}>
                    <Text style={styles.centerText}>Simon</Text>
                </View>
            </View>

            <SuccessModal
                visible={showSuccess}
                onClose={() => {
                    setShowSuccess(false);
                    setTimeout(() => addToSequence(sequence), 400);
                }}
                title="Great Memory!"
                subtitle={`You successfully remembered a sequence of ${sequence.length} colors.`}
                buttonText="Next Round"
                iconName="musical-notes"
                primaryColor="#1E88E5"
                secondaryColor="#E3F2FD"
            />

            <ErrorModal
                visible={showGameOver}
                onClose={() => {
                    setShowGameOver(false);
                    startGame();
                }}
                title="Game Over"
                subtitle={`You reached round ${score}!`}
                buttonText="Try Again"
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
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
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
    infoText: {
        fontSize: 24,
        color: '#5D4037',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    scoreText: {
        fontSize: 18,
        color: '#8D6E63',
        marginBottom: 30,
    },
    gameBoard: {
        width: 300,
        height: 300,
        borderRadius: 150,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#3E2723',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    row: {
        flexDirection: 'row',
    },
    button: {
        width: 130,
        height: 130,
        margin: 5,
        borderRadius: 10,
    },
    centerCircle: {
        position: 'absolute',
        width: 100,
        height: 100,
        backgroundColor: '#F7F4EB',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        elevation: 5,
    },
    centerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3E2723',
    },
    
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
