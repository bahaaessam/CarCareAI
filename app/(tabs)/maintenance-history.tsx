import AsyncStorage from '@react-native-async-storage/async-storage';
import { sortByDateDesc } from '@/utils/records';
import { useEffect, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type MaintenanceHistoryItem = {
  date?: string;
  serviceName?: string;
  odometer?: string;
  cost?: string;
  notes?: string;
  storageIndex: number;
};

export default function MaintenanceHistoryScreen() {
  const [logs, setLogs] = useState<MaintenanceHistoryItem[]>([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const data = await AsyncStorage.getItem(
      'maintenanceLogs'
    );

    console.log('Loaded Maintenance:', data);

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
    const oldData = await AsyncStorage.getItem('maintenanceLogs');
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
      'maintenanceLogs',
      JSON.stringify(updatedLogs)
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        سجل الصيانات
      </Text>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.storageIndex.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.item}>
              📅 التاريخ: {item.date}
            </Text>

            <Text style={styles.item}>
              🔧 الصيانة: {item.serviceName}
            </Text>

            <Text style={styles.item}>
              🚗 العداد: {item.odometer}
            </Text>

            <Text style={styles.item}>
              💰 التكلفة: {item.cost}
            </Text>

            <Text style={styles.item}>
              📝 ملاحظات: {item.notes}
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