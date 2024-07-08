import React from "react";
import Slider from "react-slick";
import styles from "./MyCarousel.module.css"; // Assuming you have some custom styles for the carousel

const images = [
  "https://t4.ftcdn.net/jpg/05/61/78/69/360_F_561786951_IdQbtR0bga3RzISgodGvIRMFEBqmjfcn.jpg",
  "https://t4.ftcdn.net/jpg/00/66/88/27/360_F_66882766_MpyPOVtZad7RigdHpdWVITANQfTcih7u.jpg",
  "https://static.vecteezy.com/system/resources/thumbnails/023/809/530/small_2x/a-flying-burger-with-all-the-layers-ai-generative-free-photo.jpg",
  "https://cdn.pixabay.com/photo/2020/05/17/04/22/pizza-5179939_640.jpg",
  "https://madhurasrecipe.com/wp-content/uploads/2023/03/Veg-Biryani-Featured.jpg",
];

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} ${styles.slick_next}`}
      style={{ ...style }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} ${styles.slick_prev}`}
      style={{ ...style }}
      onClick={onClick}
    />
  );
};

const MyCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    // nextArrow: <NextArrow />,
    // prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 2500,
    fade: true, // Add fade effect
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className={styles.carousel_container}>
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className={styles.carousel_slide}>
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className={styles.carousel_image}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MyCarousel;
