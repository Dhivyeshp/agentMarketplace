'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Star, Play, Heart, Eye, MessageCircle, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { AuroraText } from "./magicui/aurora-text.tsx";
import { RainbowButton } from "./magicui/rainbow-button.tsx";
import { ShimmerButton } from './magicui/shimmer-button.tsx';
import { AuroraBackground } from "./ui/aurora-background";
import { GlowingEffect } from "./ui/glowing-effect";
import { TestimonialsColumn } from "./ui/testimonials-columns-1";
import { headerNavLinks, howItWorksSteps, footerNavigation, testimonials } from "../lib/mockData";
import { TechBackground } from "./ui/tech-background";
// Header Component
export const Header = () => {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-black hover:text-gray-700 transition-colors">
                ◆ agentMarketPlace
              </Link>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.nav 
            className="hidden md:flex items-center space-x-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {headerNavLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Link 
                  href={link.href} 
                  className="text-gray-700 hover:text-black transition-colors nav-link font-sans text-sm font-medium relative group"
                >
                  {link.text}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* Auth Buttons */}
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/login" className="text-gray-700 hover:text-black transition-colors nav-link font-sans text-sm font-medium">
                Login
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >

              <Link href="/signup" passHref>
               <RainbowButton as="a" className="font-sans text-sm font-medium">
                  Sign Up
                </RainbowButton>
              </Link>
              
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

// Hero Section Component
export const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AuroraBackground>
      <section className="pt-52 pb-8 min-h-[400px] flex items-start relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Buttons above the heading */}
            <div className="flex justify-center mb-8">
              <motion.button 
                className="px-6 py-2 rounded-l-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                HIRE INDEPENDENTS
              </motion.button>
              <motion.button 
                className="px-6 py-2 rounded-r-full border border-gray-300 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                GET HIRED
              </motion.button>
            </div>

            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-6xl font-sans font-medium text-gray-900">
                The Human-Powered
              </h1>
              <AuroraText className="text-6xl md:text-7xl font-medium">AI Agent Marketplace</AuroraText>
            </motion.div>
            <motion.p 
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Discover, connect, and work with the world&apos;s best independent creatives and clients.
            </motion.p>

            {/* Search Bar */}
            <motion.div 
              className="flex items-center max-w-3xl mx-auto mb-4 rounded-full overflow-hidden relative group 
                         glass-morphism 
                         shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="relative flex-1 h-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="What do you need help with?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full pl-12 pr-4 py-4 bg-transparent focus:outline-none focus:ring-0 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
              </div>
              <ShimmerButton 
                className="h-full px-8 py-4 font-medium rounded-full text-white bg-black"
                shimmerColor="#ffffff"
                shimmerSize="0.15em"
                shimmerDuration="4s"
                whileHover={{ scale: 1.05, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Browse 1M+ independents
              </ShimmerButton>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </AuroraBackground>
  );
};

