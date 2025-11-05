import React from 'react';
import Navbar from '../components/layout/Navbar';
import ProductSidebar from '../components/product/ProductSidebar';
import Footer from '../components/layout/Footer';
import ImageGallery from '../components/product/ImageGallery';
import ProductInfo from '../components/product/ProductInfo';
import RelatedItems from '../components/product/RelatedItems';

// Import product images
import havicGamepad from '../assets/product/havic_gamepad/havic_gamepad.png';
import havicGamepad1 from '../assets/product/havic_gamepad/havic_gamepad1.png';
import havicGamepad2 from '../assets/product/havic_gamepad/havic_gamepad2.png';
import havicGamepad3 from '../assets/product/havic_gamepad/havic_gamepad3.png';

// Import related product images
import havitHv from '../assets/product/items/havit_hv.png';
import keyboard from '../assets/product/items/Keyboard.png';
import ipsLcd from '../assets/product/items/IPS_lcd.png';
import rgbLiquid from '../assets/product/items/RGB_liquid_CPU.png';

const ProductDetails = () => {
  const product = {
    id: 'havic-hv-g92-gamepad',
    name: 'Havic HV G-92 Gamepad',
    rating: 4.5,
    reviews: 150,
    inStock: true,
    price: 300.00,
    originalPrice: 500.00,
    description: 'PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install & mess free removal Pressure sensitive.',
    colors: [
      { name: 'purple', code: '#A855F7' },
      { name: 'red', code: '#EF4444' },
      { name: 'yellow', code: '#F59E0B' }
    ],
    sizes: ['M', 'L'],
    images: [
      havicGamepad,
      havicGamepad1,
      havicGamepad2,
      havicGamepad3
    ]
  };

  const relatedProducts = [
    {
      id: 1,
      name: 'HAVIT HV-G92 Gamepad',
      price: 120,
      originalPrice: 160,
      rating: 5,
      reviews: 88,
      image: havitHv,
      discount: 40
    },
    {
      id: 2,
      name: 'AK-900 Wired Keyboard',
      price: 960,
      originalPrice: 1160,
      rating: 4,
      reviews: 75,
      image: keyboard,
      discount: 35
    },
    {
      id: 3,
      name: 'IPS LCD Gaming Monitor',
      price: 370,
      originalPrice: 400,
      rating: 5,
      reviews: 99,
      image: ipsLcd,
      discount: 30
    },
    {
      id: 4,
      name: 'RGB liquid CPU Cooler',
      price: 160,
      originalPrice: 170,
      rating: 4.5,
      reviews: 65,
      image: rgbLiquid
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ProductSidebar />
      
      {/* Main Content with Left Sidebar Offset */}
      <div className="ml-16">
        {/* Breadcrumb */}
        <div className="pl-32 pr-6 py-8">
          <div className="flex items-center space-x-3 text-lg">
            <a href="/" className="text-gray-400 hover:text-gray-600 transition">Home</a>
            <span className="text-gray-400">/</span>
            <a href="/categories" className="text-gray-400 hover:text-gray-600 transition">Categories</a>
            <span className="text-gray-400">/</span>
            <a href="/gadgets" className="text-gray-400 hover:text-gray-600 transition">Gadgets</a>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>

        {/* Main Product Section */}
        <div className="pl-32 pr-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ImageGallery images={product.images} />
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Related Items */}
        <div className="pl-32 pr-6 py-6">
          <RelatedItems products={relatedProducts} />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default ProductDetails;
