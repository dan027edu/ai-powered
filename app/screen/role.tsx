import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const RoleScreen = () => {
  const router = useRouter();

  return (
    <ImageBackground 
      source={require('../../assets/images/background.png')} 
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.contentContainer}>
        {/* Logo */}
        <Image
          source={require('../../assets/images/udm-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/screen/log')}
          >
            <Ionicons name="person-outline" size={20} color="#000" style={styles.icon} />
            <Text style={styles.buttonText}>Faculty</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/screen/in')}
          >
            <Ionicons name="people-outline" size={20} color="#000" style={styles.icon} />
            <Text style={styles.buttonText}>Registrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default RoleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  logo: {
    width: 150,
    height: 150,
    borderColor : '#000000',
    borderWidth: 2,
    borderRadius: 75,
    marginBottom: 80,
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
    gap: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
