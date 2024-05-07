import React, { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import styles from "./NewAddress.module.css";
import "semantic-ui-css/semantic.min.css";

import { Dropdown } from "semantic-ui-react";
import Button from "./Button";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

const countryOptions = [
  {
    key: "af",
    value: "India",
    flag: "in",
    text: "India",
    className: styles.optionTag,
  },
  {
    key: "ax",
    value: "Aland Islands",
    flag: "ax",
    text: "Aland Islands",
    className: styles.optionTag,
  },
  {
    key: "al",
    value: "Albania",
    flag: "al",
    text: "Albania",
    className: styles.optionTag,
  },
  {
    key: "dz",
    value: "Algeria",
    flag: "dz",
    text: "Algeria",
    className: styles.optionTag,
  },
  {
    key: "as",
    value: "American Samoa",
    flag: "as",
    text: "American Samoa",
    className: styles.optionTag,
  },
  {
    key: "ad",
    value: "Andorra",
    flag: "ad",
    text: "Andorra",
    className: styles.optionTag,
  },
  {
    key: "ao",
    value: "Angola",
    flag: "ao",
    text: "Angola",
    className: styles.optionTag,
  },
  {
    key: "ai",
    value: "Anguilla",
    flag: "ai",
    text: "Anguilla",
    className: styles.optionTag,
  },
  {
    key: "ag",
    value: "Antigua",
    flag: "ag",
    text: "Antigua",
    className: styles.optionTag,
  },
  {
    key: "ar",
    value: "Argentina",
    flag: "ar",
    text: "Argentina",
    className: styles.optionTag,
  },
  {
    key: "am",
    value: "Armenia",
    flag: "am",
    text: "Armenia",
    className: styles.optionTag,
  },
  {
    key: "aw",
    value: "Aruba",
    flag: "aw",
    text: "Aruba",
    className: styles.optionTag,
  },
  {
    key: "au",
    value: "Australia",
    flag: "au",
    text: "Australia",
    className: styles.optionTag,
  },
  {
    key: "at",
    value: "Austria",
    flag: "at",
    text: "Austria",
    className: styles.optionTag,
  },
  {
    key: "az",
    value: "Azerbaijan",
    flag: "az",
    text: "Azerbaijan",
    className: styles.optionTag,
  },
  {
    key: "bs",
    value: "Bahamas",
    flag: "bs",
    text: "Bahamas",
    className: styles.optionTag,
  },
  {
    key: "bh",
    value: "Bahrain",
    flag: "bh",
    text: "Bahrain",
    className: styles.optionTag,
  },
  {
    key: "bb",
    value: "Barbados",
    flag: "bb",
    text: "Barbados",
    className: styles.optionTag,
  },
  {
    key: "by",
    value: "Belarus",
    flag: "by",
    text: "Belarus",
    className: styles.optionTag,
  },
  {
    key: "be",
    value: "Belgium",
    flag: "be",
    text: "Belgium",
    className: styles.optionTag,
  },
  {
    key: "bz",
    value: "Belize",
    flag: "bz",
    text: "Belize",
    className: styles.optionTag,
  },
  {
    key: "bj",
    value: "Benin",
    flag: "bj",
    text: "Benin",
    className: styles.optionTag,
  },
];

const states = [
  {
    key: "Andhra Pradesh",
    value: "Andhra Pradesh",
    text: "Andhra Pradesh",
    className: styles.optionTag,
  },
  {
    key: "Arunachal Pradesh",
    value: "Arunachal Pradesh",
    text: "Arunachal Pradesh",
    className: styles.optionTag,
  },
  { key: "Assam", value: "Assam", text: "Assam", className: styles.optionTag },
  { key: "Bihar", value: "Bihar", text: "Bihar", className: styles.optionTag },
  {
    key: "Chhattisgarh",
    value: "Chhattisgarh",
    text: "Chhattisgarh",
    className: styles.optionTag,
  },
  { key: "Goa", value: "Goa", text: "Goa", className: styles.optionTag },
  {
    key: "Gujarat",
    value: "Gujarat",
    text: "Gujarat",
    className: styles.optionTag,
  },
  {
    key: "Haryana",
    value: "Haryana",
    text: "Haryana",
    className: styles.optionTag,
  },
  {
    key: "Himachal Pradesh",
    value: "Himachal Pradesh",
    text: "Himachal Pradesh",
    className: styles.optionTag,
  },
  {
    key: "Jharkhand",
    value: "Jharkhand",
    text: "Jharkhand",
    className: styles.optionTag,
  },
  {
    key: "Karnataka",
    value: "Karnataka",
    text: "Karnataka",
    className: styles.optionTag,
  },
  {
    key: "Kerala",
    value: "Kerala",
    text: "Kerala",
    className: styles.optionTag,
  },
  {
    key: "Madhya Pradesh",
    value: "Madhya Pradesh",
    text: "Madhya Pradesh",
    className: styles.optionTag,
  },
  {
    key: "Maharashtra",
    value: "Maharashtra",
    text: "Maharashtra",
    className: styles.optionTag,
  },
  {
    key: "Manipur",
    value: "Manipur",
    text: "Manipur",
    className: styles.optionTag,
  },
  {
    key: "Meghalaya",
    value: "Meghalaya",
    text: "Meghalaya",
    className: styles.optionTag,
  },
  {
    key: "Mizoram",
    value: "Mizoram",
    text: "Mizoram",
    className: styles.optionTag,
  },
  {
    key: "Nagaland",
    value: "Nagaland",
    text: "Nagaland",
    className: styles.optionTag,
  },
  {
    key: "Odisha",
    value: "Odisha",
    text: "Odisha",
    className: styles.optionTag,
  },
  {
    key: "Punjab",
    value: "Punjab",
    text: "Punjab",
    className: styles.optionTag,
  },
  {
    key: "Rajasthan",
    value: "Rajasthan",
    text: "Rajasthan",
    className: styles.optionTag,
  },
  {
    key: "Sikkim",
    value: "Sikkim",
    text: "Sikkim",
    className: styles.optionTag,
  },
  {
    key: "Tamil Nadu",
    value: "Tamil Nadu",
    text: "Tamil Nadu",
    className: styles.optionTag,
  },
  {
    key: "Telangana",
    value: "Telangana",
    text: "Telangana",
    className: styles.optionTag,
  },
  {
    key: "Tripura",
    value: "Tripura",
    text: "Tripura",
    className: styles.optionTag,
  },
  {
    key: "Uttar Pradesh",
    value: "Uttar Pradesh",
    text: "Uttar Pradesh",
    className: styles.optionTag,
  },
  {
    key: "Uttarakhand",
    value: "Uttarakhand",
    text: "Uttarakhand",
    className: styles.optionTag,
  },
  {
    key: "West Bengal",
    value: "West Bengal",
    text: "West Bengal",
    className: styles.optionTag,
  },
];

export default function Address() {
  const queryString = useLocation().search;

  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  // const [name, setName] = useState("");
  // const [street, setStreet] = useState("");
  // const [houseNo, setHouseNo] = useState("");
  // const [contactNo, setContactNo] = useState(null);
  // const [city, setCity] = useState("");
  // const [pincode, setPincode] = useState(null);
  // const [state, setState] = useState("");
  // const [country, setCountry] = useState("");
  const [address, setAddress] = useState({
    name: "",
    houseNo: "",
    street: "",
    city: "",
    pincode: "",
    contactNo: "",
    state: "",
    country: "",
  });
  const inputChangeHandler = (event, value) => {
    if (value.placeholder === "Select State") {
      setAddress((prevState) => {
        return { ...prevState, state: value.value };
      });
    }
    if (value.placeholder === "Select Country") {
      setAddress((prevState) => {
        return { ...prevState, country: value.value };
      });
    }
    setAddress((prevState) => {
      return { ...prevState, [event]: value };
    });
  };

  if (queryString) {
    useEffect(() => {
      const getSingleAddress = async () => {
        const queryParams = new URLSearchParams(queryString);
        const addressId = queryParams.get("addressId");
        const response = await axios.get(
          `http://localhost:4000/getsingleaddress?addressId=${addressId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + authCtx.token,
            },
          }
        );
      
        let updatedAddress = response.data.data;
        console.log(updatedAddress);

        setAddress({
          name: updatedAddress.name,
          houseNo: updatedAddress.houseNo,
          street: updatedAddress.street,
          city: updatedAddress.city,
          contactNo: updatedAddress.contactNo,
          pincode: updatedAddress.pincode,
          state: updatedAddress.state,
          country: updatedAddress.country,
        });
      };
      getSingleAddress();
    }, []);
  }

  const submitAddress = async (e) => {
    e.preventDefault();

    if (queryString) {
      const queryParams = new URLSearchParams(queryString);
      const addressId = queryParams.get("addressId");
      const response = await axios.patch(
        `http://localhost:4000/updateaddress?addressId=${addressId}`,
        address,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      if (response.status === 200) {
        navigate("/address");
      }
    } else {
      const response = await axios.post(
        "http://localhost:4000/addaddress",
        address,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      if (response.status === 200) {
        navigate("/address");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className={`${styles.container} container`}>
        <form className="ui form" onSubmit={submitAddress}>
          <h4 className="ui dividing header">Shipping Information</h4>
          <div className="field">
            <label>Full Name</label>
            <div className="field">
              <div className="field">
                <input
                  onChange={(e) => {
                    inputChangeHandler("name", e.target.value);
                  }}
                  type="text"
                  name="shipping[first-name]"
                  placeholder="Full Name"
                  value={address.name}
                />
              </div>
            </div>
          </div>
          <div className="field">
            <label>Billing Address</label>
            <div className="fields">
              <div className="five wide field">
                <input
                  onChange={(e) => {
                    inputChangeHandler("houseNo", e.target.value);
                  }}
                  type="text"
                  name="houseno"
                  placeholder="House No."
                  value={address.houseNo}
                />
              </div>
              <div className="five wide field">
                <input
                  onChange={(e) => {
                    inputChangeHandler("street", e.target.value);
                  }}
                  type="text"
                  name="street"
                  placeholder="Street"
                  value={address.street}
                />
              </div>
              <div className="six wide field">
                <input
                  onChange={(e) => {
                    inputChangeHandler("city", e.target.value);
                  }}
                  type="text"
                  name="city"
                  placeholder="City"
                  value={address.city}
                />
              </div>
            </div>
          </div>
          <div className="fields">
            <div className="eight wide field">
              <label>Contact Number</label>
              <input
                type="number"
                onChange={(e) => {
                  inputChangeHandler("contactNo", e.target.value);
                }}
                name="card[number]"
                maxlength="16"
                placeholder="Contact No."
                value={address.contactNo}
              />
            </div>
            <div className="eight wide field">
              <label>Pin Code</label>
              <input
                onChange={(e) => {
                  inputChangeHandler("pincode", e.target.value);
                }}
                autoComplete="on"
                type="number"
                name="card[cvc]"
                placeholder="Pin Code"
                value={address.pincode}
              />
            </div>
          </div>
          <div className="two fields">
            <div className="field">
              <label>State</label>

              <Dropdown
                placeholder="Select State"
                onChange={inputChangeHandler}
                search
                clearable
                fluid
                selection
                options={states}
                className={styles.dropdown}
                value={address.state}
              />
            </div>
            <div className="field">
              <label>Country</label>

              <Dropdown
                onChange={inputChangeHandler}
                placeholder="Select Country"
                fluid
                search
                selection
                className={styles.dropdown}
                clearable
                options={countryOptions}
                value={address.country}
              />
            </div>
          </div>

          <div className={styles.buttons}>
            <Button className={`${styles.submitBtn} ui button`} tabindex="0">
              {queryString ? "Update Address" : "Add Address"}
            </Button>
            <Link to={"/address"}>
              <Button className={`${styles.submitBtn} ui button`} tabindex="0">
                Saved Address
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
