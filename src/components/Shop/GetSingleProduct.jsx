import React, { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useLocation } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import styles from "./GetSingleProduct.module.css";
import Footer from "./Footer";
import AddToCart from "./components/AddToCart";
import OrderNow from "./components/OrderNow";

export default function GetSingleProduct() {
  const queryString = useLocation().search;
  const queryParams = new URLSearchParams(queryString);
  const productId = queryParams.get("productId");
  const authCtx = useContext(AuthContext);
  const [product, setProduct] = useState();

  useEffect(() => {
    const getProduct = async () => {
      const response = await axios.get(
        `http://localhost:4000/admin/getsingleproduct?productId=${productId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      setProduct(response.data);
    };
    getProduct();
  }, []);

  const clickedAddToCart = () => {
    const div = document.getElementsByClassName("hidden");
  };

  return (
    <div>
      <Navbar />
      <div className={`${styles.card} card`} style={{ width: "100%" }}>
        <div className={styles.imageContainer}>
          <img
            src={
              `${import.meta.env.VITE_ASSET_URL}` +
              `${product && product.imgURL}`
            }
            className="card-img-top"
            alt="..."
          />
        </div>
        <div className={styles.descriptionData}>
          <div className="card-body">
            <h2 className={`${styles.title} card-title`}>
              {product && product.name}
            </h2>
            <p className="card-text"></p>
          </div>
          <ul className={`${styles.ulList} bg-secondary list-group-flush`}>
            <li className="list-group-item">
              <div> Description :</div> {product && product.description}
            </li>
            <li className="list-group-item">
              <div> Price : </div>Rs. {product && product.price}
            </li>
            <li className="list-group-item">
              <div>Delivery Charges : </div> Free Delivery
            </li>
          </ul>
          <div
            className={`${styles.buttons} card-body`}
            style={{ width: "100%" }}>
            <AddToCart
              onClick={clickedAddToCart}
              className={styles.btn}
              addToCart={product && product._id}
            />
            <OrderNow className={styles.btn}>Order</OrderNow>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
