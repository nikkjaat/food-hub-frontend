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
  const [quantity, setQuantity] = useState(1);
  const [data, setData] = useState();
  const [addressId, setAddressId] = useState("");
  const [address, setAddress] = useState();
  const [changeAddress, setChangeAddress] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setQuantity(parseInt(query.get("quantity")));
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
      console.log(response);
      if (response.status === 200) {
        setData(response.data);
      }
    };
    getProduct();
  }, []);

  console.log(addressId);

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
                <div className={styles.cardBody}>
                  <div className={styles.imageContainer}>
                    <img src={data && data.imgURL} alt="" />
                    <div className={styles.quantityContainer}>
                      <button
                        onClick={() => {
                          if (quantity > 1) {
                            setQuantity(quantity - 1);
                          }
                        }}
                      >
                        <RemoveIcon />
                      </button>
                      <input type="text" readOnly value={quantity} />
                      <button
                        onClick={() => {
                          if (quantity < 10) {
                            setQuantity(quantity + 1);
                          }
                        }}
                      >
                        <AddIcon />
                      </button>
                    </div>
                  </div>
                  <div className={styles.itemDetails}>
                    <h1>{data && data.name}</h1>
                    <p>{data && data.description}</p>
                    <h2>
                      <CurrencyRupeeIcon />
                      {data && data.price * quantity}
                    </h2>
                    <div className={styles.deliveryDetails}>
                      Delivery in 2 days |{" "}
                      <CurrencyRupeeIcon fontSize="small" />{" "}
                      {data && data.shippingCost}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.secondChildOfContainer1}>
                <div>
                  <h2>PRICE DETAILS</h2>
                  <hr />
                  <div>
                    <div>Price</div>
                    <div>
                      {" "}
                      <CurrencyRupeeIcon /> {data && data.price * quantity}
                    </div>
                  </div>
                  <div>
                    <div>Delivery Charges</div>
                    <div>
                      {" "}
                      <CurrencyRupeeIcon />
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
                        {data && data.price * quantity + data.shippingCost}
                      </strong>
                    </div>
                  </div>
                </div>
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
                  quantity={quantity}
                  addressId={addressId}
                  shippingCost={data && data.shippingCost}
                  amount={
                    data &&
                    data.price * quantity +
                      (quantity == 1 ? data.shippingCost : 0)
                  }
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
                    {data && data.price * quantity}
                  </div>
                </div>
                <div>
                  <div>Delivery Charges</div>
                  <div>
                    {" "}
                    <CurrencyRupeeIcon />{" "}
                    {data?.shippingCost > 0 && quantity == 1
                      ? data.shippingCost
                      : "Free"}
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
                      <CurrencyRupeeIcon />{" "}
                      {data &&
                        data.price * quantity +
                          (quantity == 1 ? data.shippingCost : 0)}
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
