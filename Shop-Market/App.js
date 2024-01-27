import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

export default function App() {

  const [editor, setEditor] = useState('');
  const [items, setItems] = useState([]);

  const addItem = () => {
    setItems([...items, 'Item ' + (items.length + 1)]);
  };

  const removeItem = () => {
    setItems(items.slice(0, -1));
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" backgroundColor='#1E92C4'/>

        <View>
          <Text>My Shop Market List🛒</Text>
          <Text>Last edit by: {editor}</Text>
        </View>


      {items?.map((item, index) => (
        <View key={index}>
          <Text>{item}</Text>
        </View>
      ))}
     
      

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
