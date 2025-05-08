import React from 'react';
import { StatusBar } from 'react-native';
// Changed to default import (removed curly braces)
import SharedUploadScreen from '../components/SharedUploadScreen'; // <--- Changed import

// Update this to your DigitalOcean Droplet's public IP address
const API_URL = "http://159.223.53.201/api";

const RegistrarUploadScreen = () => {
  return (
    <>
      <StatusBar backgroundColor="#15311E" barStyle="light-content" />
      <SharedUploadScreen
        apiUrl={API_URL}
        redirectPath="/(registrar)/home"
      />
    </>
  );
};

export default RegistrarUploadScreen;
