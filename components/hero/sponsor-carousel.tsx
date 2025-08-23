"use client";

import React from "react";

const sponsors = [
  "/image/sponsor-1.png",
  "/image/sponsor-2.png",
  "/image/sponsor-3.png",
  "/image/sponsor-4.png",
  "/image/sponsor-5.png",
  "/image/sponsor-1.png",
  "/image/sponsor-2.png",
  "/image/sponsor-3.png",
];

const SponsorSection: React.FC = () => {
  return (
    <div className="sponsor_section bg-gray-100 py-12 overflow-hidden">
      <div className="container mx-auto">
        <div className="relative w-full">
          <ul className="flex animate-marquee gap-8">
            {sponsors.map((src, index) => (
              <li key={index} className="flex-shrink-0">
                <img
                  src={src}
                  alt={`sponsor-${index}`}
                  className="h-16 md:h-24"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SponsorSection;
