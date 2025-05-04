import React from 'react';
import { StatusBar } from 'react-native';
import { SharedUploadScreen } from '../../components/SharedUploadScreen';

const API_URL = 'http://192.168.1.7:8000/api';

const RegistrarUploadScreen = () => {
  return (
    <>
      <StatusBar backgroundColor="#15311E" barStyle="light-content" />
      <SharedUploadScreen 
        apiUrl={API_URL}
        redirectPath="/screen/(registrar)/home"
      />
    </>
  );
};

export default RegistrarUploadScreen;