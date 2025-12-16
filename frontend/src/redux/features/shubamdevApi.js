import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const shubhamDevApi = createApi({
  reducerPath: "shubhamDevApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api`,
    credentials: "include",
  }),
  tagTypes: ["Project", "Career", "Faqs"],
  endpoints: (builder) => ({
    mailSend: builder.mutation({
      query: (credentials) => ({
        url: "/mail/send-email",
        method: "POST",
        body: credentials,
      }),
    }),

    getProjects: builder.query({
      query: () => "/projects",
      providesTags: ["Project"],
    }),

    getProjectBySlug: builder.query({
      query: (slug) => `/projects/slug/${slug}`,
      providesTags: (r, e, slug) => [{ type: "Project", id: slug }],
    }),

    getProjectById: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: (r, e, id) => [{ type: "Project", id }],
    }),

    // // ✅ NEW — VIDEO URL FETCH
    // getProjectVideo: builder.query({
    //   query: (id) => `/project-video/${id}/video`,
    // }),

    getProjectTitle: builder.query({
      query: () => "/projects/get-title",
    }),

    getJob: builder.query({
      query: () => "/career/",
      providesTags: ["Career"],
    }),

    getFaq: builder.query({
      query: () => "/faq/",
    }),

    getPrivacyPolicy: builder.query({
      query: () => "/privacy-policy",
    }),

    applyForJob: builder.mutation({
      query: (jobData) => ({
        url: "job-enquiry/apply",
        method: "POST",
        body: jobData,
      }),
      invalidatesTags: ["Career"],
    }),

    getApplications: builder.query({
      query: () => ({
        url: "job-enquiry/applications",
        method: "GET",
      }),
      providesTags: ["Career"]
    })
  }),
});

export const {
  useMailSendMutation,
  useGetProjectsQuery,
  useGetProjectBySlugQuery,
  useGetProjectByIdQuery,

  useGetProjectTitleQuery,
  useGetJobQuery,
  useGetFaqQuery,
  useGetPrivacyPolicyQuery,
  useApplyForJobMutation,
  useGetApplicationsQuery
} = shubhamDevApi;
