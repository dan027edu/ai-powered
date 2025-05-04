import React from 'react';
import { StatusBar } from 'react-native';
import { SharedUploadScreen } from '../components/SharedUploadScreen';
import { useRouter, usePathname } from 'expo-router';

const API_URL = 'http://192.168.1.7:8000/api';

const UploadScreen = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isRegistrar = pathname.includes('registrar');
  
  return (
    <>
      <StatusBar backgroundColor="#15311E" barStyle="light-content" />
      <SharedUploadScreen 
        apiUrl={API_URL}
        redirectPath={isRegistrar ? '/(registrar)/home' : '/(faculty)/home'}
      />
    </>
  );
};

export default UploadScreen;