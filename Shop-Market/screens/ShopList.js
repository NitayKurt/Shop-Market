import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, } from 'react-native';
import { Card, Button } from 'react-native-paper';
import EmptyListCase from '../components/EmptyListCase';
import { collection, getDocs, addDoc, setDoc, doc,updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB, } from '../firebase-config';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

export default function ShopList() {

  const [lastEditor, setLastEditor] = useState('');
  const [lastEditAt, setLastEditAt] = useState('');
  const [currentEditor, setCurrentEditor] = useState('ofri');
  const date = new Date().toLocaleString();
  const [item, setItem] = useState('');
  const [items, setItems] = useState([]);
  const [data, setData] = useState([]);
  const [dataId, setDataId] = useState('');


  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const productsRef = collection(FIRESTORE_DB, "products");
      const querySnapshot = await getDocs(productsRef);
      let fetchedData = [];
      let fetchedDataId = '';
      let fetchedLastEditor = '';
      let fetchedLastEditAt = '';
      
      querySnapshot.forEach((doc) => {
        fetchedData = doc.data().items;
        fetchedDataId = doc.id;
        fetchedLastEditor = doc.data().editor;
        fetchedLastEditAt = doc.data().date;
      });

      setDataId(fetchedDataId);
      setLastEditor(fetchedLastEditor);
      setLastEditAt(fetchedLastEditAt);
      setItems(fetchedData);

    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  };
  
  const saveItem = async(item) => {
      if (item.trim() !== '') {
        if(!items.includes(item)){
        setItems([...items, item]);
        setItem(''); // Clear the input after saving
      }
    
  }
    if (item.trim() !== '') {
      if(!items.includes(item)){
      setItems([...items, item]);
      setItem(''); // Clear the input after saving
      
    }
    else{
      alert("Item already exists❗");
      setItem('');
    }}
  };


  const handleKeyPress = (key) => {
    if (key === '.') {
      saveItem(item);
      setItem('');
    }
  };


  const sendList = async () => {
    try {
      if (data.length === 0){
      const docRef = await addDoc(collection(FIRESTORE_DB, 'products'), {
        items: items,
        editor: currentEditor,
        date: date,
      });
      console.log("Document written with ID: ",docRef.id);
      Alert.alert('Success', 'List sent successfully✅');

      } else {
      const updateProducts = await updateDoc(doc(FIRESTORE_DB, "products",dataId), {
        items: items,
        editor: currentEditor,
        date: date,
      });
      console.log("Document updated with ID: ", dataId);
      Alert.alert('Success', 'List Updated successfully✅');
      }

    } catch (error) {
      Alert.alert('Error', 'Error sending list❌');
      console.error('Error adding document: ', error);
    }
  };

  const deleteItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const clearList = () => {
    Alert.alert('Alert⚠️', 'Are you sure you want to delete the whole list?', [
      {
        text: 'Cancel',
        onPress: () => {console.log('Cancel Pressed')},
        style: 'cancel',
      },
      {text: 'OK', onPress: () => {setItems([]), alert('List cleared✅')}},
    ]);
  };

  


return (
  <SafeAreaView style={styles.container}>
    <StatusBar style="auto" backgroundColor="#82BDC1" />

    <KeyboardAvoidingView
      style={styles.container}
      behavior={"height"}
    >
      <View style={styles.header}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', margin: 10, color: "#09263B" }}>רשימת הקניות שלי🛒</Text>
        <Text style={{ fontSize: 18, color: "#09263B" }}>Last edit by: {currentEditor} AT: {date}</Text>
        <TextInput
          style={styles.input}
          placeholder="הקש כאן כדי להוסיף דברים לרשימה"
          onChangeText={(text) => setItem(text)}
          value={item}
          autoFocus={true}
          onKeyPress={(e) => handleKeyPress(e.nativeEvent.key)}
        />
      </View>

      <View style={styles.itemsList}>
        {items.length === 0 ? (
          <EmptyListCase />
        ) : (
          <ScrollView>
            {/* Display the list as card with option to delete */}
            {items.length > 0 &&
            items.slice().reverse().map((item, index) => (
              <Card key={index} style={styles.card}>
                <Card.Actions style={styles.cardActions}>
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
        )}
      </View>

      <View style={styles.buttonsSection}>
        <TouchableOpacity onPress={() => sendList()}>
          <FontAwesome style={styles.saveBotton} name="send" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => getData()}>
          <FontAwesome style={styles.refershBotton} name="refresh" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => clearList()}>
          <AntDesign style={styles.clearBotton} name="delete" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  justifyContent: 'flex-start',
  paddingTop: 35,
  borderColor: '#82BDC1',
  borderWidth: 5,
},
header: {
  alignItems: 'center',
  backgroundColor: '#82BDC1',
  padding: 10,
},
input: {
  height: 40,
  color: '#1E92C4',
  borderColor: '#1E92C4',
  borderWidth: 2,
  borderRadius: 5,
  padding: 10,
  margin: 20,
  backgroundColor: 'white',
  width: '80%',
},
item: {
  padding: 5,
  fontSize: 18,
  height: 44,
  color: '#1E92C4',
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
itemsList: {
  flex: 1,
  borderColor: '#09263B',
  borderWidth: 5,
  borderRadius: 15,
  backgroundColor: '#82BDC1',
  marginTop: 10,
  paddingHorizontal: 20,
  paddingVertical: 10,
},
card: {
  backgroundColor: "white",
  borderColor: "#1E92C4",
  borderWidth: 1,
  marginVertical: 5,
},
cardActions: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},
buttonsSection: {
  flexDirection: "row",
  justifyContent: 'space-between',
  backgroundColor: '#82BDC1',
  padding: 10,
},
itemsListEmpty: {},
});