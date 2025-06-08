// import React, { useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import styles from "./Navbar.module.css";
// import { useContext, useEffect, useState } from "react";
// import AuthContext from "../../context/AuthContext";
// import Button from "./Button";
// import axios from "axios";
// import MyProfile from "../../screens/MyProfile";
// import Profile from "../../screens/Profile";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// export default function Navbar(props) {
//   // const [filter, setFilter] = useState();
// const [display, setDisplay] = useState(false);
//   const [user, setUser] = useState("");
//   const [capitalize, setCapitalize] = useState();
//   const [cartItem, setCartItem] = useState(0);
//   const profileRef = useRef();
//   const authCtx = useContext(AuthContext);
//   const navigate = useNavigate();

//   const logoutHandler = () => {
//     authCtx.logoutHandler();
//     navigate("/login");
//   };

//   const filterProduct = (e) => {
//     setCapitalize(e.target.value);
//   };
//   if (props.setFilterProduct) {
//     props.setFilterProduct(capitalize);
//   }

//   useEffect(() => {
//     const getCartItem = async () => {
//       const response = await axios.get(
//         `${import.meta.env.VITE_API_BACKEND_URL}/getcartitem`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + authCtx.token,
//           },
//         }
//       );

//       const cartItem = response.data.data;
//       // console.log(response);
//       setCartItem(cartItem.length);
//       setUser(response.data.user);
//     };
//     getCartItem();
//   }, [authCtx.refresh]);

//   let roles = authCtx.role;
//   if (authCtx.role) {
//     roles = roles.find((role) => role == "Admin");
//   }

//   const handleClickOutside = (e) => {
//     if (profileRef.current && !profileRef.current.contains(e.target)) {
//       setDisplay(false);
//     }
//   };

//   useEffect(() => {
//     // Add event listener for clicks outside the element
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       // Clean up the event listener on component unmount
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // console.log(cartItem);
//   return (
//     <>
//       <nav className={`navbar navbar-expand-lg navbar-light ${styles.navbar}`}>
//         <div className="container-fluid">
//           <span className={`navbar-brand ${styles.logo}`}>
//             food<span>H</span>ub
//           </span>
//           <button
//             style={{ backgroundColor: "yellow" }}
//             className="navbar-toggler primary-color"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarSupportedContent"
//             aria-controls="navbarSupportedContent"
//             aria-expanded="false"
//             aria-label="Toggle navigation"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>
//           <div className="collapse navbar-collapse" id="navbarSupportedContent">
//             <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//               <li className="nav-item">
//                 <Link className="nav-link" aria-current="page" to="/">
//                   Home
//                 </Link>
//               </li>

//               {roles && (
//                 <>
//                   <li className="nav-item">
//                     <Link className="nav-link" to="/admin/products">
//                       My Products
//                     </Link>
//                   </li>
//                   <li className="nav-item">
//                     <Link className="nav-link" to="/admin/addproduct">
//                       Add Product
//                     </Link>
//                   </li>
//                   <li className="nav-item">
//                     <Link className="nav-link" to="/admin/neworder">
//                       New Order
//                     </Link>
//                   </li>
//                 </>
//               )}
//             </ul>
//             <div className={styles.allBtnBox}>
//               <form className={`${styles.searchBoxForm} d-flex`}>
//                 <input
//                   style={{
//                     height: "3rem !important",
//                     width: "1rem !important",
//                   }}
//                   className={`${styles.searchInputBox} form-control me-2`}
//                   type="search"
//                   onChange={filterProduct}
//                   // ref={filter}
//                   placeholder="Search"
//                   aria-label="Search"
//                 />
//               </form>
//               <Link
//                 to={!authCtx.isLoggedIn ? "/login" : "/cart"}
//                 className={styles.myCartBtn}
//               >
//                 <div className={styles.cartHead}>
//                   <ShoppingCartIcon />
//                 </div>
//                 <div className={styles.numberOfCartItem}>{cartItem}</div>
//               </Link>
//               {authCtx.isLoggedIn ? (
//                 <>
//                   <div className="">
//                     <Profile
//                       logoutHandler={logoutHandler}
//                       user={user}
//                       setDisplay={setDisplay}
//                     />
//                     {display && (
//                       <div ref={profileRef}>
//                         {" "}
//                         <MyProfile
//                           user={user}
//                           setDisplay={setDisplay}
//                           display={display}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </>
//               ) : (
//                 <div className={styles.myAccountBtn}>
//                   <Link to={localStorage.getItem("authToken") ? "" : "/login"}>
//                     Login
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </nav>
//     </>
//   );
// }

