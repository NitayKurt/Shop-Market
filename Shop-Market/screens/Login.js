import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, Keyboard, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER1, USER2, USER3, USER4 } from '@env';

export default function Login({ setUser, navigation }) {
  const [userInput, setUserInput] = useState(null);
  const users = [USER1, USER2, USER3, USER4];
  const [authSuccess, setAuthSuccess] = useState(false);
  
  const savedUser = async () => {
    try {
      const value = await AsyncStorage.getItem('savedUser');
      if (value !== null) {
        if (users.includes(value.trim().toLowerCase()) || users.includes(value.trim())) {
          setUser(value);
          setAuthSuccess(true);
        }
      }
    } catch (e) {
      console.log('Error reading user from AsyncStorage:', e);
    }
  };
  
  useEffect(() => {
    savedUser();
  }, []);

  useEffect(() => {
    if (authSuccess) {
      navigation.navigate('ShopList');
    }
  }, [authSuccess, navigation]);

  const checkUser = async () => {
    if (!userInput) {
      Alert.alert("Error ❌",'Please enter a user name');
      return;
    }
    if (users.includes(userInput.trim().toLowerCase()) || users.includes(userInput.trim())) {
      try {
        await AsyncStorage.setItem('savedUser', userInput);
      } catch (error) {
        console.log('Error saving user to AsyncStorage:', error);
      }
      Alert.alert("Success 😁",'Welcome back ' + userInput);
      setUser(userInput);
      setAuthSuccess(true);
      return;
    }
    else {
      Alert.alert("Error ❌",'Wrong User Name!');
      setUserInput(null);
      return;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
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
            placeholder="שם משתמש"
            textAlign="center"
            onChangeText={(text) => setUserInput(text)}
          />
          <TouchableOpacity style={styles.buttonContainer} mode="contained" onPress={checkUser}>
            <Text style={styles.buttonText}>התחברות</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#82BDC1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    position: 'absolute',
    top: 80,
  },
  header: {
    color: 'white',
    fontSize: 40,
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
    marginBottom: 90,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  textInput: {
    position: 'relative',
    width: 250,
    height: 50,
    marginBottom: 20,
    backgroundColor: 'white',
    textAlign: 'center',
    borderColor: "#1E92C4",
    borderWidth: 1,
  },
  buttonContainer: {
    width: 150,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#1E92C4',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});