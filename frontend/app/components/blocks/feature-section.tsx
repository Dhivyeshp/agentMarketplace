'use client'

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Feature {
  step: string;
  title: string;
  content: string;
  image: string;
}

interface FeatureStepsProps {
  features: Feature[];
  title: string;
  subtitle?: string;
  autoPlayInterval?: number;
  imageHeight?: string;
}

export const FeatureSteps: React.FC<FeatureStepsProps> = ({
  features,
  title,
  subtitle,
  autoPlayInterval = 3000,
  imageHeight = "h-[400px]",
}) => {
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  useEffect(() => {
    if (autoPlayInterval) {
      const interval = setInterval(() => {
        setCurrentFeatureIndex(
          (prevIndex) => (prevIndex + 1) % features.length
        );
      }, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [features, autoPlayInterval]);

  const currentFeature = features[currentFeatureIndex];

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-sans font-medium text-gray-900 mb-4 text-center"
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Feature Steps */}
          <div className="space-y-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 border rounded-lg cursor-pointer transition-all duration-300 ${
                  index === currentFeatureIndex
                    ? "border-blue-500 bg-blue-50 text-blue-800 shadow-md"
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100"
                }`}
                onClick={() => setCurrentFeatureIndex(index)}
              >
                <p className="text-sm font-semibold mb-2">{feature.step}</p>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.content}</p>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Image */}
          <div className="relative rounded-lg overflow-hidden shadow-xl md:order-last">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature.image} // Key change for exit/enter animation
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className={`relative w-full ${imageHeight}`}
              >
                <Image
                  src={currentFeature.image}
                  alt={currentFeature.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}; 