import React, { useContext, useRef, useState } from "react";
import Navbar from "../components/Shop/Navbar";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Shop/Button";
import axios from "axios";
import AuthContext from "../context/AuthContext";

export default function Login() {
  const [inputType, setInputType] = useState("password");
  const [showHidePass, setShowHidePass] = useState("Show Password");
  const authCtx = useContext(AuthContext);
  const email = useRef();
  const password = useRef();
  const navigate = useNavigate();

  const passShowHide = () => {
    if (showHidePass === "Show Password") {
      setShowHidePass("Hide Password");
      setInputType("text");
    } else {
      setShowHidePass("Show Password");
      setInputType("password");
    }
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("http://localhost:4000/login", {
      email: email.current.value,
      password: password.current.value,
    });
    const json = await response.data;

    if (json.success) {
      // localStorage.setItem("authToken", json.authToken);
      authCtx.loginHandler(json.authToken);
      navigate("/");
      alert(json.message);
    } else {
      alert(json.message);
    }
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingTop: "5rem",
          alignItems: "center",
        }}>
        <form
          onSubmit={loginSubmit}
          className={`p-3 rounded ${styles.form}`}
          action="/">
          <div className="mb-3">
            <label for="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              required
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter email address"
              aria-describedby="emailHelp"
              ref={email}
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label for="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type={inputType}
              required
              placeholder="Enter your password"
              className="form-control"
              id="exampleInputPassword1"
              ref={password}
            />
            <span className={`showHidePassDiv`} onClick={passShowHide}>
              {showHidePass}
            </span>
          </div>
          <div className={`mb-3 ${styles.newAccountBtn}`}>
            <Link to="/signup">Create a new account</Link>
            <Link to="/resetpassword">Forgot Password</Link>
          </div>
          {/* <button type="submit" className={`btn ${styles.submitBtn}`}>
            Submit
          </button> */}
          <Button className={styles.submitBtn} type="submit" btn="Login">
            Login
          </Button>
        </form>
      </div>
    </>
  );
}
