import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    loggedIn: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3333/login", { withCredentials: true })
      .then((response) => {
        if (response.data.loggedIn) {
          setAuth({
            loggedIn: true,
            user: response.data.user[0],
            loading: false,
          });
        } else {
          setAuth({ loggedIn: false, user: null, loading: false });
        }
      })
      .catch((error) => {
        console.error("Error fetching login status:", error);
        setAuth({ loggedIn: false, user: null, loading: false });
      });
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
