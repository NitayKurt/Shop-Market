import { useEffect, useState, useMemo } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, SectionList, Image } from 'react-native';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../firebase-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import ItemCard from '../components/ItemCard';
import PickImage from '../components/PickImage';
import EmptyListCase from '../components/EmptyListCase';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import categoriesJSON from '../database/allProducts.json';

export default function ShopList({ navigation, setUser, user }) {

  const [lastEditor, setLastEditor] = useState('');
  const [lastEditAt, setLastEditAt] = useState('');
  const [currentEditor] = useState(user);
  const date = new Date().toLocaleString();
  const [item, setItem] = useState('');
  const [items, setItems] = useState([]);
  const [dataId, setDataId] = useState('');
  const categories = categoriesJSON.categories;

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
      Alert.alert('Success','List updated ✅');
    } catch (error) {
      Alert.alert('Error', 'Error getting list ❌');
      console.log("Error getting documents: ", error);
    }
  };

  const cleanName = (name) => name.replace(/[?.!]/g, '').trim();

  const sections = useMemo(() => {
    const lookup = {};
    categories.forEach(cat => {
      cat.data.forEach(name => {
        lookup[name.trim()] = cat.title;
      });
    });

    const grouped = {};
    items.forEach(it => {
      const name = cleanName(it.name);
      const category = lookup[name] || "אחר";
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push({ ...it, name });
    });

    return Object.keys(grouped).map(title => ({
      title,
      data: grouped[title],
    }));
  }, [items, categories]);

  const saveItem = (itemName) => {
    const trimmedItem = cleanName(itemName);
    if (trimmedItem) {
      const existingIndex = items.findIndex(it => cleanName(it.name) === trimmedItem);
      if (existingIndex !== -1) {
        const updatedItems = [...items];
        updatedItems[existingIndex].quantity += 1;
        setItems(updatedItems);
      } else {
        setItems([...items, { name: trimmedItem, quantity: 1 }]);
      }
      setItem('');
    }
  };

  const handleKeyPress = (text) => {
    if (text.includes('.')) saveItem(text);
  };

  const sendList = async () => {
    try {
      await updateDoc(doc(FIRESTORE_DB, "products", dataId), {
        items,
        editor: currentEditor,
        date,
      });
      Alert.alert('Success', 'List updated successfully ✅');
    } catch (error) {
      Alert.alert('Error', 'Error sending list ❌');
      console.error(error);
    }
  };

  const deleteItem = (itemToDelete) => {
    setItems(items.filter(it => it.name !== itemToDelete.name));
  };

  const clearList = () => {
    Alert.alert('Alert ⚠️', 'Are you sure you want to delete the whole list?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: resetList },
    ]);
  };

  const resetList = async () => {
    try {
      await updateDoc(doc(FIRESTORE_DB, "products", dataId), { items: [], editor: currentEditor, date });
      setItems([]);
      Alert.alert('Success','List cleared ✅');
    } catch (error) {
      Alert.alert('Error', 'Error deleting list ❌');
      console.error(error);
    }
  };

  const exitApp = () => {
    Alert.alert('Alert ⚠️', 'Are you sure you want to exit?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: () => { setUser(''); deleteSavedUser(); navigation.navigate('Login'); } },
    ]);
  };

  const deleteSavedUser = async () => {
    try {
      await AsyncStorage.removeItem('savedUser');
    } catch (error) {
      console.log('Error deleting saved user from AsyncStorage:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.container} behavior={"height"}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={exitApp} style={styles.exitButtonContainer}>
            <MaterialIcons name="exit-to-app" size={30} color="#005f73" />
          </TouchableOpacity>
          <Header lastEditor={lastEditor} lastEditAt={lastEditAt} />
        </View>

        <View style={styles.headerContainer}>
          <TextInput
            style={styles.input}
            placeholder="הקש כאן כדי להוסיף דברים לרשימה"
            onChangeText={(text) => { setItem(text); handleKeyPress(text); }}
            value={item}
            autoFocus={true}
          />
        </View>

        <View style={styles.itemsList}>
          {items.length === 0 ? (
            <EmptyListCase />
          ) : (
            <SectionList
              extraData={items}
              sections={sections}
              keyExtractor={(item, index) => `${item.name}-${index}-${item.quantity}`}
              renderItem={({ item }) => (
                <ItemCard
                  item={item}
                  items={items}
                  setItems={setItems}
                  deleteItem={deleteItem}
                />
              )}
              renderSectionHeader={({ section: { title } }) => (
                <View style={styles.sectionHeaderContainer}>
                  <Image style={styles.sectionHeaderIcon} source={PickImage(title)}/>
                  <Text style={styles.sectionHeaderText}>{title}</Text>
                </View>
              )}
              initialNumToRender={20}
              maxToRenderPerBatch={20}
              stickySectionHeadersEnabled={false}
            />
          )}
        </View>

        <View style={styles.buttonsSection}>
          <TouchableOpacity onPress={sendList}><FontAwesome style={styles.saveButton} name="send" size={24} color="black" /></TouchableOpacity>
          <TouchableOpacity onPress={getData}><FontAwesome style={styles.refreshButton} name="refresh" size={24} color="black" /></TouchableOpacity>
          <TouchableOpacity onPress={clearList}><AntDesign style={styles.clearButton} name="delete" size={24} color="black" /></TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    paddingTop: 35 
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: '#82BDC1',
    padding: 10 
  },
  input: { 
    height: 50,
    color: '#1E92C4',
    borderColor: '#1E92C4', 
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    margin: 20, 
    backgroundColor: 'white', 
    width: '80%' 
  },
  itemsList: { 
    flex: 1,
    borderRadius: 10,
    backgroundColor: '#82BDC1', 
    marginTop: 10, 
    paddingHorizontal: 20, 
    paddingVertical: 10 
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0fbfc',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  sectionHeaderIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    resizeMode: 'contain',
  },
  sectionHeaderText: { 
    fontWeight: 'bold', 
    fontSize: 18,
    color: '#023047',
    marginVertical: 5 
  },
  buttonsSection: { 
    flexDirection: "row",
    justifyContent: 'space-between',
    borderTopColor:"#1E92C4",
    borderTopWidth: 1,
    backgroundColor: '#82BDC1',
    padding: 10
  },
  saveButton: { 
    backgroundColor: '#4caf50',
    color: 'white',
    fontSize: 20,
    padding: 10,
    margin: 10,
    borderRadius: 5
  },
  refreshButton: { backgroundColor: '#00B0FF',
    color: 'white',
    fontSize: 20,
    padding: 10,
    margin: 10,
    borderRadius: 5
  },
  clearButton: { 
    backgroundColor: '#f44336',
    color: 'white',
    fontSize: 20,
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignContent: "flex-end"
  },
  headerContainer: {
    backgroundColor: '#82BDC1',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  exitButtonContainer: { 
    position: 'absolute',
    top: -10,
    right: 10,
    padding: 5,
  },
});