import Link from "next/link";
import React from "react";

const Layout = ({ children }) => {
  return (
    <div>
      <nav
        style={{ padding: "1rem", background: "#f2f2f2", marginBottom: "1rem" }}
      >
        <Link href="/" style={{ marginRight: "1rem" }}>
          Home
        </Link>
        <Link href="/products">Products</Link>
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
