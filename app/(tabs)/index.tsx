import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [engine, setEngine] = useState('');

  const handleSave = async () => {
  try {
    const carData = {
      make,
      model,
      year,
      engine,
    };

    await AsyncStorage.setItem(
      'carData',
      JSON.stringify(carData)
    );

    router.push('/(tabs)/dashboard');
  } catch (error) {
    console.log(error);
    alert('حدث خطأ أثناء الحفظ');
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        CarCare <Text style={styles.ai}>AI</Text>
      </Text>

      <Text style={styles.subtitle}>
        أدخل بيانات سيارتك لبدء إنشاء ملف الصيانة
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>ماركة السيارة</Text>
        <TextInput
          style={styles.input}
          value={make}
          onChangeText={setMake}
          placeholder="مثال: Toyota"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>الموديل</Text>
        <TextInput
          style={styles.input}
          value={model}
          onChangeText={setModel}
          placeholder="مثال: Corolla"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>سنة الصنع</Text>
        <TextInput
          style={styles.input}
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
          placeholder="2022"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>نوع المحرك / السعة</Text>
        <TextInput
          style={styles.input}
          value={engine}
          onChangeText={setEngine}
          placeholder="1600 CC"
          placeholderTextColor="#666"
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>حفظ البيانات</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#020817',
    padding: 20,
    justifyContent: 'center',
  },

  title: {
    color: '#fff',
    fontSize: 38,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
  },

  ai: {
    color: '#00FFFF',
  },

  subtitle: {
    color: '#CBD5E1',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },

  card: {
    backgroundColor: '#172033',
    borderRadius: 20,
    padding: 20,
  },

  label: {
    color: '#fff',
    marginBottom: 8,
    marginTop: 14,
    textAlign: 'right',
  },

  input: {
    backgroundColor: '#091224',
    color: '#fff',
    borderRadius: 10,
    padding: 14,
  },

  button: {
    backgroundColor: '#00FFFF',
    marginTop: 25,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: '#0F172A',
    fontWeight: 'bold',
    fontSize: 16,
  },
});