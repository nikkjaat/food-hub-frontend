import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get("order_id");

  useEffect(() => {
    const session = async () => {
      if (!sessionId) return;

      // ✅ Check if sessionId has already been processed
      const processedSession = localStorage.getItem(
        `processedSession_${sessionId}`
      );
      if (processedSession) {
        console.log("Payment session already processed. Skipping API call.");
        return;
      }

      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BACKEND_URL
          }/payment/session?order_id=${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${authCtx.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log(response);

        if (response.status === 200) {
          // ✅ Store sessionId in localStorage to prevent duplicate processing
          localStorage.setItem(`processedSession_${sessionId}`, "true");
          // navigate("/");
        }
      } catch (error) {
        console.error("Error processing payment:", error);
      }
    };

    session();
  }, [sessionId, authCtx.token]); // ✅ Add dependencies to prevent infinite loops

  return (
    <div style={containerStyle}>
      <div style={childDiv}>
        <h1 style={{ color: "#4cd137" }}>Payment Successful!</h1>
        <p>Thank you for your purchase. Your order is being processed.</p>
      </div>
    </div>
  );
};

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  color: "#333",
  textAlign: "center",
};

const childDiv = {
  backdropFilter: "blur(8px) brightness(.8)",
  padding: "6em",
};

export default PaymentSuccess;
