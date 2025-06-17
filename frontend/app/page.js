'use client'

import React, { useState } from 'react';
import { Header, HeroSection, HowItWorksSection, ProjectGrid, CategoryTabs, Footer } from './components';
import { Testimonials } from './components/testimonials';
import { mockProjects, categories, features } from './lib/mockData';
import { FeatureSteps } from './components/blocks/feature-section';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('Projects');

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <HowItWorksSection />
      
      {/* Feature Steps Section */}
      <FeatureSteps 
        features={features}
        title="Why AgentGig?"
        subtitle="Discover the advantages of choosing AgentGig for your AI agent needs"
        autoPlayInterval={4000}
        imageHeight="h-[500px]"
      />

      {/* Category Navigation */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryTabs 
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </div>
      </section>

      {/* Project Grids */}
      <ProjectGrid
        title="Projects we love"
        subtitle="Standout projects making waves around the web"
        projects={mockProjects['Projects we love']}
      />

      <div className="bg-gray-50">
        <ProjectGrid
          title="Animations built with Spline"
          subtitle="Stunning 3D and interactive animations crafted with the powerful design tool, Spline"
          projects={mockProjects['Animations built with Spline']}
        />
      </div>

      <ProjectGrid
        title="Brand design projects"
        subtitle="Creative visual identities and branding systems created by top independent designers"
        projects={mockProjects['Brand design projects']}
      />

      <div className="bg-gray-50">
        <ProjectGrid
          title="Web design projects"
          subtitle="The best web design projects for effective websites and landing pages"
          projects={mockProjects['Web design projects']}
        />
      </div>

      <Testimonials />

      <Footer />
    </div>
  );
}