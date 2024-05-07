import React from "react";
import styles from "./Loader.module.css";

export default function Loader() {
  return (
    <div>
      {/* <div class="ui active centered inline loader"></div> */}
      <div className={styles.container}>
        <h1 data-text="foodHub...">foodHub...</h1>
      </div>
    </div>
  );
}
