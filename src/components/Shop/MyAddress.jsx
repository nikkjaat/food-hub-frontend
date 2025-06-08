import React, { useContext, useEffect, useState } from "react";
import styles from "./MyAddress.module.css";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapLocation,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import Delete from "./components/Delete";
import EditButton from "./components/EditButton";
import Footer from "./Footer";
import styled from "styled-components";

export default function MyAddress({ id, setChangeAddress, getSingleAddress }) {
  const query = new URLSearchParams(useLocation().search);
  const productId = query.get("productId");
  const quantity = query.get("quantity");

  const [addressId, setAddressId] = useState(id);
  const [address, setAddress] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(id);

  const authCtx = useContext(AuthContext);

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
    setAddress(response.data.data.myAddress);
    setDefaultAddress(response.data.defaultAddress);
    if (!addressId) {
      setAddressId(response.data.defaultAddress);
      setSelectedAddress(response.data.defaultAddress);
    }
  };

  useEffect(() => {
    getAddress();
  }, [authCtx.refresh]);

  const deleteAddress = async (prodId) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_BACKEND_URL}/deleteaddress?prodId=${prodId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        },
      }
    );
    if (response.status === 200) {
      getAddress();
    }
  };

  const editAddress = (addressId) => {
    window.location.href = `/addaddress?addressId=${addressId}`;
  };

  const makeDefaultAddress = async (addressId) => {
    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_API_BACKEND_URL
        }/setdefaultaddress?addressId=${addressId}&userId=${authCtx.userId}`
      );
      if (res.status === 200) {
        getAddress();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeAddress = () => {
    if (typeof setChangeAddress === 'function') {
      setChangeAddress(false);
    }
    if (typeof getSingleAddress === 'function' && selectedAddress) {
      getSingleAddress(selectedAddress);
    }
  };

  return (
    <>
      <div className={`${styles.container} field container`}>
        <Link to="/addaddress" state={{ fromConfirmOrder: true }}>
          <div
            className={`${styles.addNewAdd} ui vertical animated button`}
            tabIndex="0"
          >
            <div className="hidden content">
              <i className="plus icon"></i>
              <FontAwesomeIcon icon={faMapLocation} />
            </div>
            <div className="visible content">Add New Address</div>
          </div>
        </Link>
        {address.length > 0 ? (
          <div>
            {address.map((add) => {
              return (
                <div
                  key={add._id}
                  onClick={() => {
                    setSelectedAddress(add.addressId._id);
                  }}
                  className={styles.addContainer}
                >
                  <div
                    className={`${styles.address} btn-group`}
                    role="group"
                    aria-label="Basic radio toggle button"
                  >
                    <input
                      type="radio"
                      className="btn-radio"
                      id={add._id}
                      name="same"
                      checked={
                        add.addressId._id === selectedAddress
                      }
                      onChange={() => {}}
                    />
                    <label
                      className={`${styles.addressPrint} btn`}
                      htmlFor={add._id}
                    >
                      <div>
                        <span style={{ color: "var(---secMainColor)" }}>
                          {add.addressId.name}
                        </span>{" "}
                        , {add.addressId.houseNo} , {add.addressId.street} ,{" "}
                        {add.addressId.city} , {add.addressId.pincode} ,{" "}
                        {add.addressId.state} , {add.addressId.country} ,{" "}
                        <span style={{ color: "var(---secMainColor)" }}>
                          {add.addressId.contactNo}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "1em",
                          alignItems: "center",
                          flexDirection: "row",
                          flexWrap: "wrap",
                        }}
                      >
                        <div className={styles.editDelBtn}>
                          <Delete
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteAddress(add.addressId._id);
                            }}
                            className={styles.btn}
                          />
                          <EditButton
                            onClick={(e) => {
                              e.stopPropagation();
                              editAddress(add.addressId._id);
                            }}
                            className={styles.btn}
                          />
                        </div>
                        <ButtonStyle
                          onClick={(e) => {
                            e.stopPropagation();
                            makeDefaultAddress(add.addressId._id);
                          }}
                        >
                          {defaultAddress === add.addressId._id ? (
                            <span
                              style={{
                                background: "var(---secMainColor)",
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "white",
                                borderRadius: ".2em",
                              }}
                            >
                              Default
                            </span>
                          ) : (
                            "Make Default"
                          )}
                        </ButtonStyle>
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
            }}
          >
            No Address Found
          </div>
        )}
        <SaveButton onClick={changeAddress}>Save</SaveButton>
      </div>
      <Footer />
    </>
  );
}

const SaveButton = styled.button`
  background-color: #3498db;
  width: 100%;
  border: none;
  height: 2em;
  font-size: 1.3em;
  font-weight: bold;
  border-radius: 0.2em;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;

const ButtonStyle = styled.button`
  background-color: #3498db;
  width: 8em;
  border: none;
  height: 2em;
  font-size: 0.7em;
  font-weight: bold;
  border-radius: 0.2em;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;