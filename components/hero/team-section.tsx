"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface Barber {
  _id: string;
  name: string;
  location: string;
  image: string;
}

export default function TeamSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const barbers: Barber[] = [
    {
      _id: "1",
      name: "Kyle Frederick",
      location: "Senior Barber",
      image: "/image/about-1.jpg",
    },
    {
      _id: "2",
      name: "José Carpio",
      location: "Hair Specialist",
      image: "/image/about-2.jpg",
    },
    {
      _id: "3",
      name: "Michel Ibáñez",
      location: "Beard Expert",
      image: "/image/about-3.jpg",
    },
    {
      _id: "4",
      name: "Adam Castellon",
      location: "Style Consultant",
      image: "/image/about-1.jpg",
    },
  ];

  const visibleCards = 4;

  const nextSlide = () => {
    setCurrentIndex(
      (prev) => (prev + 1) % Math.max(1, barbers.length - visibleCards + 1)
    );
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + Math.max(1, barbers.length - visibleCards + 1)) %
        Math.max(1, barbers.length - visibleCards + 1)
    );
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h3 className="text-neutral-600 text-lg font-semibold mb-2">
            Trendy Salon &
          </h3>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Our Barber Shops
          </h2>
          <div className="flex items-center justify-center">
            <Image
              src="/image/heading-line.png"
              alt="Heading divider"
              width={200}
              height={20}
              className="mx-auto"
            />
          </div>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex transition-transform duration-500 ease-in-out"
            animate={{ x: `-${currentIndex * 25}%` }}
          >
            {barbers.map((barber) => (
              <motion.div
                key={barber._id}
                className="w-1/4 flex-shrink-0 px-4"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative group">
                  <Image
                    src={barber.image}
                    alt={barber.name}
                    width={300}
                    height={320}
                    className="w-full h-80 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-lg flex items-end">
                    <div className="text-white p-6">
                      <h3 className="text-xl font-semibold">{barber.name}</h3>
                      <p className="text-neutral-400">{barber.location}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Navigation Arrows */}
          {barbers.length > visibleCards && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-neutral-600 hover:bg-neutral-700 text-white p-2 rounded-full"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-neutral-600 hover:bg-neutral-700 text-white p-2 rounded-full"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
