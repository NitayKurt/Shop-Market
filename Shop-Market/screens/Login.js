import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image } from 'react-native';
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
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Shop Market 🛒</Text>
      </View>

      <View style={styles.circle}>
        <Image source={require("../assets/groceriesBag.png")} />
      </View>

      <View style={styles.content}>
        <Text style={styles.loginText}>Login</Text>

        <TextInput
          autoFocus={true}
          value={userInput}
          placeholderTextColor={'#82BDC1'}
          placeholder="הכנס שם משתמש"
          textAlign='center'
          textAlignVertical='center'
          onChangeText={(text) => setUserInput(text)}
          style={styles.textInput}
        />

        <Button style={styles.buttonContainer} mode="contained" onPress={checkUser}>
          <Text style={styles.buttonText}>התחברות</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#82BDC1',
  },
  headerContainer: {
    alignContent: "center",
    alignItems: "center",
    top:60
  },
  header: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'Roboto',
    fontStyle: 'italic',
  },
  content: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 24,
    marginBottom: 40,
    color: 'white',
  },
  textInput: {
    width: '80%',
    marginBottom: 20,
    backgroundColor: 'white',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '80%',
    backgroundColor: '#1E92C4',
  },
  buttonText:{
    color: 'white',
    fontSize: 20,
    fontWeight: "bold"
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#1E92C4',
    marginTop: 120,
  },
});
