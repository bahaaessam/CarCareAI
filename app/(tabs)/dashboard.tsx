import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function Dashboard() {
  const [oilWarning, setOilWarning] = useState('');

  useEffect(() => {
    loadOilStatus();
  }, []);

  const loadOilStatus = async () => {
    try {
      const oil = await AsyncStorage.getItem('oilChange');
      const fuelLogs = await AsyncStorage.getItem('fuelLogs');

      if (!oil || !fuelLogs) return;

      const oilData = JSON.parse(oil);
      const logs = JSON.parse(fuelLogs);

      if (logs.length === 0) return;

      const currentKm = Number(
        logs[logs.length - 1].odometer
      );

      const remaining =
        Number(oilData.nextChangeKm) - currentKm;

      if (remaining <= 100 && remaining > 0) {
        setOilWarning(
          `⚠️ متبقي ${remaining} كم على تغيير الزيت`
        );
      } else if (remaining <= 0) {
        setOilWarning(
          '🚨 يجب تغيير الزيت الآن'
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}>

      <Text style={styles.title}>لوحة التحكم</Text>

      {oilWarning !== '' && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            {oilWarning}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/(tabs)/car-info')}>
        <Text style={styles.cardTitle}>
          🚗 بيانات السيارة
        </Text>
        <Text style={styles.cardText}>
          عرض وتعديل بيانات السيارة
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/(tabs)/statistics')}>
        <Text style={styles.cardTitle}>
          📊 إحصائيات السيارة
        </Text>
        <Text style={styles.cardText}>
          عرض المصروفات والاستهلاك
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/(tabs)/fuel')}>
        <Text style={styles.cardTitle}>
          ⛽ إضافة تفويلة
        </Text>
        <Text style={styles.cardText}>
          تسجيل البنزين واستهلاك الوقود
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/(tabs)/fuel-history')}>
        <Text style={styles.cardTitle}>
          📋 سجل التفويلات
        </Text>
        <Text style={styles.cardText}>
          عرض جميع التفويلات السابقة
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/(tabs)/oil-change')}>
        <Text style={styles.cardTitle}>
          🛢️ تغيير الزيت
        </Text>
        <Text style={styles.cardText}>
          تسجيل تغيير الزيت
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/(tabs)/oil-status')}>
        <Text style={styles.cardTitle}>
          📊 حالة الزيت
        </Text>
        <Text style={styles.cardText}>
          متابعة التغيير القادم
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/(tabs)/maintenance')}>
        <Text style={styles.cardTitle}>
          🔧 إضافة صيانة
        </Text>
        <Text style={styles.cardText}>
          تسجيل أعمال الصيانة
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/(tabs)/maintenance-history')}>
        <Text style={styles.cardTitle}>
          📋 سجل الصيانات
        </Text>
        <Text style={styles.cardText}>
          عرض جميع أعمال الصيانة
        </Text>
      </TouchableOpacity>

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
    marginBottom: 30,
  },

  warningBox: {
    backgroundColor: '#7F1D1D',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },

  warningText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: '#172033',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
  },

  cardTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
  },

  cardText: {
    color: '#CBD5E1',
    marginTop: 8,
    textAlign: 'right',
  },
});