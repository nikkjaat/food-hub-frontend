import React, { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useLocation } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import styles from "./GetSingleProduct.module.css";
import Footer from "./Footer";
import AddToCart from "./components/AddToCart";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import OrderNow from "./components/OrderNow";

export default function GetSingleProduct() {
  const queryString = useLocation().search;
  const queryParams = new URLSearchParams(queryString);
  const productId = queryParams.get("productId");
  const authCtx = useContext(AuthContext);
  const [product, setProduct] = useState();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const getProduct = async () => {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BACKEND_URL
        }/admin/getsingleproduct?productId=${productId}`,
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
    <div className={styles.container}>
      {/* <Navbar /> */}
      <div className={`${styles.itemDetails} card`}>
        <div className={styles.imageContainer}>
          <img
            src={product && product.imgURL}
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
              <div> Price : </div>
              <div>
                <CurrencyRupeeIcon />

                {product && product.price * quantity}
                <div className={`${styles.quantityBox}`}>
                  <div className={`${styles.quantityBoxParent}`}>
                    <button
                      onClick={() => {
                        quantity > 1 && setQuantity(quantity - 1);
                      }}
                    >
                      -
                    </button>
                    <input readOnly type="number" value={quantity} />
                    <button
                      onClick={() => {
                        quantity < 10 && setQuantity(quantity + 1);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </li>
            <li className="list-group-item">
              <div>Delivery Charges :</div>{" "}
              {product &&
                (product.shippingCost > 0 ? (
                  <span>
                    <CurrencyRupeeIcon /> {product.shippingCost}
                  </span>
                ) : (
                  "Free Delivery"
                ))}
            </li>
          </ul>
          <div
            className={`${styles.buttons} card-body`}
            style={{ width: "100%" }}
          >
            <AddToCart
              onClick={clickedAddToCart}
              className={styles.btn}
              addToCart={product && product._id}
            />
            <OrderNow
              quantity={quantity}
              orderNow={product && product._id}
              className={styles.btn}
            >
              Order Now
            </OrderNow>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
