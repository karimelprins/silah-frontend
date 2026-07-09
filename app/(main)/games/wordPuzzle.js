import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import SuccessModal from '../../components/SuccessModal';
import ErrorModal from '../../components/ErrorModal';

const WORDS = [
    "MEMORY", "SUDOKU", "PUZZLE", "GAMES", "BRAIN", "FOCUS", "LOGIC", "SMART", "THINK", "SOLVE"
];

export default function WordPuzzle() {
    const router = useRouter();
    const [currentWord, setCurrentWord] = useState("");
    const [scrambledLetters, setScrambledLetters] = useState([]);
    const [userGuess, setUserGuess] = useState([]);
    const [score, setScore] = useState(0);
    const [showHelp, setShowHelp] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        startNewRound();
    }, []);

    const startNewRound = () => {
        const word = WORDS[Math.floor(Math.random() * WORDS.length)];
        setCurrentWord(word);

        const letters = word.split('').map((char, index) => ({ char, id: index }));
        for (let i = letters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [letters[i], letters[j]] = [letters[j], letters[i]];
        }

        setScrambledLetters(letters);
        setUserGuess([]);
    };

    const resetGame = () => {
        setScore(0);
        startNewRound();
    };

    const handleLetterPress = (letterObj) => {
        setScrambledLetters(prev => prev.filter(l => l.id !== letterObj.id));
        setUserGuess(prev => [...prev, letterObj]);
    };

    const handleGuessPress = (letterObj) => {
        setUserGuess(prev => prev.filter(l => l.id !== letterObj.id));
        setScrambledLetters(prev => [...prev, letterObj]);
    };

    const checkAnswer = () => {
        const guessString = userGuess.map(l => l.char).join("");
        if (guessString === currentWord) {
            setScore(prev => prev + 10);
            setShowSuccess(true);
        } else {
            setShowError(true);
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
                            1. Unscramble the letters to form a word.{'\n'}
                            2. Tap letters to move them to the guess box.{'\n'}
                            3. Tap guess letters to remove them.{'\n'}
                            4. Press 'Check Answer' when done.{'\n'}
                            5. Earn points for every correct word!
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
                <Text style={styles.headerTitle}>Word Puzzle</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={() => setShowHelp(true)} style={styles.iconButton}>
                        <Ionicons name="help-circle-outline" size={28} color="#795548" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={resetGame} style={styles.iconButton}>
                        <Ionicons name="refresh" size={24} color="#795548" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>Score: {score}</Text>
            </View>

            <Text style={styles.instruction}>Unscramble the word:</Text>

            <View style={styles.guessContainer}>
                {userGuess.map((letter, index) => (
                    <TouchableOpacity key={letter.id} style={styles.letterBox} onPress={() => handleGuessPress(letter)}>
                        <Text style={styles.letterText}>{letter.char}</Text>
                    </TouchableOpacity>
                ))}
                
                {Array(currentWord.length - userGuess.length).fill(0).map((_, i) => (
                    <View key={`placeholder-${i}`} style={[styles.letterBox, styles.placeholderBox]} />
                ))}
            </View>

            <View style={styles.lettersContainer}>
                {scrambledLetters.map((letter) => (
                    <TouchableOpacity key={letter.id} style={styles.letterButton} onPress={() => handleLetterPress(letter)}>
                        <Text style={styles.letterButtonText}>{letter.char}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
                style={[styles.checkButton, userGuess.length !== currentWord.length && styles.disabledButton]}
                onPress={checkAnswer}
                disabled={userGuess.length !== currentWord.length}
            >
                <Text style={styles.checkButtonText}>Check Answer</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={startNewRound} style={styles.skipButton}>
                <Text style={styles.skipText}>Skip Word</Text>
            </TouchableOpacity>

            <SuccessModal
                visible={showSuccess}
                onClose={() => {
                    setShowSuccess(false);
                    startNewRound();
                }}
                title="Dictionary Master!"
                subtitle={`You unscrambled ${currentWord} correctly.`}
                buttonText="Next Word"
                iconName="book"
                primaryColor="#BA68C8"
                secondaryColor="#F3E5F5"
            />

            <ErrorModal
                visible={showError}
                onClose={() => {
                    setShowError(false);
                    setScrambledLetters(prev => [...prev, ...userGuess]);
                    setUserGuess([]);
                }}
                title="Try Again"
                subtitle="That's not the correct word."
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
        marginBottom: 30,
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
    scoreContainer: {
        marginBottom: 20,
        backgroundColor: '#EFEBE9',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    scoreText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#5D4037',
    },
    instruction: {
        fontSize: 18,
        color: '#8D6E63',
        marginBottom: 20,
    },
    guessContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 40,
        minHeight: 60,
    },
    letterBox: {
        width: 45,
        height: 45,
        backgroundColor: '#FFF',
        borderWidth: 2,
        borderColor: '#8D6E63',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    placeholderBox: {
        borderStyle: 'dashed',
        backgroundColor: 'transparent',
    },
    letterText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#5D4037',
    },
    lettersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 40,
    },
    letterButton: {
        width: 50,
        height: 50,
        backgroundColor: '#BA68C8',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    letterButtonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
    },
    checkButton: {
        backgroundColor: '#66BB6A',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 30,
        marginBottom: 15,
    },
    disabledButton: {
        backgroundColor: '#A5D6A7',
        opacity: 0.7,
    },
    checkButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    skipButton: {
        padding: 10,
    },
    skipText: {
        color: '#8D6E63',
        fontSize: 16
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
