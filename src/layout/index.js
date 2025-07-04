import Navbar from "@/components/navbar/Navbar";
import { useRouter } from "next/router";
import React from "react";

const Layout = ({ children }) => {
  const router = useRouter();
  const noNavbar = router.pathname.match(/^\/$/);

  return (
    <div>
      {!noNavbar && <Navbar/>}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
