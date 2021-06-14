import {LatLng} from 'react-native-maps';
import {getDistanceFromLatLonInKm} from './getDistanceFromLatLonInKm';

/**
 * Adds time to a date. Modelled after MySQL DATE_ADD function.
 * Example: dateAdd(new Date(), 'minutes', 30)  //returns 30 minutes from now.
 *
 * @param date  Date to start with
 * @param interval  One of: year, quarter, month, week, day, hour, minute, second
 * @param units  Number of units of the given interval to add.
 */
const dateAdd = (
  date: Date,
  interval: string,
  units: number,
): Date | undefined => {
  if (!(date instanceof Date)) return undefined;
  let ret = new Date(date); //don't change original date
  const checkRollover = function () {
    if (ret.getDate() != date.getDate()) ret.setDate(0);
  };
  switch (String(interval).toLowerCase()) {
    case 'year':
      ret.setFullYear(ret.getFullYear() + units);
      checkRollover();
      break;
    case 'quarter':
      ret.setMonth(ret.getMonth() + 3 * units);
      checkRollover();
      break;
    case 'month':
      ret.setMonth(ret.getMonth() + units);
      checkRollover();
      break;
    case 'week':
      ret.setDate(ret.getDate() + 7 * units);
      break;
    case 'day':
      ret.setDate(ret.getDate() + units);
      break;
    case 'hour':
      ret.setTime(ret.getTime() + units * 3600000);
      break;
    case 'minute':
      ret.setTime(ret.getTime() + units * 60000);
      break;
    case 'second':
      ret.setTime(ret.getTime() + units * 1000);
      break;
    default:
      return undefined;
  }
  return ret;
};

const getMinute = (min?: number): number => {
  if (!min) return 0;
  const base = 10;
  const div = Math.floor(min / base);
  const mod = min % base;

  const result = mod < base / 4 ? base * div : base * (div + 1);
  if (result < 10) return 15;
  if (result < 17) return 20;
  return result > 10 ? result : 15;
};

const minRound = (curr: number) => {};

const getMinuteFromDistance = (km: number, speed: number) => (km / speed) * 60;

export const getNewTimeFormatted_OLD = (
  d: Date,
  km: number,
  rawSpeed: number | undefined,
) => {
  const speed = rawSpeed ? rawSpeed : 0;
  const min = getMinuteFromDistance(km, speed);

  // const d = new Date('2021-03-17T07:00:00Z');
  // const d = new Date();
  const min2 = d.getMinutes();
  const m = minRound(min + min2);

  const date = dateAdd(d, 'minute', (min + 10) * 1.1);

  //   const newMin = ('0' + getMinute(date?.getMinutes())).slice(-2);
  const newMin = ('0' + date?.getMinutes()).slice(-2);
  const hour = ('0' + date?.getHours()).slice(-2);
  return `${hour}:${newMin}`;
};

type Params = {
  coordinate: LatLng;
  date: Date;
  startSource: LatLng;
  duration: number;
  distance: number;
};

export const estimateArrival = ({
  date: d,
  coordinate,
  startSource,
  duration,
  distance,
}: Params) => {
  const calculatedDist = getDistanceFromLatLonInKm(
    coordinate.latitude,
    coordinate.longitude,
    startSource.latitude,
    startSource.longitude,
  );
  const calcDuration = (calculatedDist * distance) / duration;
  const date = dateAdd(d, 'minute', calcDuration);
  //   const newMin = ('0' + getMinute(date?.getMinutes())).slice(-2);
  const newMin = ('0' + date?.getMinutes()).slice(-2);
  const hour = ('0' + date?.getHours()).slice(-2);
  return `${hour}:${newMin}`;
};
