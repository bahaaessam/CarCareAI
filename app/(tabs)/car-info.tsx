import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text, TouchableOpacity, View
} from 'react-native';

export default function CarInfoScreen() {
  const [carData, setCarData] = useState<any>(null);

  useEffect(() => {
    loadCarData();
  }, []);

  const loadCarData = async () => {
    try {
      const data = await AsyncStorage.getItem('carData');

      if (data) {
        setCarData(JSON.parse(data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!carData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          لا توجد بيانات سيارة محفوظة
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>بيانات السيارة</Text>

      <View style={styles.card}>
        <Text style={styles.item}>
          🚗 الماركة: {carData.make}
        </Text>

        <Text style={styles.item}>
          📌 الموديل: {carData.model}
        </Text>

        <Text style={styles.item}>
          📅 سنة الصنع: {carData.year}
        </Text>

        <Text style={styles.item}>
          ⚙️ المحرك: {carData.engine}
        </Text>
        <TouchableOpacity
  style={styles.editButton}
  onPress={() => router.push('/')}>
  <Text style={styles.editButtonText}>
    ✏️ تعديل البيانات
  </Text>
</TouchableOpacity>
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
    marginBottom: 30,
  },

  card: {
    backgroundColor: '#172033',
    borderRadius: 16,
    padding: 20,
  },

  item: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'right',
  },
  editButton: {
  backgroundColor: '#00FFFF',
  padding: 15,
  borderRadius: 12,
  marginTop: 20,
},

editButtonText: {
  textAlign: 'center',
  color: '#000',
  fontWeight: 'bold',
},
});