// How It Works Section
export const HowItWorksSection = () => {
  const [activeTab, setActiveTab] = useState('business');
  const businessSteps = howItWorksSteps;
  const developerSteps = [
    {
      title: "Create Your Profile",
      description: "Showcase your AI development skills and expertise",
      icon: "👤"
    },
    {
      title: "Browse Projects",
      description: "Find exciting AI projects that match your skills",
      icon: "🔍"
    },
    {
      title: "Submit Proposals",
      description: "Present your solutions to potential clients",
      icon: "📝"
    },
    {
      title: "Collaborate",
      description: "Work with clients in our secure environment",
      icon: "🤝"
    },
    {
      title: "Get Paid",
      description: "Receive secure payments for your work",
      icon: "💰"
    }
  ];

  const handleCardClick = (title) => {
    console.log(`Card clicked: ${title}`);
  };

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/30 via-transparent to-transparent" />
      
      {/* Animated Tech Background */}
      <TechBackground />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-sans font-medium text-gray-900 mb-4">How AgentGig Works</h2>
          
          {/* Tab List */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
              <motion.button
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'business'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('business')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                For Businesses
              </motion.button>
              <motion.button
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'developer'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('developer')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                For Developers
              </motion.button>
            </div>
          </div>

          <p className="text-lg text-gray-600 mb-8">
            {activeTab === 'business' ? 'For Businesses' : 'For Developers'}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.ul
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2"
          >
            {(activeTab === 'business' ? businessSteps : developerSteps).map((step, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`min-h-[14rem] list-none ${
                  index === 0 ? "md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]" :
                  index === 1 ? "md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]" :
                  index === 2 ? "md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]" :
                  index === 3 ? "md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]" :
                  "md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
                }`}
              >
                <div
                  className="relative h-full rounded-2xl border border-gray-200 p-2 md:rounded-3xl md:p-3 bg-white cursor-pointer transition-all duration-300 hover:border-gray-300 hover:scale-[1.02] hover:shadow-lg focus-within:border-gray-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-white"
                  onClick={() => handleCardClick(step.title)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Click card: ${step.title}`}
                >
                  <GlowingEffect 
                    spread={40} 
                    glow={true} 
                    disabled={false} 
                    proximity={64} 
                    inactiveZone={0.01}
                    className="rounded-2xl"
                  />
                  <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 bg-white border border-gray-100 transition-all duration-300 hover:bg-gray-50">
                    <div className="relative flex flex-1 flex-col justify-between gap-3">
                      <div className="w-fit rounded-lg border border-gray-200 bg-gray-50 p-2 transition-all duration-300 hover:border-gray-300 hover:bg-gray-100">
                        <span className="text-2xl text-gray-900">{step.icon}</span>
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-sans text-xl font-semibold text-gray-900 md:text-2xl transition-colors duration-300">
                          {step.title}
                        </h3>
                        <p className="font-sans text-sm text-gray-600 md:text-base transition-colors duration-300">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </section>
  );
};

// Project Card Component
export const ProjectCard = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative group">
        <Image
          src={project.image}
          alt={project.title}
          width={400}
          height={300}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Play className="h-12 w-12 text-white" />
        </motion.div>
        <motion.button
          className="absolute top-3 right-3 z-10"
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart className={`h-5 w-5 transition-colors ${isLiked ? 'text-red-500 fill-current' : 'text-white'}`} />
        </motion.button>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Image
              src={project.authorAvatar}
              alt={project.author}
              width={24}
              height={24}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-gray-600">{project.author}</span>
            {project.isPro && (
              <span className="bg-black text-white text-xs px-2 py-1 rounded">PRO</span>
            )}
          </div>
          <div className="flex items-center space-x-3 text-gray-500 text-sm">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {project.views}
            </div>
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              {project.likes}
            </div>
          </div>
        </div>
        <h3 className="font-medium text-gray-900 mb-1">{project.title}</h3>
        <p className="text-sm text-gray-600">{project.category}</p>
      </div>
    </motion.div>
  );
};

// Project Grid Component
export const ProjectGrid = ({ title, subtitle, projects }) => {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
          </div>
          <motion.button 
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            View more
            <ArrowRight className="ml-2 h-4 w-4" />
          </motion.button>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Category Tabs Component
export const CategoryTabs = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8 justify-center">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`px-4 py-2 rounded-full transition-colors ${
            activeCategory === category
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

// Footer Component
export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold mb-4">◆ agentMarketPlace</div>
            <p className="text-gray-400">
              The commission-free platform for independent professionals.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">For Independents</h3>
            <ul className="space-y-2 text-gray-400">
              {footerNavigation.independents.map((link, index) => (
                <li key={index}><Link href={link.href} className="hover:text-white transition-colors">{link.text}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">For Clients</h3>
            <ul className="space-y-2 text-gray-400">
              {footerNavigation.clients.map((link, index) => (
                <li key={index}><Link href={link.href} className="hover:text-white transition-colors">{link.text}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              {footerNavigation.company.map((link, index) => (
                <li key={index}><Link href={link.href} className="hover:text-white transition-colors">{link.text}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 agentMarketPlace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Update the main component to include the new section
export const MainContent = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <HowItWorksSection />
      {/* Now Testimonials is imported and rendered directly in page.js, so it's removed from here */}
      {/* <Testimonials /> */}
    </>
  );
};