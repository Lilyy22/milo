"use client";

import { Heading } from "@/components/heading";
import { useState } from "react";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        message: "",
    });

    const validateField = (name, value) => {
        let errorMessage = "";
        
        switch (name) {
            case "name":
                if (!value.trim()) {
                    errorMessage = "Name is required";
                } else if (value.trim().length < 2) {
                    errorMessage = "Name must be at least 2 characters";
                }
                break;
            case "email":
                if (!value.trim()) {
                    errorMessage = "Email is required";
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errorMessage = "Please enter a valid email address";
                }
                break;
            case "message":
                if (!value.trim()) {
                    errorMessage = "Message is required";
                } else if (value.trim().length < 10) {
                    errorMessage = "Message must be at least 10 characters";
                }
                break;
            default:
                break;
        }
        
        return errorMessage;
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        
        // Validate on change after user has started typing
        const errorMessage = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: errorMessage,
        }));
    };

    const validateForm = () => {
        const newErrors = {
            name: validateField("name", formData.name),
            email: validateField("email", formData.email),
            message: validateField("message", formData.message),
        };
        
        setErrors(newErrors);
        
        // Return true if no errors (all error messages are empty)
        return Object.values(newErrors).every(error => error === "");
    };

    const handleSubmit = e => {
        e.preventDefault();
        
        if (validateForm()) {
            // Handle form submission logic here
            console.log("Form submitted:", formData);
            // Reset form after submission
            setFormData({ name: "", email: "", message: "" });
            setErrors({ name: "", email: "", message: "" });
        }
    };

    const getInputClassName = (fieldName) => {
        const baseClass = "w-full border-b-2 bg-transparent p-3 focus:outline-none placeholder:text-[17px] placeholder:font-normal placeholder:leading-[140%] placeholder:text-gray";
        return `${baseClass} ${errors[fieldName] ? "border-red-500" : "border-gray"}`;
    };

    const getTextareaClassName = (fieldName) => {
        const baseClass = "w-full border-2 bg-transparent p-3 focus:outline-none";
        return `${baseClass} ${errors[fieldName] ? "border-red-500" : "border-gray"}`;
    };

    return (
        <section className="flex flex-col md:gap-[40px] gap-[24px]">
            <Heading type="h2" className="md:text-start text-center">Contact</Heading>
            <div className="flex flex-col items-center justify-center bg-gray/10 md:px-[40px] px-[16px] md:py-[40px] py-[24px]">
                <div className="max-w-[636px] w-full">
                    <Heading type="h3" className="text-center">
                        Have a question for me? Reach out using the form below
                    </Heading>
                    <form onSubmit={handleSubmit} className="md:mt-[40px] mt-[24px]">
                        <div className="mb-[24px]">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleChange}
                                className={getInputClassName("name")}
                                aria-invalid={errors.name ? "true" : "false"}
                                aria-describedby="name-error"
                                required
                            />
                            {errors.name && (
                                <p id="name-error" className="mt-1 text-red-500 text-sm">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className={getInputClassName("email")}
                                aria-invalid={errors.email ? "true" : "false"}
                                aria-describedby="email-error"
                                required
                            />
                            {errors.email && (
                                <p id="email-error" className="mt-1 text-red-500 text-sm">{errors.email}</p>
                            )}
                        </div>

                        <div className="mt-[48px] mb-[40px]">
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={6}
                                className={getTextareaClassName("message")}
                                aria-invalid={errors.message ? "true" : "false"}
                                aria-describedby="message-error"
                                required
                            />
                            {errors.message && (
                                <p id="message-error" className="mt-1 text-red-500 text-sm">{errors.message}</p>
                            )}
                        </div>

                        <div className="flex justify-center md:w-1/2 w-full">
                            <button
                                type="submit"
                                className="w-full bg-black text-white font-serif py-2 px-[32px] hover:bg-[#2a2a2a] transition-colors text-[17px] font-normal leading-[140%] capitalize">
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
