import React from "react";
import { Routes, Route } from "react-router-dom";


import Home from "./components/commons/main";
import Auth from "./components/commons/Auth";
import MedOption from "./components/commons/main-pages/MedOption";
import About from "./components/commons/main-pages/About";
import Hospitals from "./components/commons/hospitals/hospital";
import InTouch from "./components/commons/main-pages/InTouch";
import FAQPage from "./components/commons/main-pages/FAQ";
// import Filter from "./components/commons/Filters";
import UserDashboard from "./components/commons/user_profile/userDashboard";
import DashboardContent from "./components/commons/user_profile/DashboardContent";
import Orders from "./components/commons/user_profile/Orders";
import Reports from "./components/commons/user_profile/Reports";
import Notifications from "./components/commons/user_profile/Notifications";
import Problems from "./components/commons/user_profile/Problems";
import Visits from "./components/commons/user_profile/Visits";
import Appointments from "./components/commons/user_profile/Appointments";
import Transactions from "./components/commons/user_profile/Transactions";
import Settings from "./components/commons/user_profile/Settings";
import Cart from "./components/commons/cart/Cart";
import Part from "./components/commons/cart/Part";
import Essential from "./components/commons/essential/Essential";
import Product from "./components/commons/Product/product";
import Doctor from "./components/commons/doctors/Doctor";
import DoctorProfile from "./components/commons/doctors/DoctorProfile";
import CurrentOrderedProduct from "./components/commons/cart/OrderedProduct";
import HospitalDetails from "./components/commons/hospitals/HospitalDetails";

function AppRoutes() {

  const isAuthenticated = localStorage.getItem("data");
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/MedOption" element={<MedOption />} />
      <Route path="/About" element={<About />} />
      <Route path="/InTouch" element={<InTouch />} />
      <Route path="/FAQPage" element={<FAQPage />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/register/patient" element={<Auth />} />
      <Route path="/register/doctor" element={<Auth />} />
      <Route path="/register/pharmacy" element={<Auth />} />
      <Route path="/register/hospital" element={<Auth />} />
      <Route path="/register/clinic" element={<Auth />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/part" element={<Part />} />
      <Route path="/doctor" element={<Doctor />} />
      <Route path="/hospitals" element={<Hospitals />} />
      <Route path="/hospital/:hospital_id" element={<HospitalDetails />} />
      <Route path="/pharmacy" element={<Product />} />
      <Route path="/medicine" element={<Product />} />
      <Route path="/order-details" element={<CurrentOrderedProduct />} />

      {/* ----------------------------------------Routes with values--------------------------------------------------------- */}
      <Route path="/essential/:product_id" element={<Essential />} />
      <Route path="/:selectedOption/:searchValue" element={<Doctor />} />
      <Route path="/hospitals/:searchValue" element={<Hospitals />} />
      <Route path="/medicine/:searchValue" element={<Product />} />
      <Route path="/pharmacy/:searchValue" element={<Product />} />

      {/* ----------------------------------------Book Appointment with doctor--------------------------------------------------------- */}
      <Route path="/doctor-profile/:doctor_id" element={<DoctorProfile />} />
      
      

      {/* ----------------------------------------userDashboard--------------------------------------------------------- */}


      {isAuthenticated ? (
          <Route path="/userdashboard/*" element={<UserDashboard />}>
            <Route index element={<DashboardContent />} />
            <Route path="orders" element={<Orders />} />
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="problems" element={<Problems />} />
            <Route path="visits" element={<Visits />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        ) : (
          <Route path="*" element={<Home/>} />
        )}
      


      {/* -----------------------------------------pages --------------------------------------------------------------------- */}
 
 
  {/* <Route path="/clinic" element={<Clinic />} /> */}
  {/* <Route path="/doctor" element={<Doctor />} /> */}
 

      {/* ---------------------------------------search--------------------------------------------------------------- */}
      {/* <Route path="/search/:searchValue/searchType/:selectedOption" element={<Hospitals />} />
      <Route path="/search/:selectedOption" element={<Hospitals />} /> */}
      {/* -------------------------------------------------------------------------------------------------------------- */}
      {/* ---------------------------------------pharmacy--------------------------------------------------------------- */}
     
      {/* <Route path="/pharmacy/:selectedOption" element={<Product />} />
      <Route path="/pharmacy/:searchValue/searchType/pharmacy" element={<Product />} /> */}
      {/* -------------------------------------------------------------------------------------------------------------- */}
    </Routes>
  );
}

export default AppRoutes;
