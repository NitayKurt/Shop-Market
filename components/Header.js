import { StyleSheet, Text, View } from 'react-native'

export default function Header({ lastEditor, lastEditAt }) {
  return (
    <View style={styles.headerTextContainer}>
      <Text style={styles.mainHeader}>רשימת הקניות שלי🛒</Text>
      <Text style={styles.subHeader}>נערך לאחרונה על ידי: {lastEditor} ב: {lastEditAt}</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  headerTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainHeader: { 
    fontSize: 20,
    fontWeight: 'bold',
    color: "#09263B" ,
    textAlign: 'center',
  },
  subHeader: { 
    fontSize: 16,
    color: "#09263B",
    textAlign: 'center',
  },
});