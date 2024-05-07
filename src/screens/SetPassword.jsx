import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Shop/Navbar";
import styles from "./ResetPassword.module.css";
import Button from "../components/Shop/Button";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const queryString = useLocation().search;
  const queryParams = new URLSearchParams(queryString);
  const userId = queryParams.get("userId");
  const otp = queryParams.get("otp");

  const [matched, setMatched] = useState(true);
  const [valid, setValid] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(
    "We'll never share your email with anyone else."
  );

  const newPass = (event, value) => {
    if (event === "newPassword") {
      if (value.length >= 6) {
        setValid(true);
        setError(<h5 style={{ color: "green" }}>Great</h5>);
      } else {
        setValid(false);
        setError(<h5>Atleast 6 Character</h5>);
      }
      setNewPassword(value);
    } else {
      setConfirmPassword(value);
    }
  };

  useEffect(() => {
    if (confirmPassword === newPassword && valid) {
      setMatched(false);
      setValid(true);
      setError(<h5 style={{ color: "green" }}>Password Matched</h5>);
    } else if (confirmPassword === "" && newPassword === "") {
      setError(<h5 style={{ color: "red" }}></h5>);
    } else if (!valid) {
      setError(<h5>Atleast 6 Character</h5>);
    } else if (confirmPassword != "") {
      setMatched(true);
      setError(<h5 style={{ color: "red" }}>Password do not Match</h5>);
    }
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post("http://localhost:4000/setpassword", {
      newPassword: newPassword,
      userId: userId,
      otp: otp,
    });
    if (response.status === 200) {
      navigate("/login");
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
                for="exampleInputPassword"
                className="form-label">
                New Password
              </label>
              <input
                type="password"
                required
                className="form-control"
                id="exampleInputPassword"
                placeholder="New Password"
                aria-describedby="emailHelp"
                onChange={(e) => {
                  newPass("newPassword", e.target.value);
                }}
              />
            </div>

            <div>
              <label
                style={{ color: "black", fontWeight: "bold" }}
                for="otpnumber"
                className="form-label">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                className="form-control"
                id="otpnumber"
                placeholder="Confirm New Password"
                onChange={(e) => {
                  newPass("confirmPassword", e.target.value);
                }}
              />
            </div>
            <div id="emailHelp" className="form-text">
              {error}
            </div>
          </div>

          {/* <button type="submit" className={`btn ${styles.submitBtn}`}>
            Submit
          </button> */}
          <div>
            <Button
              disabled={matched}
              className={styles.button}
              type="submit"
              btn="Login">
              SUBMIT
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
