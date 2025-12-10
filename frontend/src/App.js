import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { motion } from "framer-motion";

// ===== PROTECTED ROUTES =====
import ProtectedRoute from "./components/ProtectedRoute";

// ===== LAYOUT COMPONENTS =====
import MainLayout from "./components/layouts/MainLayout";
import MainNav from "./components/layouts/MainNav";
import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";

// ===== AUTHENTICATION PAGES =====
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import GoogleCallback from "./pages/auth/GoogleCallback";
import OwnerLogin from "./pages/auth/OwnerLogin";
import OwnerSignup from "./pages/auth/OwnerSignup";
import OwnerSetup from "./pages/auth/OwnerSetup";
import AdminLogin from "./pages/auth/AdminLogin";
import AdminSignup from "./pages/auth/AdminSignup";

// ===== HOMEPAGE SECTIONS =====
import HeroSection from "./components/home/HeroSection";
import FeaturedCategories from "./components/home/FeaturedCategories";
import HowItWorks from "./components/home/HowItWorks";
import BrowseItems from "./components/items/BrowseItems";
import WhyChoose from "./components/home/WhyChoose";
import Testimonials from "./components/home/Testimonials";

// ===== NAVBAR PAGES =====
import BrowseRentals from "./pages/home/navbar/BrowseRentals";
import Collection from "./pages/home/navbar/Collection";
import Wishlist from "./pages/home/navbar/Wishlist";
import AboutPage from "./pages/home/navbar/AboutPage";
import { HowItWorksSection } from "./pages/home/navbar/HowItWorks";
import NotificationsPage from "./pages/notifications/NotificationsPage";
import ProductDetails from "./pages/ProductDetails";
import ItemDetails from "./pages/ItemDetails";

// ===== SIDEBAR PAGES =====
import MyRentals from "./pages/home/sidebar/MyRentals";
import Booking from "./pages/home/sidebar/Booking";
import Messages from "./pages/home/sidebar/Messages";
import Returns from "./pages/home/sidebar/Returns";
import Account from "./pages/home/sidebar/Account";

// ===== OWNER DASHBOARD =====
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import AddItem from "./pages/owner/AddItem";
import MyListings from "./pages/owner/MyListings";
import OwnerBookings from "./pages/owner/OwnerBookings";
import OwnerMessages from "./pages/owner/OwnerMessages";
import OwnerReturns from "./pages/owner/OwnerReturns";
import OwnerEarnings from "./pages/owner/OwnerEarnings";
import OwnerProfile from "./pages/owner/OwnerProfile";
import OwnerSettings from "./pages/owner/OwnerSettings";

// ===== ADMIN DASHBOARD =====
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSettings from "./pages/admin/AdminSettings";

// ===== STYLES & IMPORTS =====
import "leaflet/dist/leaflet.css";

// ===== LANDING PAGE COMPONENT =====
function LandingPage() {
  const { isLoggedIn } = useContext(AuthContext);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="App">
      {/* Navbar switches based on login state */}
      {isLoggedIn ? <Navbar /> : <MainNav />}

      {/* Hero Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <HeroSection />
      </motion.section>

      {/* Featured Categories */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <FeaturedCategories />
      </motion.section>

      {/* Browse Items */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <BrowseItems />
      </motion.section>

      {/* How It Works */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <HowItWorks />
      </motion.section>

      {/* Why Choose */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <WhyChoose />
      </motion.section>

      {/* Testimonials */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <Testimonials />
      </motion.section>

      <Footer />
    </div>
  );
}

// ===== MAIN APP COMPONENT =====
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* ===== PUBLIC ROUTES ===== */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth-callback" element={<GoogleCallback />} />

            {/* ===== OWNER ROUTES ===== */}
            <Route path="/ownerlogin" element={<OwnerLogin />} />
            <Route path="/ownersignup" element={<OwnerSignup />} />
            <Route path="/ownersetup" element={<OwnerSetup />} />

            {/* ===== ADMIN ROUTES (PROTECTED) ===== */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-signup" element={<AdminSignup />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminSettings />
                </ProtectedRoute>
              }
            />

            {/* ===== OWNER DASHBOARD (PROTECTED) ===== */}
            <Route
              path="/owner/dashboard"
              element={
                <ProtectedRoute requiredRole="owner">
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/add-item"
              element={
                <ProtectedRoute requiredRole="owner">
                  <AddItem />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/my-listings"
              element={
                <ProtectedRoute requiredRole="owner">
                  <MyListings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/bookings"
              element={
                <ProtectedRoute requiredRole="owner">
                  <OwnerBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/returns"
              element={
                <ProtectedRoute requiredRole="owner">
                  <OwnerReturns />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/messages"
              element={
                <ProtectedRoute requiredRole="owner">
                  <OwnerMessages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/earnings"
              element={
                <ProtectedRoute requiredRole="owner">
                  <OwnerEarnings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/profile"
              element={
                <ProtectedRoute requiredRole="owner">
                  <OwnerProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/settings"
              element={
                <ProtectedRoute requiredRole="owner">
                  <OwnerSettings />
                </ProtectedRoute>
              }
            />

            {/* ===== MAIN LAYOUT ROUTES (with navbar and sidebar) ===== */}
            <Route element={<MainLayout />}>
              {/* Navbar Pages */}
              <Route path="/browse" element={<BrowseRentals />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/how-it-works" element={<HowItWorksSection />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/items/:id" element={<ItemDetails />} />

              {/* Sidebar Pages */}
              <Route path="/my-rentals" element={<MyRentals />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/chat" element={<Messages />} />
              <Route path="/account" element={<Account />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/collection" element={<Collection />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;