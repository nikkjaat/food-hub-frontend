import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./screens/Home";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import AdminWelcomePage from "./components/Admin/WelcomePage";
import Get404 from "../Error";
import Cart from "./components/Shop/Cart";
import ProtectedRoute from "./util/ProtectedRoute";
import AdminProducts from "./components/Admin/AdminProducts";
import PostProduct from "./components/Admin/PostProduct";
import GetSingleProduct from "./components/Shop/GetSingleProduct";
import NewAddress from "./components/Shop/NewAddress";
import MyAddress from "./components/Shop/MyAddress";
import StripePayment from "./util/payment/StripePayment";
import MyProfile from "./screens/MyProfile";
import ResetPassword from "./screens/ResetPassword";
import SetPassword from "./screens/SetPassword";
import { useContext, useEffect, useState } from "react";
import AuthContext from "./context/AuthContext";
import AlertBox from "./components/AlertBox/AlertBox";

function App() {
  const authCtx = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (authCtx.alertBoxText) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [authCtx.refresh]);
  return (
    <>
      {showAlert && <AlertBox />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/productdetails"
            element={
              <ProtectedRoute>
                <GetSingleProduct />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/setpassword" element={<SetPassword />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminWelcomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute>
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/addproduct"
            element={
              <ProtectedRoute>
                <PostProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/address"
            element={
              <ProtectedRoute>
                <MyAddress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addaddress"
            element={
              <ProtectedRoute>
                <NewAddress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <StripePayment />
              </ProtectedRoute>
            }
          />
          <Route path="/check" element={<MyProfile />} />
          <Route path="*" element={<Get404 />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
