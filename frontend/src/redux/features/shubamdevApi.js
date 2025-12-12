import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL=import.meta.env.VITE_API_URL ||" http://localhost:3001/"


export const shubhamDevApi = createApi({
  reducerPath: "shubhamDevApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl:  `${API_URL}/api`,
    credentials: "include"
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
      providesTags: (result, error, slug) => [{ type: "Project", id: slug }],
    }),
    getProjectById: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: "Project", id }],
    }),
    getProjectTitle: builder.query({
      query: () => "/projects/get-title",
    }),
    getJob: builder.query({
      query: () => ({
        url: "/career/",
        method: "GET",
      }),
      providesTags: ["Career"],
    }),
    getFaq: builder.query({
      query: (body) => {

        return{
          url: "/faq/",
          method: "GET",
          body
        }
      }
    }),

    getPrivacyPolicy: builder.query({
      query: () => {

        return{
          url: "/privacy-policy",
          method: "GET",

        }
      }
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
  useGetPrivacyPolicyQuery
} = shubhamDevApi;