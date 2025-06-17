'use client'

import React from 'react';
import { motion } from 'framer-motion';

export const AuroraText = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative z-10 text-white drop-shadow-lg">{children}</div>
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 opacity-40 blur-2xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.5, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-green-600 opacity-40 blur-2xl"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.4, 0.5, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 opacity-40 blur-2xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.5, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </motion.div>
  );
}; 