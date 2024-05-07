import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./MyProfile.module.css";
import Button from "../components/Shop/Button";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import AlertBox from "../components/AlertBox/AlertBox";

export default function MyProfile(props) {
  const [data, setData] = useState({
    name: "",
    email: "",
    profilePicture: "",
  });

  const [editData, setEditData] = useState(true);
  const imagePicker = useRef();
  const imagePreview = useRef();
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const logoutHandler = () => {
    authCtx.logoutHandler();
  };

  useEffect(() => {
    if (props.user) {
      setData({
        name: props.user.name,
        email: props.user.email,
        profilePicture: props.user.profilePicture,
      });
    }
  }, []);

  const imgPicker = () => {
    imagePicker.current.click();
  };

  const imageHandler = (e) => {
    if (e.target.files.length > 0) {
      const pickedFile = e.target.files[0];
      console.log(pickedFile);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        imagePreview.current.src = fileReader.result;
      };
      fileReader.readAsDataURL(pickedFile);
      inputChangeHandler("profilePicture", pickedFile);
    } else {
      return false;
    }
  };

  const editUserData = () => {
    setEditData(false);
  };

  const inputChangeHandler = (event, value) => {
    setData((prevState) => {
      return { ...prevState, [event]: value };
    });
  };

  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("profilePicture", data.profilePicture);

  const submitUserData = async () => {
    const response = await axios.put(
      `http://localhost:4000/updateuserinfo/?userId=${props.user._id.toString()}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + authCtx.token,
        },
      }
    );
    if (response.status === 200) {
      authCtx.refreshData();
      props.setDisplay(false);
      authCtx.alertBoxHandler("Profile updated successfully");
      authCtx.refreshData();
    }
  };
  return (
    <>
      <div className={`${styles.card} ui cards`}>
        <div className="card">
          <div className="content">
            <input
              hidden
              type="file"
              onChange={imageHandler}
              ref={imagePicker}
              name=""
            />
            <div className={styles.imageContainer}>
              <img
                onClick={imgPicker}
                className="right floated mini ui image"
                src={
                  data.profilePicture
                    ? `${import.meta.env.VITE_ASSET_URL}` + data.profilePicture
                    : "/images/empty.jpg"
                }
                ref={imagePreview}
              />
              <FontAwesomeIcon
                onClick={imgPicker}
                icon={faPenToSquare}
                style={{ color: "#FFD43B" }}
                className={styles.editBtn}
              />
            </div>
            <div className={`${styles.nameContainer} header`}>
              <div>
                <input
                  readOnly={editData}
                  className={`${editData ? styles.name : styles.input} input`}
                  type="text"
                  value={data.name}
                  name="name"
                  onChange={(e) => {
                    inputChangeHandler("name", e.target.value);
                  }}
                />
              </div>
            </div>
            {props.user.roles.map((role) => {
              return <div className="meta">{role}</div>;
            })}

            <div className={`${styles.descriptionContainer} description`}>
              <div>
                <input
                  className={`${editData ? styles.email : styles.input} input`}
                  readOnly={editData}
                  type="text"
                  value={data.email}
                  name="email"
                  onChange={(e) => {
                    inputChangeHandler("email", e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="extra content">
            <div className="ui two buttons">
              <div
                className="ui yellow button"
                onClick={() => {
                  editUserData("name");
                }}>
                Edit
              </div>
              <div onClick={submitUserData} className="ui green button">
                Save
              </div>
            </div>
          </div>
          <div onClick={logoutHandler} className="ui red button">
            Logout
          </div>
        </div>
      </div>
    </>
  );
}
