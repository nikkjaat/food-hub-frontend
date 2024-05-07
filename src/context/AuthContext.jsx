import { jwtDecode } from "jwt-decode";
import { createContext, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";

const AuthContext = createContext({
  refresh: false,
  isLoggedIn: false,
  token: "",
  role: [],
  refreshData: () => {},
  loginHandler: () => {},
  logoutHandler: () => {},
  alertBoxText: "",
  alertBoxHandler: () => {},
});

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [alertBoxText, setAlertBoxText] = useState("");

  const refreshData = () => {
    setRefresh(!refresh);
  };

  const alertBoxHandler = (text) => {
    setAlertBoxText(text);
  };

  const loginHandler = (authToken) => {
    // console.log(authToken);
    localStorage.setItem("token", authToken);
    setIsLoggedIn(true);
  };

  const logoutHandler = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const token = useMemo(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
      return localStorage.getItem("token");
    }
  }, [isLoggedIn]);

  const role = useMemo(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
      const decodedToken = jwtDecode(localStorage.getItem("token"));
      // console.log(decodedToken.roles);
      return decodedToken.roles;
    }
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token,
        loginHandler,
        logoutHandler,
        refresh,
        refreshData,
        role,
        alertBoxText,
        alertBoxHandler,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
