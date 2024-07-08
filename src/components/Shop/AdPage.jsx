import React from "react";
import styles from "./AdPage.module.css";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { Link } from "react-router-dom";

export default function AdPage() {
  return (
    <>
      <div className={`${styles.container}`}>
        <div className={styles.contentContainer}>
          <h2>
            Perfect Companions To Your <span>Pizza Adventure</span>
          </h2>
          <p>
            Welcome to a Food Hub like no other. It's not just food; it's an
            Experience. Our pizzas and more fast food are crafted with passion,
            using the finest ingredients and innovative recipes to bring you a
            slice of perfection.
          </p>
          <div className={styles.btnContainer}>
            <div>Order</div>
            <Link target="blank" to={"https://wa.me/+919760258097"}>
              Have any Question? <br />
              Chat <ArrowOutwardIcon />
            </Link>
          </div>
        </div>
        <div className={styles.imageContainer}>
          <div className={styles.doubleImage}>
            <div>
              <img
                src="https://img.freepik.com/premium-photo/artisan-pizza-chef-creating-rustic-pizza-ingredients-dark-kitchen-artistic-dark-lighting_127934-7867.jpg"
                alt=""
              />
            </div>
            <div>
              <img
                src="https://miro.medium.com/v2/resize:fit:700/1*U4GynyTnMohMffMKEUWTXQ.jpeg"
                alt=""
              />
            </div>
          </div>
          <div className={styles.singleImage}>
            <div>
              {" "}
              <img
                src="https://img.freepik.com/premium-photo/ink-drawing-raven-side-profile-full-body_975283-23.jpg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
