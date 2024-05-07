import React, { useContext, useEffect, useState } from "react";
import styles from "./MyAddress.module.css";
import Navbar from "./Navbar";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import NewAddress from "./NewAddress";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapLocation,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import Delete from "./components/Delete";
import EditButton from "./components/EditButton";
import Button from "./Button";
import Footer from "./Footer";

export default function MyAddress() {
  const navigate = useNavigate();
  const [addressId, setAddressId] = useState();
  const [address, setAddress] = useState([]);
  const authCtx = useContext(AuthContext);
  useEffect(() => {
    const getAddress = async () => {
      const response = await axios.get("http://localhost:4000/getaddress", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        },
      });
      console.log(response);
      setAddress(response.data.data);
    };
    getAddress();
  }, [authCtx.refresh]);

  const deleteAddress = async (prodId) => {
    const response = await axios.delete(
      `http://localhost:4000/deleteaddress?prodId=${prodId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        },
      }
    );
    console.log(response);
    authCtx.refreshData();
  };

  const editAddress = (addressId) => {
    navigate(`/addaddress?addressId=${addressId}`);
  };

  const inputHandler = (e) => {
    setAddressId(e.target.value);
  };

  const submitAddress = () => {};

  return (
    <>
      <Navbar />

      <div className={`${styles.container} field container`}>
        <Link to={"/addaddress"}>
          <div
            className={`${styles.addNewAdd} ui vertical animated button`}
            tabindex="0">
            <div class="hidden content">
              <i class="plus icon"></i>
              <FontAwesomeIcon icon={faMapLocation} />
            </div>
            <div class="visible content">Add New Address</div>
          </div>
        </Link>
        {address.length > 0 ? (
          <div>
            {address.map((add) => {
              return (
                <div className={styles.addContainer}>
                  <div
                    className={`${styles.address} btn-group`}
                    role="group"
                    aria-label="Basic radio toggle button">
                    <input
                      type="radio"
                      class="btn-radio"
                      id={add._id}
                      name="same"
                      onChange={inputHandler}
                      value={add._id}
                    />
                    <label class={`${styles.addressPrint} btn`} for={add._id}>
                      <div>
                        <span style={{ color: "var(---secMainColor)" }}>
                          {add.name}
                        </span>{" "}
                        , {add.houseNo} , {add.street} , {add.city} ,{" "}
                        {add.pincode} , {add.state} , {add.country} ,{" "}
                        <span style={{ color: "var(---secMainColor)" }}>
                          {add.contactNo}
                        </span>
                      </div>
                      <div>
                        <div className={styles.editDelBtn}>
                          <Delete
                            onClick={() => {
                              deleteAddress(add._id);
                            }}
                            className={styles.btn}
                          />
                          <EditButton
                            onClick={() => {
                              editAddress(add._id);
                            }}
                            className={styles.btn}
                          />
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              background: "white",
              padding: "1rem",
              fontSize: "1.4rem",
              color: "black",
              borderRadius: ".7rem",
              fontWeight: "bold",
            }}>
            No Address Found
          </div>
        )}
        <Link to={`/payment/?addressId=${addressId}`}>
          <Button onClick={submitAddress} className={styles.payBtn}>
            Proceed to Pay
          </Button>
        </Link>
      </div>

      <Footer />
    </>
  );
}
