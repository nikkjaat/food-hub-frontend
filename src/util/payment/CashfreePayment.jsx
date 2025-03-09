// import React, { useState, useContext, useCallback, useEffect } from "react";
// import axios from "axios";
// import AuthContext from "../../context/AuthContext";

// export default function StripePayment({
//   addressId,
//   productId,
//   quantity,
//   children,
//   onClick,
//   shippingCost,
// }) {
//   const ctx = useContext(AuthContext);
//   const [paymentUrl, setPaymentUrl] = useState("");
//   const [loading, setLoading] = useState(false);

//   const createPaymentLink = useCallback(async () => {
//     if (loading) return; // Prevent multiple clicks
//     setLoading(true);
//     onClick?.();

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_BACKEND_URL}/payment/checkout`,
//         {
//           addressId,
//           productId,
//           userId: ctx.userId,
//           quantity,
//           shippingCost,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${ctx.token}`,
//           },
//         }
//       );
//       setPaymentUrl(response.data.url);
//     } catch (error) {
//       console.error("Error creating payment link:", error);
//       alert("Failed to create payment link. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, [
//     addressId,
//     productId,
//     quantity,
//     shippingCost,
//     ctx.userId,
//     ctx.token,
//     loading,
//     onClick,
//   ]);

//   // Redirect when payment URL is set
//   useEffect(() => {
//     if (paymentUrl) {
//       window.location.href = paymentUrl;
//     }
//   }, [paymentUrl]);

//   return (
//     <button onClick={createPaymentLink} style={buttonStyle} disabled={loading}>
//       {loading ? "Processing..." : children}
//     </button>
//   );
// }

// const buttonStyle = {
//   padding: "10px 20px",
//   backgroundColor: "#6772E5",
//   color: "#FFF",
//   border: "none",
//   borderRadius: "4px",
//   cursor: "pointer",
//   opacity: "1",
//   transition: "opacity 0.3s",
// };

// buttonStyle[":disabled"] = {
//   opacity: "0.7",
//   cursor: "not-allowed",
// };

import React, { useContext, useState } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
// import Cashfree from "cashfree-sdk";

export default function CashfreePayment({
  amount,
  productId,
  quantity,
  addressId,
  shippingCost,
}) {
  const [loading, setLoading] = useState(false);
  const authCtx = useContext(AuthContext);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND_URL}/payment/create-order`,
        {
          productId,
          amount,
          quantity,
          addressId,
          shippingCost,
          userId: authCtx.userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );

      console.log("Payment Response:", response.data);

      if (response.data.sessionId) {
        // Load Cashfree SDK and Start Payment
        const cashfree = new Cashfree({
          mode: "sandbox", // Change to 'production' for live
        });

        cashfree.checkout({
          paymentSessionId: response.data.sessionId, // Use session ID for checkout
        });
      } else {
        alert("Payment session creation failed.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Failed to create payment. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handlePayment} style={buttonStyle} disabled={loading}>
      {loading ? "Processing..." : `Pay ₹${amount} via UPI`}
    </button>
  );
}

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
