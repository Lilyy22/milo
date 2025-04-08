import { Facebook, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DoctorWebsite() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-[#0a1a2f] text-white py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-xl font-bold">DR. JONATHAN THOMSON</h1>
          <nav className="hidden md:flex space-x-6">
            <Link href="#" className="hover:text-blue-300 uppercase text-sm">
              Home
            </Link>
            <Link href="#" className="hover:text-blue-300 uppercase text-sm">
              About
            </Link>
            <Link href="#" className="hover:text-blue-300 uppercase text-sm">
              Blog
            </Link>
            <Link href="#" className="hover:text-blue-300 uppercase text-sm">
              In The News
            </Link>
            <Link href="#" className="hover:text-blue-300 uppercase text-sm">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative">
          <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative">
                <div className="absolute -top-8 -left-8 w-64 h-64 bg-[#b8e0f7] rounded-lg -z-10"></div>
                <div className="relative z-10">
                  <Image
                    src="https://static.vecteezy.com/system/resources/thumbnails/026/375/249/small_2x/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg"
                    alt="Dr. Jonathan Thomson"
                    width={400}
                    height={500}
                    className="rounded-lg shadow-lg"
                  />
                </div>
                <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-[#b8e0f7] rounded-lg -z-10"></div>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-[#0a1a2f] mb-6">
                  WORLD-CLASS MEDICAL EXPERTISE AT YOUR SERVICE
                </h2>
                <p className="text-gray-700 mb-6">
                  With over a decade of experience and a passion for innovation,
                  I provide exceptional medical care tailored to your needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tagline */}
        <section className="bg-[#2d3e50] text-white py-6">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-semibold text-center">
              Your Health, My Priority
            </h3>
          </div>
        </section>

        {/* Welcome Section */}
        <section className="py-12 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              Welcome To The World Of Dr. Jonathan Thomson
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto text-center">
              Dr. Jonathan Thomson is a globally recognized specialist in
              [medical field]. With years of experience, cutting-edge expertise,
              and a commitment to patient-centric care, he has helped thousands
              regain their health and well-being.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              Our Impact In Numbers:
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-[#b8e0f7] p-6 text-center rounded-lg"
                >
                  <h3 className="text-xl font-bold mb-2">15+ Years</h3>
                  <p className="text-sm">of Medical Expertise</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Services */}
        <section className="py-12 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-[#e6f4fc] p-6 rounded-lg mb-8">
                <h2 className="text-2xl font-bold text-center mb-6">
                  Key Services Highlight:
                </h2>
              </div>
              <div className="space-y-6">
                {[
                  "Advanced Diagnostics & Treatment",
                  "Personalized Healthcare Solutions",
                  "Minimally Invasive Procedures",
                  "Holistic Patient Care",
                ].map((service, index) => (
                  <div key={index} className="border-b border-gray-300 pb-4">
                    <p className="text-gray-800">{service}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-6">
              Why Choose Dr. Jonathan Thomson?
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto text-center mb-8">
              Dr. Jonathan Thomson is a globally recognized specialist in
              [medical field]. With years of experience, cutting-edge expertise,
              and a commitment to patient-centric care, he has helped thousands
              regain their health and well-being.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                "Top-Tier Medical Expertise",
                "Individualized Treatment Plans",
                "State-Of-The-Art Technology",
                "Compassionate And Dedicated Care",
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="bg-[#b8e0f7] p-6 text-center rounded-lg"
                >
                  <p className="font-semibold">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-8">
              Take The First Step Towards Better Health
            </h2>
            <button className="bg-[#0a1a2f] text-white px-8 py-3 rounded-lg hover:bg-[#1a3a5f] transition-colors">
              Book An Appointment
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a1a2f] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-xl font-bold mb-4 md:mb-0">
              DR. JONATHAN THOMSON
            </h2>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-blue-300">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="hover:text-blue-300">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="hover:text-blue-300">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6">
            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8 mb-4">
              <Link href="#" className="hover:text-blue-300">
                Home
              </Link>
              <Link href="#" className="hover:text-blue-300">
                Blog
              </Link>
              <Link href="#" className="hover:text-blue-300">
                Contact
              </Link>
              <Link href="#" className="hover:text-blue-300">
                About
              </Link>
              <Link href="#" className="hover:text-blue-300">
                In The News
              </Link>
            </div>
            <div className="text-center text-sm text-gray-400">
              Copyright © 2025 • Dr. Jonathan Thomson • All Rights Reserved
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
