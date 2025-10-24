import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturedCategories from './components/FeaturedCategories';
import BrowseItems from './components/BrowseItems';
import HowItWorks from './components/HowItWorks';
import WhyChoose from './components/WhyChoose';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

function App() {
  return React.createElement(
    'div',
    { className: 'App' },
    React.createElement(Navbar),
    React.createElement(HeroSection),
    React.createElement(FeaturedCategories),
    React.createElement(BrowseItems),
    React.createElement(HowItWorks),
    React.createElement(WhyChoose),
    React.createElement(Testimonials),
    React.createElement(Footer)
  );
}

export default App;
