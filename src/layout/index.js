import Navbar from "@/components/navbar/Navbar";
import React from "react";

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar/>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
