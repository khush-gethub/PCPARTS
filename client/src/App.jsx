import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import ConfiguratorPage from './pages/ConfiguratorPage.jsx';
import SavedBuildsPage from './pages/SavedBuildsPage.jsx';
import BenchmarksPage from './pages/BenchmarksPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import CartPage from './pages/CartPage.jsx';
import ShippingPage from './pages/ShippingPage.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import OrderConfirmationPage from './pages/OrderConfirmationPage.jsx';
import ProductDetailsPage from './pages/ProductDetailsPage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import ReadyMadePCsPage from './pages/ReadyMadePCsPage.jsx';
import ReadyMadePCDetailsPage from './pages/ReadyMadePCDetailsPage.jsx';
import ReadyMadePCComponentsPage from './pages/ReadyMadePCComponentsPage.jsx';
import SearchResultsPage from './pages/SearchResultsPage.jsx';

// Admin Imports
import AdminLayout from './layouts/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminCoupons from './pages/admin/AdminCoupons.jsx';
import AdminReadyMadePCs from './pages/admin/AdminReadyMadePCs.jsx';
import AdminPlaceholderPage from './pages/admin/AdminPlaceholderPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/configurator" element={<ConfiguratorPage />} />
        <Route path="/saved-builds" element={<SavedBuildsPage />} />
        <Route path="/benchmarks" element={<BenchmarksPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout/shipping" element={<ShippingPage />} />
        <Route path="/checkout/payment" element={<PaymentPage />} />
        <Route path="/checkout/confirmation" element={<OrderConfirmationPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/ready-made-pcs" element={<ReadyMadePCsPage />} />
        <Route path="/ready-made-pc/:id" element={<ReadyMadePCDetailsPage />} />
        <Route path="/ready-made-pc/:id/components" element={<ReadyMadePCComponentsPage />} />
        <Route path="/search" element={<SearchResultsPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="ready-made-pcs" element={<AdminReadyMadePCs />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
