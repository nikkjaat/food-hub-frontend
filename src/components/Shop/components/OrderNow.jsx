import React from "react";
import Button from "../Button";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBasketShopping } from "@fortawesome/free-solid-svg-icons";

export default function OrderNow(props) {
  return (
    <>
      <Link to={"/address"}>
        {/* <Button className={props.className}>{props.children}</Button> */}
        <div
          className={`${props.className} ui vertical animated button`}
          tabindex="0">
          <div class="hidden content">Order Now</div>
          <div class="visible content">
            <FontAwesomeIcon icon={faBasketShopping} style={{ color: "red" }} />
          </div>
        </div>
      </Link>
    </>
  );
}
