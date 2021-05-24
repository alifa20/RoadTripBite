import axios from 'axios';
import React, {useState} from 'react';
import {useDebounce} from '../../hooks/useDebounce';
import {SearchBarWithAutocomplete} from './SearchBarWithAutocomplete';

const GOOGLE_PACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place';
const GOOGLE_API_KEY = 'AIzaSyCwTHpLD23nVmwcVdIFqCj40EiTus7zh8M';
// ==== Change No.3 ====
/**
 * Prediction's type returned from Google Places Autocomplete API
 * https://developers.google.com/places/web-service/autocomplete#place_autocomplete_results
 */
export type PredictionType = {
  description: string;
  place_id: string;
  reference: string;
  matched_substrings: any[];
  tructured_formatting: Object;
  terms: Object[];
  types: string[];
};

interface Props {
  searchTerm?: string;
  onComplete: (address: string) => void;
}

export const SearchBar = ({searchTerm = '', onComplete}: Props) => {
  const latitude = -33.84796;
  const longitude = 151.07443;
  const [search, setSearch] = useState({
    term: searchTerm,
    fetchPredictions: false,
  });
  const [showPredictions, setShowPredictions] = useState(false);
  const [predictions, setPredictions] = useState<PredictionType[]>([]);

  /**
   * Grab predictions on entering text
   *    by sending reqyest to Google Places API.
   * API details: https://developers.google.com/maps/documentation/places/web-service/autocomplete
   */
  const onChangeText = async () => {
    if (search.term.trim() === '') return;
    if (!search.fetchPredictions) return;

    const apiUrl = `${GOOGLE_PACES_API_BASE_URL}/autocomplete/json?key=${GOOGLE_API_KEY}&input=${search.term}&location=${latitude},${longitude}&radius=500`;
    try {
      const result = await axios.request({
        method: 'post',
        url: apiUrl,
      });
      if (result) {
        const {
          data: {predictions},
        } = result;
        setPredictions(predictions);
        setShowPredictions(true);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useDebounce(onChangeText, 1000, [search.term]);

  /**
   * Grab lattitude and longitude on prediction tapped
   *    by sending another reqyest using the place id.
   * You can check what kind of information you can get at:
   *    https://developers.google.com/maps/documentation/places/web-service/details#PlaceDetailsRequests
   */
  const onPredictionTapped = async (placeId: string, description: string) => {
    const apiUrl = `${GOOGLE_PACES_API_BASE_URL}/details/json?key=${GOOGLE_API_KEY}&place_id=${placeId}`;
    try {
      const result = await axios.request({
        method: 'post',
        url: apiUrl,
      });
      if (result) {
        const {
          data: {
            result: {
              geometry: {location},
            },
          },
        } = result;
        const {lat, lng} = location;
        setShowPredictions(false);
        setSearch({term: description, fetchPredictions: false});
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SearchBarWithAutocomplete
      value={search.term}
      onChangeText={(text: string) => {
        setSearch({term: text, fetchPredictions: true});
      }}
      showPredictions={showPredictions}
      predictions={predictions}
      onPredictionTapped={onPredictionTapped}
    />
  );
};
