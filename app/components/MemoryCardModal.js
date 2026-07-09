
import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Text,
    Animated,
    Image,
    TouchableOpacity,
    Modal,
    StyleSheet,
    ScrollView,
    Dimensions,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { API_BASE_URL } from "../../src/config/ApiConfig";

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
const CARD_BG_IMAGE = require('../../assets/unnamed (6).jpg');

const modalStyles = StyleSheet.create({
    centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)' },
    modalView: {
        backgroundColor: '#FFFBF5',
        borderRadius: 25,
        width: screenWidth * 0.9,
        maxHeight: screenHeight * 0.85,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        overflow: 'hidden',
    },
    modalBackground: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.08,
    },
    scrollContent: { padding: 20, alignItems: 'center' },
    modalTitle: { fontSize: 24, fontWeight: '700', color: '#4A3B2F', marginBottom: 5, textAlign: 'center' },
    modalDate: { fontSize: 13, color: '#8B735B', marginBottom: 15, fontStyle: 'italic' },
    
    imageContainer: {
        width: '100%',
        height: 240,
        borderRadius: 15,
        backgroundColor: '#EFE1C4',
        overflow: 'hidden',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#D8C4A8',
    },
    modalImage: { width: '100%', height: '100%' },
    
    iconOverlay: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        borderRadius: 25,
        padding: 5,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
        backgroundColor: '#4A3B2F',
    },

    descriptionWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 18,
        borderRadius: 15,
        width: '100%',
        marginBottom: 20,
    },
    modalDescription: { fontSize: 16, lineHeight: 24, color: '#5A3A1E' },
    
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#EFE1C4',
    },
    uploaderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        backgroundColor: '#D8C4A8',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#4A3B2F',
        justifyContent: 'center', // Centers the icon
        alignItems: 'center',     // Centers the icon
    },
    closeButton: {
        backgroundColor: '#4A3B2F',
        paddingHorizontal: 22,
        paddingVertical: 10,
        borderRadius: 12,
    },
    closeButtonText: { color: '#FFF', fontWeight: 'bold' }
});

const MemoryCardModal = ({ memory, onClose }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const [areIconsVisible, setAreIconsVisible] = useState(false);

    useEffect(() => {
        if (memory) {
            Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 8 }).start();
        } else {
            scaleAnim.setValue(0);
            setAreIconsVisible(false);
        }
    }, [memory]);

    const getImageUrl = (filePath) => {
        if (!filePath) return null;
        if (filePath.startsWith('http')) return filePath;
        const cleanBase = API_BASE_URL.replace(/\/$/, "");
        const cleanPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
        return `${cleanBase}${cleanPath}`;
    };

    if (!memory) return null;

    const mainImageUri = memory.media_files?.length > 0 
        ? getImageUrl(memory.media_files[0].file_path) 
        : null;

    // Future functionality for download
    const handleDownload = () => {
        Alert.alert("Download", "Image download initiated.");
    };

    return (
        <Modal transparent visible={!!memory} animationType="none">
            <View style={modalStyles.centeredView}>
                <TouchableOpacity style={modalStyles.backdrop} activeOpacity={1} onPress={onClose} />
                
                <Animated.View style={[modalStyles.modalView, { transform: [{ scale: scaleAnim }] }]}>
                    <Image source={CARD_BG_IMAGE} style={modalStyles.modalBackground} resizeMode="cover" />

                    <ScrollView contentContainerStyle={modalStyles.scrollContent} showsVerticalScrollIndicator={false}>
                        <Text style={modalStyles.modalTitle}>{memory.title}</Text>
                        <Text style={modalStyles.modalDate}>{memory.memory_date}</Text>

                        <TouchableOpacity 
                            activeOpacity={0.9} 
                            onPress={() => setAreIconsVisible(!areIconsVisible)} 
                            style={modalStyles.imageContainer}
                        >
                            {mainImageUri ? (
                                <Image source={{ uri: mainImageUri }} style={modalStyles.modalImage} resizeMode="cover" />
                            ) : (
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                    <Ionicons name="images-outline" size={45} color="#9B7B5C" />
                                    <Text style={{color: '#9B7B5C', marginTop: 10}}>No memory photo</Text>
                                </View>
                            )}

                            {areIconsVisible && mainImageUri && (
                                <View style={modalStyles.iconOverlay}>
                                    <TouchableOpacity style={modalStyles.iconButton} onPress={() => Alert.alert("Zoom", "Viewing full image...")}>
                                        <Ionicons name="expand-outline" size={22} color="#FFF" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={modalStyles.iconButton} onPress={handleDownload}>
                                        <Ionicons name="download-outline" size={22} color="#FFF" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </TouchableOpacity>

                        <View style={modalStyles.descriptionWrapper}>
                            <Text style={modalStyles.modalDescription}>{memory.description || "A beautiful memory with no words."}</Text>
                        </View>

                        <View style={modalStyles.footer}>
                          <TouchableOpacity 
    style={modalStyles.uploaderInfo}
    onPress={() => Alert.alert("Profile", `Viewing ${memory.author_name}'s profile...`)}
>
    {/* PROFILE IMAGE SECTION */}
    <View style={modalStyles.avatar}>
        {memory.author_image ? (
            <Image 
                source={{ uri: getImageUrl(memory.author_image) }} 
                style={{ width: '100%', height: '100%', borderRadius: 17.5 }}
            />
        ) : (
            <Ionicons name="person" size={20} color="#4A3B2F" />
        )}
    </View>
    <View>
        <Text style={{fontSize: 10, color: '#8B735B'}}>Uploaded by</Text>
        <Text style={{fontWeight: '700', color: '#4A3B2F'}}>{memory.author_name || 'Family Member'}</Text>
    </View>
</TouchableOpacity>

                            <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
                                <Text style={modalStyles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default MemoryCardModal;