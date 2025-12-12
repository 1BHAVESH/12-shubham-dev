import React, { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";  // <-- IMPORT KIA
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function EnquiryForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("📩 FORM DATA:", formData);
  };

  return (
    <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-2xl border border-gray-200">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-center">
          Enquiry Form
        </DialogTitle>

        {/* 🔥 WARNING FIX */}
        <DialogDescription className="text-center text-gray-500 text-sm">
          Please fill out the form below — we will get back soon.
        </DialogDescription>
      </DialogHeader>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <Input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
        <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
        <Textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your Message..." rows={4} />

        <Button className="w-full bg-blue-600 hover:bg-blue-700" type="submit">
          Submit
        </Button>
      </form>
    </DialogContent>
  );
}
