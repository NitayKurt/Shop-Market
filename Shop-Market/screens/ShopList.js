import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Image,} from 'react-native';
import { Card, } from 'react-native-paper';
import EmptyListCase from '../components/EmptyListCase';
import { collection, getDocs, addDoc, setDoc, doc,updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB, } from '../firebase-config';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

export default function ShopList({ navigation, setUser, user }) {

  const [lastEditor, setLastEditor] = useState('');
  const [lastEditAt, setLastEditAt] = useState('');
  const [currentEditor, setCurrentEditor] = useState(user);
  const date = new Date().toLocaleString();
  const [item, setItem] = useState('');
  const [items, setItems] = useState([]);
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
      alert('List updated✅');
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  };
  
  const saveItem = (itemName) => {
    const trimmedItem = itemName.trim();
    if (trimmedItem !== '') {
      const existingItemIndex = items.findIndex(item => item.name === trimmedItem);
      if (existingItemIndex !== -1) {
        // If the item already exists, increase its quantity
        const updatedItems = [...items];
        updatedItems[existingItemIndex].quantity += 1;
        setItems(updatedItems);
      } else {
        // Add a new item with a quantity of 1
        setItems([...items, { name: trimmedItem, quantity: 1 }]);
      }
      setItem('');
    }
  };
  
  const handleKeyPress = (text) => {
    if (text.includes('.')) {
        saveItem(text);
    }
  };

  const sendList = async () => {
    try {
      await updateDoc(doc(FIRESTORE_DB, "products", dataId), {
        items: items, // Updated array of objects
        editor: currentEditor,
        date: date,
      });
      console.log("Document updated with ID: ", dataId);
      Alert.alert('Success', 'List updated successfully ✅');
    } catch (error) {
      Alert.alert('Error', 'Error sending list ❌');
      console.error('Error updating document: ', error);
    }
  };


  const deleteItem = (index) => {
    // Since items are displayed in reverse, adjust the index to match the original array
    const actualIndex = items.length - 1 - index;
    const newItems = [...items];
    newItems.splice(actualIndex, 1);
    setItems(newItems);
  };
  

  const clearList = () => {
    Alert.alert('Alert ⚠️', 'Are you sure you want to delete the whole list?', [
      {
        text: 'Cancel',
        onPress: () => {console.log('Cancel Pressed')},
        style: 'cancel',
      },
      {text: 'OK', onPress: () => {resetList()}},
    ]);
  };

  const resetList = async() => {
    try {
      const updateProducts = await updateDoc(doc(FIRESTORE_DB, "products",dataId), {
        items: [],
        editor: currentEditor,
        date: date,
      });
      setItems([]);
      alert('List cleared✅')
    } catch (error) {
      Alert.alert('Error', 'Error delete list❌');
      console.error('Error delete document: ', error);
    }
  };
  
  const exitApp = () => {
    Alert.alert('Alert ⚠️', 'Are you sure you want to exit?', [
      {
        text: 'Cancel',
        onPress: () => {console.log('Cancel Pressed')},
        style: 'cancel',
      },
      {text: 'OK', onPress: () => {setUser(''),navigation.navigate('Login');}},
    ]);
  };

return (
  <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView style={styles.container} behavior={"height"}>
      <View style={styles.headerContainer}> 
        <Text style={styles.mainHeader}>רשימת הקניות שלי🛒</Text>
        <Text style={styles.subHeader}>Last edit by: {lastEditor} AT: {lastEditAt}</Text>
        <TextInput
          style={styles.input}
          placeholder="הקש כאן כדי להוסיף דברים לרשימה"
          onChangeText={(text) => {setItem(text),handleKeyPress(text);}}
          value={item}
          autoFocus={true}
        />
      </View>

      <View style={styles.itemsList}>
        {items.length === 0 ? (
          <EmptyListCase />
        ) : (
          <ScrollView>
               {items.slice().reverse().map((item, index) => (
                <Card key={index} style={styles.card}>
                  <Card.Actions style={styles.cardActions}>
                      <Text style={[styles.item, { flex: 1 }]}>{item.name}</Text>
                    <View style={styles.itemCounterSection}>
                      <TouchableOpacity style={styles.counterChanger}
                        onPress={() => {
                        const actualIndex = items.length - 1 - index;
                        const updatedItems = [...items];
                        if (updatedItems[actualIndex].quantity > 1) {
                        updatedItems[actualIndex].quantity -= 1;
                        setItems(updatedItems);
                        }
                        }}
                        >
                        <Image source={require('../assets/arrowDownIcon.png')} style={styles.arrowDownImage} />
                      </TouchableOpacity>
                      <Text style={{ color: "#1E92C4", fontWeight: "bold" }}>{item.quantity}</Text>
                      <TouchableOpacity style={styles.counterChanger}
                        onPress={() => {
                        const actualIndex = items.length - 1 - index;
                        const updatedItems = [...items];
                        updatedItems[actualIndex].quantity += 1;
                        setItems(updatedItems);
                        }}
                        >
                        <Image source={require('../assets/arrowUpIcon.png')} style={styles.arrowUpImage} />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteItem(index)}>
                      <Text style={{ color: "white" }}>X</Text>
                    </TouchableOpacity>
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

      <View style={styles.exitButtonContainer}>
        <TouchableOpacity onPress={() => exitApp()}>
          <MaterialIcons name="exit-to-app" size={30} color="#005f73" />
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
headerContainer: {
  alignItems: 'center',
  backgroundColor: '#82BDC1',
  padding: 10,
},
mainHeader: {
  fontSize: 20,
  fontWeight: 'bold',
  margin: 10,
  color: "#09263B"
},
subHeader:{
  fontSize: 18,
  color: "#09263B"
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
deleteButton: {
  backgroundColor: '#f44336',
  color: 'white',
  fontSize: 20,
  padding: 10,
  margin: 10,
  borderRadius: 5,
},
exitButtonContainer: {
  position: 'absolute',
  top: 10,
  right: 10,
  },
itemCounterSection: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'white',
  justifyContent: 'space-between',
  width: 80,
  right: 10,
  },
  counterChanger: {
  justifyContent: 'center',
  alignItems: 'center',
  width: 30,
  height: 30,
  borderRadius: 10,
  },
  arrowUpImage:{
    width: 20,
    height: 20,
  },
  arrowDownImage:{
    width: 20,
    height: 20,
  },
});