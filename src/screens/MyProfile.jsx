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

  const [editData, setEditData] = useState(false);
  const imagePicker = useRef();
  const imagePreview = useRef();
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if (props.user) {
      setData({
        name: props.user.name,
        email: props.user.email,
        profilePicture: props.user.profilePicture,
      });
    }
  }, [editData]);

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

  const inputChangeHandler = (event, value) => {
    setData((prevState) => {
      return { ...prevState, [event]: value };
    });
  };

  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("profilePicture", data.profilePicture);
  // formData.append("folderType", data.folderType);

  const submitUserData = async () => {
    console.log([...formData.entries()]);

    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_BACKEND_URL
        }/updateuserinfo/?userId=${props.user._id.toString()}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      if (response.status === 200) {
        props.setDisplay(false);
        authCtx.alertBoxHandler("Profile updated successfully");
        authCtx.refreshData();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className={`${styles.card} ui cards`}>
        <div className={`${styles.container} card`}>
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
                    ? data.profilePicture
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
                  autoFocus={editData && true}
                  readOnly={!editData}
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
            {props.user &&
              props.user.roles.map((role) => {
                return <div className={`${styles.role} meta`}>{role}</div>;
              })}

            <div className={`${styles.descriptionContainer} description`}>
              <div>
                <input
                  className={`${editData ? styles.email : styles.input} input`}
                  readOnly={!editData}
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
            <div className={`${styles.buttonContainer} ui two buttons`}>
              <button
                className="ui button"
                onClick={() => {
                  setEditData(!editData);
                }}
              >
                {editData ? "Cancel" : "Edit"}
              </button>
              <button onClick={submitUserData} className="ui button">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
