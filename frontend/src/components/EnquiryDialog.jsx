import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useGetProjectTitleQuery, useMailSendMutation } from "@/redux/features/shubamdevApi";

export default function EnquiryDialog({ selectedProject }) {

  // console.log(selectedProject)
  const [mailSend, { isLoading }] = useMailSendMutation();

   const {data, isLoading : projectTitleLoading} = useGetProjectTitleQuery()

  // if(projectTitleLoading) return <h1>please title</h1>

  // console.log(data)

  // ⭐ Controlled Select State
  const [projectValue, setProjectValue] = useState(selectedProject || "");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  // ⭐ Update when selectedProject comes from parent
  useEffect(() => {
    if (selectedProject) {
      setProjectValue(selectedProject);
      setValue("projectType", selectedProject);
    }
  }, [selectedProject]);

  const onSubmit = async (data) => {
    const finalData = {
      ...data,
      projectType: projectValue, // ⭐ Ensure correct final value
    };

    console.log(finalData)

    await toast.promise(mailSend(finalData).unwrap(), {
      loading: "Sending your message...",
      success: "Mail sent successfully!",
      error: "Failed to send email",
    });

    reset();
    setProjectValue("");
  };

  return (
   <>
   {
    projectTitleLoading ? (<h1>Please wait</h1>) : 
    (
       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-3">

      {/* ⭐ PROJECT SELECT INPUT */}
      <div>
        <Label>Project *</Label>

        <Select
  value={projectValue}
  onValueChange={(value) => {
    setProjectValue(value);
    setValue("projectType", value);
  }}
>
  <SelectTrigger className="w-full rounded-md">
    <SelectValue placeholder="Select Project" />
  </SelectTrigger>

  <SelectContent>

    {/* ⭐ If props se project aa raha hai → sirf wohi show hoga */}
    {selectedProject ? (
      <SelectItem value={selectedProject}>{selectedProject}</SelectItem>
    ) : (
      <>
        <SelectItem value="The Fort Jodhpur">The Fort Jodhpur</SelectItem>
        <SelectItem value="Shubham Paradise">Shubham Paradise</SelectItem>
        <SelectItem value="Shubh-Villa">Shubh-Villa</SelectItem>
      </>
    )}

  </SelectContent>
</Select>


        {!projectValue && (
          <p className="text-red-500 text-sm mt-1">Project is required</p>
        )}
      </div>

      {/* NAME */}
      <div>
        <Label>Your Name *</Label>
        <Input {...register("name", { required: "Name is required" })} />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* EMAIL */}
      <div>
        <Label>Email *</Label>
        <Input
          type="email"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* PHONE */}
      <div>
        <Label>Phone *</Label>
        <Input
          maxLength={10}
          {...register("phone", {
            required: "Phone number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Enter a valid 10-digit number",
            },
          })}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}
      </div>

      {/* MESSAGE */}
      <div>
        <Label>Message *</Label>
        <textarea
          {...register("message", { required: "Message is required" })}
          className="w-full border rounded-md p-2 text-black"
          rows={3}
          placeholder="Your Message"
        ></textarea>

        {errors.message && (
          <p className="text-red-500 text-sm">{errors.message.message}</p>
        )}
      </div>

      {/* SUBMIT BUTTON */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full cursor-pointer bg-[#d4af37] hover:bg-yellow-600"
      >
        {isLoading ? "Sending..." : "Submit Enquiry"}
      </Button>
    </form>
    )
   }
   </>
  );
}
