import React from 'react';
import { useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import ShopList from './ShopList';

export default function Login() {
  const { user, setUser } = useContext(AppContext);
    const navigation = useNavigation();

    const checkUser = (user) => {
        if(user.trim() === 'ofri'){
            alert('Welcome Ofri');
            navigation.navigate("ShopList");
        }
        else if(user.trim() === 'nitay'){
            alert('Welcome Nitay');
            navigation.navigate("ShopList");
        }
        else {
            alert('Wrong User Name!');
            setUser('');
        }
    };



  return (
    <SafeAreaView>

      <Text>Shop Market</Text>
      <Text>Login</Text>

      <TextInput
        label="User Name"
        value={user}
        placeholder='Enter your user name'
        onChangeText={(text) => setUser(text)}
        onEndEditing={() => checkUser(user)}
      />

      

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})