export type Filter = {
  restaurants: {rating: number; checked: boolean};
  petrol: {checked: boolean};
  groceries: {checked: boolean};
  coffee: {rating: number; checked: boolean};
  hotels: {rating: number; checked: boolean};
};
export type State = {
  isDirty: boolean;
  arrive: number;
  direction: string[];
  time: string;
  goingBy: 'car' | 'bike' | 'walk';
  filter: Filter;
  isSearching: boolean;
};

export type SetFilterPayload =
  | {
      key: 'restaurants' | 'coffee' | 'hotels';
      rating: number;
      checked: boolean;
    }
  | {
      key: 'petrol' | 'groceries';
      checked: boolean;
    };

export type Action =
  | {
      type: 'SET_IS_SEARCHING';
      payload: {isSearching: boolean};
    }
  | {
      type: 'SET_IS_DIRTY';
      payload: {isDirty: boolean; isSearching: boolean};
    }
  | {
      type: 'UPDATE_FILTER';
      payload: {isDirty: boolean; filter: SetFilterPayload};
    }
  | {
      type: 'CLEAR_FILTER';
    };

export type TravelTool = {icon: string; value: string; speed: number};
