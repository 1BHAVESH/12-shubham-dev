import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMailSendMutation } from "@/redux/features/shubamdevApi";
import HeroImage from "@/components/HeroImage";

export default function ContactForm() {
  const contactData = [
    { icon: <Phone size={28} />, text: "Call : +91 9024 195 195" },
    { icon: <Mail size={28} />, text: "info@subhamdevelopers.com" },
    {
      icon: <MapPin size={28} />,
      text: "BCM SHUBHAM BUILDERS LLP 861/C, Chopasni Road, Near Bombay Motors Chouraha, Jodhpur (Rajasthan)",
    },
  ];

  const [mailSend, { isLoading }] = useMailSendMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const finalData = {
      name: `${data.firstName.trim()} ${data.lastName.trim()}`,
      email: data.email.trim(),
      phone: data.phone.trim(),
      message: data.message.trim(),
    };

    console.log(finalData);
    await toast.promise(mailSend(finalData).unwrap(), {
      loading: "Sending your message...",
      success: "Mail sent successfully!",
      error: "Failed to send email",
    });

    reset();
  };

  return (
    <>
      <HeroImage />

      <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center w-full px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif italic font-bold tracking-wide text-white drop-shadow-lg">
          Contact Us
        </h2>

        <div className="flex items-center justify-center mt-3 mx-auto max-w-[200px] sm:max-w-[300px]">
          <div
            className="w-2 h-2 sm:w-3 sm:h-3 bg-white"
            style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
          ></div>
          <div className="h-[1px] sm:h-[2px] bg-white flex-grow mx-2"></div>
          <div
            className="w-2 h-2 sm:w-3 sm:h-3 bg-white"
            style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
          ></div>
        </div>
      </div>

      <section className="w-full max-w-[1370px] mx-auto py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[#D2AB48] text-base sm:text-lg font-medium">
          Have Any Queries?
        </p>
        <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-semibold mt-2">
          Reach Out To Us Today!!
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 sm:mt-8 flex flex-col gap-4 sm:gap-6"
        >
          {/* First & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <Label className="mb-2 block text-sm sm:text-base">First Name</Label>
              <Input
                placeholder="Enter your first name"
                className="border-[#C29A2D] h-10 sm:h-12 w-full"
                {...register("firstName", {
                  required: "First name is required",
                  validate: {
                    notEmpty: (value) =>
                      value.trim() !== "" || "First name cannot be empty or just spaces",
                  },
                })}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <Label className="mb-2 block text-sm sm:text-base">Last Name</Label>
              <Input
                placeholder="Enter your last name"
                className="border-[#C29A2D] h-10 sm:h-12 w-full"
                {...register("lastName", {
                  required: "Last name is required",
                  validate: {
                    notEmpty: (value) =>
                      value.trim() !== "" || "Last name cannot be empty or just spaces",
                  },
                })}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <Label className="mb-2 block text-sm sm:text-base">Email</Label>
            <Input
              type="email"
              placeholder="Enter your email"
              className="h-10 sm:h-12 border-[#C29A2D] w-full"
              {...register("email", {
                required: "Email is required",
                validate: {
                  notEmpty: (value) =>
                    value.trim() !== "" || "Email cannot be empty or just spaces",
                },
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Enter a valid email",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label className="mb-2 block text-sm sm:text-base">Phone Number</Label>
            <Input
              type="tel"
              placeholder="Enter your phone number"
              className="h-10 sm:h-12 border-[#C29A2D] w-full"
              maxLength={10}
              {...register("phone", {
                required: "Phone number is required",
                validate: {
                  notEmpty: (value) =>
                    value.trim() !== "" || "Phone number cannot be empty or just spaces",
                },
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Enter valid 10-digit Indian phone number",
                },
              })}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <Label className="mb-2 block text-sm sm:text-base">Message</Label>
            <Textarea
              rows={5}
              placeholder="Enter your message"
              className="border-[#C29A2D] min-h-[100px] sm:min-h-[120px] w-full"
              {...register("message", {
                required: "Message is required",
                validate: {
                  notEmpty: (value) =>
                    value.trim() !== "" || "Message cannot be empty or just spaces",
                },
              })}
            />
            {errors.message && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#C29A2D] hover:bg-[#B58920] cursor-pointer text-black font-medium w-full rounded-xl py-5 sm:py-6 text-base sm:text-lg"
          >
            {isLoading ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </section>

      {/* CONTACT CARDS SECTION */}
      <section className="max-w-[1320px] mx-auto py-8 sm:py-12 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {contactData.map((item, i) => (
            <Card
              key={i}
              className="bg-[#D2AB48] w-full max-w-[317px] min-h-[200px] sm:min-h-[242px] rounded-2xl text-center shadow-lg p-2"
            >
              <CardContent className="flex pt-8 sm:pt-12 flex-col items-center gap-3 sm:gap-4">
                <div className="bg-black p-2.5 sm:p-3 rounded-xl text-white">
                  {item.icon}
                </div>

                {item.text.includes("Call") ? (
                  <a
                    href="tel:+919024195195"
                    className="flex items-center gap-1 px-2 hover:underline"
                  >
                    <p className="text-xs sm:text-sm mb-3 sm:mb-5 break-words">
                      {item.text}
                    </p>
                  </a>
                ) : item.text.includes("@") ? (
                  <a
                    href="mailto:info@subhamdevelopers.com"
                    className="flex items-center gap-1 px-2 hover:underline"
                  >
                    <p className="text-xs sm:text-sm mb-3 sm:mb-5 break-words">
                      {item.text}
                    </p>
                  </a>
                ) : (
                  <p className="text-xs sm:text-sm mb-3 sm:mb-5 break-words px-2">
                    {item.text}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}