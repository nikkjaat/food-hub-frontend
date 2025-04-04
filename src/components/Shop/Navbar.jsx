import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import Button from "./Button";
import axios from "axios";
import MyProfile from "../../screens/MyProfile";
import Profile from "../../screens/Profile";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function Navbar(props) {
  // const [filter, setFilter] = useState();
  const [display, setDisplay] = useState(false);
  const [user, setUser] = useState("");
  const [capitalize, setCapitalize] = useState();
  const [cartItem, setCartItem] = useState(0);
  const profileRef = useRef();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    authCtx.logoutHandler();
    navigate("/login");
  };

  const filterProduct = (e) => {
    setCapitalize(e.target.value);
  };
  if (props.setFilterProduct) {
    props.setFilterProduct(capitalize);
  }

  useEffect(() => {
    const getCartItem = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND_URL}/getcartitem`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );

      const cartItem = response.data.data;
      // console.log(response);
      setCartItem(cartItem.length);
      setUser(response.data.user);
    };
    getCartItem();
  }, [authCtx.refresh]);

  let roles = authCtx.role;
  if (authCtx.role) {
    roles = roles.find((role) => role == "Admin");
  }

  const handleClickOutside = (e) => {
    if (profileRef.current && !profileRef.current.contains(e.target)) {
      setDisplay(false);
    }
  };

  useEffect(() => {
    // Add event listener for clicks outside the element
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up the event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // console.log(cartItem);
  return (
    <>
      <nav className={`navbar navbar-expand-lg navbar-light ${styles.navbar}`}>
        <div className="container-fluid">
          <span className={`navbar-brand ${styles.logo}`}>
            food<span>H</span>ub
          </span>
          <button
            style={{ backgroundColor: "yellow" }}
            className="navbar-toggler primary-color"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" aria-current="page" to="/">
                  Home
                </Link>
              </li>

              {roles && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/products">
                      My Products
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/addproduct">
                      Add Product
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/neworder">
                      New Order
                    </Link>
                  </li>
                </>
              )}
            </ul>
            <div className={styles.allBtnBox}>
              <form className={`${styles.searchBoxForm} d-flex`}>
                <input
                  style={{
                    height: "3rem !important",
                    width: "1rem !important",
                  }}
                  className={`${styles.searchInputBox} form-control me-2`}
                  type="search"
                  onChange={filterProduct}
                  // ref={filter}
                  placeholder="Search"
                  aria-label="Search"
                />
              </form>
              <Link
                to={!authCtx.isLoggedIn ? "/login" : "/cart"}
                className={styles.myCartBtn}
              >
                <div className={styles.cartHead}>
                  <ShoppingCartIcon />
                </div>
                <div className={styles.numberOfCartItem}>{cartItem}</div>
              </Link>
              {authCtx.isLoggedIn ? (
                <>
                  <div className="">
                    <Profile
                      logoutHandler={logoutHandler}
                      user={user}
                      setDisplay={setDisplay}
                    />
                    {display && (
                      <div ref={profileRef}>
                        {" "}
                        <MyProfile
                          user={user}
                          setDisplay={setDisplay}
                          display={display}
                        />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className={styles.myAccountBtn}>
                  <Link to={localStorage.getItem("authToken") ? "" : "/login"}>
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
