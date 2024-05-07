import React, { useContext, useEffect, useReducer, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import styles from "./Cart.module.css";
import Button from "./Button";
import OrderNow from "./components/OrderNow";
import { Link } from "react-router-dom";
import Delete from "./components/Delete";
import Loader from "./components/Loader/Loader";

const cartReducer = (state, action) => {
  if (action.type === "setCart") {
    return {
      ...state,
      cartItems: action.payload,
      totalAmount: state.totalAmount,
    };
  } else if ((action.type = "calculateTotal")) {
    let calculateTotal = 0;
    for (let item of state.cartItems) {
      calculateTotal += item.productId.price * item.quantity;
    }
    return {
      ...state,
      cartItems: state.cartItems,
      totalAmount: calculateTotal,
    };
  } else if ((action.type = "updateCart")) {
    const existingProductId = state.cartItems.findIndex((item) => {
      return item.productId._id === action.payload.productId;
    });

    let updatedCart = [...state.cartItems];
    updatedCart[existingProductId].quantity += action.payload.quantity;
    return {
      ...state,
      cartItems: updatedCart,
      totalAmount: state.totalAmount,
    };
  }
  return state;
};

export default function Cart() {
  const authCtx = useContext(AuthContext);
  const [updatedCart, setUpdatedCart] = useState({});
  const [loader, setLoader] = useState(true);
  const [cartData, setCartData] = useState();
  const [cartState, dispatchCart] = useReducer(cartReducer, {
    cartItems: [],
    totalAmount: 0,
  });

  // for fetching the cart

  useEffect(() => {
    const getCart = async () => {
      const response = await axios.get("http://localhost:4000/getcartitem", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        },
      });
      console.log(response);
      if (response) {
        setLoader(false);
      }
      if (response) {
        setLoader(false);
      }
      // console.log(authCtx.refresh);
      setCartData(response.data);
    };

    getCart();
  }, [authCtx.refresh]);

  // FOR HANDLING THE CART

  useEffect(() => {
    if (cartData) {
      dispatchCart({ type: "setCart", payload: cartData.data });
      dispatchCart({ type: "calculateTotal" });
    }
  }, [cartData]);

  // FOR UPDATE CART

  useEffect(() => {
    if (cartData) {
      dispatchCart({
        type: "updateCart",
        payload: {
          productId: updatedCart.prodId,
          quantity: updatedCart.quantity,
        },
      });
      dispatchCart({ type: "calculateTotal" });
    }
  }, [cartData]);

  const updateCartItemHandler = async (prodId, changeQty) => {
    authCtx.refreshData();
    setUpdatedCart({ prodId, changeQty });
    const response = await axios.patch(
      `http://localhost:4000/updatecart/?productId=${prodId}&changeQty=${changeQty}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        },
      }
    );
  };

  const deleteCartItem = async (prodId) => {
    authCtx.refreshData();
    const response = await axios.delete(
      `http://localhost:4000/deletecartitem/?productId=${prodId}`,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        },
      }
    );
    console.log(response);
  };

  // setTotalItem(cartState.cartItems.length);

  // console.log(cartData);

  return (
    <>
      <div>
        <Navbar />
        {loader && <Loader />}
        {cartState.cartItems.length > 0 && (
          <section className={`${styles.mainContainer} h-100 gradient-custom`}>
            <div className={`${styles.container} container py-1`}>
              <div className="row d-flex justify-content-center my-4">
                <div className={`${styles.cardContainer} col-md-8`}>
                  <div className="card mb-4">
                    <div className="card-header py-3">
                      <h5 className={`${styles.totalCartItem} mb-0`}>
                        cart - {cartState.cartItems.length} items
                      </h5>
                    </div>
                    {cartState.cartItems.map((cartItem) => {
                      return (
                        <div className={`${styles.cardBody} card-body`}>
                          <hr className="mb-5" />
                          <div className={`${styles.singleCard} row`}>
                            <div className="col-lg-3 col-md-12 mb-4 mb-lg-0">
                              <Link
                                to={`/productdetails?productId=${cartItem.productId._id}`}>
                                <div
                                  className={`${styles.imageContainer} bg-image hover-overlay hover-zoom ripple rounded`}
                                  data-mdb-ripple-color="light">
                                  <img
                                    src={
                                      `${import.meta.env.VITE_ASSET_URL}` +
                                      `${cartItem.productId.imgURL}`
                                    }
                                    className={styles.image}
                                  />
                                </div>
                              </Link>
                            </div>

                            <div className="col-lg-5 col-md-6 mb-4 mb-lg-0">
                              <p>
                                <strong>{cartItem.productId.name}</strong>
                              </p>
                              <p className={styles.description}>
                                Description : {cartItem.productId.description}
                              </p>
                              <p>
                                <strong>
                                  Rs. {cartItem.productId.price} /item
                                </strong>
                              </p>

                              <Delete
                                className={styles.delANDbuyBtn}
                                onClick={() => {
                                  deleteCartItem(cartItem.productId._id);
                                }}
                              />
                              <OrderNow className={styles.delANDbuyBtn}>
                                Buy
                              </OrderNow>
                            </div>

                            <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                              <div
                                className="d-flex mb-4"
                                style={{ maxWwidth: "300px" }}>
                                <div className={styles.quantityBox}>
                                  <Button
                                    className={styles.child}
                                    onClick={() => {
                                      updateCartItemHandler(
                                        cartItem.productId._id,
                                        -1
                                      );
                                    }}>
                                    -
                                  </Button>
                                  <Button className={styles.quantity}>
                                    {cartItem.quantity}
                                  </Button>

                                  <Button
                                    className={styles.child}
                                    onClick={() => {
                                      updateCartItemHandler(
                                        cartItem.productId._id,
                                        1
                                      );
                                    }}>
                                    +
                                  </Button>
                                </div>
                              </div>

                              <p className="text-start text-md-center">
                                <strong>
                                  Total -{" "}
                                  {cartItem.productId.price * cartItem.quantity}
                                </strong>
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="card mb-4">
                    <div className="card-body">
                      <p>
                        <strong>Expected shipping delivery</strong>
                      </p>
                      <p className="mb-0">12.10.2020 - 14.10.2020</p>
                    </div>
                  </div>
                  <div className="card mb-4 mb-lg-0">
                    <div className="card-body">
                      <p>
                        <strong>We accept</strong>
                      </p>
                      <img
                        className="me-2"
                        width="45px"
                        src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/visa.svg"
                        alt="Visa"
                      />
                      <img
                        className="me-2"
                        width="45px"
                        src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/amex.svg"
                        alt="American Express"
                      />
                      <img
                        className="me-2"
                        width="45px"
                        src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/mastercard.svg"
                        alt="Mastercard"
                      />
                      <img
                        className="me-2"
                        width="45px"
                        src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce/includes/gateways/paypal/assets/images/paypal.webp"
                        alt="PayPal acceptance mark"
                      />
                    </div>
                  </div>
                </div>
                <div className={`${styles.allProductDetails} col-md-4`}>
                  <div className={`${styles.card} card mb-4`}>
                    <div className="card-header py-3">
                      <h5 className="mb-0">Summary</h5>
                    </div>
                    <div className={`${styles.cardBody} card-body`}>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                          Products ( {cartState.cartItems.length} )
                          <span>Rs. {cartState.totalAmount}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                          Shipping
                          <span>Free</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                          <div>
                            <strong>Total amount</strong>
                            <strong>
                              <p className="mb-0">(including VAT)</p>
                            </strong>
                          </div>
                          <span>
                            <strong>Rs. {cartState.totalAmount}</strong>
                          </span>
                        </li>
                      </ul>

                      <Link to={"/address"}>
                        <button
                          type="button"
                          className={`${styles.orderBtn} btn btn-lg btn-block`}>
                          Go to checkout
                        </button>
                      </Link>
                      {/* <OrderNow className={styles.orderBtn}>Buy</OrderNow> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* <div className={styles.mainContainer}>
          <div className={`${styles.itemContainer} ui unstackable items`}>
            {cartState.cartItems.map((cartItem) => {
              return (
                <div className={`${styles.item} item`}>
                  <div className="image">
                    <img src="https://cdn.siasat.com/wp-content/uploads/2022/07/noodles-july19.jpg" />
                  </div>
                  <div className={`${styles.itemDetails} content`}>
                    <div className={`${styles.name} name`}>
                      <span>{cartItem.productId.name}</span>
                    </div>
                    <div className={`${styles.description} description`}>
                      <span>{cartItem.productId.description}</span>
                    </div>

                    <div className="extra">Free Delivery</div>
                    <div className={`${styles.priceContainer} `}>
                      <div className="price">
                        {cartItem.productId.price * cartItem.quantity}
                      </div>
                      <div className={styles.quantityBox}>
                        <Button
                          className={styles.child}
                          onClick={() => {
                            updateCartItemHandler(cartItem.productId._id, -1);
                          }}>
                          -
                        </Button>
                        <Button className={styles.quantity}>
                          {cartItem.quantity}
                        </Button>

                        <Button
                          className={styles.child}
                          onClick={() => {
                            updateCartItemHandler(cartItem.productId._id, 1);
                          }}>
                          +
                        </Button>
                      </div>
                    </div>
                    <div>
                      <div className={styles.delANDbuyBtnParent}>
                        <Delete
                          className={styles.delANDbuyBtn}
                          onClick={() => {
                            deleteCartItem(cartItem.productId._id);
                          }}
                        />
                        <OrderNow className={styles.delANDbuyBtn}>Buy</OrderNow>
                      </div>
                      <p className="card-text">
                        <small className="text-muted"></small>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div> */}

        <Footer />
      </div>
    </>
  );
}
