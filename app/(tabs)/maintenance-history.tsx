import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function MaintenanceHistoryScreen() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const data = await AsyncStorage.getItem(
      'maintenanceLogs'
    );

    console.log('Loaded Maintenance:', data);

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
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
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