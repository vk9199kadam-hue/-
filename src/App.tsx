import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import StoreLocator from './pages/StoreLocator';
import FAQ from './pages/FAQ';
import JewelleryGuide from './pages/JewelleryGuide';
import PolicyPage from './pages/PolicyPage';
import TrackOrder from './pages/TrackOrder';
import SignIn from './pages/SignIn';
import GoldRate from './pages/GoldRate';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddProduct from './pages/admin/AddProduct';
import ManageProducts from './pages/admin/ManageProducts';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <>
              <Navbar />
              <main className="main-content admin-main">
                <div className="container">
                  <AdminDashboard />
                </div>
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <>
              <Navbar />
              <main className="main-content admin-main">
                <div className="container">
                  <AddProduct />
                </div>
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/admin/manage-products"
          element={
            <>
              <Navbar />
              <main className="main-content admin-main">
                <div className="container">
                  <ManageProducts />
                </div>
              </main>
              <Footer />
            </>
          }
        />

        {/* Public Routes */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <main className="main-content">
                <Home />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/shop"
          element={
            <>
              <Navbar />
              <main className="main-content">
                <Shop />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/product/:id"
          element={
            <>
              <Navbar />
              <main className="main-content">
                <ProductDetail />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Navbar />
              <main className="main-content">
                <About />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Navbar />
              <main className="main-content">
                <Contact />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/store-locator"
          element={
            <>
              <Navbar />
              <main className="main-content">
                <StoreLocator />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/faq"
          element={
            <>
              <Navbar />
              <main className="main-content">
                <FAQ />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/jewellery-guide"
          element={
            <>
              <Navbar />
              <main className="main-content">
                <JewelleryGuide />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/gold-rate"
          element={
            <>
              <Navbar />
              <main className="main-content">
                <GoldRate />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/track-order"
          element={
            <>
              <Navbar />
              <main className="main-content">
                <TrackOrder />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/sign-in"
          element={
            <>
              <Navbar />
              <main className="main-content">
                <SignIn />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/shipping-policy"
          element={
            <>
              <Navbar />
              <main className="main-content">
                <PolicyPage />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/return-policy"
          element={
            <>
              <Navbar />
              <main className="main-content">
                <PolicyPage />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <>
              <Navbar />
              <main className="main-content">
                <PolicyPage />
              </main>
              <Footer />
            </>
          }
        />
        <Route
          path="/terms-conditions"
          element={
            <>
              <Navbar />
              <main className="main-content">
                <PolicyPage />
              </main>
              <Footer />
            </>
          }
        />

        {/* 404 Catch-all */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <main className="main-content">
                <div className="page-error">
                  <div className="container">
                    <div className="empty-state">
                      <div className="empty-icon">🔍</div>
                      <h3>Page Not Found</h3>
                      <p>The page you're looking for doesn't exist or has been moved.</p>
                      <a href="/" className="btn btn-primary">Go Home</a>
                    </div>
                  </div>
                </div>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
