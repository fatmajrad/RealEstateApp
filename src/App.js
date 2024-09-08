import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import Offers from "./pages/Offers";
import Profile from "./pages/Profile";
import AppointementManagment from "./pages/AppointementManagment";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import "./App.css";
import Listing from "./pages/Listing";
import OffersManagment from "./pages/OffersManagment";
import OfferDetails from "./pages/OfferDetails";
import Footer from "./components/Footer";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";

function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

function MainApp() {
  const location = useLocation();
  const showFooterRoutes = [
    "/",
    "/profile",
    "/aboutUs",
    "/contactUs",
    "/forgotPassword",
    "/offers",
    "/signIn",
    "/signUp",
  ];

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route
          path="/category/:categoryName/:listingId"
          element={<Listing />}
        />
        <Route path="/createListing" element={<PrivateRoute />}>
          <Route path="/createListing" element={<CreateListing />} />
        </Route>
        <Route path="/appointementManagment" element={<PrivateRoute />}>
          <Route
            path="/appointementManagment"
            element={<AppointementManagment />}
          />
        </Route>
        <Route path="/offersManagment" element={<PrivateRoute />}>
          <Route path="/offersManagment" element={<OffersManagment />} />
        </Route>
        <Route path="/editListing" element={<PrivateRoute />}>
          <Route path="/editListing/:listingId" element={<EditListing />} />
        </Route>
        <Route path="/offerDetails" element={<PrivateRoute />}>
          <Route path="/offerDetails/:listingId" element={<OfferDetails />} />
        </Route>
      </Routes>

      {/* Conditionally render the Footer only on specified routes */}
      {showFooterRoutes.includes(location.pathname) && <Footer />}

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
