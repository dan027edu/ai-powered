import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Check if email and password are provided
    if (!email || !email.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    if (!password || !password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    
    // Check for specific email types
    if (normalizedEmail.includes('registrar')) {
      router.replace('/(registrar)/home');
    } else if (normalizedEmail.includes('faculty')) {
      router.replace('/(faculty)/home');
    } else {
      Alert.alert('Error', 'Please use your official email address');
    }
  };

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

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email Address"
            style={styles.input}
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            placeholder="Type a password"
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
          />
          
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/screen/forgotpass')}>
            <Text style={styles.forgotPassword}>Forgot the password?</Text>
          </TouchableOpacity>
          
          <View style={styles.signupContainer}>
            <Text style={styles.lightText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/screen/signup')}>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View> 
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;

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
    marginTop: 120,
    marginBottom: 50,
  },
  inputContainer: {
    width: '80%',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  forgotPassword: {
    color: '#15311E',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  lightText: {
    color: '#15311E',
  },
  signupLink: {
    color: '#15311E',
    fontWeight: 'bold',
  },
});
