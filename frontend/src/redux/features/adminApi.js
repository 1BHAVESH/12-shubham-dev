import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL || " http://localhost:3001/";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("adminToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Admin", "Banner", "Project", "Career", "Faq"],
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: "/admin/login",
        method: "POST",
        body: credentials,
      }),
    }),
    adminRegister: builder.mutation({
      query: (credentials) => ({
        url: "/admin/register",
        method: "POST",
        body: credentials,
      }),
    }),
    adminLogout: builder.mutation({
      query: () => ({
        url: "/admin/logout",
        method: "POST",
      }),
    }),
    getAdminProfile: builder.query({
      query: () => "/admin/profile",
      providesTags: ["Admin"],
    }),
    updateAdminProfile: builder.mutation({
      query: (data) => ({
        url: "/admin/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Admin"],
    }),
    changeAdminPassword: builder.mutation({
      query: (data) => ({
        url: "/admin/change-password",
        method: "PUT",
        body: data,
      }),
    }),

    getAdminSideBanner: builder.query({
      query: () => ({
        url: "/banners/banner",
        method: "GET",
      }),
      providesTags: ["Banner"],
    }),

    getBanners: builder.query({
      query: () => "/banners",
      providesTags: ["Banner"],
    }),
    createBanner: builder.mutation({
      query: (formData) => ({
        url: "/banners",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Banner"],
    }),
    updateBanner: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/banners/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Banner"],
    }),
    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `/banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Banner"],
    }),

    getProjects: builder.query({
      query: () => "/projects",
      providesTags: ["Project"],
    }),
    createProject: builder.mutation({
      query: (formData) => ({
        url: "/projects",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Project"],
    }),
    updateProject: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/projects/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Project"],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),

    createJob: builder.mutation({
      query: (body) => ({
        url: "/career/create-job",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Career"],
    }),

    getJob: builder.query({
      query: () => ({
        url: "/career/",
        method: "GET",
      }),
      providesTags: ["Career"],
    }),

    updateJob: builder.mutation({
      query: ({ id, ...data }) => {
        console.log("UPDATE REQ:", id, data);

        return {
          url: `/career/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["Career"],
    }),

    deleteCareer: builder.mutation({
      query: (id) => ({
        url: `/career/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Career"],
    }),

    createFaq: builder.mutation({
      query: (body) => ({
        url: "/faq",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Faq"],
    }),

    getFaq: builder.query({
      query: () => ({
        url: "/faq",
        method: "GET",
      }),
      providesTags: ["Faq"],
    }),

    faqUpdate: builder.mutation({
      query: ({ id, ...formData }) => ({
        url: `/faq/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Faq"],
    }),

    deleteFaq: builder.mutation({
      query: ({ id }) => {
        return {
          url: `faq/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Faq"],
    }),
    toggleProject: builder.mutation({
      query: (id) => ({
        url: `/projects/toggle/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Project"],
    }),
    getViewAnalytics: builder.query({
      query: () => "/view/all",
    }),

    createGeneralSetting: builder.mutation({
      query: (formData) => ({
        url: "/genral-setting/general-settings",
        method: "PUT",
        body: formData,
      }),

      invalidatesTags: ["Admin"],
    }),
    getGeneralSettingQuery: builder.query({
      query: () => ({
        url: "/genral-setting/general-settings",
        method: "GET",
      }),

      providesTags: ["Admin"],
    }),
    getAllContacts: builder.query({
      query: () => ({
        url: "/mail/",
        method: "GET",
      }),

      providesTags: ["Career"],
    }),

    deleteEnquiry: builder.mutation({
      query: (id) => ({
        url: `/mail/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Career"],
    }),

    getApplications: builder.query({
      query: () => ({
        url: "job-enquiry/applications",
        method: "GET",
      }),
      providesTags: ["Career"],
    }),

    deleteAllApplications: builder.mutation({
      query: () => {
        console.log("🔥 deleteAllApplications API called");

        return {
          url: "/job-enquiry/delete-all-applications",
          method: "DELETE",
        };
      },
      invalidatesTags: ["Career"],
    }),

    deleteJobBYId: builder.mutation({
      query: (id) => ({
        url: `job-enquiry/applications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Career"],
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useAdminRegisterMutation,
  useAdminLogoutMutation,
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useChangeAdminPasswordMutation,
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useCreateJobMutation,
  useGetJobQuery,
  useUpdateJobMutation,
  useDeleteCareerMutation,
  useCreateFaqMutation,
  useGetFaqQuery,
  useFaqUpdateMutation,
  useDeleteFaqMutation,
  useGetAdminSideBannerQuery,
  useToggleProjectMutation,
  useGetViewAnalyticsQuery,
  useCreateGeneralSettingMutation,
  useGetGeneralSettingQueryQuery,
  useGetAllContactsQuery,
  useDeleteEnquiryMutation,
  useDeleteJobBYIdMutation,
  useGetApplicationsQuery,
  useDeleteAllApplicationsMutation,
} = adminApi;
