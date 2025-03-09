import React, { useContext, useState } from "react";
import axios from "axios";
import AuthContext from "../../../context/AuthContext";

export default function AddToCart(props) {
  const [cartText, setCartText] = useState("Add To Cart");
  const authCtx = useContext(AuthContext);

  const addToCart = async (prodId, e) => {
    e.stopPropagation(); // Stop the click event from propagating
    setCartText("Added");

    const response = await axios.post(
      `${import.meta.env.VITE_API_BACKEND_URL}/addtocart/${prodId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        },
      }
    );

    if (response.status === 200) {
      authCtx.refreshData();
    }
  };

  return (
    <div
      style={{ height: "2.8em" }}
      className={`${props.className} ui vertical animated button`}
      onClick={(e) => addToCart(props.addToCart, e)} // Make sure to pass `e` here
      tabIndex="0">
      <div className="hidden content">{cartText}</div>
      <div className="visible content">
        <i className="shop icon"></i>
      </div>
    </div>
  );
}
