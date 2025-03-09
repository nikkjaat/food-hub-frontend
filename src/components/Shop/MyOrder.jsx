import React, { useContext, useEffect, useState } from "react";
import VerticalLinearStepper from "./components/VerticalLinearStepper";
import Navbar from "./Navbar";
import styles from "./MyOrder.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import axios from "axios";

export default function MyOrder() {
  const authCtx = useContext(AuthContext);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const order_id = searchParams.get("id");
  const [order, setOrder] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const session = async () => {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BACKEND_URL
        }/payment/session?order_id=${order_id}`,
        {
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        // navigate("/");
        getMyOrder();
      }
    };
    if (order_id) {
      session();
    }
  }, [order_id]);

  const getMyOrder = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BACKEND_URL}/myorder`,
        {
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log(res.data.data);
      setOrder(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMyOrder();
  }, []);

  const getProductDetails = async (id) => {
    // try {
    //   const response = await axios.get(
    //     `${
    //       import.meta.env.VITE_API_BACKEND_URL
    //     }/admin/getsingleproduct?productId=${id}`,
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: "Bearer " + authCtx.token,
    //       },
    //     }
    //   );
    //   console.log(response);
    // } catch (error) {
    //   console.error(error);
    // }
    navigate("/productdetails?productId=" + id);
  };

  return (
    <>
      {/* <Navbar /> */}
      <div>
        <div className={styles.container}>
          <div className={styles.filterBox}>
            <div className={styles.heading}>Filters</div>
            <hr />
            <div>
              <div className={styles.orderstatus}>
                <div>Order Status</div>
                <div>
                  <input type="checkbox" name="ontheway" id="ontheway" />
                  <label htmlFor="ontheway">On the way</label>
                </div>
                <div>
                  <input type="checkbox" name="delivered" id="delivered" />
                  <label htmlFor="delivered">Delivered</label>
                </div>
                <div>
                  <input type="checkbox" name="cancelled" id="cancelled" />
                  <label htmlFor="cancelled">Cancelled</label>
                </div>
                <div>
                  <input type="checkbox" name="returned" id="returned" />
                  <label htmlFor="returned">Returned</label>
                </div>
              </div>
              <hr />
              <div className={styles.orderTime}>
                {" "}
                <div>Order Time</div>
                {["Today", "Last Week", "Last Month"].map((time, index) => (
                  <div key={index}>
                    <input type="checkbox" id={time.toLowerCase()} />
                    <label htmlFor={time.toLowerCase()}>{time}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.orderListContainer}>
            <div className={styles.searchBar}>
              <input
                type="search"
                className="search"
                placeholder="Search your order here"
              />
            </div>
            {order &&
              order.map((order) => {
                return (
                  <div
                    className={styles.card}
                    onClick={() => {
                      getProductDetails(order.productId._id);
                    }}
                  >
                    <div className={styles.imageContainer}>
                      <img
                        src={
                          order.productId.imgURL ||
                          "https://via.placeholder.com/150"
                        }
                        alt=""
                      />
                      <div className={styles.orderDetails}>
                        <div className={styles.name}>
                          {order.productId.name}
                        </div>
                        <div className={styles.description}>
                          {order.productId.description}
                        </div>
                        <div className={styles.itemPrice}>
                          ₹{order.productId.price}
                        </div>
                      </div>
                    </div>
                    <div className={styles.date}>Delivered on 15</div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
