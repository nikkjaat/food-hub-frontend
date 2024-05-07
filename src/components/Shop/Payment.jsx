import React, { useContext, useEffect, useState } from "react";
import styles from "./MyAddress.module.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link, useLocation } from "react-router-dom";
import { faGooglePay } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import style from "./Payment.module.css";
import { faMapLocation } from "@fortawesome/free-solid-svg-icons";

export default function Payment() {
  const [address, setAddress] = useState();
  const authCtx = useContext(AuthContext);
  const queryString = useLocation().search;
  const queryParams = new URLSearchParams(queryString);
  const addId = queryParams.get("addressId");

  useEffect(() => {
    if (queryString) {
      const getAddress = async () => {
        const response = await axios.get(
          `http://localhost:4000/getsingleaddress/?addressId=${addId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + authCtx.token,
            },
          }
        );

        setAddress(response.data.data);
      };
      getAddress();
    }
  }, []);
  console.log(address);

  return (
    <>
      <Navbar />
      <div className={`${style.container} field container`}>
        <Link to={"/address"}>
          <div className={`${style.addNewAdd} ui button`} tabindex="0">
            {address && (
              <div class="visible content">
                <span>
                  <FontAwesomeIcon
                    className={style.locationIcon}
                    icon={faMapLocation}
                  />
                </span>
                <span>
                  {address.name} , {address.houseNo} , {address.street},{" "}
                  {address.city} ,{address.state} , {address.city} ,{" "}
                  {address.pincode} , {address.state} , {address.country}
                </span>
              </div>
            )}
          </div>
        </Link>

        <div>
          <div className={styles.addContainer}>
            <div
              className={`${styles.address} btn-group`}
              role="group"
              aria-label="Basic radio toggle button">
              <input type="radio" class="btn-radio" id="paytm" name="same" />
              <label class={`${styles.addressPrint} btn`} for="paytm">
                Paytm
              </label>
            </div>
          </div>
          <div className={styles.addContainer}>
            <div
              className={`${styles.address} btn-group`}
              role="group"
              aria-label="Basic radio toggle button">
              <input type="radio" class="btn-radio" id="pp" name="same" />
              <label class={`${styles.addressPrint} btn`} for="pp">
                PhonePe
              </label>
            </div>
          </div>
          <div className={styles.addContainer}>
            <div
              className={`${styles.address} btn-group`}
              role="group"
              aria-label="Basic radio toggle button">
              <input type="radio" class="btn-radio" id="gpay" name="same" />
              <label class={`${styles.addressPrint} btn`} for="gpay">
                {/* <FontAwesomeIcon
                  style={{
                    color: "red",
                    background: "black",
                    width: "3rem",
                    height: "2rem",
                  }}
                  icon={faGooglePay}
                /> */}
                Google Pay
              </label>
            </div>
          </div>
          <div className={styles.addContainer}>
            <div
              className={`${styles.address} btn-group`}
              role="group"
              aria-label="Basic radio toggle button">
              <input type="radio" class="btn-radio" id="cc" name="same" />
              <label class={`${styles.addressPrint} btn`} for="cc">
                Credit Card
              </label>
            </div>
          </div>
          <div className={styles.addContainer}>
            <div
              className={`${styles.address} btn-group`}
              role="group"
              aria-label="Basic radio toggle button">
              <input type="radio" class="btn-radio" id="cod" name="same" />
              <label class={`${styles.addressPrint} btn`} for="cod">
                Cash on Delivery
              </label>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
