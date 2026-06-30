export type DatedRecord = {
  date?: string;
};

export type FuelLog = DatedRecord & {
  odometer?: string | number;
  liters?: string | number;
  totalPrice?: string | number;
};

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const parseRecordDate = (value?: string) => {
  if (!value) return 0;

  const parsed = Date.parse(value);

  if (!Number.isNaN(parsed)) {
    return parsed;
  }

  const parts = value.split(/[\/\-.]/).map(Number);

  if (parts.length === 3) {
    const [first, second, third] = parts;
    const year = third < 100 ? 2000 + third : third;
    const day = second > 12 ? second : first;
    const month = second > 12 ? first : second;
    const fallback = new Date(year, month - 1, day).getTime();

    return Number.isNaN(fallback) ? 0 : fallback;
  }

  return 0;
};

export const sortByDateDesc = <T extends DatedRecord>(records: T[]) =>
  [...records].sort(
    (a, b) => parseRecordDate(b.date) - parseRecordDate(a.date)
  );

export const sortFuelLogsByOdometer = <T extends FuelLog>(logs: T[]) =>
  [...logs].sort(
    (a, b) => Number(a.odometer || 0) - Number(b.odometer || 0)
  );

export const calculateFuelConsumption = (logs: FuelLog[]) => {
  const sortedLogs = sortFuelLogsByOdometer(logs).filter(
    (item) => Number(item.odometer) > 0
  );

  for (let index = sortedLogs.length - 1; index > 0; index -= 1) {
    const current = sortedLogs[index];
    const previous = sortedLogs[index - 1];
    const distance =
      Number(current.odometer) - Number(previous.odometer);
    const liters = Number(current.liters || 0);

    if (distance > 0 && liters > 0) {
      return ((liters * 100) / distance).toFixed(2);
    }
  }

  return null;
};

export const calculateTotalDrivingRange = (logs: FuelLog[]) => {
  const sortedLogs = sortFuelLogsByOdometer(logs).filter(
    (item) => Number(item.odometer) > 0
  );

  return sortedLogs.reduce((total, item, index) => {
    if (index === 0) return total;

    const previous = sortedLogs[index - 1];
    const distance = Number(item.odometer) - Number(previous.odometer);

    return distance > 0 ? total + distance : total;
  }, 0);
};
