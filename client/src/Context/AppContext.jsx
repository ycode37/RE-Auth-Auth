import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";
import { server } from "../main";
import api from "../apiInterceptor";
import { toast } from "react-toastify";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  async function fetchUser() {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/v1/profile`, {
        withCredentials: true, // Include cookies in the request
      });
      setUser(data);
      setIsAuth(true);
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      const { data } = await api.post("/api/v1/logout", {
        withCredentials: true,
      });
      toast.success(data.message);
      setUser(null);
      setIsAuth(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <AppContext.Provider
      value={{
        setUser,
        setIsAuth,
        setLoading,
        loading,
        isAuth,
        user,
        fetchUser,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const AppData = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppData must be used within an AppProvider");
  }
  return context;
};