// import React, { useState, useEffect, useContext, useRef } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import styles from "./Navbar.module.css";
// import AuthContext from "../../context/AuthContext";
// import axios from "axios";
// import MyProfile from "../../screens/MyProfile";
// import Profile from "../../screens/Profile";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import HomeIcon from "@mui/icons-material/Home";
// import SearchIcon from "@mui/icons-material/Search";
// import PersonIcon from "@mui/icons-material/Person";
// import MenuIcon from "@mui/icons-material/Menu";

// export default function Navbar(props) {
//   const [display, setDisplay] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [user, setUser] = useState("");
//   const [searchInput, setSearchInput] = useState("");
//   const [cartItemCount, setCartItemCount] = useState(0);
//   const [activeNav, setActiveNav] = useState("home");
//   const authCtx = useContext(AuthContext);
//   const profileRef = useRef();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Set active nav based on current route
//   useEffect(() => {
//     const path = location.pathname;
//     if (path === "/") setActiveNav("home");
//     else if (path === "/search") setActiveNav("search");
//     else if (path === "/cart") setActiveNav("cart");
//     else if (path === "/profile") setActiveNav("profile");
//     else if (path === "/more") setActiveNav("more");
//   }, [location]);

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
//   const closeMenu = () => setIsMenuOpen(false);

//   const logoutHandler = () => {
//     authCtx.logoutHandler();
//     navigate("/login");
//     closeMenu();
//   };

//   const handleSearch = (e) => {
//     setSearchInput(e.target.value);
//     if (props.setFilterProduct) {
//       props.setFilterProduct(e.target.value);
//     }
//   };

//   useEffect(() => {
//     const getCartItem = async () => {
//       if (!authCtx.token) return;

//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_API_BACKEND_URL}/getcartitem`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: "Bearer " + authCtx.token,
//             },
//           }
//         );
//         const cartItems = response.data.data;
//         setCartItemCount(cartItems.length);
//         setUser(response.data.user);
//       } catch (error) {
//         console.error("Error fetching cart items:", error);
//       }
//     };
//     getCartItem();
//   }, [authCtx.refresh, authCtx.token]);

