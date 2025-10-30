import { useEffect, useState, useMemo, useCallback } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, SectionList, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
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

  // --- Fetch Data ---
  const getData = useCallback(async () => {
    try {
      const productsRef = collection(FIRESTORE_DB, "products");
      const querySnapshot = await getDocs(productsRef);
      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();
        const docId = querySnapshot.docs[0].id;
        const cleanedItems = docData.items.map(it => ({ ...it, name: cleanName(it.name) }));
        setDataId(docId);
        setLastEditor(docData.editor);
        setLastEditAt(docData.date);
        setItems(cleanedItems);
        Alert.alert('Success', 'List updated ✅');
      }
    } catch (error) {
      Alert.alert('Error', 'Error getting list ❌');
      console.log("Error getting documents: ", error);
    }
  }, []);

  useEffect(() => { getData(); }, [getData]);

  const cleanName = useCallback(name => name.replace(/[?.!]/g, '').trim(), []);

  // --- Section Memoization ---
  const sections = useMemo(() => {
    const lookup = {};
    categories.forEach(cat => cat.data.forEach(name => { lookup[name.trim()] = cat.title; }));
    const grouped = {};
    items.forEach(it => {
      const category = lookup[it.name] || "אחר";
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(it);
    });
    return Object.keys(grouped).map(title => ({ title, data: grouped[title] }));
  }, [items, categories]);

  // --- Add / Save Item ---
  const saveItem = useCallback((itemName) => {
    const trimmed = cleanName(itemName);
    if (!trimmed) return;

    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(it => it.name === trimmed);
      if (existingIndex !== -1) {
        const newItems = [...prevItems];
        newItems[existingIndex].quantity += 1;
        return newItems;
      } else {
        return [...prevItems, { name: trimmed, quantity: 1 }];
      }
    });

    setItem('');
  }, [cleanName]);

  

  const handleKeyPress = useCallback((text) => { if (text.includes('.')) saveItem(text); }, [saveItem]);

  // --- Send / Clear / Delete ---
  const sendList = useCallback(async () => {
    try {
      await updateDoc(doc(FIRESTORE_DB, "products", dataId), { items, editor: currentEditor, date });
      Alert.alert('Success', 'List updated successfully ✅');
    } catch (error) {
      Alert.alert('Error', 'Error sending list ❌');
      console.error(error);
    }
  }, [items, currentEditor, date, dataId]);

  const deleteItem = useCallback((itemName) => {
    setItems(prev => prev.filter(it => it.name !== itemName));
  }, []);

  const clearList = useCallback(() => {
    Alert.alert('Alert ⚠️', 'Are you sure you want to delete the whole list?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: resetList },
    ]);
  }, []);

  const resetList = useCallback(async () => {
    try {
      await updateDoc(doc(FIRESTORE_DB, "products", dataId), { items: [], editor: currentEditor, date });
      setItems([]);
      Alert.alert('Success','List cleared ✅');
    } catch (error) {
      Alert.alert('Error', 'Error deleting list ❌');
      console.error(error);
    }
  }, [currentEditor, dataId, date]);

  const exitApp = useCallback(() => {
    Alert.alert('Alert ⚠️', 'Are you sure you want to exit?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: () => { setUser(''); deleteSavedUser(); navigation.navigate('Login'); } },
    ]);
  }, [navigation, setUser]);

  const deleteSavedUser = useCallback(async () => {
    try { await AsyncStorage.removeItem('savedUser'); } catch (error) { console.log(error); }
  }, []);

  // --- Render ---
  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={exitApp} style={styles.exitButtonContainer}>
              <MaterialIcons name="exit-to-app" size={30} color="#005f73" />
            </TouchableOpacity>
            <Header lastEditor={lastEditor} lastEditAt={lastEditAt} />
          </View>

          <KeyboardAvoidingView behavior="height">
            <TextInput
              style={styles.input}
              placeholder="הקש כאן כדי להוסיף דברים לרשימה"
              onChangeText={text => { setItem(text); handleKeyPress(text); }}
              value={item}
              autoFocus={true}
            />
          </KeyboardAvoidingView>

          <View style={styles.itemsList}>
            {items.length === 0 ? <EmptyListCase /> : (
              <SectionList
                sections={sections}
                keyExtractor={item => item.name} // stable key
                renderItem={({ item }) => {
                  const handleUpdate = updatedItem => setItems(prev => prev.map(i => i.name === updatedItem.name ? updatedItem : i));
                  const handleDelete = () => deleteItem(item.name);
                  return <ItemCard item={item} updateItem={handleUpdate} deleteItem={handleDelete} />;
                }}
                renderSectionHeader={({ section: { title } }) => (
                  <View style={styles.sectionHeaderContainer}>
                    <Image style={styles.sectionHeaderIcon} source={PickImage(title)} />
                    <Text style={styles.sectionHeaderText}>{title}</Text>
                  </View>
                )}
                initialNumToRender={15}
                maxToRenderPerBatch={15}
                windowSize={21}
                stickySectionHeadersEnabled={false}
              />
            )}
          </View>

          <View style={styles.buttonsSection}>
            <TouchableOpacity onPress={sendList}><FontAwesome style={[styles.buttonBase, styles.saveButton]} name="send" size={24} color="white" /></TouchableOpacity>
            <TouchableOpacity onPress={getData}><FontAwesome style={[styles.buttonBase, styles.refreshButton]} name="refresh" size={24} color="white" /></TouchableOpacity>
            <TouchableOpacity onPress={clearList}><AntDesign style={[styles.buttonBase, styles.clearButton]} name="delete" size={24} color="white" /></TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 35 },
  headerContainer: { backgroundColor: '#82BDC1', paddingVertical: 10, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  exitButtonContainer: { position: 'absolute', top: -10, right: 10, padding: 5 },
  input: { height: 50, color: '#1E92C4', borderColor: '#1E92C4', borderWidth: 2, borderRadius: 5, padding: 10, margin: 20, backgroundColor: 'white', width: '80%' },
  itemsList: { flex: 1, borderRadius: 10, backgroundColor: '#82BDC1', paddingHorizontal: 10, paddingVertical: 10 },
  sectionHeaderContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0fbfc', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10, marginVertical: 4, alignSelf: 'center' },
  sectionHeaderIcon: { width: 24, height: 24, marginRight: 8, resizeMode: 'contain' },
  sectionHeaderText: { fontWeight: 'bold', fontSize: 18, color: '#023047', marginVertical: 5 },
  buttonsSection: { flexDirection: "row", justifyContent: 'space-between', borderTopColor:"#1E92C4", borderTopWidth: 1, backgroundColor: '#82BDC1', padding: 10 },
  buttonBase: { padding: 10, margin: 10, borderRadius: 5 },
  saveButton: { backgroundColor: '#4caf50' },
  refreshButton: { backgroundColor: '#00B0FF' },
  clearButton: { backgroundColor: '#f44336' },
});
