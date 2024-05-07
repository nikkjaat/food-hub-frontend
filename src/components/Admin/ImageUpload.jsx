import React, { useRef, useState } from "react";

export default function ImageUpload(props) {
  const imagePreview = useRef();

  const image = useRef();

  const pickedhandler = (event) => {
    if (event.target.files.length > 0) {
      const pickedFile = event.target.files[0];
      console.log(pickedFile);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        imagePreview.current.src = fileReader.result;
        props.onGetImage("imgURL", pickedFile);
      };
      fileReader.readAsDataURL(pickedFile);
    } else {
      return false;
    }
  };

  const imageClick = () => {
    image.current.click();
  };
  return (
    <div>
      <div className="row mb-3">
        <label htmlFor="image" className="col-sm-2 col-form-label">
          Image
        </label>
        <div className="col-sm-10">
          <input
            onChange={pickedhandler}
            type="file"
            className="form-control"
            id="imgURL"
            name="imgURL"
            // value={imgUrl}
            hidden
            ref={image}
          />
        </div>
      </div>

      <div style={{ margin: "0 20rem" }}>
        <img
          style={{ width: "10rem", height: "10rem" }}
          src={
            props.imgUrl
              ? `${import.meta.env.VITE_ASSET_URL}` + props.imgUrl
              : "/images/download.jpeg"
          }
          alt=""
          name="imgURL"
          onClick={imageClick}
          ref={imagePreview}
        />
      </div>
    </div>
  );
}

// import { useRef } from "react";

// import styles from "./ImageUpload.module.css";

// export default function ImageUpload(props) {
//   const imagePicker = useRef();
//   const imagePreview = useRef();

//   const pickImageHandler = () => {
//     imagePicker.current.click();
//   };

//   const pickedhandler = (event) => {
//     // console.log(event.target.files);
//     if (event.target.files.length > 0) {
//       const pickedFile = event.target.files[0];
//       console.log(pickedFile);

//       const fileReader = new FileReader();
//       fileReader.onload = () => {
//         imagePreview.current.src = fileReader.result;
//         props.onGetImage("imgUrl", pickedFile);
//       };
//       fileReader.readAsDataURL(pickedFile);
//     } else {
//       return false;
//     }
//   };

//   return (
//     <>
//       <input
//         type="file"
//         id="imageUrl"
//         hidden
//         ref={imagePicker}
//         onChange={pickedhandler}
//         multiple
//       />
//       <div className={`${styles["image-upload"]} ${styles.center}`}>
//         <div className={styles["image-upload__preview"]}>
//           <img
//             src={
//               props.image
//                 ? `http://localhost:4000/${props.image}`
//                 : "http://via.placeholder.com/640x360"
//             }
//             alt="Preview"
//             ref={imagePreview}
//           />
//         </div>
//         <button type="button" onClick={pickImageHandler}>
//           PICK IMAGE
//         </button>
//       </div>
//     </>
//   );
// }
