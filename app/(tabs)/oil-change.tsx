import AsyncStorage from '@react-native-async-storage/async-storage';
import { DatePickerField } from '@/components/date-picker-field';
import { formatDate } from '@/utils/records';
import { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function OilChangeScreen() {
  const [date, setDate] = useState(formatDate(new Date()));
  const [odometer, setOdometer] = useState('');
  const [oilType, setOilType] = useState('');
  const [filterChanged, setFilterChanged] = useState('');
  const [nextKm, setNextKm] = useState('');

  const saveOilChange = async () => {
    try {
      const currentKm = Number(odometer);
      const nextChangeKm = currentKm + Number(nextKm);

      const oilData = {
        date,
        odometer,
        oilType,
        filterChanged,
        nextKm,
        nextChangeKm,
      };

      await AsyncStorage.setItem(
        'oilChange',
        JSON.stringify(oilData)
      );

      alert('تم حفظ بيانات الزيت');
      setDate(formatDate(new Date()));
      setOdometer('');
      setOilType('');
      setFilterChanged('');
      setNextKm('');
    } catch (error) {
      console.log(error);
      alert('حدث خطأ');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تغيير الزيت</Text>

      <DatePickerField
        label="التاريخ"
        value={date}
        onChange={setDate}
      />

      <TextInput
        style={styles.input}
        placeholder="قراءة العداد الحالية"
        placeholderTextColor="#666"
        keyboardType="numeric"
        value={odometer}
        onChangeText={setOdometer}
      />

      <TextInput
        style={styles.input}
        placeholder="نوع الزيت"
        placeholderTextColor="#666"
        value={oilType}
        onChangeText={setOilType}
      />

      <TextInput
        style={styles.input}
        placeholder="تم تغيير الفلتر؟ (نعم / لا)"
        placeholderTextColor="#666"
        value={filterChanged}
        onChangeText={setFilterChanged}
      />

      <TextInput
        style={styles.input}
        placeholder="التغيير القادم بعد كام كم؟"
        placeholderTextColor="#666"
        keyboardType="numeric"
        value={nextKm}
        onChangeText={setNextKm}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={saveOilChange}>
        <Text style={styles.buttonText}>
          حفظ بيانات الزيت
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
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 30,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    color: '#000',
  },
});