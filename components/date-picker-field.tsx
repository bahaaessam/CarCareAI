import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { formatDate } from '@/utils/records';

type DatePickerFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const toDate = (value: string) => {
  const parsed = Date.parse(value);

  return Number.isNaN(parsed) ? new Date() : new Date(parsed);
};

const shiftDate = (date: Date, amount: number, unit: 'day' | 'month' | 'year') => {
  const next = new Date(date);

  if (unit === 'day') {
    next.setDate(next.getDate() + amount);
  }

  if (unit === 'month') {
    next.setMonth(next.getMonth() + amount);
  }

  if (unit === 'year') {
    next.setFullYear(next.getFullYear() + amount);
  }

  return next;
};

export function DatePickerField({ label, value, onChange }: DatePickerFieldProps) {
  const [visible, setVisible] = useState(false);
  const [draftDate, setDraftDate] = useState(toDate(value));

  const displayValue = useMemo(
    () => toDate(value).toLocaleDateString('ar-EG'),
    [value]
  );

  const openPicker = () => {
    setDraftDate(toDate(value));
    setVisible(true);
  };

  const confirmDate = () => {
    onChange(formatDate(draftDate));
    setVisible(false);
  };

  const setToday = () => {
    setDraftDate(new Date());
  };

  return (
    <>
      <TouchableOpacity style={styles.field} onPress={openPicker}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{displayValue}</Text>
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{label}</Text>
            <Text style={styles.selectedDate}>
              {draftDate.toLocaleDateString('ar-EG')}
            </Text>

            <View style={styles.row}>
              <DateStepButton
                title="- سنة"
                onPress={() => setDraftDate(shiftDate(draftDate, -1, 'year'))}
              />
              <DateStepButton
                title="+ سنة"
                onPress={() => setDraftDate(shiftDate(draftDate, 1, 'year'))}
              />
            </View>

            <View style={styles.row}>
              <DateStepButton
                title="- شهر"
                onPress={() => setDraftDate(shiftDate(draftDate, -1, 'month'))}
              />
              <DateStepButton
                title="+ شهر"
                onPress={() => setDraftDate(shiftDate(draftDate, 1, 'month'))}
              />
            </View>

            <View style={styles.row}>
              <DateStepButton
                title="- يوم"
                onPress={() => setDraftDate(shiftDate(draftDate, -1, 'day'))}
              />
              <DateStepButton
                title="+ يوم"
                onPress={() => setDraftDate(shiftDate(draftDate, 1, 'day'))}
              />
            </View>

            <TouchableOpacity style={styles.todayButton} onPress={setToday}>
              <Text style={styles.todayText}>اليوم</Text>
            </TouchableOpacity>

            <View style={styles.actions}>
              <Pressable style={styles.cancelButton} onPress={() => setVisible(false)}>
                <Text style={styles.cancelText}>إلغاء</Text>
              </Pressable>

              <Pressable style={styles.confirmButton} onPress={confirmDate}>
                <Text style={styles.confirmText}>اختيار</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

function DateStepButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.stepButton} onPress={onPress}>
      <Text style={styles.stepText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  field: {
    backgroundColor: '#172033',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  label: {
    color: '#94A3B8',
    textAlign: 'right',
    marginBottom: 6,
  },
  value: {
    color: '#fff',
    textAlign: 'right',
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 8, 23, 0.82)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#172033',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  selectedDate: {
    color: '#00FFFF',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  stepButton: {
    flex: 1,
    backgroundColor: '#020817',
    borderRadius: 12,
    padding: 14,
  },
  stepText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  todayButton: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
  },
  todayText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 14,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#00FFFF',
    borderRadius: 12,
    padding: 14,
  },
  cancelText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  confirmText: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
