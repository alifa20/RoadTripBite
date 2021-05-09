import {State} from './types';

const d = new Date(); // get current date
d.setHours(d.getHours() + 2, d.getMinutes(), 0, 0);

export const initialState: State = {
  isDirty: false,
  arrive: 4,
  direction: ['North'],
  time: d.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
  goingBy: 'car',
  filter: {
    restaurants: {rating: 4, checked: false},
    petrol: {checked: false},
    groceries: {checked: false},
    coffee: {rating: 4, checked: false},
    hotels: {rating: 4, checked: false},
  },
  isSearching: false,
};
