"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // Reset form after submission
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="w-full max-w-4xl px-4 py-8 mx-auto">
      <div className="relative">
        {/* Blue accent on the left */}
        <div className="absolute left-0 w-10 h-24 top-24 bg-sky-200"></div>

        <h1 className="mb-6 text-2xl font-bold">CONTACT</h1>

        <div className="relative p-8 shadow-sm bg-gray-50 md:p-12">
          {/* Blue accent on the bottom right */}
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-sky-200"></div>

          <div className="relative z-10">
            <p className="mb-8 text-lg">
              Need help? Just fill in the form, and we&apos;ll contact you soon!
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="px-0 bg-transparent border-t-0 border-b border-gray-400 rounded-none border-x-0 focus-visible:ring-0 focus-visible:border-black"
                  required
                />
              </div>

              <div>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="px-0 bg-transparent border-t-0 border-b border-gray-400 rounded-none border-x-0 focus-visible:ring-0 focus-visible:border-black"
                  required
                />
              </div>

              <div>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="I would like"
                  className="min-h-[140px] border border-gray-300 focus-visible:ring-0 focus-visible:border-black"
                  required
                />
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full md:w-auto md:min-w-[200px] bg-[#0a1629] hover:bg-[#162942] text-white"
                >
                  Send
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
