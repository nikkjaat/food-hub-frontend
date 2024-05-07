import React from "react";
import AdminNavbar from "./AdminNavbar";

export default function WelcomePage() {
  return (
    <div>
      <AdminNavbar />
      <div style={{ height: "30rem" }} className="container">
        <h1
          style={{
            width: "100%",
            // backgroundColor: "yellow",
            // height: "100%",
            display: "inline-block",
            margin: "10rem auto",
            textAlign: "center",
          }}>
          Welcome to Admin Page
        </h1>
      </div>
    </div>
  );
}
