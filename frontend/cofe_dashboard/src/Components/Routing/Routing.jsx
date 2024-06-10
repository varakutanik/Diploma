import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "../../Pages/HomePage";
import LoginPage from "../../Pages/LoginPage";
import PrivateRoute from "./PrivateRoute";
import DashboardPage from "../../Pages/Dashboard";
import MenuPage from "../../Pages/MenuPage";
import CoffeeShops from "../../Pages/CoffeeShops";

const Routing = () => {
  const locations = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [locations.pathname]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          // <PrivateRoute>
          <HomePage />
          // </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <DashboardPage />
        }
      />

      <Route
        path="/menu"
        element={
          <MenuPage />
        }
      />
      <Route
        path="/coffee"
        element={
          <CoffeeShops />
        }
      />
    </Routes>
  );
};

export default Routing;
