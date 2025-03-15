import React, { useContext, useEffect, useState } from "react";
import styles from "./ConfirmOrder.module.css";
import { useLocation } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AuthContext from "../../context/AuthContext";
import CashfreePayment from "../../util/payment/CashfreePayment";
import MyAddress from "./MyAddress";

export default function ConfirmOrder() {
  const authCtx = useContext(AuthContext);
  const query = new URLSearchParams(useLocation().search);
  const productId = query.get("productId");
  const [qty, setQty] = useState(1);
  const [data, setData] = useState([]);
  const [addressId, setAddressId] = useState("");
  const [address, setAddress] = useState();
  const [changeAddress, setChangeAddress] = useState(false);
  const [loader, setLoader] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    setQty(parseInt(query.get("quantity")));
  }, []);

  const getSingleAddress = async (id) => {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_BACKEND_URL
      }/getsingleaddress?addressId=${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        },
      }
    );
    // console.log(response);
    if (response.status === 200) {
      setAddress(response.data.data);
      setAddressId(id);
    }
  };

  const getAddress = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BACKEND_URL}/getaddress`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        },
      }
    );
    // console.log(response);
    if (response.status === 200) {
      setAddressId(response.data.defaultAddress);
      getSingleAddress(response.data.defaultAddress);
    }
  };

  useEffect(() => {
    getAddress();
  }, []);

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
      // console.log(response);
      if (response.status === 200) {
        setData([response.data]);
      }
    };
    if (productId) {
      getProduct();
    }
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const total = data.reduce(
        (acc, product) =>
          acc + product.price * qty + (qty > 1 ? 0 : product.shippingCost),
        0
      );
      setTotalAmount(total);
    }
  }, [data, qty]);

  // console.log(data);
  // console.log(totalAmount);

  useEffect(() => {
    const getCart = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND_URL}/getcartitem`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      // console.log(response.data.data);

      if (response) {
        setLoader(false);
      }
      if (response) {
        setLoader(false);
      }
      // console.log(authCtx.refresh);
      setData(response.data.data);
    };

    if (!productId) {
      getCart();
    }
  }, [authCtx.refresh, qty]);

  useEffect(() => {
    if (data.length > 0 && !productId) {
      const total = data.reduce(
        (acc, item) => acc + item.productId.price * item.quantity,
        0
      );
      setTotalAmount(total);
    } else {
      const total = data.reduce(
        (acc, product) =>
          acc + product.price * qty + (qty > 1 ? 0 : product.shippingCost),
        0
      );
      setTotalAmount(total);
    }
  }, [data, qty]); // Dependencies ensure it updates when data or qty changes

  return (
    <>
      {/* <Navbar /> */}
      {changeAddress ? (
        <MyAddress
          id={addressId}
          setChangeAddress={setChangeAddress}
          getSingleAddress={getSingleAddress}
        />
      ) : (
        <>
          <div className={`${styles.container}`}>
            <div className={styles.firstChildOfContainer}>
              <div className={styles.deliveryAddressContainer}>
                <div>
                  <h2 className={styles.heading}>Delivery Address</h2>
                  {addressId ? (
                    <p className={styles.address}>
                      {address ? (
                        <>
                          <strong>{address.name}</strong> , {address.houseNo} ,
                          {address.street} , {address.city} , {address.state} ,{" "}
                          {address.country} , {address.pincode} ,
                          <strong>
                            {" "}
                            Ph.&nbsp;
                            {address.contactNo}
                          </strong>
                        </>
                      ) : (
                        // <Loader />
                        <div>No Address found</div>
                      )}
                    </p>
                  ) : (
                    "Choose Address"
                  )}
                </div>
                <div className={styles.changeButton}>
                  <button
                    onClick={() => {
                      setChangeAddress(true);
                    }}
                  >
                    {address ? "Change" : " Add"}
                  </button>
                </div>
              </div>
              <div className={styles.card}>
                <h2>ORDER SUMMARY</h2>
                {Array.isArray(data) ? (
                  data.map((item) => {
                    const { productId, quantity } = item; // Extract productId and qty

                    return (
                      <div className={styles.cardBody} key={item.id}>
                        <div className={styles.imageContainer}>
                          <img
                            src={productId ? productId.imgURL : item.imgURL}
                            alt={productId ? productId.name : item.name}
                          />
                          <div className={styles.quantityContainer}>
                            <button
                              onClick={() => {
                                if (qty && qty > 1) {
                                  setQty(qty - 1);
                                } else {
                                  setData((prevData) =>
                                    prevData.map((item) =>
                                      item.productId === productId &&
                                      item.quantity > 1
                                        ? {
                                            ...item,
                                            quantity: item.quantity - 1,
                                          }
                                        : item
                                    )
                                  );
                                }
                              }}
                              disabled={
                                qty === 1 ||
                                data.find(
                                  (item) => item.productId === productId
                                )?.quantity === 1
                              }
                            >
                              <RemoveIcon />
                            </button>

                            <input
                              type="text"
                              readOnly
                              value={qty ? qty : quantity}
                            />
                            <button
                              onClick={() => {
                                if (qty) {
                                  setQty(qty + 1);
                                } else {
                                  setData((prevData) =>
                                    prevData.map((item) =>
                                      item.productId === productId
                                        ? {
                                            ...item,
                                            quantity: (item.quantity || 1) + 1,
                                          }
                                        : item
                                    )
                                  );
                                }
                              }}
                            >
                              <AddIcon />
                            </button>
                          </div>
                        </div>
                        <div className={styles.itemDetails}>
                          <h1>{productId ? productId.name : item.name}</h1>
                          <p>
                            {productId
                              ? productId.description
                              : item.description}
                          </p>
                          <h2>
                            <CurrencyRupeeIcon />
                            {productId
                              ? productId.price * quantity
                              : item.price * qty}
                          </h2>
                          <div className={styles.deliveryDetails}>
                            Delivery in 2 days |{" "}
                            <CurrencyRupeeIcon fontSize="small" />{" "}
                            {productId
                              ? productId.shippingCost
                              : item.shippingCost}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div>No products found</div>
                )}
              </div>
              <div className={styles.secondChildOfContainer1}>
                {/* <div>
                  <h2>PRICE DETAILS</h2>
                  <hr />
                  <div>
                    <div>Price</div>
                    <div>
                      {" "}
                      <CurrencyRupeeIcon /> {data && data.price * qty}
                    </div>
                  </div>
                  <div>
                    <div>Delivery Charges</div>
                    <div>
                      {" "}
                      <CurrencyRupeeIcon />
                      {}
                      {data && data.shippingCost}
                    </div>
                  </div>
                  <hr />
                  <div>
                    <div>
                      <strong>Total Payable</strong>
                    </div>
                    <div>
                      <strong>
                        {" "}
                        <CurrencyRupeeIcon />{" "}
                        {data && data.price * qty + data.shippingCost}
                      </strong>
                    </div>
                  </div>
                </div> */}
              </div>
              <div className={styles.confirmOrderContainer}>
                <div>
                  Order confirmation email will be sent to
                  nikhiljaat327@gmail.com
                </div>
                <CashfreePayment
                  onClick={() => {
                    setLoader(true);
                  }}
                  productId={productId}
                  qty={qty}
                  addressId={addressId}
                  shippingCost={data && data.shippingCost}
                  amount={totalAmount}
                >
                  Continue
                </CashfreePayment>
              </div>
            </div>
            <div className={styles.secondChildOfContainer2}>
              <div>
                <h2>PRICE DETAILS</h2>
                <hr />
                <div>
                  <div>Price</div>
                  <div>
                    {" "}
                    <CurrencyRupeeIcon />
                    {productId
                      ? data?.map((data) => {
                          return data.price * qty;
                        })
                      : data?.reduce((amount, item) => {
                          return amount + item.productId.price * item.quantity;
                        }, 0)}
                  </div>
                </div>
                <div>
                  <div>Delivery Charges</div>
                  <div>
                    {" "}
                    <CurrencyRupeeIcon />{" "}
                    {productId
                      ? data?.map((item) => {
                          return qty > 1 ? 0 : item.shippingCost;
                        })
                      : data?.reduce((amount, item) => {
                          return (
                            (item.quantity > 1
                              ? ""
                              : item.productId.shippingCost) + amount
                          );
                        }, 0)}
                    {/* <del> 40 </del>&nbsp; Free */}
                  </div>
                </div>
                <hr />
                <div>
                  <div>
                    <strong>Total Payable</strong>
                  </div>
                  <div>
                    <strong>
                      {" "}
                      <CurrencyRupeeIcon />
                      {totalAmount +
                        (Array.isArray(data) && data?.length > 1
                          ? 0
                          : data?.length === 1 && data[0].quantity == 1
                          ? data[0]?.productId?.shippingCost ?? 0
                          : 0)}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
