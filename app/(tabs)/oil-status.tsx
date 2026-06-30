import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function OilStatusScreen() {
  const [oilData, setOilData] = useState<any>(null);
  const [latestOdometer, setLatestOdometer] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Notifications.requestPermissionsAsync();

      const oil = await AsyncStorage.getItem('oilChange');

      if (oil) {
        const oilInfo = JSON.parse(oil);
        setOilData(oilInfo);

        const fuelLogs =
          await AsyncStorage.getItem('fuelLogs');

        if (fuelLogs) {
          const logs = JSON.parse(fuelLogs);

          if (logs.length > 0) {
            const maxOdometer = Math.max(
              ...logs.map(
                (item: any) =>
                  Number(item.odometer)
              )
            );

            setLatestOdometer(maxOdometer);

            const remaining =
              Number(oilInfo.nextChangeKm) -
              maxOdometer;

            if (
              remaining <= 100 &&
              remaining > 0
            ) {
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: 'تغيير الزيت',
                  body: `متبقي ${remaining} كم على تغيير الزيت`,
                  sound: true,
                },
                trigger: null,
              });
            }

            if (remaining <= 0) {
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: 'تغيير الزيت',
                  body: '🚨 يجب تغيير الزيت الآن',
                  sound: true,
                },
                trigger: null,
              });
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!oilData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          لا توجد بيانات زيت محفوظة
        </Text>
      </View>
    );
  }

  const remaining =
    Number(oilData.nextChangeKm) -
    latestOdometer;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        حالة الزيت
      </Text>

      <View style={styles.card}>
        <Text style={styles.item}>
          🛢️ نوع الزيت: {oilData.oilType}
        </Text>

        <Text style={styles.item}>
          🚗 آخر تغيير زيت:
          {' '}
          {oilData.odometer} كم
        </Text>

        <Text style={styles.item}>
          🔧 الفلتر:
          {' '}
          {oilData.filterChanged}
        </Text>

        <Text style={styles.item}>
          📍 آخر عداد مسجل:
          {' '}
          {latestOdometer} كم
        </Text>

        <Text style={styles.item}>
          🎯 التغيير القادم:
          {' '}
          {oilData.nextChangeKm} كم
        </Text>

        <Text style={styles.item}>
          ⏳ المتبقي:
          {' '}
          {remaining} كم
        </Text>

        {remaining <= 100 &&
          remaining > 0 && (
            <Text style={styles.warning}>
              ⚠️ متبقي 100 كم أو أقل على تغيير الزيت
            </Text>
          )}

        {remaining <= 0 && (
          <Text style={styles.warning}>
            🚨 يجب تغيير الزيت الآن
          </Text>
        )}
      </View>
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
    padding: 20,
    borderRadius: 16,
  },

  item: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'right',
  },

  warning: {
    color: '#ff4444',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
});