import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FacultyProfile = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/udm-logo.png')}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>Universidad De Manila</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={require('../../assets/images/avatar.png')}
          style={styles.profileImage}
        />
        <Text style={styles.name}>John Smith</Text>
        <Text style={styles.idNumber}>ID: 25030024</Text>
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.iconContainer}>
            <Ionicons name="person" size={24} color="#fff" />
          </View>
          <Text style={styles.menuText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield" size={24} color="#fff" />
          </View>
          <Text style={styles.menuText}>Security</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.iconContainer}>
            <Ionicons name="settings" size={24} color="#fff" />
          </View>
          <Text style={styles.menuText}>Setting</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.iconContainer}>
            <Ionicons name="log-out" size={24} color="#fff" />
          </View>
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#15311E" />
          <Text>HOME</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="search" size={24} color="#15311E" />
          <Text>SEARCH</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="cloud-upload" size={24} color="#15311E" />
          <Text>UPLOAD</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={24} color="#15311E" />
          <Text>PROFILE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#15311E',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    flex: 1,
  },
  profileButton: {
    padding: 8,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  idNumber: {
    fontSize: 16,
    color: '#666',
  },
  menuContainer: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#15311E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
});

export default FacultyProfile;