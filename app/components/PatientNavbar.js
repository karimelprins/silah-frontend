import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PatientNavbar({ activeTab }) {
  const router = useRouter();

  const getColor = (tabName) => (activeTab === tabName ? '#795548' : '#B4A594');

  return (
    <View style={styles.navContainer}>
     
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => router.replace("/role/patient/patientHomePage")}
      >
        <FontAwesome name="home" size={24} color={getColor('home')} />
        <Text style={[styles.navLabel, { color: getColor('home') }]}>Home</Text>
      </TouchableOpacity>

     
<TouchableOpacity 
        style={styles.navItem} 
        onPress={() => router.push("/discovery/discovery")}
      >
        <FontAwesome name="compass" size={24} color={getColor('discovery')} />
        <Text style={[styles.navLabel, { color: getColor('discovery') }]}>Discover</Text>
      </TouchableOpacity>

      

      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => router.push("/games/gamesMenu")}
      >
        <FontAwesome name="gamepad" size={22} color={getColor('games')} />
        <Text style={[styles.navLabel, { color: getColor('games') }]}>Games</Text>
      </TouchableOpacity>

      
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => router.push("/chat/chatPage")}
      >
        <FontAwesome name="commenting" size={22} color={getColor('chat')} />
        <Text style={[styles.navLabel, { color: getColor('chat') }]}>AI Chat</Text>
      </TouchableOpacity>

      
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => router.push("/Profile/patientProfile")}
      >
        <FontAwesome name="user" size={22} color={getColor('profile')} />
        <Text style={[styles.navLabel, { color: getColor('profile') }]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 85 : 70,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E4D9',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
  }
});
