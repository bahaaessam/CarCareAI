import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
console.log('Fuel History Loaded');

export default function FuelHistoryScreen() {
  const [logs, setLogs] = useState<any[]>([]);

  const latestOdometer =
  logs.length > 0
    ? Math.max(
        ...logs.map(
          (item) => Number(item.odometer)
        )
      )
    : 'لا يوجد';

  useFocusEffect(
  useCallback(() => {
    loadLogs();
  }, [])
);

  const loadLogs = async () => {
  const data = await AsyncStorage.getItem('fuelLogs');

  console.log('Loaded Fuel Logs:', data);

  if (data) {
    setLogs(JSON.parse(data));
  }
};

  const deleteLog = async (indexToDelete: number) => {
    const updatedLogs = logs.filter(
      (_, index) => index !== indexToDelete
    );

    setLogs(updatedLogs);

    await AsyncStorage.setItem(
      'fuelLogs',
      JSON.stringify(updatedLogs)
    );
  };

  const fuelConsumption =
  logs.length >= 2
    ? (
        (Number(logs[logs.length - 1].liters) * 100) /
        (
          Number(logs[logs.length - 1].odometer) -
          Number(logs[logs.length - 2].odometer)
        )
      ).toFixed(2)
    : null;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>سجل التفويلات</Text>

      <Text
  style={{
    color: '#00FFFF',
    textAlign: 'center',
    marginBottom: 10,
  }}>
  آخر قراءة عداد: {latestOdometer}
</Text>

{fuelConsumption && (
  <Text
    style={{
      color: '#22C55E',
      textAlign: 'center',
      marginBottom: 15,
      fontWeight: 'bold',
    }}>
    استهلاك الوقود: {fuelConsumption} لتر / 100 كم
  </Text>
)}

      <FlatList
        data={logs}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.item}>
              📅 التاريخ: {item.date}
            </Text>

            <Text style={styles.item}>
              🚗 العداد: {item.odometer}
            </Text>

            <Text style={styles.item}>
              ⛽ اللترات: {item.liters}
            </Text>

            <Text style={styles.item}>
              💰 سعر اللتر: {item.price}
            </Text>

            <Text style={styles.item}>
              🛢️ البنزين: {item.fuelType}
            </Text>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteLog(index)}>
              <Text style={styles.deleteText}>
                🗑️ حذف
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020817',
    padding: 20,
  },

  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#172033',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  item: {
    color: '#fff',
    marginBottom: 5,
  },

  deleteButton: {
    backgroundColor: '#B91C1C',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },

  deleteText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});