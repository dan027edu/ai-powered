import React from 'react';
import { StatusBar } from 'react-native';
import SharedSearchScreen from '../../components/SharedSearchScreen';

const RegistrarSearchScreen = () => {
  return (
    <>
      <StatusBar backgroundColor="#15311E" barStyle="light-content" />
      <SharedSearchScreen />
    </>
  );
};

export default RegistrarSearchScreen;