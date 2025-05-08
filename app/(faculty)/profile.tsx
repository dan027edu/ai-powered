import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter, usePathname } from 'expo-router';

const FacultyProfile = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Do you want to Logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            // Changed navigation to role screen
            router.replace('/screen/role');
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/udmaddress.png')}
          style={styles.headerImage}
        />
        <TouchableOpacity 
          style={styles.bellButton}
          onPress={() => router.push('/screen/notification')}
        >
          <Icon name="notifications-outline" size={26} color="#fff" />
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
            <Icon name="person" size={24} color="#fff" />
          </View>
          <Text style={styles.menuText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.iconContainer}>
            <Icon name="shield" size={24} color="#fff" />
          </View>
          <Text style={styles.menuText}>Security</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.iconContainer}>
            <Icon name="settings" size={24} color="#fff" />
          </View>
          <Text style={styles.menuText}>Setting</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handleLogout}
        >
          <View style={styles.iconContainer}>
            <Icon name="log-out" size={24} color="#fff" />
          </View>
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={getActiveButtonStyle('home')} 
          activeOpacity={0.7}
          onPress={() => router.replace("/(faculty)/home")}
        >
          <Icon name="home-outline" size={24} color="#fff" />
          <Text style={styles.navText}>HOME</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={getActiveButtonStyle('search')} 
          activeOpacity={0.7}
          onPress={() => router.push("/(faculty)/search")}
        >
          <Icon name="search-outline" size={24} color="#fff" />
          <Text style={styles.navText}>SEARCH</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={getActiveButtonStyle('upload')} 
          activeOpacity={0.7}
          onPress={() => router.push("/(faculty)/upload")}
        >
          <Icon name="cloud-upload-outline" size={24} color="#fff" />
          <Text style={styles.navText}>UPLOAD</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={getActiveButtonStyle('profile')} 
          activeOpacity={0.7}
          onPress={() => router.replace("/(faculty)/profile")}
        >
          <Icon name="person-outline" size={24} color="#fff" />
          <Text style={styles.navText}>PROFILE</Text>
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
    backgroundColor: '#15311E',
    height: Platform.OS === 'android' ? 80 : 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  headerImage: {
    width: Dimensions.get('window').width * 0.8,
    height: Platform.OS === 'android' ? 80 : 85,
    resizeMode: 'contain',
    marginLeft: -10,
    marginTop: -1,
  },
  bellButton: {
    padding: 11,
    marginRight: 5,
    marginTop: -1,
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

export default FacultyProfile;