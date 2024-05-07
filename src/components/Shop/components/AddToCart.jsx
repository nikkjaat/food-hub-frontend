import React, { useContext, useState } from "react";
import styles from "./AddToCart.module.css";
import Button from "../Button";
import axios from "axios";
import AuthContext from "../../../context/AuthContext";

export default function AddToCart(props) {
  const [cartText, setCartText] = useState("Add To Cart");
  const authCtx = useContext(AuthContext);

  const addToCart = async (prodId, e) => {
    setCartText("Added");
    // console.log(e);
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

    console.log(response);

    if (response.status == 200) {
      authCtx.alertBoxHandler(response.data.message);
      authCtx.refreshData();
    }

    authCtx.refreshData();
  };

  return (
    <>
      {/* <Button
        className={props.className}
        onClick={() => {
          addToCart(props.addToCart);
        }}>
        {props.children}
      </Button> */}
      <div
        className={`${props.className} ui vertical animated button`}
        onClick={(e) => {
          addToCart(props.addToCart, e.target);
        }}
        tabindex="0">
        <div class="hidden content">{cartText}</div>
        <div class="visible content">
          <i class="shop icon"></i>
        </div>
      </div>
    </>
  );
}
