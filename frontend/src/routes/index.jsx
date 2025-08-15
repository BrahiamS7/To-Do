import { Routes, Route } from "react-router-dom";
import Login from "../pages/login.jsx";
import Home from "../pages/home.jsx";
import Register from "../pages/register.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};
export default AppRoutes;
