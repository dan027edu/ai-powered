import React from 'react';
import { StatusBar, View, TouchableOpacity, Text, StyleSheet, SafeAreaView, Image, Dimensions, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter, usePathname } from 'expo-router'; // Import usePathname

// Assuming SharedUploadScreen is correctly implemented and exported as default
import SharedUploadScreen from '../components/SharedUploadScreen';

const screenWidth = Dimensions.get('window').width;

// Update this to your DigitalOcean Droplet's public IP address
const API_URL = "http://159.223.53.201/api";

// Styles for the bottom navigation (can be shared or defined here)
const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#15311E',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 48,
  },
  navText: {
    fontSize: 10,
    color: '#fff',
    marginTop: 4,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

const FacultyUploadScreen = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname

  const getActiveButtonStyle = (routeName: string) => {
    const isActive = pathname.includes(routeName);
    return {
      ...styles.navButton,
      backgroundColor: isActive ? '#1F4A2D' : 'transparent',
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
    };
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#15311E" barStyle="light-content" />
      {/* Render the SharedUploadScreen component */}
      <SharedUploadScreen
        apiUrl={API_URL}
        redirectPath="/(faculty)/home" // Assuming this is the correct redirect after upload for faculty
      />

      {/* Bottom Navigation (replicated from SharedUploadScreen for clarity in this fix) */}
      {/* In a real app, you might use a dedicated BottomTabBar component */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={getActiveButtonStyle('home')}
          activeOpacity={0.7}
          onPress={() => router.replace('/(faculty)/home')}
        >
          <Icon name="home-outline" size={24} color="#fff" />
          <Text style={styles.navText}>HOME</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getActiveButtonStyle('search')}
          activeOpacity={0.7}
          onPress={() => router.push('/(faculty)/search')}
        >
          <Icon name="search-outline" size={24} color="#fff" />
          <Text style={styles.navText}>SEARCH</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getActiveButtonStyle('upload')}
          activeOpacity={0.7}
          // Corrected navigation target to the faculty upload route
          onPress={() => router.push('/(faculty)/upload')} // <--- Corrected navigation
        >
          <Icon name="cloud-upload-outline" size={24} color="#fff" />
          <Text style={styles.navText}>UPLOAD</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getActiveButtonStyle('profile')}
          activeOpacity={0.7}
          onPress={() => router.replace('/(faculty)/profile')}
        >
          <Icon name="person-outline" size={24} color="#fff" />
          <Text style={styles.navText}>PROFILE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FacultyUploadScreen;
