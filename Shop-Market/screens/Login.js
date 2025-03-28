import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import {  USER1, USER2, USER3, USER4 } from '@env';

export default function Login({ setUser, navigation }) {
  const [userInput, setUserInput] = useState('');
  const [authSuccess, setAuthSuccess] = useState(false);

  useEffect(() => {
    if (authSuccess) {
      navigation.navigate('ShopList');
    }
  }, [authSuccess, navigation]);

  const checkUser = () => {
    if (userInput.trim().toLowerCase() === USER3 || userInput.trim() === USER4) {
      alert('Welcome back Ofri');
      setUser(userInput);
      setAuthSuccess(true);
    } else if (userInput.trim().toLowerCase() === USER1 || userInput.trim() === USER2){
      alert('Welcome Nitay');
      setUser(userInput);
      setAuthSuccess(true);
    } else {
      alert('Wrong User Name!');
      setUserInput('');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={'padding'} keyboardVerticalOffset={80}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.headerContainer}>
              <Text style={styles.header}>Shop Market 🛒</Text>
            </View>

            <View style={styles.circle}>
              <Image source={require('../assets/groceriesBag.png')} />
            </View>

            <View style={styles.content}>
              <TextInput
                style={styles.textInput}
                autoFocus={true}
                value={userInput}
                placeholderTextColor={'#82BDC1'}
                placeholder="הכנס שם משתמש"
                textAlign="center"
                onChangeText={(text) => setUserInput(text)}
              />
              <Button style={styles.buttonContainer} mode="contained" onPress={checkUser}>
                <Text style={styles.buttonText}>התחברות</Text>
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#82BDC1',
  },
  inner: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
  },
  headerContainer: {
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  header: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'Roboto',
    fontStyle: 'italic',
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#1E92C4',
    marginBottom: 80,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    width: '80%',
    marginBottom: 20,
    backgroundColor: 'white',
    textAlign: 'center',
    borderColor: "#1E92C4",
    borderWidth: 1,
  },
  buttonContainer: {
    width: '50%',
    backgroundColor: '#1E92C4',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});