import React, { useContext, useEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AuthContext from "./context/AuthContext";
import AlertBox from "./components/AlertBox/AlertBox";
import ProtectedRoute from "./util/ProtectedRoute";

const Home = lazy(() => import("./screens/Home"));
const Login = lazy(() => import("./screens/Login"));
const SignUp = lazy(() => import("./screens/SignUp"));
const AdminWelcomePage = lazy(() => import("./components/Admin/WelcomePage"));
const Get404 = lazy(() => import("../Error"));
const Cart = lazy(() => import("./components/Shop/Cart"));
const AdminProducts = lazy(() => import("./components/Admin/AdminProducts"));
const PostProduct = lazy(() => import("./components/Admin/PostProduct"));
const GetSingleProduct = lazy(() =>
  import("./components/Shop/GetSingleProduct")
);
const NewAddress = lazy(() => import("./components/Shop/NewAddress"));
const MyAddress = lazy(() => import("./components/Shop/MyAddress"));
const StripePayment = lazy(() => import("./util/payment/StripePayment"));
const MyProfile = lazy(() => import("./screens/MyProfile"));
const ResetPassword = lazy(() => import("./screens/ResetPassword"));
const SetPassword = lazy(() => import("./screens/SetPassword"));

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
        <Suspense fallback={<div>Loading...</div>}>
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
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
