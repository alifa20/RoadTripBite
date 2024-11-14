import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
// import firestore from '@react-native-firebase/firestore';
import functions from "@react-native-firebase/functions";

interface PhotoRequest {
  photoReference: string;
  maxWidth?: number;
}

interface PhotoData {
  photoUrl: string;
  timestamp: number;
  reference: string;
}

export const photoApi = createApi({
  reducerPath: "photoApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Photo"],
  endpoints: (builder) => ({

    // Fetch photo URL from cache or call Cloud Function
    getPhotoUrl: builder.query<string, PhotoRequest>({
      async queryFn({ photoReference, maxWidth = 400 }) {
        try {
          if (!photoReference) {
            return { data: "" };
          }
          //   // First check if we have a cached version
          //   const cachedPhoto = await firestore()
          //     .collection('photoCache')
          //     .doc(photoReference)
          //     .get();

          //   if (cachedPhoto.exists) {
          //     const data = cachedPhoto.data() as PhotoData;
          //     // Check if cache is still valid (24 hours)
          //     if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
          //       return { data: data.photoUrl };
          //     }
          //   }

          // If no cache or expired, call Cloud Function
          const result = await functions().httpsCallable<
            PhotoRequest,
            PhotoData
          >("photosOnCall")({
            photoReference,
            maxWidth,
          });

          //   // Cache the result
          //   await firestore()
          //     .collection('photoCache')
          //     .doc(photoReference)
          //     .set({
          //       photoUrl: result.data.photoUrl,
          //       timestamp: Date.now(),
          //       reference: photoReference,
          //     });

          return { data: result.data?.photoUrl };
        } catch (error) {
          console.error("Error fetching photo:", error);
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "Failed to fetch photo URL",
            },
          };
        }
      },
      providesTags: (result, error, { photoReference }) => [
        { type: "Photo", id: photoReference },
      ],
    }),

    // Fetch all cached photos
    // getCachedPhotos: builder.query<PhotoData[], void>({
    //   async queryFn() {
    //     try {
    //       const snapshot = await firestore()
    //         .collection('photoCache')
    //         .orderBy('timestamp', 'desc')
    //         .get();

    //       const photos: PhotoData[] = [];
    //       snapshot.forEach((doc) => {
    //         photos.push(doc.data() as PhotoData);
    //       });

    //       return { data: photos };
    //     } catch (error) {
    //       console.error('Error fetching cached photos:', error);
    //       return {
    //         error: {
    //           status: 'CUSTOM_ERROR',
    //           error: 'Failed to fetch cached photos'
    //         }
    //       };
    //     }
    //   },
    //   providesTags: ['Photo'],
    // }),

    // Clear expired cache
    // clearExpiredCache: builder.mutation<void, void>({
    //   async queryFn() {
    //     try {
    //       const expiredPhotos = await firestore()
    //         .collection('photoCache')
    //         .where('timestamp', '<', Date.now() - 24 * 60 * 60 * 1000)
    //         .get();

    //       const batch = firestore().batch();
    //       expiredPhotos.forEach((doc) => {
    //         batch.delete(doc.ref);
    //       });

    //       await batch.commit();
    //       return { data: undefined };
    //     } catch (error) {
    //       console.error('Error clearing cache:', error);
    //       return {
    //         error: {
    //           status: 'CUSTOM_ERROR',
    //           error: 'Failed to clear cache'
    //         }
    //       };
    //     }
    //   },
    //   invalidatesTags: ['Photo'],
    // }),
  }),
});

export const {
  useGetPhotoUrlQuery,
  //   useGetCachedPhotosQuery,
  //   useClearExpiredCacheMutation
} = photoApi;
