import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, ScrollView, Modal } from 'react-native';
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import SuccessModal from '../../components/SuccessModal';
import ErrorModal from '../../components/ErrorModal';

const { width } = Dimensions.get('window');

const INITIAL_BOARD = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

const SOLUTION_BOARD = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
];

export default function Sudoku() {
    const router = useRouter();
    const [board, setBoard] = useState(JSON.parse(JSON.stringify(INITIAL_BOARD)));
    const [selectedCell, setSelectedCell] = useState(null); 
    const [mistakes, setMistakes] = useState(0);
    const [showHelp, setShowHelp] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showGameOver, setShowGameOver] = useState(false);

    const handleCellPress = (row, col) => {
        if (INITIAL_BOARD[row][col] === 0) {
            setSelectedCell({ row, col });
        }
    };

    const handleNumberPress = (number) => {
        if (!selectedCell) return;

        const { row, col } = selectedCell;
        const correctValue = SOLUTION_BOARD[row][col];

        if (number === correctValue) {
            const newBoard = [...board];
            newBoard[row][col] = number;
            setBoard(newBoard);
            setSelectedCell(null);

            if (checkWin(newBoard)) {
                setShowSuccess(true);
            }
        } else {
            setMistakes(prev => prev + 1);
            if (mistakes + 1 >= 3) {
                setShowGameOver(true);
            } else {
                setShowError(true);
            }
        }
    };

    const checkWin = (currentBoard) => {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (currentBoard[i][j] !== SOLUTION_BOARD[i][j]) return false;
            }
        }
        return true;
    };

    const resetGame = () => {
        setBoard(JSON.parse(JSON.stringify(INITIAL_BOARD)));
        setMistakes(0);
        setSelectedCell(null);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
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
                            1. Tap an empty cell to select it.{'\n'}
                            2. Tap a number (1-9) to fill it.{'\n'}
                            3. Use the pre-filled numbers as guides.{'\n'}
                            4. Each row, column, and 3x3 box must have all numbers 1-9.{'\n'}
                            5. Don't make 3 mistakes!
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
                <Text style={styles.headerTitle}>Sudoku</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={() => setShowHelp(true)} style={styles.iconButton}>
                        <Ionicons name="help-circle-outline" size={28} color="#795548" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={resetGame} style={styles.iconButton}>
                        <Ionicons name="refresh" size={24} color="#795548" />
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.mistakesText}>Mistakes: {mistakes}/3</Text>

            <View style={styles.board}>
                {board.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                        {row.map((cell, colIndex) => {
                            const isInitial = INITIAL_BOARD[rowIndex][colIndex] !== 0;
                            const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;

                            const borderRightWidth = (colIndex + 1) % 3 === 0 && colIndex !== 8 ? 2 : 1;
                            const borderBottomWidth = (rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? 2 : 1;

                            return (
                                <TouchableOpacity
                                    key={`${rowIndex}-${colIndex}`}
                                    style={[
                                        styles.cell,
                                        { borderRightWidth, borderBottomWidth },
                                        isSelected && styles.selectedCell,
                                        isInitial && styles.initialCell
                                    ]}
                                    onPress={() => handleCellPress(rowIndex, colIndex)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.cellText, isInitial && styles.initialText]}>
                                        {cell !== 0 ? cell : ''}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ))}
            </View>

            <View style={styles.numberPad}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <TouchableOpacity
                        key={num}
                        style={styles.numberButton}
                        onPress={() => handleNumberPress(num)}
                    >
                        <Text style={styles.numberText}>{num}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <SuccessModal
                visible={showSuccess}
                onClose={() => {
                    setShowSuccess(false);
                    resetGame();
                }}
                title="Sudoku Master!"
                subtitle="You solved the entire grid correctly."
                buttonText="Play Again"
                iconName="grid"
                primaryColor="#9C27B0"
                secondaryColor="#F3E5F5"
            />

            <ErrorModal
                visible={showError}
                onClose={() => setShowError(false)}
                title="Incorrect"
                subtitle="That's not the right number."
            />

            <ErrorModal
                visible={showGameOver}
                onClose={() => {
                    setShowGameOver(false);
                    resetGame();
                }}
                title="Game Over"
                subtitle="Too many mistakes!"
                buttonText="Restart"
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
    mistakesText: {
        fontSize: 16,
        color: '#D32F2F',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    board: {
        borderWidth: 2,
        borderColor: '#5D4037',
        marginBottom: 30,
        backgroundColor: '#FFF',
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: (width - 60) / 9,
        height: (width - 60) / 9,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#A1887F',
        borderWidth: 0.5,
    },
    initialCell: {
        backgroundColor: '#EFEBE9',
    },
    selectedCell: {
        backgroundColor: '#B2DFDB',
    },
    cellText: {
        fontSize: 18,
        color: '#3E2723',
    },
    initialText: {
        fontWeight: 'bold',
        color: '#000',
    },
    numberPad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
    },
    numberButton: {
        width: 50,
        height: 50,
        backgroundColor: '#795548',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        borderRadius: 25,
        elevation: 3,
    },
    numberText: {
        fontSize: 20,
        color: '#FFF',
        fontWeight: 'bold',
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
