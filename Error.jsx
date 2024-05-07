import React from "react";
import Navbar from "./src/components/Shop/Navbar";

export default function Error() {
  return (
    <>
      <Navbar />
      <div style={{ color: "white", margin: "1rem" }}>
        <h1>Page not Found</h1>
      </div>
    </>
  );
}
