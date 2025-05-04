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
} from 'react-native';

const SecurityPinScreen = () => {
  const [pin, setPin] = useState(['', '', '', '', '']);

  const handlePinChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) { // only allow one digit or empty
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      // Optional: focus next input automatically. You need refs for that if needed.
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      {/* Diagonal Background */}
      <View style={styles.diagonalBackground} />
      {/* Logo */}
      <Image source={require('../../assets/images/udm-logo.png')} style={styles.logo} />
      {/* Security Pin Input Section */}
      <Text style={styles.title}>Enter Security Pin</Text>
      <View style={styles.pinContainer}>
        {pin.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.pinInput}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={value => handlePinChange(index, value)}
            textAlign="center"
            autoFocus={index === 0}
            // Important for auto focusing next field: refs could be added here
          />
        ))}
      </View>
      {/* Buttons */}
      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryText}>Accept</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton}>
        <Text style={styles.secondaryText}>Send Again</Text>
      </TouchableOpacity>
      {/* Login prompt */}
      <Text style={styles.loginPrompt}>
        Try Logging in? <Text style={styles.loginLink}>Login Now</Text>
      </Text>
    </KeyboardAvoidingView>
  );
};

export default SecurityPinScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  diagonalBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '60%',
    height: '130%',
    backgroundColor: '#0D2D1D',
    transform: [{ skewY: '-26deg' }], // Aproximated skew to emulate diagonal shape
    zIndex: -1,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
    marginBottom: 15,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginBottom: 25,
  },
  pinInput: {
    backgroundColor: '#fff',
    width: 45,
    height: 45,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#0D2D1D',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
  },
  primaryButton: {
    backgroundColor: '#fff',
    width: '70%',
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0D2D1D',
  },
  primaryText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    width: '70%',
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0D2D1D',
  },
  secondaryText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginPrompt: {
    fontSize: 13,
    color: '#000',
  },
  loginLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#000',
  },
});