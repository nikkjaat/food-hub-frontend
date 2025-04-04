import React, { useContext, useEffect, useRef, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import ImageUpload from "./ImageUpload";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import styles from "./PostProduct.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../Shop/Button";
import Navbar from "../Shop/Navbar";

export default function PostProduct() {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const [catName, setCatName] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [varients, setVarients] = useState("");
  const [shippingCost, setShippingCost] = useState("");
  const [imageUrl, setImageUrl] = useState();
  const [productId, setProductId] = useState("");
  const [loader, setLoader] = useState(true);

  // Fetching Query Parameters
  const queryString = useLocation().search;

  // For Fetching Single Product

  useEffect(() => {
    const getProduct = async (prodId) => {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BACKEND_URL
        }/admin/getsingleproduct?productId=${prodId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      console.log(response);
      setCatName(response.data.categoryName);
      setName(response.data.name);
      setDescription(response.data.description);
      setVarients(response.data.price);
      setShippingCost(response.data.shippingCost);
      setImageUrl(response.data.imgURL);
      setProductId(response.data._id);
    };
    if (queryString) {
      const queryParams = new URLSearchParams(queryString);
      const prodId = queryParams.get("prodId");
      getProduct(prodId);
    } else {
      setCatName("");
      setDescription("");
      setImageUrl("");
      setName("");
      setShippingCost("");
      setVarients("");
    }
  }, [queryString]);

  const inputHandler = (input, value) => {
    if (input === "categoryName") {
      setCatName(value);
    } else if (input === "name") {
      setName(value);
    } else if (input === "description") {
      setDescription(value);
    } else if (input === "imgURL") {
      console.log(value);
      setImageUrl(value);
    } else if (input === "shippingCost") {
      setShippingCost(value);
    } else if (input === "varients") {
      setVarients(value);
    }
  };

  // const categoryHandle = (e) => {
  //   setCategory(e.target.value);
  // };
  // console.log(category);

  const submiHandler = async (e) => {
    e.preventDefault();

    console.log(imageUrl);

    const formData = new FormData();
    formData.append("categoryName", catName);
    formData.append("name", name);
    formData.append("imgURL", imageUrl);
    formData.append("description", description);
    formData.append("shippingCost", shippingCost);
    formData.append("price", varients);
    formData.append("folderType", "ProductImage");

    if (!queryString) {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND_URL}/admin/addproduct`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      if (response.status === 200) {
        navigate("/");
      }
    } else {
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_BACKEND_URL
        }/admin/updateproduct?productId=${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      // console.log(response);
      if (response.status === 200) {
        navigate("/admin/products");
      }
    }

    setCatName("");
    setDescription("");
    setImageUrl("");
    setName("");
    setShippingCost("");
    setVarients("");
  };

  return (
    <div>
      {/* <Navbar /> */}
      <form
        action="/admin/addproduct"
        method="POST"
        encType="multipart/form-data"
        className={`${styles.container} container`}
        onSubmit={submiHandler}
      >
        <div className={`${styles.categoryBox} row mb-3`}>
          <label htmlFor="categoryname" className="col-sm-2 col-form-label">
            Category Name
          </label>

          <select
            value={catName}
            onChange={(e) => {
              inputHandler("categoryName", e.target.value);
            }}
            className={`${styles.category} form-select`}
          >
            <option hidden>Select Category</option>
            <option value="Pizza">Pizza</option>
            <option value="Burger">Burger</option>
            <option value="Biryani">Biryani</option>
          </select>
        </div>

        <div>
          <div className="row mb-3">
            <label htmlFor="name" className="col-sm-2 col-form-label">
              Name
            </label>
            <div className="col-sm-10">
              <input
                value={name}
                onChange={(e) => {
                  inputHandler("name", e.target.value);
                }}
                type="text"
                className="form-control"
                id="name"
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="description" className="col-sm-2 col-form-label">
              Description
            </label>
            <div className="col-sm-10">
              <input
                value={description}
                onChange={(e) => {
                  inputHandler("description", e.target.value);
                }}
                type="text"
                className="form-control"
                id="description"
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="varients" className="col-sm-2 col-form-label">
              Varients/Price
            </label>
            <div className="col-sm-10">
              <input
                value={varients}
                onChange={(e) => {
                  inputHandler("varients", e.target.value);
                }}
                type="number"
                className="form-control"
                id="varients"
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="shippingCost" className="col-sm-2 col-form-label">
              Shipping Cost
            </label>
            <div className="col-sm-10">
              <input
                value={shippingCost}
                onChange={(e) => {
                  inputHandler("shippingCost", e.target.value);
                }}
                type="number"
                className="form-control"
                id="shippingCost"
              />
            </div>
          </div>
          <ImageUpload imgUrl={imageUrl} onGetImage={inputHandler} />

          <Button type="submit" className={styles.btn}>
            {queryString ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
