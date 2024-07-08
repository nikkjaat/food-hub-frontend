import React, { useContext, useEffect, useState } from "react";
import styles from "./Card.module.css";
import Button from "./Button";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import AddToCart from "./components/AddToCart";
import OrderNow from "./components/OrderNow";

export default function Card(props) {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState(false);

  if (props.products == []) {
    setProducts(true);
  }

  useEffect(() => {
    const getPrice = () => {
      const price = props.admin
        ? props.products.productId.price
        : props.products.price;
      setPrice(price);
    };
    getPrice();
  }, []);

  const increment = (e) => {
    e.stopPropagation();
    setQuantity(quantity + 1);
  };

  const decrement = (e) => {
    e.stopPropagation();
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    props.onDelete(props.products.productId._id);
  };

  return (
    <Link
      to={`/productdetails?productId=${
        props.admin ? props.products.productId._id : props.products._id
      }`}
      className={`${styles.card} card mt-3 text-white border-white`}>
      <div className={styles.imageContainer}>
        <img
          src={
            `${import.meta.env.VITE_ASSET_URL}` +
            `${
              props.admin
                ? props.products.productId.imgURL
                : props.products.imgURL
            }`
          }
          className={`${styles.cardImage} card-img-top`}
          alt="..."
        />
      </div>
      <div className="card-body">
        <h5 className="card-title" id={styles.cardTitle}>
          {props.admin ? props.products.productId.name : props.products.name}
        </h5>
        <p className={`${styles.descriptionText} card-text`}>
          {props.admin
            ? props.products.productId.description
            : props.products.description}
        </p>
        <div className={`${styles.quantityBox} container`}>
          <div className={`${styles.quantityBoxParent} d-flex`}>
            <button onClick={decrement}>-</button>
            <input readOnly type="number" value={quantity} />
            <button onClick={increment}>+</button>
          </div>
          <div className="d-flex justify-content-center align-items-center fs-5">
            Rs. {price * quantity}
          </div>
        </div>
      </div>
      <div className="border-warning border-top"></div>
      {props.admin ? (
        <div className="container my-3 px-4 d-flex flex-wrap justify-content-between">
          <Link
            to={`/admin/addproduct?prodId=${props.products.productId._id}`}
            className={styles.updateandDeleteBtn}
            onClick={(e) => e.stopPropagation()}>
            Update
          </Link>
          <Link onClick={handleDelete} className={styles.updateandDeleteBtn}>
            Delete
          </Link>
        </div>
      ) : (
        <div className={`${styles.buttons} container my-3 px-4`}>
          <AddToCart
            className={styles.cartBtn}
            addToCart={props.products._id}
            onClick={(e) => e.stopPropagation()}
          />
          <OrderNow
            className={styles.cartBtn}
            onClick={(e) => e.stopPropagation()}>
            Order Now
          </OrderNow>
        </div>
      )}
    </Link>
  );
}
