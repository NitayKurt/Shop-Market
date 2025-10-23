import { StyleSheet, Text, View, TouchableOpacity, Image,} from 'react-native';
import { Card } from 'react-native-paper';

export default function ItemCard({ items, item, setItems, deleteItem }) {

  return (
    <Card key={item.name} style={styles.card}>
        <Card.Actions style={styles.cardActions}>
            <Text style={[styles.item, { flex: 1 }]}>{item.name}</Text>
            <View style={styles.itemCounterSection}>
                <TouchableOpacity style={styles.counterChanger}
                    onPress={() => {
                        const updatedItems = [...items];
                        const idx = updatedItems.findIndex(i => i.name === item.name); // find the real index
                        if (idx !== -1 && updatedItems[idx].quantity > 1) {
                            updatedItems[idx].quantity -= 1;
                            setItems(updatedItems);
                        }
                    }}
                >
                    <Image source={require('../assets/arrowDownIcon.png')} style={styles.arrowDownImage} />
                </TouchableOpacity>
                <Text style={{ color: "#1E92C4", fontWeight: "bold" }}>{item.quantity}</Text>
                <TouchableOpacity style={styles.counterChanger}
                    onPress={() => {
                        const updatedItems = [...items];
                        const idx = updatedItems.findIndex(i => i.name === item.name); // find the real index
                        if (idx !== -1) {
                            updatedItems[idx].quantity += 1;
                            setItems(updatedItems);
                        }
                    }}
                >
                    <Image source={require('../assets/arrowUpIcon.png')} style={styles.arrowUpImage} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteItem(item)}><Text style={{ color: "white" }}>X</Text></TouchableOpacity>
        </Card.Actions>
    </Card>
  )
}

const styles = StyleSheet.create({
  item: {
    padding: 1,
    fontSize: 20,
    height: 35,
    color: '#1E92C4',
  },
  card: {
    backgroundColor: "white",
    borderColor: "#1E92C4",
    borderWidth: 1,
    marginVertical: 1.5,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: 'white',
    fontSize: 20,
    padding: 10,
    margin: 10,
    borderRadius: 5,
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