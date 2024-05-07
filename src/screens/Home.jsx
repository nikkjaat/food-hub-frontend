import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Shop/Navbar";
import Card from "../components/Shop/Card";
import Footer from "../components/Shop/Footer";
import Carousel from "../components/Shop/Carousel";
import styles from "./Home.module.css";
import axios from "axios";
import Error from "../../Error";
import AuthContext from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import useApi from "../hooks/useApi";
import MyProfile from "./MyProfile";
import AlertBox from "../components/AlertBox/AlertBox";
import Loader from "../components/Shop/components/Loader/Loader";

export default function Home() {
  const queryString = useLocation().search;

  const authCtx = useContext(AuthContext);
  // const [products, setProducts] = useState([]);
  let { loading, data: products, error, get } = useApi();

  // useEffect(() => {
  //   const getProducts = async () => {
  //     const response = await axios.get("http://localhost:4000/getfood", {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + authCtx.token,
  //       },
  //     });
  //     // console.log(response);
  //     const products = await response.data.products;
  //     setProducts(products);
  //   };
  //   getProducts();
  // }, [authCtx.refresh]);

  useEffect(() => {
    const getLatestProducts = async () => {
      get("/getfood");
      console.log(products);
    };
    getLatestProducts();
  }, []);

  const filterProduct = (filter) => {
    useEffect(() => {
      const filterProduct = async () => {
        get("/filterproducts", { filter: filter });
      };
      filterProduct();
    }, [filter]);
  };

  return (
    <>
      {/* <Loader /> */}
      <div>
        <Navbar filterProduct={filterProduct} refresh={authCtx.refresh} />
      </div>

      <div>
        <Carousel />
      </div>

      {/* m-2 d-flex flex-wrap justify-content-around */}

      <div className={`${styles.cardContainer}`}>
        {products &&
          products.map((product) => {
            return <Card products={product} key={product._id} />;
          })}
      </div>

      <div>
        <Footer />
      </div>
    </>
  );
}
