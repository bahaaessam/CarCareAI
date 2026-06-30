import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';

export default function FuelScreen() {
  const [odometer, setOdometer] = useState('');
  const [price, setPrice] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const [totalPrice, setTotalPrice] = useState('');

  const [date, setDate] = useState(
  new Date().toLocaleDateString()
);

  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    if (!permission?.granted) {
      const response = await requestPermission();

if (!response.granted) {
  return;
}
    }

    setShowCamera(true);
  };
const saveFuel = async () => {
  try {
    const liters =
  (
    Number(totalPrice) /
    Number(price)
  ).toFixed(2);
    const fuelData = {
      date,
      odometer,
      liters,
      totalPrice,
      fuelType,
      image,
    };

    const oldData = await AsyncStorage.getItem('fuelLogs');

    const logs = oldData ? JSON.parse(oldData) : [];

    logs.push(fuelData);

    await AsyncStorage.setItem(
      'fuelLogs',
      JSON.stringify(logs)
    );
console.log('Saved Fuel Logs:', logs);

    alert('تم حفظ التفويلة بنجاح');

    setOdometer('');
    setPrice('');
    setFuelType('');
    setImage(null);
  } catch (error) {
    console.log(error);
    alert('حدث خطأ أثناء الحفظ');
  }
};
  return (
  <ScrollView
  style={styles.container}
  contentContainerStyle={{
    paddingBottom: 80,
  }}
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}
>
      <Text style={styles.title}>إضافة تفويلة</Text>

      <TouchableOpacity
        style={styles.imageButton}
        onPress={pickImage}>
        <Text style={styles.buttonText}>
          📷 اختيار صورة العداد
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.imageButton}
        onPress={openCamera}>
        <Text style={styles.buttonText}>
          📸 التقاط صورة بالكاميرا
        </Text>
      </TouchableOpacity>

      {image && (
        <Image
          source={{ uri: image }}
          style={styles.preview}
        />
      )}

<TextInput
  style={styles.input}
  placeholder="التاريخ"
  placeholderTextColor="#666"
  value={date}
  onChangeText={setDate}
/>

      <TextInput
        style={styles.input}
        placeholder="قراءة العداد"
        placeholderTextColor="#666"
        value={odometer}
        onChangeText={setOdometer}
      />

      <TextInput
  style={styles.input}
  placeholder="إجمالي قيمة التفويلة"
  placeholderTextColor="#666"
  keyboardType="numeric"
  value={totalPrice}
  onChangeText={setTotalPrice}
/>

      <TextInput
        style={styles.input}
        placeholder="سعر اللتر"
        placeholderTextColor="#666"
        value={price}
        onChangeText={setPrice}
      />

      <TextInput
        style={styles.input}
        placeholder="نوع البنزين (80 / 92 / 95)"
        placeholderTextColor="#666"
        value={fuelType}
        onChangeText={setFuelType}
      />

      <TouchableOpacity
  style={styles.saveButton}
  onPress={saveFuel}>
        <Text style={styles.saveButtonText}>
          حفظ التفويلة
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
    fontSize: 28,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 30,
    fontWeight: 'bold',
  },

  imageButton: {
    backgroundColor: '#172033',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },

  preview: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 15,
  },

  input: {
    backgroundColor: '#172033',
    color: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },

  saveButton: {
    backgroundColor: '#00FFFF',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },

  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },

  saveButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
  },
});