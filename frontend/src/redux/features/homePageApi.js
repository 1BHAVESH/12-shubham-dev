import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL=import.meta.env.VITE_API_URL ||" http://localhost:3001/"

export const homePageApi = createApi({
  reducerPath: "homePageApi",
  baseQuery: fetchBaseQuery({
     baseUrl: `${API_URL}/api`,

    prepareHeaders: (headers, { endpoint }) => {
      // ❌ GET homepage = NO TOKEN
      if (endpoint === "getHomePage") return headers;

      // ✅ Update/Add/Delete = TOKEN REQUIRED
      const token = localStorage.getItem("adminToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ["HomePage"],

  endpoints: (builder) => ({

    // ───────────────────
    // PUBLIC ROUTE (NO TOKEN)
    // ───────────────────
    getHomePage: builder.query({
      query: () => "/home/homepage",
      providesTags: ["HomePage"],
    }),

    // ───────────────────
    // ADMIN ROUTES (TOKEN REQUIRED)
    // ───────────────────
    updateHomePage: builder.mutation({
      query: (homePageData) => ({
        url: "/home/homepage",
        method: "POST",
        body: homePageData,
      }),
      invalidatesTags: ["HomePage"],
    }),

    addTestimonial: builder.mutation({
      query: (testimonialData) => ({
        url: "/homepage/testimonial",
        method: "POST",
        body: testimonialData,
      }),
      invalidatesTags: ["HomePage"],
    }),

    deleteTestimonial: builder.mutation({
      query: (id) => ({
        url: `/homepage/testimonial/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HomePage"],
    }),

    viewCountIncreament: builder.query({
      query: () => ({
        url: "/view/website",
        method: "GET",
      }),
      providesTags: ["HomePage"],
    })
  }),
});

export const {
  useGetHomePageQuery,
  useUpdateHomePageMutation,
  useAddTestimonialMutation,
  useDeleteTestimonialMutation,
  useViewCountIncreamentQuery
} = homePageApi;