//   const isAdmin = authCtx.role?.includes("Admin");

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (profileRef.current && !profileRef.current.contains(e.target)) {
//         setDisplay(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Bottom navigation items
//   const navItems = [
//     { id: "home", label: "Home", icon: <HomeIcon />, path: "/" },
//     { id: "search", label: "Search", icon: <SearchIcon />, path: "/search" },
//     { id: "cart", label: "Cart", icon: <ShoppingCartIcon />, path: "/cart" },
//     { id: "profile", label: "Profile", icon: <PersonIcon />, path: "/profile" },
//     { id: "more", label: "More", icon: <MenuIcon />, path: "/more" },
//   ];

//   return (
//     <>
//       <header className={styles.mainHeader}>
//         {/* Desktop Header */}
//         <div className={styles.headerContainer}>
//           <div className={styles.headerTop}>
//             <Link
//               to="/"
//               className={`${styles.brandLogo} ${styles.hideOnDesktop}`}
//               onClick={closeMenu}
//             >
//               food<span className={styles.logoHighlight}>H</span>ub
//             </Link>
//             <button
//               className={`${styles.menuToggle} ${
//                 isMenuOpen ? styles.menuOpen : ""
//               }`}
//               onClick={toggleMenu}
//               aria-label="Toggle navigation"
//               aria-expanded={isMenuOpen}
//             >
//               <span className={styles.toggleBar}></span>
//               <span className={styles.toggleBar}></span>
//               <span className={styles.toggleBar}></span>
//             </button>
//           </div>

//           <nav
//             className={`${styles.mainNav} ${
//               isMenuOpen ? styles.navVisible : ""
//             }`}
//             aria-hidden={!isMenuOpen}
//           >
//             <ul className={styles.navList}>
//               <li className={styles.navItem}>
//                 <Link
//                   to="/"
//                   className={`${styles.brandLogo} ${styles.hideOnMobile}`}
//                   onClick={closeMenu}
//                 >
//                   food<span className={styles.logoHighlight}>H</span>ub
//                 </Link>
//               </li>

//               {isAdmin && (
//                 <>
//                   <li className={styles.navItem}>
//                     <Link
//                       to="/admin/products"
//                       className={styles.navLink}
//                       onClick={closeMenu}
//                     >
//                       My Products
//                     </Link>
//                   </li>
//                   <li className={styles.navItem}>
//                     <Link
//                       to="/admin/addproduct"
//                       className={styles.navLink}
//                       onClick={closeMenu}
//                     >
//                       Add Product
//                     </Link>
//                   </li>
//                   <li className={styles.navItem}>
//                     <Link
//                       to="/admin/neworder"
//                       className={styles.navLink}
//                       onClick={closeMenu}
//                     >
//                       New Order
//                     </Link>
//                   </li>
//                 </>
//               )}
//             </ul>

//             <div className={styles.navActions}>
//               <div className={styles.searchContainer}>
//                 <input
//                   type="text"
//                   placeholder="Search products..."
//                   value={searchInput}
//                   onChange={handleSearch}
//                   className={styles.searchField}
//                   aria-label="Search products"
//                 />
//               </div>

//               <Link
//                 to={authCtx.isLoggedIn ? "/cart" : "/login"}
//                 className={styles.cartLink}
//                 onClick={closeMenu}
//                 aria-label="Shopping cart"
//               >
//                 <ShoppingCartIcon className={styles.cartIcon} />
//                 {cartItemCount > 0 && (
//                   <span className={styles.cartCounter}>{cartItemCount}</span>
//                 )}
//               </Link>

//               {authCtx.isLoggedIn ? (
//                 <div className={styles.userMenu}>
//                   <button
//                     className={styles.profileButton}
//                     aria-label="User profile"
//                     aria-expanded={display}
//                     onClick={() => setDisplay(!display)}
//                   >
//                     <Profile
//                       logoutHandler={logoutHandler}
//                       user={user}
//                       setDisplay={setDisplay}
//                     />
//                   </button>

//                   {display && (
//                     <div className={styles.profileMenu} ref={profileRef}>
//                       <MyProfile
//                         user={user}
//                         setDisplay={setDisplay}
//                         display={display}
//                       />
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className={styles.authButton}>
//                   <Link
//                     to={localStorage.getItem("token") ? "" : "/login"}
//                     onClick={closeMenu}
//                   >
//                     Login
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </nav>
//         </div>
//       </header>

//       {/* Mobile Bottom Navigation */}
//       <div className={styles.bottomNav}>
//         {navItems.map((item) => (
//           <Link
//             key={item.id}
//             to={item.path}
//             className={`${styles.navItems} ${
//               activeNav === item.id ? styles.active : ""
//             }`}
//             onClick={() => {
//               setActiveNav(item.id);
//               closeMenu();
//             }}
//           >
//             <div className={styles.navIcon}>
//               {item.id === "cart" && cartItemCount > 0 && (
//                 <span className={styles.navBadge}>{cartItemCount}</span>
//               )}
//               {item.icon}
//             </div>
//             <span className={styles.navLabel}>{item.label}</span>
//           </Link>
//         ))}
//       </div>
//     </>
//   );
// }

import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import MyProfile from "../../screens/MyProfile";
import Profile from "../../screens/Profile";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import {
  ClickAwayListener,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export default function Navbar(props) {
  const [display, setDisplay] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [cartItemCount, setCartItemCount] = useState(0);
  const [activeNav, setActiveNav] = useState("home");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const authCtx = useContext(AuthContext);
  const profileRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreButtonRef = useRef(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visible, setVisible] = useState(true);

  const controlNavbar = useCallback(() => {
    if (typeof window !== "undefined") {
      if (window.scrollY < 100) {
        // Always show when near top
        setVisible(true);
        return;
      }

      if (window.scrollY > lastScrollY) {
        // if scrolling down
        setVisible(false);
      } else {
        // if scrolling up
        setVisible(true);
      }
      setLastScrollY(window.scrollY);
    }
  }, [lastScrollY]);

  useEffect(() => {
    const handleScroll = () => {
      // Debounce the scroll handler
      setTimeout(controlNavbar, 100);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [controlNavbar]);

  // Set active nav based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setActiveNav("home");
    else if (path === "/search") setActiveNav("search");
    else if (path === "/cart") setActiveNav("cart");
    else if (path === "/profile") setActiveNav("profile");
    else if (path === "/more") setActiveNav("more");
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
    if (!showSearchBar) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  const logoutHandler = () => {
    authCtx.logoutHandler();
    navigate("/login");
    closeMenu();
  };

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
    if (props.setFilterProduct) {
      props.setFilterProduct(e.target.value);
    }
  };

  useEffect(() => {
    const getCartItem = async () => {
      if (!authCtx.token) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BACKEND_URL}/getcartitem`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + authCtx.token,
            },
          }
        );
        const cartItems = response.data.data;
        setCartItemCount(cartItems.length);
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
    getCartItem();
  }, [authCtx.refresh, authCtx.token]);

  const isAdmin = authCtx.role?.includes("Admin");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setDisplay(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle more menu
  const toggleMoreMenu = () => {
    setShowMoreMenu(!showMoreMenu);
  };

  // Close more menu when clicking outside
  const handleClickAway = () => {
    setShowMoreMenu(false);
  };

  // Bottom navigation items
  const navItems = [
    { id: "home", label: "Home", icon: <HomeIcon />, path: "/" },
    { id: "search", label: "Search", icon: <SearchIcon />, path: "#" },
    { id: "cart", label: "Cart", icon: <ShoppingCartIcon />, path: "/cart" },
    { id: "profile", label: "Profile", icon: <PersonIcon />, path: "/profile" },
    {
      id: "more",
      label: "More",
      icon: <MenuIcon />,
      path: "#",
      onClick: toggleMoreMenu,
    },
  ];

  // Admin menu items
  const adminMenuItems = [
    { label: "My Products", path: "/admin/products" },
    { label: "Add Product", path: "/admin/addproduct" },
    { label: "New Order", path: "/admin/neworder" },
  ];

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowSize.width <= 780;

  return (
    <>
      <header className={styles.mainHeader}>
        {/* Desktop Header */}
        <div className={styles.headerContainer}>
          <div className={styles.headerTop}>
            <Link
              to="/"
              className={`${styles.brandLogo} ${styles.hideOnDesktop}`}
              onClick={closeMenu}
            >
              food<span className={styles.logoHighlight}>H</span>ub
            </Link>
            <button
              className={`${styles.menuToggle} ${
                isMenuOpen ? styles.menuOpen : ""
              }`}
              onClick={toggleMenu}
              aria-label="Toggle navigation"
              aria-expanded={isMenuOpen}
            >
              <span className={styles.toggleBar}></span>
              <span className={styles.toggleBar}></span>
              <span className={styles.toggleBar}></span>
            </button>
          </div>

          <nav
            className={`${styles.mainNav} ${
              isMenuOpen ? styles.navVisible : ""
            }`}
            aria-hidden={!isMenuOpen}
          >
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <Link
                  to="/"
                  className={`${styles.brandLogo} ${styles.hideOnMobile}`}
                  onClick={closeMenu}
                >
                  food<span className={styles.logoHighlight}>H</span>ub
                </Link>
              </li>

              {isAdmin && (
                <>
                  <li className={styles.navItem}>
                    <Link
                      to="/admin/products"
                      className={styles.navLink}
                      onClick={closeMenu}
                    >
                      My Products
                    </Link>
                  </li>
                  <li className={styles.navItem}>
                    <Link
                      to="/admin/addproduct"
                      className={styles.navLink}
                      onClick={closeMenu}
                    >
                      Add Product
                    </Link>
                  </li>
                  <li className={styles.navItem}>
                    <Link
                      to="/admin/neworder"
                      className={styles.navLink}
                      onClick={closeMenu}
                    >
                      New Order
                    </Link>
                  </li>
                </>
              )}
            </ul>

            <div className={styles.navActions}>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={handleSearch}
                  className={styles.searchField}
                  aria-label="Search products"
                />
              </div>

              <Link
                to={authCtx.isLoggedIn ? "/cart" : "/login"}
                className={styles.cartLink}
                onClick={closeMenu}
                aria-label="Shopping cart"
              >
                <ShoppingCartIcon className={styles.cartIcon} />
                {cartItemCount > 0 && (
                  <span className={styles.cartCounter}>{cartItemCount}</span>
                )}
              </Link>

              {authCtx.isLoggedIn ? (
                <div className={styles.userMenu}>
                  <button
                    className={styles.profileButton}
                    aria-label="User profile"
                    aria-expanded={display}
                    // onClick={() => setDisplay(!display)}
                  >
                    <Profile
                      logoutHandler={logoutHandler}
                      user={user}
                      setDisplay={setDisplay}
                    />
                  </button>

                  {display && (
                    <div className={styles.profileMenu} ref={profileRef}>
                      <MyProfile
                        user={user}
                        setDisplay={setDisplay}
                        display={display}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.authButton}>
                  <Link
                    to={localStorage.getItem("token") ? "" : "/login"}
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {isMobile && (
        <header className={styles.mobileHeader}>
          <div className={styles.mobileNavContainer}>
            <Link to="/" className={styles.mobileLogo}>
              food<span className={styles.logoHighlight}>H</span>ub
            </Link>

            {authCtx.isLoggedIn ? (
              <div className={styles.mobileProfile}>
                <Profile
                  logoutHandler={logoutHandler}
                  user={user}
                  setDisplay={setDisplay}
                />
              </div>
            ) : (
              <Link to="/login" className={styles.mobileLoginButton}>
                Login
              </Link>
            )}
          </div>
        </header>
      )}

      {/* Mobile Bottom Navigation */}
      <div
        className={`${styles.bottomNav} ${
          visible ? styles.visible : styles.hidden
        }`}
      >
        {showSearchBar ? (
          <div className={styles.searchBarContainer}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={handleSearch}
              className={styles.searchInput}
              aria-label="Search products"
            />
            <button
              className={styles.closeSearchButton}
              onClick={toggleSearchBar}
              aria-label="Close search"
            >
              <CloseIcon />
            </button>
          </div>
        ) : (
          navItems.map((item) => (
            <div
              key={item.id}
              className={styles.navItemWrapper}
              ref={item.id === "more" ? moreButtonRef : null}
            >
              <Link
                to={item.path}
                className={`${styles.navItems} ${
                  activeNav === item.id ? styles.active : ""
                }`}
                onClick={(e) => {
                  if (item.id === "search") {
                    e.preventDefault();
                    toggleSearchBar();
                  } else if (item.id === "more") {
                    e.preventDefault();
                    item.onClick();
                  } else {
                    setActiveNav(item.id);
                    closeMenu();
                  }
                }}
              >
                <div className={styles.navIcon}>
                  {item.id === "cart" && cartItemCount > 0 && (
                    <span className={styles.cartCounter}>{cartItemCount}</span>
                  )}
                  {item.icon}
                </div>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            </div>
          ))
        )}

        {/* More Menu Popup */}
        {showMoreMenu && isAdmin && (
          <ClickAwayListener
            onClickAway={(e) => {
              // Don't close if clicking on the more button itself
              if (
                moreButtonRef.current &&
                moreButtonRef.current.contains(e.target)
              ) {
                return;
              }
              handleClickAway();
            }}
          >
            <Paper
              className={styles.moreMenuPopup}
              elevation={4}
              style={{
                position: "fixed",
                bottom: moreButtonRef.current
                  ? `calc(${
                      window.innerHeight -
                      moreButtonRef.current.getBoundingClientRect().top
                    }px)`
                  : "70px",
                right: "10px",
              }}
            >
              <List>
                {adminMenuItems.map((menuItem) => (
                  <ListItem
                    key={menuItem.path}
                    button
                    component={Link}
                    to={menuItem.path}
                    onClick={() => {
                      setShowMoreMenu(false);
                      closeMenu();
                    }}
                    className={styles.moreMenuItem}
                  >
                    <ListItemText primary={menuItem.label} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </ClickAwayListener>
        )}
      </div>
    </>
  );
}
