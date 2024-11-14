import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import functions from "@react-native-firebase/functions";

interface PlaceDetailsRequest {
  placeId: string;
  fields?: string[];
}

// You can expand this interface based on the fields you request
export interface PlaceDetails {
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    open_now: boolean;
    periods: any[];
    weekday_text: string[];
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  // Add other fields as needed
}

export const placeApi = createApi({
  reducerPath: "placeApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Place"],
  endpoints: (builder) => ({
    getPlaceDetails: builder.query<PlaceDetails, PlaceDetailsRequest>({
      async queryFn({ placeId, fields }) {
        try {
          const result = await functions().httpsCallable<
            PlaceDetailsRequest,
            { data: PlaceDetails }
          >("placeDetailsOnCall")({ placeId, fields });

          return { data: result.data.data };
        } catch (error) {
          console.error("Error fetching place details:", error);
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "Failed to fetch place details",
            },
          };
        }
      },
      providesTags: (result, error, { placeId }) => [
        { type: "Place", id: placeId },
      ],
    }),
  }),
});

export const { useGetPlaceDetailsQuery } = placeApi;
