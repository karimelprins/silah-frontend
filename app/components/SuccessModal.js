import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    Animated,
    TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Audio } from 'expo-av';



export default function SuccessModal({
    visible,
    onClose,
    title = "Congratulations!",
    subtitle = "You did great!",
    buttonText = "Next Level",
    iconName = "star",
    primaryColor = "#4CAF50",
    secondaryColor = "#E8F5E9"
}) {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const soundRef = useRef(null);

    useEffect(() => {
        if (visible) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            const playSound = async () => {
                try {
                    const { sound } = await Audio.Sound.createAsync(
                        require('../../assets/success.wav')
                    );
                    soundRef.current = sound;
                    await sound.playAsync();
                } catch (error) {
                    console.log("Error playing success sound", error);
                }
            };
            playSound();

            
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 5,
                    tension: 40,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            scaleAnim.setValue(0);
            opacityAnim.setValue(0);
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="none">
            <View style={styles.overlay}>
                <Animated.View style={[
                    styles.modalContainer,
                    {
                        backgroundColor: secondaryColor,
                        opacity: opacityAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}>

                    <View style={[styles.iconCircle, { backgroundColor: primaryColor }]}>
                        <Ionicons name={iconName} size={50} color="#FFF" />
                    </View>

                    <Text style={[styles.title, { color: primaryColor }]}>{title}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: primaryColor }]}
                        onPress={onClose}
                    >
                        <Text style={styles.buttonText}>{buttonText}</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: '85%',
        borderRadius: 25,
        padding: 30,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    iconCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -75,
        borderWidth: 5,
        borderColor: '#FFF',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 22,
    },
    button: {
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 30,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    }
});
