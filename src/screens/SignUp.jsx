import React, { useState } from "react";
import Navbar from "../components/Shop/Navbar";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Shop/Button";

export default function Login() {
  const navigate = useNavigate();
  const [inputType, setInputType] = useState("password");
  const [roles, setRoles] = useState(["Customer"]);
  const [showHidePass, setShowHidePass] = useState("Show Password");
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
  });

  const passShowHide = () => {
    if (showHidePass === "Show Password") {
      setShowHidePass("Hide Password");
      setInputType("text");
    } else {
      setShowHidePass("Show Password");
      setInputType("password");
    }
  };

  // let roles = [];
  const getRoles = (e) => {
    let exists = roles.find((role) => role === e.target.value);
    console.log(exists);
    if (exists) {
      const updatedRoles = roles.filter((role) => role !== e.target.value);
      setRoles(updatedRoles);
    } else {
      setRoles([e.target.value, ...roles]);
    }
  };

  const getData = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const newUserFormSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:4000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: credentials.name,
        email: credentials.email,
        location: credentials.location,
        password: credentials.password,
        roles: roles,
      }),
    });
    const json = await response.json();

    if (json.success) {
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
          onSubmit={newUserFormSubmit}
          className={`p-3 rounded ${styles.form}`}
          action="/login">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="form-control"
              placeholder="Enter Your Name"
              name="name"
              onChange={getData}
              value={credentials.name}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter email address"
              aria-describedby="emailHelp"
              name="email"
              onChange={getData}
              value={credentials.email}
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputAddress" className="form-label">
              Address
            </label>
            <input
              type="text"
              id="exampleInputAddress"
              className="form-control"
              placeholder="Enter Your Location"
              name="location"
              onChange={getData}
              value={credentials.location}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type={inputType}
              placeholder="Enter your password"
              className="form-control"
              id="exampleInputPassword1"
              name="password"
              onChange={getData}
              value={credentials.password}
            />
            <span className={`showHidePassDiv`} onClick={passShowHide}>
              {showHidePass}
            </span>
          </div>
          <div className={styles.rolesContainer}>
            <div className={styles.rolesHeading}>Roles</div>
            <div
              class="btn-group"
              role="group"
              aria-label="Basic checkbox toggle button group">
              <input
                type="checkbox"
                onChange={getRoles}
                class="btn-check"
                id="btncheck1"
                autocomplete="off"
                value="Admin"
              />
              <label class="btn" for="btncheck1">
                Admin
              </label>

              <input
                type="checkbox"
                class="btn-check"
                id="btncheck2"
                autocomplete="off"
                value="Customer"
                checked
              />
              <label title="By Default" class="btn" for="btncheck2">
                Customer
              </label>
            </div>
          </div>
          <div className={`mb-3 ${styles.newAccountBtn}`}>
            <Link to="/login">Already a User</Link>
          </div>
          {/* <button type="submit" className={`btn ${styles.submitBtn}`}>
            Submit
          </button> */}
          <Button
            className={styles.submitBtn}
            type="submit"
            btn="Create Acount">
            Signup
          </Button>
        </form>
      </div>
    </>
  );
}
