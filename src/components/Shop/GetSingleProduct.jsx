import React, { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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

  const addToCart = async (prodId) => {
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
    <>
      <div className={styles.container}>
        <div className={`${styles.itemDetails} card`}>
          <div className={styles.descriptionData}>
            <div className={styles.imageContainer}>
              <img
                src={product && product.imgURL}
                className="card-img-top"
                alt={product && product.name}
                title={product && product.name}
              />
            </div>
            <div>
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
                <button
                  onClick={() => {
                    addToCart(product && product._id);
                  }}
                  className={styles.btn}
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    navigate(
                      `/confirmorder?productId=${
                        product && product._id
                      }&quantity=${quantity}`
                    );
                  }}
                  className={styles.btn}
                >
                  Order
                </button>
              </div>
            </div>{" "}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
