import React from "react";
import { AppData } from "../Context/AppContext";

const Home = () => {
  const { logout } = AppData();
  return (
    <div>
      Home
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Home;
