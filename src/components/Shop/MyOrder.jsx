import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import styles from "./MyOrder.module.css";
import AuthContext from "../../context/AuthContext";
import socket from "../../../SocketIO.js/Socketio";

export default function MyOrder() {
  const authCtx = useContext(AuthContext);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const order_id = searchParams.get("id");
  const navigate = useNavigate();

  const [order, setOrder] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProduct, setFilterProduct] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState(order);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

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
      if (response.status === 200) {
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
    getMyOrder(); // Initial call
  }, []);

  const getProductDetails = (id) => {
    navigate("/productdetails?productId=" + id);
  };

  useEffect(() => {
    setFilteredOrders(
      order.filter((o) =>
        o.productId.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, order]);

  // Function to filter by order status
  const filterByStatus = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // console.log(order);

  useEffect(() => {
    console.log("📡 Listening for order status updates...");

    socket.on("orderStatusUpdated", ({ orderId, status }) => {
      console.log(`🔄 Order ${orderId} updated to ${status}`);

      setOrder((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId._id === orderId
            ? { ...order, orderId: { ...order.orderId, orderStatus: status } }
            : order
        )
      );
    });

    return () => {
      socket.off("orderStatusUpdated");
    };
  }, []);

  // Apply filtering when order status changes
  useEffect(() => {
    if (selectedStatuses.length === 0) {
      setFilteredOrders(order);
    } else {
      setFilteredOrders(
        order.filter((o) =>
          selectedStatuses.includes(o.orderId.orderStatus.toLowerCase())
        )
      );
    }
  }, [selectedStatuses, order]);

  return (
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
                  <input
                    onClick={(e) => {
                      filterByStatus("preparing");
                    }}
                    type="checkbox"
                    name="preparing"
                    id="preparing"
                  />
                  <label htmlFor="preparing">Preparing</label>
                </div>
                <div>
                  <input
                    onClick={(e) => {
                      filterByStatus("on the way");
                    }}
                    type="checkbox"
                    name="ontheway"
                    id="ontheway"
                  />
                  <label htmlFor="ontheway">On the way</label>
                </div>
                <div>
                  <input
                    onClick={(e) => {
                      filterByStatus("delivered");
                    }}
                    type="checkbox"
                    name="delivered"
                    id="delivered"
                  />
                  <label htmlFor="delivered">Delivered</label>
                </div>
                <div>
                  <input
                    onClick={(e) => {
                      filterByStatus("cancelled");
                    }}
                    type="checkbox"
                    name="cancelled"
                    id="cancelled"
                  />
                  <label htmlFor="cancelled">Cancelled</label>
                </div>
              </div>
            </div>
            <hr />
            <div className={styles.orderTime}>
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
            onClick={() => setFilterProduct(!filterProduct)}
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <Card
                key={order._id}
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
                <CardMedia
                  onClick={() => getProductDetails(order.productId._id)}
                  className={styles.imageContainer}
                  sx={{
                    height: "13em",
                    width: "13em",
                    borderRadius: "10px",
                    padding: "10px",
                    flex: "0 0 auto",
                    cursor: "pointer",
                  }}
                  image={order.productId.imgURL}
                  title={order.productId.name}
                />
                <CardContent sx={{ flex: "1", minWidth: 0 }}>
                  <Typography className={styles.name} gutterBottom variant="h5">
                    {order.productId.name}
                  </Typography>
                  <Typography
                    className={styles.description}
                    variant="body2"
                    sx={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
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
                    {order.orderId.orderStatus}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography
              className={styles.noOrdersFound}
              sx={{
                textAlign: "center",
                marginTop: "20px",
                width: "100%",
              }}
            >
              No orders found.
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
}
