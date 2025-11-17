import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import OwnerSignup from "./pages/auth/OwnerSignup";
import OwnerSetup from "./pages/auth/OwnerSetup";
import BrowseRentals from "./pages/home/BrowseRentals";
import Cart from "./pages/home/Cart";
import Wishlist from "./pages/home/Wishlist";
import MainLayout from "./layouts/MainLayout";
import "leaflet/dist/leaflet.css";
// index.js or App.js
import { generateFakeToken } from "./utils/fakeAuth";

if (!localStorage.getItem("fakeToken")) {
  const token = generateFakeToken();
  localStorage.setItem("fakeToken", token);
  console.log("Fake token generated for dev:", token);
}


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ownersignup" element={<OwnerSignup/>} />
          <Route path="/ownersetup" element={<OwnerSetup />} />

          <Route element={<MainLayout />}>
            <Route path="/browse" element={<BrowseRentals />} />
            <Route path="/about" element={<div></div>} />
            <Route path="/how-it-works" element={<div></div>} />
            <Route path="/wishlist" element={<Wishlist/>} />
            <Route path="/cart" element={<Cart/>} />
            <Route path="/profile" element={<div></div>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
