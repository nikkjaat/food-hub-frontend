import React, { useContext, useEffect, useState } from "react";
import styles from "./MyAddress.module.css";
import Navbar from "./Navbar";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import NewAddress from "./NewAddress";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapLocation,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import Delete from "./components/Delete";
import EditButton from "./components/EditButton";
import Footer from "./Footer";
import styled from "styled-components";

export default function MyAddress({ setChangeAddress, getSingleAddress, id }) {
  const query = new URLSearchParams(useLocation().search);
  const productId = query.get("productId");
  const quantity = query.get("quantity");

  const navigate = useNavigate();
  const [addressId, setAddressId] = useState();
  const [address, setAddress] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState("");

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
    // console.log(response.data);
    setAddress(response.data.data.myAddress);
    setDefaultAddress(response.data.defaultAddress);
    setAddressId(response.data.defaultAddress);
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
    // authCtx.refreshData();
  };

  const editAddress = (addressId) => {
    navigate(`/addaddress?addressId=${addressId}`);
  };

  const makeDefaultAddress = async (addressId) => {
    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_API_BACKEND_URL
        }/setdefaultaddress?addressId=${addressId}&userId=${authCtx.userId}`
      );
      if (res.status === 200) {
        console.log();
        getAddress();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeAddress = () => {
    if (setChangeAddress) {
      setChangeAddress(false);
      getSingleAddress(addressId);
    } else {
      console.error("setChangeAddress is not defined");
    }
  };

  return (
    <>
      {/* <Navbar /> */}

      <div className={`${styles.container} field container`}>
        <Link to={"/addaddress"}>
          <div
            className={`${styles.addNewAdd} ui vertical animated button`}
            tabindex="0"
          >
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
              // console.log(add)
              return (
                <div
                  onClick={() => {
                    setAddressId(add.addressId._id);
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
                      class="btn-radio"
                      id={add._id}
                      name="same"
                      checked={
                        add.addressId._id === id || // Change this line
                        addressId === add.addressId._id
                      }
                    />
                    <label
                      className={`${styles.addressPrint} btn`}
                      for={add._id}
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
                            onClick={() => {
                              deleteAddress(add.addressId._id);
                            }}
                            className={styles.btn}
                          />
                          <EditButton
                            onClick={() => {
                              editAddress(add.addressId._id);
                            }}
                            className={styles.btn}
                          />
                        </div>
                        <ButtonStyle
                          onClick={() => {
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
        {/* <Link
          to={`/payment/?addressId=${addressId}&productId=${productId}&quantity=${quantity}`}>
          <Button onClick={submitAddress} className={styles.payBtn}>
            Proceed to Pay
          </Button>
        </Link> */}
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
