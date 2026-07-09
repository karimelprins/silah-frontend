import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import SuccessModal from '../../components/SuccessModal';
import ErrorModal from '../../components/ErrorModal';

export default function MathChallenge() {
    const router = useRouter();
    const [problem, setProblem] = useState("");
    const [answer, setAnswer] = useState(0);
    const [options, setOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isActive, setIsActive] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft => timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            Alert.alert("Time's Up!", `Final Score: ${score}`, [
                { text: "Try Again", onPress: startGame },
                { text: "Menu", onPress: () => router.back() }
            ]);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const startGame = () => {
        setScore(0);
        setTimeLeft(30);
        setIsActive(true);
        generateProblem();
    };

    const generateProblem = () => {
        const operators = ['+', '-', '*'];
        const operator = operators[Math.floor(Math.random() * operators.length)];
        let num1 = Math.floor(Math.random() * 20) + 1;
        let num2 = Math.floor(Math.random() * 20) + 1;
        let result = 0;

        if (operator === '-') {
            if (num1 < num2) [num1, num2] = [num2, num1]; 
            result = num1 - num2;
        } else if (operator === '*') {
            num1 = Math.floor(Math.random() * 10) + 1; 
            num2 = Math.floor(Math.random() * 10) + 1;
            result = num1 * num2;
        } else {
            result = num1 + num2;
        }

        setProblem(`${num1} ${operator} ${num2}`);
        setAnswer(result);
        generateOptions(result);
    };

    const generateOptions = (correctAnswer) => {
        const opts = new Set([correctAnswer]);
        while (opts.size < 4) {
            const offset = Math.floor(Math.random() * 10) - 5; 
            const activeOption = correctAnswer + offset;
            if (activeOption !== correctAnswer && activeOption >= 0) {
                opts.add(activeOption);
            } else {
                opts.add(Math.floor(Math.random() * 50));
            }
        }
        setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
    };

    const handleOptionPress = (selectedOption) => {
        if (!isActive) return;

        if (selectedOption === answer) {
            setScore(prev => prev + 1);
            setShowSuccess(true);
        } else {
            setShowError(true);
            setTimeLeft(prev => Math.max(0, prev - 2));
        }
    };

    useEffect(() => {
        startGame();
    }, []);

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
                            1. Solve the math problem shown.{'\n'}
                            2. Tap the correct answer from the options.{'\n'}
                            3. You have 30 seconds to solve as many as you can.{'\n'}
                            4. Wrong answers deduct time!
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
                <Text style={styles.headerTitle}>Math Challenge</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={() => setShowHelp(true)} style={styles.iconButton}>
                        <Ionicons name="help-circle-outline" size={28} color="#795548" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={startGame} style={styles.iconButton}>
                        <Ionicons name="refresh" size={24} color="#795548" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Time</Text>
                    <Text style={[styles.infoValue, timeLeft < 10 && styles.lowTime]}>{timeLeft}s</Text>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Score</Text>
                    <Text style={styles.infoValue}>{score}</Text>
                </View>
            </View>

            <View style={styles.problemContainer}>
                <Text style={styles.problemText}>{problem}</Text>
                <Text style={styles.problemEqual}>= ?</Text>
            </View>

            <View style={styles.optionsContainer}>
                {options.map((opt, index) => (
                    <TouchableOpacity key={index} style={styles.optionButton} onPress={() => handleOptionPress(opt)}>
                        <Text style={styles.optionText}>{opt}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <SuccessModal
                visible={showSuccess}
                onClose={() => {
                    setShowSuccess(false);
                    generateProblem();
                }}
                title="Brilliant!"
                subtitle="You solved that math problem perfectly."
                buttonText="Next Problem"
                iconName="school"
                primaryColor="#FFB74D"
                secondaryColor="#FFF8E1"
            />

            <ErrorModal
                visible={showError}
                onClose={() => {
                    setShowError(false);
                    generateProblem();
                }}
                title="Oops!"
                subtitle={`The correct answer was ${answer}`}
                buttonText="Next Problem"
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
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    infoBox: {
        alignItems: 'center',
    },
    infoLabel: {
        color: '#8D6E63',
        fontSize: 14,
        fontWeight: 'bold',
    },
    infoValue: {
        color: '#5D4037',
        fontSize: 24,
        fontWeight: 'bold',
    },
    lowTime: {
        color: '#E53935',
    },
    problemContainer: {
        backgroundColor: '#FFF',
        padding: 40,
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 40,
        alignItems: 'center',
        width: '90%',
    },
    problemText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#3E2723',
    },
    problemEqual: {
        fontSize: 32,
        color: '#8D6E63',
        marginTop: 10,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
    },
    optionButton: {
        width: '48%',
        backgroundColor: '#FFB74D',
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        alignItems: 'center',
        elevation: 2,
    },
    optionText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
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
