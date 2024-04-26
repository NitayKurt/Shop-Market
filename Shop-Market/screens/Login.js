import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image } from 'react-native';
import { TextInput, Button, } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function Login({ setUser }) {

  const [userInput, setUserInput] = useState('');
  const navigation = useNavigation();

  const checkUser = () => {
    console.log("user", userInput);
    if (userInput.trim() === 'ofri' || userInput.trim() === 'Ofri') {
      alert('Welcome back Ofri');
      setUser(userInput);
      navigation.navigate('ShopList');

    } else if (userInput.trim() === 'nitay' || userInput.trim() === 'Nitay') {
      alert('Welcome Nitay');
      setUser(userInput);
      navigation.navigate('ShopList');
    } else {
      alert('Wrong User Name!');
      setUserInput('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={{ alignContent: "center", alignItems: "center", }}>
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

        <Button style={styles.button} mode="contained" onPress={checkUser}>
          <Text style={{ color: 'white', fontSize: 20, fontWeight: "bold" }}>התחברות</Text>
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
    alignItems: 'center',
    marginTop: 50,
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
  button: {
    width: '80%',
    backgroundColor: '#f17537',
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#f17537',
    marginTop: 120,
  },
});
