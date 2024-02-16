import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, ScrollView,Image, Alert } from 'react-native';
import { Card, Button } from 'react-native-paper';
import EmptyListCase from './components/EmptyListCase';
import { collection, query, where, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { auth, database } from './firebase-config';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

export default function ShopList() {
  const [editor, setEditor] = useState('ofri');
  const [item, setItem] = useState('');
  const [items, setItems] = useState([]);
  const date = new Date().toLocaleString();
  const firebaseAuth = getAuth();
  const itemsRef = collection(database, "market-list");

  const getData = async() =>{
    console.log("Get data");
  };

  const saveItem = async(e) => {
    if(e.key === 'Enter'){
      if (item.trim() !== '') {
        if(!items.includes(item)){
        setItems([...items, item]);
        setItem(''); // Clear the input after saving
        collection(database, "market-list").add({ item: item, editor: editor, date: date });
        await addDoc(itemsRef, { item: item, editor: editor, date: date, items: items}); 
      }
    }
  }
    if (item.trim() !== '') {
      if(!items.includes(item)){
      setItems([...items, item]);
      setItem(''); // Clear the input after saving
      collection(database, "market-list").add({ item: item, editor: editor, date: date });
      await addDoc(itemsRef, { item: item, editor: editor, date: date, items: items});
      
    }
    else{
      alert("Item already exists!");
      setItem('');
    }}
  };

  const sendList = () => {
    console.log(items);
  };

  const deleteItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const clearList = () => {
    Alert.alert('Alert', 'Are you sure you want to delete the whole list?', [
      {
        text: 'Cancel',
        onPress: () => {console.log('Cancel Pressed')},
        style: 'cancel',
      },
      {text: 'OK', onPress: () => {setItems([]), alert('List cleared')}},
    ]);
  };

  


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" backgroundColor="#1E92C4" />

        <ScrollView>
      <View style={styles.header}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>רשימת הקניות שלי🛒</Text>
        <Text style={{ fontSize: 20 }}>Last edit by: {editor} AT: {date}</Text>
      <TextInput
        style={{ height: 40 }}
        placeholder="הקש כאן כדי להוסיף דברים לרשימה"
        onChangeText={(newText) => setItem(newText)}
        value={item} // Use value instead of defaultValue
        autoFocus={true}
        onSubmitEditing={() => saveItem()}
        onKeyPress={(e) => saveItem(e)}
        />
      </View>

      {/* If the list is empty display this just for nice UI*/}
      {items.length === 0 && (
          <EmptyListCase />
      )}
        

      {/* Display the list as card with option to delete */}
        {items.slice().reverse().map((item, index) => (
          <Card key={index} style={{ backgroundColor: "white" }}>
            <Card.Actions style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={[styles.item, { flex: 1 }]}>
                  {item}
                </Text>
              <Button style={{ backgroundColor: "#f44336" }} onPress={() => deleteItem(items.length - index - 1)}>
                <Text style={{ color: "white" }}>X</Text>
              </Button>
            </Card.Actions>
          </Card>
        ))}


      </ScrollView>

      <View style={{flexDirection:"row",justifyContent: 'space-between'}}>
        <TouchableOpacity onPress={() => sendList(items)}>
          <Text style={styles.saveBotton}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => getData()}>
        <Text style={styles.refershBotton}>Refresh</Text>
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
    justifyContent: 'flex-start',
    paddingTop: 35,
  },
  header: {
    flex: 1,
    alignItems: 'center',  // Updated this line
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
  refershBotton: {
    backgroundColor: '#00B0FF',
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
    alignContent: "flex-end",
    right: 0,
  },
});
