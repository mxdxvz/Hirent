import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductDetails from './pages/ProductDetails';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Product Details Route */}
        <Route path="/product/:id" element={<ProductDetails />} />
        
      </Routes>
    </Router>
  );
}

export default App;
