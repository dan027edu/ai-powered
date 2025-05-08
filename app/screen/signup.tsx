import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';

const SignupScreen = () => {
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  return (
    <ImageBackground 
      source={require('../../assets/images/background.png')} 
      style={styles.container}
      resizeMode="cover"
    >
      {/* Logo */}
      <Image source={require('../../assets/images/udm-logo.png')} style={styles.logo} />

      {/* Form Fields */}
      <View style={styles.form}>
        <TextInput placeholder="Full Name" style={styles.input} />
        <TextInput placeholder="Email Address" style={styles.input} keyboardType="email-address" />
        <TextInput placeholder="Mobile Number" style={styles.input} keyboardType="phone-pad" />

        <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
          <Text>{date.toDateString()}</Text>
          <Ionicons name="calendar-outline" size={20} />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        {/* Password Field */}
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Type a password"
            secureTextEntry={!passwordVisible}
            style={styles.passwordInput}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Ionicons name={passwordVisible ? 'eye-off-outline' : 'eye-outline'} size={20} />
          </TouchableOpacity>
        </View>

        {/* Confirm Password Field */}
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Type a password"
            secureTextEntry={!confirmPasswordVisible}
            style={styles.passwordInput}
          />
          <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
            <Ionicons name={confirmPasswordVisible ? 'eye-off-outline' : 'eye-outline'} size={20} />
          </TouchableOpacity>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity 
          style={styles.signupButton}
          onPress={() => router.push('/screen/in')}  // Changed navigation to in.tsx
        >
          <Text style={styles.signupText}>Sign up</Text>
        </TouchableOpacity>

        {/* Links */}
        <TouchableOpacity onPress={() => router.push('/screen/forgotpass')}>
          <Text style={styles.forgotText}>Forgot the password?</Text>
        </TouchableOpacity>

        <View style={styles.loginPromptContainer}>
          <Text style={styles.loginPromptText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/screen/in')}>
            <Text style={styles.loginLink}>Login Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    width: 150,
    height: 150,
    marginTop: 40,
    marginBottom: 50,
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
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  dateInput: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    width: '100%',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
  },
  signupButton: {
    width: '100%',
    backgroundColor: '#15311E',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  signupText: {
    color: '#EFEFFF',
    fontWeight: 'bold',
  },
  forgotText: {
    color: '#15311E',
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 10,
  },
  loginPromptContainer: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginPromptText: {
    fontSize: 13,
    color: '#15311E',
  },
  loginLink: {
    color: '#15311E',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
