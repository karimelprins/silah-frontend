import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from './FamilyNavbarstyles';

export default function Navbar({ activeTab }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const brownColor = '#4C2A13';
  const activeTabColor = '#7A4A2E';
  const inactiveIconColor = '#B4A594';

  const isActive = activeTab === 'upload' || isHovered;

  const getTabColor = (tabName) => (activeTab === tabName ? activeTabColor : inactiveIconColor);

  return (
    <View style={styles.bottomTabBar}>
      
      {/* HOME */}
      <TouchableOpacity 
        style={styles.tabButton} 
        onPress={() => router.replace("/role/family/familyHomePage")}
      >
        <Ionicons name="grid" size={24} color={getTabColor('home')} />
        <Text style={[styles.tabLabelBottom, { color: getTabColor('home') }]}>HOME</Text>
      </TouchableOpacity>

      {/* REMINDERS */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => router.push("/reminders/remindersPage")}
      >
        <Ionicons name="calendar-outline" size={24} color={getTabColor('reminders')} />
        <Text style={[styles.tabLabelBottom, { color: getTabColor('reminders') }]}>REMINDERS</Text>
      </TouchableOpacity>

      {/* UPLOAD (Inverting Style) */}
      <Pressable
        onPressIn={() => setIsHovered(true)}
        onPressOut={() => setIsHovered(false)}
        onPress={() => router.push("/upload/uploadmemory")}
        style={styles.uploadBtnContainer}
      >
        <View style={[
          styles.uploadCircle, 
          { 
            backgroundColor: isActive ? brownColor : '#FFF',
            borderColor: brownColor,
            borderWidth: 2
          }
        ]}>
          <Ionicons 
            name="add" 
            size={35} 
            color={isActive ? '#FFF' : brownColor} 
          />
        </View>
        <Text style={[styles.uploadText, { color: brownColor }]}>UPLOAD</Text>
      </Pressable>

      {/* LIFE STORY */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => router.push("lifestory/lifestory")}
      >
        <MaterialCommunityIcons 
          name="book-open-variant" 
          size={24} 
          color={getTabColor('lifestory')} 
        />
        <Text style={[styles.tabLabelBottom, { color: getTabColor('lifestory') }]}>LIFESTORY</Text>
      </TouchableOpacity>

      {/* PROFILE */}
      <TouchableOpacity 
        style={styles.tabButton} 
        onPress={() => router.push("Profile/familyProfile")}
      >
        <Ionicons name="person" size={24} color={getTabColor('profile')} />
        <Text style={[styles.tabLabelBottom, { color: getTabColor('profile') }]}>PROFILE</Text>
      </TouchableOpacity>

    </View>
  );
}