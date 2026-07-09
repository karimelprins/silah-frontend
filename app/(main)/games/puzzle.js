import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Dimensions, Modal } from 'react-native';
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import SuccessModal from '../../components/SuccessModal';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_SIZE = 3;
const TILE_SIZE = (SCREEN_WIDTH - 40) / GRID_SIZE; 

const PUZZLE_IMAGES = [
    require('../../../assets/puzzle1.png'),
    require('../../../assets/puzzle2.png'),
    require('../../../assets/puzzle3.png'),
    require('../../../assets/puzzle4.png'),
    require('../../../assets/puzzle5.png'),
    require('../../../assets/puzzle6.png'),
    require('../../../assets/puzzle7.png'),
    require('../../../assets/puzzle8.png'),
    require('../../../assets/puzzle9.png'),
];

export default function SlidingPuzzle() {
    const router = useRouter();
    const [grid, setGrid] = useState([]); 
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [moves, setMoves] = useState(0);
    const [isSolved, setIsSolved] = useState(false);
    const [selectedTileIndex, setSelectedTileIndex] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [sound, setSound] = useState();

    useEffect(() => {
        startNewGame();
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    async function playSuccessSound() {
        try {
            
        } catch (error) {
            console.log("Error playing sound", error);
        }
    }

    const startNewGame = () => {
        
        let tiles = [];
        for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
            tiles.push(i);
        }

    
        tiles = tiles.sort(() => Math.random() - 0.5);

        setGrid(tiles);
        setMoves(0);
        setIsSolved(false);
        setSelectedTileIndex(null);
        setShowSuccessModal(false);
        setCurrentImageIndex(Math.floor(Math.random() * PUZZLE_IMAGES.length));
    };

    const handleTilePress = (index) => {
        if (isSolved) return;

        if (selectedTileIndex === null) {
            
            setSelectedTileIndex(index);
        } else {
            if (selectedTileIndex !== index) {
                const newGrid = [...grid];
                [newGrid[selectedTileIndex], newGrid[index]] = [newGrid[index], newGrid[selectedTileIndex]];

                setGrid(newGrid);
                setMoves(prev => prev + 1);
                checkWin(newGrid);
            }
            setSelectedTileIndex(null);
        }
    };

    const checkWin = (currentGrid) => {
        const won = currentGrid.every((val, index) => val === index);
        if (won) {
            setIsSolved(true);
            setShowSuccessModal(true);
            playSuccessSound();
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
                            1. Tap a tile to select it.{'\n'}
                            2. Tap another tile to swap positions.{'\n'}
                            3. Rearrange the tiles to match the reference image.{'\n'}
                            4. Solve it in as few moves as possible!
                        </Text>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setShowHelp(false)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <SuccessModal
                visible={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    startNewGame();
                }}
                title="Masterpiece!"
                subtitle={`You solved the puzzle in just ${moves} moves!`}
                buttonText="Play Again"
                iconName="images"
                primaryColor="#FFC107"
                secondaryColor="#FFFDE7"
            />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <Ionicons name="arrow-back" size={24} color="#795548" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Puzzle</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={() => setShowHelp(true)} style={styles.iconButton}>
                        <Ionicons name="help-circle-outline" size={28} color="#795548" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={startNewGame} style={styles.iconButton}>
                        <Ionicons name="refresh" size={24} color="#795548" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Reference Image */}
            <View style={styles.referenceContainer}>
                <Text style={styles.subText}>Target:</Text>
                <Image source={PUZZLE_IMAGES[currentImageIndex]} style={styles.referenceImage} resizeMode="cover" />
            </View>

            <Text style={styles.movesText}>Moves: {moves}</Text>
            <Text style={styles.instructionText}>Tap two tiles to swap them!</Text>

            <View style={styles.gridContainer}>
                {grid.map((tileValue, index) => {
                    const originalRow = Math.floor(tileValue / GRID_SIZE);
                    const originalCol = tileValue % GRID_SIZE;

                    const isSelected = selectedTileIndex === index;

                    return (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={0.8}
                            onPress={() => handleTilePress(index)}
                            style={[
                                styles.tileWrapper,
                                isSelected && styles.selectedTile
                            ]}
                        >
                            <View style={styles.tile}>
                                <Image
                                    source={PUZZLE_IMAGES[currentImageIndex]}
                                    style={{
                                        width: TILE_SIZE * GRID_SIZE,
                                        height: TILE_SIZE * GRID_SIZE,
                                        position: 'absolute',
                                        top: -originalRow * TILE_SIZE,
                                        left: -originalCol * TILE_SIZE,
                                        transform: [{ scale: 1 }],
                                    }}
                                    resizeMode="cover"
                                />
                            </View>
                           
                        </TouchableOpacity>
                    );
                })}
            </View>
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
        marginBottom: 10,
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
    referenceContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    referenceImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#8D6E63',
    },
    subText: {
        color: '#8D6E63',
        marginBottom: 5,
        fontWeight: 'bold',
    },
    movesText: {
        fontSize: 18,
        color: '#5D4037',
        fontWeight: 'bold',
    },
    instructionText: {
        fontSize: 14,
        color: '#8D6E63',
        marginBottom: 10,
        fontStyle: 'italic',
    },
    gridContainer: {
        width: TILE_SIZE * GRID_SIZE + 6,
        height: TILE_SIZE * GRID_SIZE + 6,
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#3E2723',
        padding: 3,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    tileWrapper: {
        width: TILE_SIZE,
        height: TILE_SIZE,
        padding: 1,
        borderWidth: 0,
    },
    selectedTile: {
        borderColor: '#FFD700',
        borderWidth: 3,
        zIndex: 10,
    },
    tile: {
        flex: 1,
        overflow: 'hidden',
        backgroundColor: '#D7CCC8',
    },
   
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        elevation: 10,
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
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: '#795548',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 20,
        marginTop: 10,
    },
    closeButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    congratsText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginVertical: 10,
    },
    statsText: {
        fontSize: 18,
        color: '#5D4037',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        minWidth: 100,
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
