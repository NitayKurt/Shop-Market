import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image } from 'react-native';
import { TextInput, Button, Appbar } from 'react-native-paper'; // Assuming you have Appbar from react-native-paper
import { useNavigation } from '@react-navigation/native';
import ShopList from './ShopList';

export default function Login() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  const checkUser = () => {
    if (user.trim() === 'ofri' || user.trim() === 'Ofri'){
      alert('Welcome back Ofri');
      navigation.navigate(ShopList);
    } else if (user.trim() === 'nitay' || user.trim() === 'Nitay'){
      alert('Welcome Nitay');
      navigation.navigate(ShopList);
    } else {
      alert('Wrong User Name!');
      setUser('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={{alignContent:"center", alignItems:"center",}}>
        <Text style={styles.header}>Shop Market 🛒</Text>
      </View>

      
      <View style={styles.circle}>
          <Image source={require("../assets/groceriesBag.png")} />
      </View>
      

      <View style={styles.content}>
        <Text style={styles.loginText}>Login</Text>

        <TextInput
          autoFocus={true}
          value={user}
          placeholderTextColor={'#82BDC1'}
          placeholder="הכנס שם משתמש"
          textAlign='center'
          textAlignVertical='center'
          onChangeText={(text) => setUser(text)}
          style={styles.textInput}
        />

        <Button style={styles.button} mode="contained" onPress={checkUser}>
          <Text style={{color: 'white',fontSize:20, fontWeight:"bold"}}>התחברות</Text>
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
    marginBottom: 20,
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
    marginTop: 70, // Adjust as needed
  },
});
