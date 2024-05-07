import React, { useEffect, useRef, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import styles from "./AddProduct.module.css";
import axios from "axios";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState([]);
  const [image, setImage] = useState("../../public/images/download.jpeg");
  // const [varprice, setVarPrice] = useState([]);
  // const [productId, setProductId] = useState("");
  // const category = useRef();
  // const title = useRef();
  // let price = useRef();
  // const description = useRef();
  const imgURL = useRef();
  // const quantity = useRef();
  let [size, setSize] = useState([]);
  const [showInput, setShowInput] = useState(true);
  const [priceWithSizes, setPriceWithSizes] = useState(false);
  // const navigate = useNavigate();

  let varients = {
    size: size,
  };
  console.log(varients);

  const authCtx = useContext(AuthContext);

  const imageSelect = () => {
    imgURL.current.click();
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      // console.log(event.target.files[0].name);
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const getCheckboxValue = (e) => {
    let { value, checked } = e.target;
    if (checked) {
      setSize([value]);
      setShowInput(false);
    } else {
      setSize(size.filter((e) => e !== value));
    }
  };
  console.log(size);

  // const getPriceHandle = (e) => {
  //   console.log(e.target.value);
  //   setVarPrice(e.target.value);
  // };

  useEffect(() => {
    if (size.length === 0) {
      setShowInput(true);
      setPriceWithSizes(false);
      // setShowInput(true);
    }
  }, [size]);

  // const newProductData = async (e) => {
  //   e.preventDefault();

  //   const product = new FormData();
  //   product.append("categoryName", category.current.value);
  //   product.append("title", title.current.value);
  //   product.append("description", description.current.value);
  //   // product.append("price", price.current.value);
  //   product.append("imgURL ", imgURL.current.value);
  //   product.append("quantity", quantity.current.value);
  //   let price = { price: varprice };
  // product.append("varients", price);

  // useEffect(() => {
  //   const addAndUpdateProduct = async () => {
  //     const response = await axios.put(
  //       "http://localhost:4000/admin/addproduct",
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: "Bearer " + authCtx.token,
  //         },
  //       }
  //     );
  //     console.log(response);
  //   };
  //   addAndUpdateProduct();
  // }, []);

  //   const response = await axios.post(
  //     "http://localhost:4000/admin/addproduct",
  //     {
  //       categoryName: category.current.value,
  //       name: title.current.value,
  //       description: description.current.value,
  //       imgURL: imgURL.current.value,
  //       quantity: quantity.current.value,
  //       varients: price,
  //     },
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + authCtx.token,
  //       },
  //     }
  //   );
  //   console.log(response);

  //   title.current.value = "";
  //   description.current.value = "";
  //   price.current.value = "";
  //   imgURL.current.value = "";
  //   quantity.current.value = "";
  //   navigate("admin/products");
  // };

  const showPriceWithSize = () => {
    if (priceWithSizes) {
      setPriceWithSizes(false);
    } else {
      setPriceWithSizes(true);
    }
  };

  const closePriceWithSizesBox = () => {
    if (priceWithSizes) {
      setPriceWithSizes(false);
      setShowInput(true);
      setSize([]);
    } else {
      setPriceWithSizes(true);
    }
  };

  const inputChangeHandler = (input, value) => {
    if (input === "category") {
      setCategory(value);
    } else if (input === "title") {
      setTitle(value);
    } else if (input === "description") {
      setDescription(value);
    } else if (input === "quantity") {
      setQuantity(value);
    } else if (input === "Small" || input === "Medium" || input === "Large") {
      console.log(input);
      setPrice([
        { size: "Small", price: value },
        { size: "Medium", price: 12 },
      ]);
    }
  };

  const productSubmitHandler = (e) => {
    e.preventDefault();
    console.log(size);
    const product = new FormData();
    product.append("categoryName", category);
    product.append("name", title);
    product.append("description", description);
    product.append("quantity", quantity);
    for (const key of price) {
      console.log(key);
      product.append("varients", key);
    }
    // product.append("varients", price);
    product.append("imgURL", image);

    const addORupdateProduct = async () => {
      const response = await axios.post(
        "http://localhost:4000/admin/addproduct",
        product,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      console.log(response);
    };
    addORupdateProduct();
  };

  return (
    <div>
      <AdminNavbar />
      <div className="container">
        <form
          onSubmit={productSubmitHandler}
          className={styles.form}
          action="/admin/products"
          method="POST">
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              placeholder="Enter Category Name"
              // ref={category}
              className="form-control"
              name="categoryName"
              onChange={(e) => {
                inputChangeHandler("category", e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              placeholder="Enter Title"
              // ref={title}
              className="form-control"
              name="name"
              onChange={(e) => {
                inputChangeHandler("title", e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              placeholder="Enter Description"
              // ref={description}
              className="form-control"
              name="description"
              onChange={(e) => {
                inputChangeHandler("description", e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              placeholder="Enter Quantity"
              // ref={quantity}
              className="form-control"
              name="quantity"
              onChange={(e) => {
                inputChangeHandler("quantity", e.target.value);
              }}
            />
          </div>
          {priceWithSizes ? (
            <div className={`${styles.checkInputBoxParent} form-group`}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label>Varients</label>
                <div
                  onClick={closePriceWithSizesBox}
                  style={{
                    background: "#991906",
                    padding: "0 5px",
                    borderRadius: "5px",
                    color: "rgb(255, 196, 0)",
                    cursor: "pointer",
                  }}>
                  X
                </div>
              </div>
              <div className={styles.checkBoxParent}>
                <div
                  className={`${styles.checkInputBox} form-check form-check-inline`}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="inlineCheckbox1"
                    value="Small"
                    name="size"
                    onChange={(e) => {
                      getCheckboxValue(e);
                    }}
                  />
                  <label className="form-check-label" htmlFor="inlineCheckbox1">
                    Small
                  </label>
                </div>
                <div
                  className={`${styles.checkInputBox} form-check form-check-inline`}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="inlineCheckbox2"
                    value="Medium"
                    name="size"
                    onChange={(e) => {
                      getCheckboxValue(e);
                    }}
                  />
                  <label className="form-check-label" htmlFor="inlineCheckbox2">
                    Medium
                  </label>
                </div>
                <div
                  className={`${styles.checkInputBox} form-check form-check-inline`}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="inlineCheckbox3"
                    value="Large"
                    name="size"
                    onChange={(e) => {
                      getCheckboxValue(e);
                    }}
                  />
                  <label className="form-check-label" htmlFor="inlineCheckbox3">
                    Large
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={showPriceWithSize}
              style={{
                color: "#991906",
                fontWeight: "bold",
                cursor: "pointer",
                display: "inline-block !important",
              }}>
              If Varients ?
            </div>
          )}

          <div className={`form-group`}>
            <label>Price</label>
            <div className={styles.parentOfPriceBox}>
              {!showInput &&
                size.map((e) => {
                  return (
                    <div
                      className={` ${styles.priceBoxParent} form-check form-check-inline`}>
                      <label
                        className="form-check-label"
                        htmlFor="inlineCheckbox1">
                        {e}
                      </label>
                      <input
                        className={`${styles.varientPriceInput} form-control`}
                        type="number"
                        id="inlineCheckbox1"
                        name={e}
                        placeholder={`Enter ${e} Price`}
                        onChange={(e) => {
                          inputChangeHandler({ e }, e.target.value);
                        }}
                      />
                    </div>
                  );
                })}
              {showInput && (
                <input
                  className={`${styles.varientPriceInput} form-control`}
                  type="number"
                  placeholder="Enter Price"
                  id="inlineCheckbox1"
                  name="basePrice"
                  onChange={(e) => {
                    inputChangeHandler("Small", e.target.value);
                  }}
                />
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Image</label>
            <div
              className={styles.pickedImage}
              style={{ position: "relative" }}>
              <div className="card" style={{ width: "18rem;" }}>
                <img
                  src={image}
                  // src=""
                  onClick={imageSelect}
                  className={styles.pickedImage}
                  alt="..."
                />
              </div>
            </div>
            <input
              onChange={onImageChange}
              type="file"
              className="form-control"
              name="image"
              hidden
              ref={imgURL}
            />
          </div>
          <button className={styles.submitBtn}>Submit</button>
        </form>
      </div>
    </div>
  );
}
