import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import AuthContext from "./context/AuthContext";
import useApi from "./hooks/useApi";

export default function Check() {
  const authCtx = useContext(AuthContext);
  const file = useRef();
  // const input = useRef();
  const [image, setImage] = useState();
  const [input, setInput] = useState();
  const {
    data: postData,
    loading: postLoading,
    error: postError,
    post,
  } = useApi();

  const fileHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const inputHandle = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(image);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("categoryName", "Pizza");
    formData.append("name", "Pizza");
    formData.append("description", "description");
    formData.append("quantity", 3);
    formData.append("price", 120);

    const response = await axios.post(
      "http://localhost:4000/admin/fileupload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + authCtx.token,
        },
      }
    );
    console.log(response);
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        action="/fileupload"
        method="POST"
        encType="multipart/form-data">
        <input onChange={fileHandler} type="file" id="file" />
        <input onChange={inputHandle} type="text" />
        <button>Submit</button>
      </form>
    </div>
  );
}
