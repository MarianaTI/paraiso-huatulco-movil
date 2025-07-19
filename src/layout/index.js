import Navbar from "@/components/navbar/Navbar";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Layout = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const noNavbar = router.pathname.match(/^\/$/);

  useEffect(() => {
    const publicRoutes = ["/"];
    const isPublic = publicRoutes.includes(router.pathname);

    const userCookie = Cookies.get("user_session");

    if (!userCookie && !isPublic) {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [router.pathname]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {!noNavbar && <Navbar />}
      <div
        style={{
          backgroundColor: "#f8f8f8",
          minHeight: "calc(100vh - 82px)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
