import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Gallery from "./pages/Gallery/Gallery";
import BarberProfile from "./pages/BarberProfile/BarberProfile";
import ProtectedAdminRoute from "./components/auth/ProtectedAdminRoute";
import ProtectedUserRoute from "./components/auth/ProtectedUserRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserProfile from "./pages/User/UserProfile/Userprofile";
import BookingPage from "@/pages/BookingPage/BookingPage";
import { useUserStore } from "@/store/user/userStore";

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    useUserStore.getState().initializeFromStorage();
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/our-work" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/barber/:id" element={<BarberProfile />} />
          {/* Auth Routes */}
          <Route path="/login" element={<div>Login</div>} />
          <Route path="/register" element={<div>Register</div>} />

          {/* Protected User Routes */}
          <Route
            path="/appointments"
            element={
              <ProtectedUserRoute>
                <div>Appointments</div>
              </ProtectedUserRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedUserRoute>
                <UserProfile />
              </ProtectedUserRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/book"
            element={
              <ProtectedUserRoute>
                <BookingPage />
              </ProtectedUserRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
