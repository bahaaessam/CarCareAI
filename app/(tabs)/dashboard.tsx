import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function Dashboard() {
  const [oilWarning, setOilWarning] = useState('');
  const [fabOpen, setFabOpen] = useState(false);

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

      const currentKm = Math.max(
        ...logs.map((item: any) => Number(item.odometer || 0))
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

  const openRoute = (route: '/(tabs)/fuel' | '/(tabs)/oil-change' | '/(tabs)/maintenance') => {
    setFabOpen(false);
    router.push(route);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}>

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
          onPress={() => router.push('/(tabs)/maintenance-history')}>
          <Text style={styles.cardTitle}>
            📋 سجل الصيانات
          </Text>
          <Text style={styles.cardText}>
            عرض جميع أعمال الصيانة
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {fabOpen && (
        <Pressable style={styles.backdrop} onPress={() => setFabOpen(false)}>
          <View style={styles.actionMenu}>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => openRoute('/(tabs)/fuel')}>
              <Text style={styles.actionText}>⛽ إضافة تفويلة</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => openRoute('/(tabs)/oil-change')}>
              <Text style={styles.actionText}>🛢️ إضافة تغيير زيت</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => openRoute('/(tabs)/maintenance')}>
              <Text style={styles.actionText}>🔧 إضافة صيانة</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setFabOpen((current) => !current)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#020817',
  },

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

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 8, 23, 0.35)',
  },

  actionMenu: {
    position: 'absolute',
    right: 20,
    bottom: 96,
    width: 220,
    backgroundColor: '#172033',
    borderRadius: 16,
    padding: 10,
  },

  actionItem: {
    backgroundColor: '#020817',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },

  actionText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'right',
  },

  fab: {
    position: 'absolute',
    right: 24,
    bottom: 28,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#00FFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  fabText: {
    color: '#000',
    fontSize: 38,
    lineHeight: 42,
    fontWeight: 'bold',
  },
});