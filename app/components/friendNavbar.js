import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function FriendNavbar({ activeTab }) {
  const router = useRouter();

  const getColor = (tabName) => (activeTab === tabName ? '#7A4A2E' : '#B4A594');
  const getPopStyle = (tabName) => (activeTab === tabName ? { transform: [{ translateY: -5 }], elevation: 4 } : {});

  return (
    <View style={styles.bottomTabBar}>
      
      {/* HOME */}
      <TouchableOpacity 
        style={[styles.tabButton, getPopStyle('home')]} 
        onPress={() => router.replace("/role/friend/friendHomePage")}
      >
        <Ionicons name="grid" size={24} color={getColor('home')} />
        <Text style={[styles.tabLabelBottom, { color: getColor('home') }]}>HOME</Text>
      </TouchableOpacity>

      {/* LIFE STORY (Added before Profile) */}
      <TouchableOpacity 
        style={[styles.tabButton, getPopStyle('lifestory')]} 
        onPress={() => router.push("lifestory/Flifestory")} // Ensure this path is correct for the friend role
      >
        <MaterialCommunityIcons 
          name="book-open-variant" 
          size={24} 
          color={getColor('lifestory')} 
        />
        <Text style={[styles.tabLabelBottom, { color: getColor('lifestory') }]}>LIFESTORY</Text>
      </TouchableOpacity>

      {/* PROFILE */}
      <TouchableOpacity 
        style={[styles.tabButton, getPopStyle('profile')]} 
        onPress={() => router.push("/Profile/friendprofile")} 
      >
        <Ionicons name="person" size={24} color={getColor('profile')} />
        <Text style={[styles.tabLabelBottom, { color: getColor('profile') }]}>PROFILE</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  bottomTabBar: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E4D9',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10, 
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabelBottom: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 4,
  }
});