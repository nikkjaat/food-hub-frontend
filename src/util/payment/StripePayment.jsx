// import React, { useState, useEffect, useContext } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";
// import CheckoutForm from "./CheckoutForm";
// import AuthContext from "../../context/AuthContext";
// import Navbar from "../../components/Shop/Navbar";

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_API_KEY);

// export default function StripePayment() {
//   const [clientSecret, setClientSecret] = useState("");
// const ctx = useContext(AuthContext);

//   useEffect(() => {
//     // Create PaymentIntent as soon as the page loads
//     fetch(`${import.meta.env.VITE_API_BACKEND_URL}/payment/checkout`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + ctx.token,
//       },
//       body: JSON.stringify({
//         addressId: "65c0a01e41933e921953c571",
//       }),
//     })
//       .then((res) => res.json())
//       .then((data) => setClientSecret(data.clientSecret));
//   }, []);

//   const appearance = {
//     theme: "stripe",
//   };
//   const options = {
//     clientSecret,
//     appearance,
//   };

//   return (
//     <div className="App">
//       <Navbar />
//       {clientSecret && (
//         <Elements options={options} stripe={stripePromise}>
//           <CheckoutForm />
//         </Elements>
//       )}
//     </div>
//   );
// }

import React, { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import { useLocation } from "react-router-dom";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export default function StripePayment() {
  const query = useQuery();
  const addressId = query.get("addressId");
  const productId = query.get("productId");
  const quantity = query.get("quantity");
  // console.log(productId, addressId);
  const ctx = useContext(AuthContext);
  const [paymentUrl, setPaymentUrl] = useState("");

  const createPaymentLink = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND_URL}/payment/checkout`,
        {
          addressId,
          productId,
          userId: ctx.userId,
          quantity,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + ctx.token,
          },
        }
      );
      // console.log(response.data);
      setPaymentUrl(response.data.url);
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error creating payment link:", error);
    }
  };

  console.log(paymentUrl);
  return (
    <button onClick={createPaymentLink} style={buttonStyle}>
      Pay Now
    </button>
  );
}

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#6772E5",
  color: "#FFF",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
