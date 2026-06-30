import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function StatisticsScreen() {
  const [fuelCost, setFuelCost] = useState(0);
  const [maintenanceCost, setMaintenanceCost] = useState(0);
  const [fuelCount, setFuelCount] = useState(0);
  const [maintenanceCount, setMaintenanceCount] = useState(0);
  const [consumption, setConsumption] = useState('0');

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    const fuelData =
      await AsyncStorage.getItem('fuelLogs');

    const maintenanceData =
      await AsyncStorage.getItem(
        'maintenanceLogs'
      );

    let totalFuelCost = 0;
    let totalMaintenanceCost = 0;

    if (fuelData) {
      const logs = JSON.parse(fuelData);

      setFuelCount(logs.length);

      logs.forEach((item: any) => {
        totalFuelCost +=
          Number(item.totalPrice || 0);
      });

      setFuelCost(totalFuelCost);

      if (logs.length >= 2) {
        const last = logs[logs.length - 1];
        const prev = logs[logs.length - 2];

        const km =
          Number(last.odometer) -
          Number(prev.odometer);

        const liters =
          Number(last.liters);

        if (km > 0) {
          setConsumption(
            ((liters * 100) / km).toFixed(2)
          );
        }
      }
    }

    if (maintenanceData) {
      const logs =
        JSON.parse(maintenanceData);

      setMaintenanceCount(logs.length);

      logs.forEach((item: any) => {
        totalMaintenanceCost +=
          Number(item.cost || 0);
      });

      setMaintenanceCost(
        totalMaintenanceCost
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        📊 إحصائيات السيارة
      </Text>

      <View style={styles.card}>
        <Text style={styles.value}>
          {fuelCost.toFixed(2)} جنيه
        </Text>
        <Text style={styles.label}>
          إجمالي البنزين
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.value}>
          {maintenanceCost.toFixed(2)} جنيه
        </Text>
        <Text style={styles.label}>
          إجمالي الصيانة
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.value}>
          {(fuelCost + maintenanceCost).toFixed(2)}
          {' '}جنيه
        </Text>
        <Text style={styles.label}>
          إجمالي المصروفات
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.value}>
          {consumption}
        </Text>
        <Text style={styles.label}>
          لتر / 100 كم
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.value}>
          {fuelCount}
        </Text>
        <Text style={styles.label}>
          عدد التفويلات
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.value}>
          {maintenanceCount}
        </Text>
        <Text style={styles.label}>
          عدد الصيانات
        </Text>
      </View>
    </ScrollView>
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
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 25,
  },

  card: {
    backgroundColor: '#172033',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    alignItems: 'center',
  },

  value: {
    color: '#00FFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },

  label: {
    color: '#CBD5E1',
    marginTop: 8,
    fontSize: 16,
  },
});