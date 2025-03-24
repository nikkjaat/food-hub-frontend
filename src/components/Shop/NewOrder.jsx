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
  const authCtx = useContext(AuthContext);

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

      // Process orders and add "hideButtons" flag
      const newOrders = res.data.order.map((orderObj) => ({
        ...orderObj.order,
        hideButtons: orderObj.order.orderStatus === "On the way",
      }));

      setOrders((prevOrders) => {
        const uniqueOrders = newOrders.filter(
          (newOrder) =>
            !prevOrders.some(
              (existingOrder) => existingOrder._id === newOrder._id
            )
        );
        return [...uniqueOrders, ...prevOrders];
      });
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
      setOrders((prevOrders) => [order, ...prevOrders]);
    });

    return () => {
      socket.off("newOrder");
      socket.off("orderStatusUpdated");
    };
  }, []);

  const sendNotification = (order) => {
    if (Notification.permission === "granted") {
      let notification = new Notification("📦 New Order Received", {
        body: `Order from ${order.userId.name}, Status: ${order.orderStatus}`,
        icon: "https://via.placeholder.com/150",
        tag: order._id,
      });

      notification.onclick = () => {
        window.open(`https://yourwebsite.com/orders/${order._id}`, "_blank");
      };
    }
  };

  const requestAccepted = async (e, id) => {
    let newStatus = "";

    if (e.target.textContent === "Accept") {
      newStatus = "Preparing";
    } else if (e.target.textContent === "Out for Delivery") {
      newStatus = "On the way";
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
                  hideButtons: newStatus === "On the way",
                }
              : order
          )
        );
      }
    }
  };

  return (
    <div style={{ margin: "5em 1em 1em", display: "flex" }}>
      <div className={styles.filterBox} style={{ margin: "1em 0" }}>
        <div className={styles.heading}>Filters</div>
        <hr />
        <div>
          <div className={styles.orderstatus}>
            <div>Order Status</div>
            <div>
              {[
                "Requests",
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
        <div className={styles.filterIcon}>
          <TuneIcon />
        </div>
      </div>

      <div style={{ width: "100%" }}>
        {filteredOrders.map((order, index) => (
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
                  order.productId?.imgURL || "https://via.placeholder.com/150"
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
              <Typography variant="body1">
                Status: {order.orderStatus}
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
                    ? "Accept"
                    : "Out for Delivery"}
                </Button>
                <Button
                  onClick={() => requestAccepted("Cancelled")}
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
  );
}
