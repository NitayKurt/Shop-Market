import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

export default function App() {

  const [editor, setEditor] = useState('');


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" backgroundColor='#1E92C4'/>
    <View>
      <Text>My Shop Market List</Text>
      <Text>Last edit by: {editor}</Text>
    </View>
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
