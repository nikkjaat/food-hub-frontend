import React, { useContext, useEffect, useState } from "react";
import HorizontalLinearStepper from "./components/HorizontalLinearStepper";
import Navbar from "./Navbar";
import styles from "./MyOrder.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import VerticalLinearStepper from "./components/Loader/VerticalLinearStepper";

export default function MyOrder() {
  const authCtx = useContext(AuthContext);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const order_id = searchParams.get("id");
  const [order, setOrder] = useState();
  const navigate = useNavigate();
  const [filterProduct, setFilterProduct] = useState(true);

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

  useEffect(() => {
    const handleResize = () => {
      setFilterProduct(window.innerWidth > 872.5);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          <div
            style={{ height: filterProduct ? "100%" : "4em" }}
            className={styles.filterBox}
          >
            <div className={styles.heading}>Filters</div>
            <hr />
            <div>
              <div className={styles.orderstatus}>
                <div>Order Status</div>
                <div>
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
                </div>
              </div>
              <hr />
              <div className={styles.orderTime}>
                {" "}
                <div>Order Time</div>
                <div>
                  {["Today", "Last Week", "Last Month"].map((time, index) => (
                    <div key={index}>
                      <input type="checkbox" id={time.toLowerCase()} />
                      <label htmlFor={time.toLowerCase()}>{time}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div
              onClick={() => {
                setFilterProduct(!filterProduct);
              }}
              className={styles.filterIcon}
            >
              <TuneIcon />
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
                  <>
                    <Card
                      className={styles.card}
                      sx={{
                        maxWidth: "100%",
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "transparent",
                        marginBottom: "10px",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      {/* Product Image - Takes only necessary space */}
                      <CardMedia
                        className={styles.imageContainer}
                        sx={{
                          height: "13em",
                          width: "13em",
                          borderRadius: "10px",
                          backgroundColor: "red",
                          padding: "10px",
                          flex: "0 0 auto", // Fixed width, does not shrink/grow
                        }}
                        image={order.productId.imgURL}
                        title={order.productId.name}
                      />

                      {/* Product Details - Takes all remaining space */}
                      <CardContent sx={{ flex: "1", minWidth: 0 }}>
                        <Typography
                          className={styles.name}
                          gutterBottom
                          variant="h5"
                        >
                          {order.productId.name}
                        </Typography>
                        <Typography
                          className={styles.description}
                          variant="body2"
                          sx={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2, // Limits to 2 lines
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {order.productId.description}
                        </Typography>
                        <Typography
                          className={styles.itemPrice}
                          variant="body2"
                          sx={{ fontSize: 25, mt: 1 }}
                        >
                          ₹{order.productId.price}
                        </Typography>
                        <Typography sx={{ fontSize: ".8em", mt: 0.5 }}>
                          Delivered
                        </Typography>
                        {/* <HorizontalLinearStepper /> */}
                      </CardContent>
                    </Card>
                  </>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
