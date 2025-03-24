import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Shop/Navbar";
import Card from "../components/Shop/Card";
import Footer from "../components/Shop/Footer";
import Carousele from "../components/Shop/Carousele";
import styles from "./Home.module.css";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import Loader from "../components/Shop/components/Loader/Loader";
import MyCarousel from "../components/Shop/components/MyCarousel";
import AdPage from "../components/Shop/AdPage";

export default function Home(props) {
  const authCtx = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loader, setLoader] = useState(true);

  const getProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND_URL}/getfood`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );

      if (response.status === 200) {
        setProducts(response.data.products);
        setLoader(false);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // ✅ Fetch products on initial render and when authCtx.refresh changes
  useEffect(() => {
    getProducts();
  }, [authCtx.refresh]);

  // ✅ Filter products based on search input
  useEffect(() => {
    if (!props.filterProduct || props.filterProduct.trim() === "") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(props.filterProduct.toLowerCase())
        )
      );
    }
  }, [props.filterProduct, products]);

  return (
    <>
      <div>
        {/* <Navbar filterProduct={filterProduct} refresh={authCtx.refresh} /> */}
      </div>

      <div className={styles.showCase}>
        <div className={styles.text}>
          <p>
            Taste Our Delicious <span> Best Foods</span>
          </p>
          <p>it's not just food It's an Experience</p>
        </div>
        <MyCarousel />
      </div>

      <section>
        <AdPage />
      </section>

      {loader ? (
        <Loader />
      ) : (
        <div className={`${styles.cardContainer}`}>
          {filteredProducts?.map((product) => (
            <Card products={product} key={product._id} />
          ))}
        </div>
      )}

      <div>
        <Footer />
      </div>
    </>
  );
}
