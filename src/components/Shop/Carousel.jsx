import React from "react";
import styles from "./Carousel.module.css";

export default function Carousel() {
  return (
    <div>
      <div
        id="carouselExampleControls"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel">
        <div className="carousel-inner" id={styles.carouselContainer}>
          <div className="carousel-item active object-fit-contain">
            <img
              style={{
                filter: "brightness(30%)",
              }}
              src="https://img.freepik.com/free-photo/exploding-burger-with-vegetables-melted-cheese-black-background-generative-ai_157027-1734.jpg?size=626&ext=jpg&ga=GA1.1.386372595.1697760000&semt=ais"
              className="d-block w-100 object-fit-contain"
              alt="..."
            />
          </div>
          <div className="carousel-item">
            <img
              style={{ filter: "brightness(30%)" }}
              src="https://www.giallozafferano.com/images/251-25178/Pizza-napoletana_1200x800.jpg"
              className="d-block w-100"
              alt="..."
            />
          </div>
          <div className="carousel-item">
            <img
              style={{ filter: "brightness(30%)" }}
              src="https://www.eatthis.com/wp-content/uploads/sites/4/2020/02/Chipotle-burrito-bowl-salad.jpg?quality=82&strip=1"
              className="d-block w-100"
              alt="..."
            />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="prev">
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="next">
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
