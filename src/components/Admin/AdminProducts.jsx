import React, { useContext, useEffect, useState } from "react";

import Footer from "../Shop/Footer";
import Card from "../Shop/Card";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import Navbar from "../Shop/Navbar";
import Loader from "../Shop/components/Loader/Loader";
import { faL } from "@fortawesome/free-solid-svg-icons";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [admin, setAdmin] = useState(true);
  const [loader, setLoader] = useState(true);
  const [msg, setMsg] = useState("Products Available");
  const [refresh, setRefresh] = useState(false);
  const authCtx = useContext(AuthContext);
  useEffect(() => {
    const getAdminProducts = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND_URL}/admin/getproducts`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      if (response) {
        setLoader(false);
      }
      if (response.data.products.length === 0) {
        return setAdmin(false);
      }
      setProducts(response.data.products);
      setAdmin(true);
      setMsg(response.message);
    };
    getAdminProducts();
  }, [refresh]);
  // console.log(products);
  const onDelete = async (prodId) => {
    const response = await axios.delete(
      `http://localhost:4000/admin/deleteproduct/${prodId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        },
      }
    );
    setRefresh(!refresh);
  };
  return (
    <div>
      <Navbar />
      {loader && <Loader />}
      <div className="m-2 d-flex flex-wrap justify-content-around">
        {admin ? (
          products.map((product) => {
            return (
              <Card
                onDelete={onDelete}
                msg={msg}
                admin={admin}
                products={product}
              />
            );
          })
        ) : (
          <h1>No Products Available</h1>
        )}
      </div>

      <Footer />
    </div>
  );
}
