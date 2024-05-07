import React from "react";
import styles from "./Button.module.css";

export default function Button(props) {
  return (
    <button
      disabled={props.disabled || false}
      onClick={props.onClick}
      type={props.type}
      className={`${props.className} ${styles.button} btn`}>
      {props.children}
    </button>
  );
}
