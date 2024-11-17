import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import functions from "@react-native-firebase/functions";

export const helloApi = createApi({
  reducerPath: "helloApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Hello"],
  endpoints: (builder) => ({
    getHelloWorld: builder.query<{ message: string }, void>({
      async queryFn() {
        try {
          const result = await functions().httpsCallable<
            void,
            { message: string }
          >("helloWorldOnCall")();

          return { data: result.data };
        } catch (error) {
          console.error("Error fetching hello world:", error);
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "Failed to fetch hello world message",
            },
          };
        }
      },
      providesTags: ["Hello"],
    }),
  }),
});

export const { useGetHelloWorldQuery } = helloApi;
