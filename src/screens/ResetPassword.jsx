import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Shop/Navbar";
import styles from "./ResetPassword.module.css";
import Button from "../components/Shop/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [error, setError] = useState(
    "We'll never share your email with anyone else."
  );
  let [display, setDisplay] = useState(false);
  let [otp, setOtp] = useState();
  const email = useRef();
  const OTP = useRef("");

  useEffect(() => {
    const randomNumber = Math.random() * 9000;
    setOtp(Math.floor(randomNumber));
  }, []);

  const getOTP = async () => {
    if (!validateEmail(email.current.value)) {
      setError(
        <h5 style={{ color: "red" }}>Please enter a valid email address.</h5>
      );
    } else {
      const response = await axios.post("http://localhost:4000/getotp", {
        email: email.current.value,
        otp: otp,
      });
      console.log(response);
      setDisplay(true);
      setError(
        <h5 style={{ color: "green" }}>OTP sent to youe email address.</h5>
      );
    }
  };

  // Basic email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (OTP) {
      const response = await axios.post("http://localhost:4000/resetpassword", {
        email: email.current.value,
        OTP: OTP.current.value,
      });
      console.log(response);
      if (response.status == 200) {
        navigate(
          `/setpassword/?userId=${response.data.userId}&otp=${response.data.otp}`
        );
      }
    }
  };
  return (
    <>
      <Navbar />

      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingTop: "5rem",
          alignItems: "center",
        }}>
        <form
          onSubmit={handleSubmit}
          className={`p-3 rounded container ${styles.form}`}
          action="/">
          <div style={{ display: "grid", gap: "1rem" }} className="mb-3">
            <div>
              <label
                style={{ color: "black", fontWeight: "bold" }}
                for="exampleInputEmail1"
                className="form-label">
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
                {error}
              </div>
            </div>
            {display && (
              <div>
                <label
                  style={{ color: "black", fontWeight: "bold" }}
                  for="otpnumber"
                  className="form-label">
                  OTP
                </label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  className="form-control"
                  id="otpnumber"
                  placeholder="Enter OTP"
                  ref={OTP}
                />
              </div>
            )}
          </div>

          {/* <button type="submit" className={`btn ${styles.submitBtn}`}>
            Submit
          </button> */}
          <div>
            {display ? (
              <Button
                disabled={false}
                className={styles.button}
                type="submit"
                btn="Login">
                SUBMIT
              </Button>
            ) : (
              <div onClick={getOTP} className={styles.button}>
                Get OTP
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
