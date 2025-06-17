'use client'

import Image from "next/image";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

interface TestimonialsColumnProps {
  testimonials: Testimonial[];
  duration?: number;
  className?: string;
}

export const TestimonialsColumn: React.FC<TestimonialsColumnProps> = ({
  testimonials,
  duration = 20,
  className,
}) => {
  const columnRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [start, setStart] = React.useState(false);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!columnRef.current || !scrollRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setStart(true);
      } else {
        setStart(false);
      }
    }, { threshold: 0.1 });

    observer.observe(columnRef.current);

    const calculateHeight = () => {
      if (scrollRef.current) {
        setHeight(scrollRef.current.offsetHeight / 2);
      }
    };

    const timeoutId = setTimeout(calculateHeight, 0);

    window.addEventListener('resize', calculateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', calculateHeight);
      clearTimeout(timeoutId);
    };
  }, [testimonials]);

  return (
    <div
      ref={columnRef}
      className={`relative flex flex-col gap-6 overflow-hidden ${className}`}
    >
      <motion.div
        ref={scrollRef}
        className="flex flex-col gap-6 pb-6"
        initial={{ y: "0%" }}
        animate={start && height > 0 ? { y: `-${height}px` } : { y: "0%" }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: duration,
        }}
      >
        {[...testimonials, ...testimonials].map((testimonial, idx) => (
          <TestimonialCard key={idx} testimonial={testimonial} />
        ))}
      </motion.div>
    </div>
  );
};

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div
      className="max-w-sm cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 transition-all ease-in-out hover:scale-[1.03] hover:shadow-lg"
    >
      <div className="flex flex-col gap-4">
        <p className="text-base leading-snug text-gray-800">
          {testimonial.text}
        </p>
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-full">
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-full"
            />
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900">
              {testimonial.name}
            </p>
            <p className="text-sm text-gray-600">
              {testimonial.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 