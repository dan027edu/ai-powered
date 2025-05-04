import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

const LoadingScreen = () => {
  const router = useRouter();
  const logoSize = 150;
  const logoHeight = logoSize;  // Make it square like other screens

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/screen/role');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground 
      source={require('../assets/images/background.png')} 
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.contentContainer}>
        {/* Logo */}
        <Image
          source={require('../assets/images/udm-logo.png')}
          style={[styles.logo, {
            width: logoSize,
            height: logoSize,  // Make it square
          }]}
          resizeMode="contain"
        />

        {/* Loading Spinner */}
        <ActivityIndicator 
          size="large" 
          color="#15311E"
          style={styles.spinner}
        />
      </View>
    </ImageBackground>
  );
};

export default LoadingScreen;

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
    borderColor: '#000000',
    borderWidth: 2,  // Changed from 3 to 2 to match other screens
    borderRadius: 75,
    marginBottom: '10%',
  },
  spinner: {
    transform: [{scale: 1.5}],
    marginTop: 30,
  },
});
