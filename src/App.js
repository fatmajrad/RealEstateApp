import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import AppointementManagment from './pages/AppointementManagment';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';
import './App.css';
import Listing from './pages/Listing';
import OffersManagment from './pages/OffersManagment';
import OfferDetails from './pages/OfferDetails';

function App() {
  return (
    <Router>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/offers" element={<Offers />} />
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route
          path="/category/:categoryName/:listingId"
          element={<Listing />}
        />
      <Route path="/createListing" element={<PrivateRoute />}>
        <Route path="/createListing" element={<CreateListing />} /> {/* Nested route */}
      </Route>
      <Route path="/appointementManagment" element={<PrivateRoute />}>
        <Route path="/appointementManagment" element={<AppointementManagment />} /> {/* Nested route */}
      </Route>
      <Route path="/offersManagment" element={<PrivateRoute />}>
        <Route path="/offersManagment" element={<OffersManagment />} /> {/* Nested route */}
      </Route>
      <Route path="/editListing" element={<PrivateRoute />}>
        <Route path="/editListing/:listingId" element={<EditListing />} /> {/* Nested route */}
      </Route>
      <Route path="/offerDetails" element={<PrivateRoute />}>
        <Route path="/offerDetails/:listingId" element={<OfferDetails />} /> {/* Nested route */}
      </Route>
    </Routes>
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
  </Router>
  );
}

export default App;
