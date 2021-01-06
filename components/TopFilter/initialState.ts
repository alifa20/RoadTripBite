import { State } from "./types";

export const initialState: State = {
  isDirty: false,
  oldFilter: {
    arrive: 4,
    direction: ["North"],
    restaurants: { rating: 4, checked: false },
    petrol: { checked: false },
    groceries: { checked: false },
    coffee: { rating: 4, checked: false },
    hotels: { rating: 4, checked: false },
  },
  newFilter: {
    arrive: 4,
    direction: ["North"],
    restaurants: { rating: 4, checked: false },
    petrol: { checked: false },
    groceries: { checked: false },
    coffee: { rating: 4, checked: false },
    hotels: { rating: 4, checked: false },
  },
};
