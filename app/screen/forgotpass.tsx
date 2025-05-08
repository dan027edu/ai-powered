import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

const ForgotPasswordScreen = () => {
  const router = useRouter();

  return (
    <ImageBackground 
      source={require('../../assets/images/background.png')} 
      style={styles.container}
      resizeMode="cover"
    >
      {/* Logo */}
      <Image source={require('../../assets/images/udm-logo.png')} style={styles.logo} />

      {/* Forgot Password Form */}
      <View style={styles.form}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>We will share a password reset link on your mobile</Text>

        <TextInput placeholder="Mobile Number" style={styles.input} keyboardType="phone-pad" />

        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryText}>Next Step</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => router.push('/screen/signup')}
        >
          <Text style={styles.secondaryText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.loginPrompt}>
          <Text style={styles.loginText}>Try Logging in?</Text>
          <TouchableOpacity onPress={() => router.push('/screen/in')}>
            <Text style={styles.loginLink}>Login Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default ForgotPasswordScreen;

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
    borderColor : '#000000',
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
  subtitle: {
    fontSize: 13,
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
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
  secondaryButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
  },
  secondaryText: {
    fontWeight: 'bold',
    color: '#000',
  },
  loginPrompt: {
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'column',
  },
  loginText: {
    fontSize: 13,
    color: '#000',
    marginBottom: 5,
  },
  loginLink: {
    color: '#0D2D1D',
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 4,
  },
});
