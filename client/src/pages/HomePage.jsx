import React from 'react';
import Navbar from '../components/Navbar.jsx';
import SubNavbar from '../components/SubNavbar.jsx';
import Footer from '../components/Footer.jsx';

// New Homepage Sections
import TrendingSection from '../components/TrendingSection.jsx';
import PreBuiltSection from '../components/PreBuiltSection.jsx';
import BenchmarksSection from '../components/BenchmarksSection.jsx';
import BuilderPromoSection from '../components/BuilderPromoSection.jsx';
import FeaturesSection from '../components/FeaturesSection.jsx';

import Hero from '../components/Hero.jsx';
import heroPC from '../assets/hero-pc.png';
import gpuImg from '../assets/gpu.jpg';
import pcBuildImg from '../assets/pc-build.jpg';


const HomePage = () => {
    const heroImages = [heroPC, gpuImg, pcBuildImg];

    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar />
            <SubNavbar />

            <main>
                {/* 1. HERO SECTION */}
                <Hero images={heroImages} />

                {/* 2. TRENDING COMPONENTS */}
                <TrendingSection />

                {/* 4. PRE-BUILT SYSTEMS */}
                <PreBuiltSection />

                {/* 5. BENCHMARK RESULTS */}
                <BenchmarksSection />


                {/* 7. PC BUILDER PROMOTION */}
                <BuilderPromoSection />

                {/* 8. WHY CHOOSE THIS PLATFORM */}
                <FeaturesSection />


            </main>

            <Footer />
        </div>
    );
};

export default HomePage;
