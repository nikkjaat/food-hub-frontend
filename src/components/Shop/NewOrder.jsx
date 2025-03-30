import { useContext, useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { Button, Card, CardMedia, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import TuneIcon from "@mui/icons-material/Tune";
import styles from "./MyOrder.module.css";
import socket from "../../../SocketIO.js/Socketio";
import AuthContext from "../../context/AuthContext";

export default function NewOrder() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [filterProduct, setFilterProduct] = useState(true);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const handleResize = () => {
      setFilterProduct(window.innerWidth > 872.5);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BACKEND_URL}/admin/getneworder`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );

      const newOrders = res.data.order.map((orderObj) => ({
        ...orderObj.order,
        hideButtons: ["On the way", "Delivered", "Cancelled"].includes(
          orderObj.order.orderStatus
        ),
      }));

      setOrders(newOrders);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (selectedStatuses.length === 0) {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((order) => selectedStatuses.includes(order.orderStatus))
      );
    }
  }, [orders, selectedStatuses]);

  const handleStatusChange = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    console.log("📡 Listening for new orders...");
    socket.on("newOrder", (order) => {
      if (order) {
        sendNotification(order);
      }
      setOrders((prevOrders) => [...prevOrders, order]);
    });

    return () => {
      socket.off("newOrder");
      socket.off("orderStatusUpdated");
    };
  }, []);

  const sendNotification = (order) => {
    if (Notification.permission === "granted") {
      let notification = new Notification(
        `📦 New Order Received (${order.productId.name})`,
        {
          body: `Order from ${order.userId.name}, Status: ${order.orderStatus}`,
          icon: order.productId.imgURL,
          tag: order._id,
        }
      );

      notification.onclick = () => {
        window.open(
          `${import.meta.env.VITE_FRONTEND_URL}/admin/neworder`,
          "_blank"
        );
      };
    }
  };

  const requestAccepted = async (e, id, status) => {
    let newStatus = "";

    if (e.target.textContent === "Approve") {
      newStatus = "Preparing";
    } else if (e.target.textContent === "Out for Delivery") {
      newStatus = "On the way";
    } else {
      newStatus = "Cancelled";
    }

    if (newStatus) {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BACKEND_URL}/admin/setorderstatus?id=${id}`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );

      if (res.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === id
              ? {
                  ...order,
                  orderStatus: newStatus,
                  hideButtons:
                    newStatus === "On the way" ||
                    newStatus === "Cancelled" ||
                    newStatus === "Delivered",
                }
              : order
          )
        );
      }
    }
  };

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
                {[
                  "Pending",
                  "Preparing",
                  "On the way",
                  "Delivered",
                  "Cancelled",
                ].map((status) => (
                  <div key={status}>
                    <input
                      onChange={() => handleStatusChange(status)}
                      type="checkbox"
                      id={status}
                    />
                    <label htmlFor={status}>
                      {status.charAt(0).toUpperCase() +
                        status.slice(1).toLowerCase()}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <hr />
            <div className={styles.orderTime}>
              <div>Order Time</div>
              <div>
                {["Today", "Last Week", "Last Month"].map((time) => (
                  <div key={time}>
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

        <div style={{ width: "100%" }}>
          {filteredOrders
            .slice()
            .reverse()
            .map((order, index) => (
              <Card
                key={index}
                sx={{
                  backgroundColor: "transparent",
                  padding: "1em",
                  margin: "1em",
                  backdropFilter: "blur(8px)",
                  display: "flex",
                }}
              >
                <CardMedia
                  sx={{
                    minWidth: "10em",
                    height: "10rem",
                    mr: "2em",
                    borderRadius: ".2em",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={
                      order.productId?.imgURL ||
                      "https://via.placeholder.com/150"
                    }
                    alt="Product"
                    style={{
                      width: "10em",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </CardMedia>
                <Box sx={{ flex: "auto", display: "grid", gap: ".4em" }}>
                  <Typography variant="h6">
                    {order.productId?.name || "Product"}
                  </Typography>
                  <Typography sx={{ display: "flex" }} variant="body1">
                    Status &nbsp;: &nbsp;
                    <Typography
                      sx={{
                        color:
                          order.orderStatus == "Cancelled"
                            ? "red"
                            : "" || order.orderStatus == "Delivered"
                            ? "green"
                            : "",
                      }}
                    >
                      {order.orderStatus}
                    </Typography>
                  </Typography>
                  <Typography variant="body1">
                    {order.addressId?.name || "Name"}
                  </Typography>
                  <Typography variant="body1">
                    {order.addressId?.houseNo || "House No"},{" "}
                    {order.addressId?.street || "Street"},{" "}
                    {order.addressId?.city || "City"},{" "}
                    {order.addressId?.state || "State"},{" "}
                    {order.addressId?.contactNo || "Contact No"},{" "}
                    {order.addressId?.country || "Country"},{" "}
                    {order.addressId?.pincode || "Pincode"}
                  </Typography>
                  <Stack
                    className="buttons"
                    mt={1}
                    direction="row"
                    spacing={2}
                    style={{ display: order.hideButtons ? "none" : "flex" }}
                  >
                    <Button
                      onClick={(e) => requestAccepted(e, order._id)}
                      color="success"
                      variant="contained"
                    >
                      {order.orderStatus === "Pending"
                        ? "Approve"
                        : "Out for Delivery"}
                    </Button>
                    <Button
                      onClick={(e) => requestAccepted(e, order._id)}
                      variant="contained"
                      color="error"
                    >
                      Reject
                    </Button>
                  </Stack>
                </Box>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
