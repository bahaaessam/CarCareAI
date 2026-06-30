import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import {
  calculateFuelConsumption,
  calculateTotalDrivingRange,
  sortByDateDesc,
} from '@/utils/records';
import { useCallback, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
console.log('Fuel History Loaded');

type FuelHistoryItem = {
  date?: string;
  odometer?: string;
  liters?: string;
  price?: string;
  fuelType?: string;
  storageIndex: number;
};

export default function FuelHistoryScreen() {
  const [logs, setLogs] = useState<FuelHistoryItem[]>([]);

  const latestOdometer =
  logs.length > 0
    ? Math.max(
        ...logs.map(
          (item) => Number(item.odometer)
        )
      )
    : 'لا يوجد';

  const fuelConsumption = calculateFuelConsumption(logs);
  const totalDrivingRange = calculateTotalDrivingRange(logs);

  useFocusEffect(
  useCallback(() => {
    loadLogs();
  }, [])
);

  const loadLogs = async () => {
  const data = await AsyncStorage.getItem('fuelLogs');

  console.log('Loaded Fuel Logs:', data);

  if (data) {
    const parsedLogs = JSON.parse(data).map((item: any, index: number) => ({
      ...item,
      storageIndex: index,
    }));

    setLogs(sortByDateDesc(parsedLogs));
  } else {
    setLogs([]);
  }
};

  const deleteLog = async (indexToDelete: number) => {
    const oldData = await AsyncStorage.getItem('fuelLogs');
    const storedLogs = oldData ? JSON.parse(oldData) : [];
    const updatedLogs = storedLogs.filter(
      (_: any, index: number) => index !== indexToDelete
    );
    const visibleLogs = updatedLogs.map((item: any, index: number) => ({
      ...item,
      storageIndex: index,
    }));

    setLogs(sortByDateDesc(visibleLogs));

    await AsyncStorage.setItem(
      'fuelLogs',
      JSON.stringify(updatedLogs)
    );
  };

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

<Text style={styles.rangeText}>
  إجمالي المسافة المقطوعة: {totalDrivingRange} كم
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
        keyExtractor={(item) => item.storageIndex.toString()}
        renderItem={({ item }) => (
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
              onPress={() => deleteLog(item.storageIndex)}>
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

  rangeText: {
    color: '#CBD5E1',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: 'bold',
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