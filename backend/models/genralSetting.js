import mongoose from "mongoose";

const generalSettingSchema = new mongoose.Schema(
  {
    favicon: {
      type: String, // file URL
      default: "",
    },
    logo: {
      type: String, // file URL
      default: "",
    },
    applicationName: {
      type: String,
      required: true,
      default: "",
    },
    siteMetaTitle: {
      type: String,
      default: "",
    },
    siteMetaKeyword: {
      type: String,
      default: "",
    },
    siteMetaDescription: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    whatsappMobile: {
      type: String,
      default: "",
    },
    slogan: {
      type: String,
      default: "",
    },
    corporateAddress: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    copyright: {
      type: String,
      default: "",
    },
    footerLogo: {
      type: String, // file URL
      default: "",
    },
  },
  { timestamps: true }
);

export const GeneralSetting =  mongoose.model("GeneralSetting", generalSettingSchema);
