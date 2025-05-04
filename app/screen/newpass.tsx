import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';

const SetNewPasswordScreen = () => {
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');

  return (
    <ImageBackground 
      source={require('../../assets/images/background.png')} 
      style={styles.container}
      resizeMode="cover"
    >
      {/* Logo */}
      <Image 
        source={require('../../assets/images/udm-logo.png')} 
        style={styles.logo} 
      />

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.title}>Set New Password</Text>
        <TextInput
          placeholder="Type a password"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          placeholder="Retype Password"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
          value={retypePassword}
          onChangeText={setRetypePassword}
        />
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryText}>Change Password</Text>
        </TouchableOpacity>

        <Text style={styles.loginPrompt}>
          Try Logging in? <Text style={styles.loginLink}>Login Now</Text>
        </Text>
      </View>
    </ImageBackground>
  );
};

export default SetNewPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    width: 150,
    height: 150,
    marginTop: 150,
    marginBottom: 40,
    resizeMode: 'contain',
    alignSelf: 'center',
    borderColor: '#000000',
    borderWidth: 2,
    borderRadius: 75,
  },
  form: {
    width: '85%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 35,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
  },
  primaryText: {
    fontWeight: 'bold',
    color: '#000',
  },
  loginPrompt: {
    marginTop: 20,
    fontSize: 13,
    color: '#000',
  },
  loginLink: {
    color: '#0D2D1D',
    fontWeight: 'bold',
  },
});