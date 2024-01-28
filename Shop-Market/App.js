import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, ScrollView } from 'react-native';

export default function App() {
  const [editor, setEditor] = useState('');
  const [item, setItem] = useState('');
  const [items, setItems] = useState([]);

  const saveItem = () => {
    if (item.trim() !== '') {
      setItems([...items, item]);
      setItem(''); // Clear the input after saving
    }
  };

  const clearList = () => {
    setItems([]);
    alert('List cleared');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" backgroundColor="#1E92C4" />

      <View style={styles.header}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>רשימת הקניות שלי🛒</Text>
        <Text style={{ fontSize: 20 }}>Last edit by: {editor}</Text>
      </View>

    <ScrollView>
      <TextInput
        style={{ height: 40 }}
        placeholder="Type here to start"
        onChangeText={(newText) => setItem(newText)}
        value={item} // Use value instead of defaultValue
      />

      <View>
        {items?.map((item, index) => (
          <Text key={index} style={styles.item}>
            {item}
          </Text>
        ))}
      </View>
      </ScrollView>
      <View style={{flexDirection:"row",}}>
      <TouchableOpacity onPress={() => saveItem(item)}>
        <Text style={styles.saveBotton}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => clearList()}>
        <Text style={styles.clearBotton}>Clear List</Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: 35,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
  },
  item: {
    padding: 5,
    fontSize: 18,
    height: 44,
  },
  saveBotton: {
    backgroundColor: '#4caf50',
    color: 'white',
    fontSize: 20,
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  clearBotton: {
    backgroundColor: '#f44336',
    color: 'white',
    fontSize: 20,
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
});
