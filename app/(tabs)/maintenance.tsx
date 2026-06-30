console.log('Maintenance Loaded');

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function MaintenanceScreen() {
  const [serviceName, setServiceName] = useState('');
  const [odometer, setOdometer] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');
  const [nextKm, setNextKm] = useState('');

  const saveMaintenance = async () => {
    try {
      const nextServiceKm =
        Number(odometer) + Number(nextKm);

      const maintenanceData = {
        date: new Date().toLocaleDateString(),
        serviceName,
        odometer,
        cost,
        notes,
        nextKm,
        nextServiceKm,
      };

      const oldData =
        await AsyncStorage.getItem(
          'maintenanceLogs'
        );

      const logs = oldData
        ? JSON.parse(oldData)
        : [];

      logs.push(maintenanceData);

      await AsyncStorage.setItem(
        'maintenanceLogs',
        JSON.stringify(logs)
      );

      console.log(
        'Saved Maintenance:',
        logs
      );

      alert('تم حفظ الصيانة بنجاح');

      setServiceName('');
      setOdometer('');
      setCost('');
      setNotes('');
      setNextKm('');
    } catch (error) {
      console.log(error);
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        إضافة صيانة
      </Text>

      <TextInput
        style={styles.input}
        placeholder="اسم الصيانة"
        placeholderTextColor="#666"
        value={serviceName}
        onChangeText={setServiceName}
      />

      <TextInput
        style={styles.input}
        placeholder="قراءة العداد"
        placeholderTextColor="#666"
        keyboardType="numeric"
        value={odometer}
        onChangeText={setOdometer}
      />

      <TextInput
        style={styles.input}
        placeholder="تكلفة الصيانة"
        placeholderTextColor="#666"
        keyboardType="numeric"
        value={cost}
        onChangeText={setCost}
      />

      <TextInput
        style={styles.input}
        placeholder="الصيانة القادمة بعد كام كم"
        placeholderTextColor="#666"
        keyboardType="numeric"
        value={nextKm}
        onChangeText={setNextKm}
      />

      <TextInput
        style={styles.input}
        placeholder="ملاحظات"
        placeholderTextColor="#666"
        value={notes}
        onChangeText={setNotes}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={saveMaintenance}>
        <Text style={styles.buttonText}>
          حفظ الصيانة
        </Text>
      </TouchableOpacity>
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

  input: {
    backgroundColor: '#172033',
    color: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },

  button: {
    backgroundColor: '#00FFFF',
    padding: 15,
    borderRadius: 12,
  },

  buttonText: {
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
  },
});