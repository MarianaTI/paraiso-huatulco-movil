import Navbar from "@/components/navbar/Navbar";
import { useRouter } from "next/router";
import React from "react";

const Layout = ({ children }) => {
  const router = useRouter();
  const noNavbar = router.pathname.match(/^\/$/);

  return (
    <div>
      {!noNavbar && <Navbar/>}
      <div style={{backgroundColor: "#f8f8f8", minHeight: "calc(100vh - 72.75px)"}}>{children}</div>
    </div>
  );
};

export default Layout;
